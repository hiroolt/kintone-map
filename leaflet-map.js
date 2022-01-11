/*
README
Customization code for kintone to visualize location information with OpenStreetMap.

Setup:
In the kintone administration screen, specify the following JavaScript for PC.
https://js.kintone.com/jquery/3.4.1/jquery.min.js
https://unpkg.com/leaflet@1.7.1/dist/leaflet.js

In the kintone administration screen, specify the following CSS for PC.
https://unpkg.com/leaflet@1.7.1/dist/leaflet.css

Set the following fields in the kintone application.
String field for setting latitude (field code Lat)
String field for setting longitude (field code Lng)
String field for event name (field code Event)

Reerence URL
https://developer.kintone.io/hc/en-us/articles/360000365282-Display-Maps-With-LeafletJS

*/

(function() {
  'use strict';

  // Record list screen

  kintone.events.on('app.record.index.show', function(event) {
    // If the map is already displayed, delete it once.
    if ($('div#indexmap').length > 0) {
      $('div#indexmap').remove();
    }

    // Add a map element to the header position.

    var indexHeaderSpace = kintone.app.getHeaderSpaceElement(); // Fetches the header space

    var indexMapSpace = document.createElement('div');
    indexMapSpace.style.height = '450px';
    indexMapSpace.style.width = '90%';
    indexMapSpace.style.padding = '25px';
    indexMapSpace.style.margin = '25px';
    indexMapSpace.setAttribute('id', 'indexmap');
    indexHeaderSpace.appendChild(indexMapSpace);

    // Obtain a list of events

    var eventPoints = [];

    for (var i = 0; i < event.records.length; i++) {
      var record = event.records[i];
      var lat = record.Lat.value; // Gets data form latitude text field from the Record
      var lng = record.Lng.value; // Gets data form longitude text field from the Record
      var name = record.Event.value;      // Gets data from "Event" text field from the Record
      var recURL = "https://toyooka-city.cybozu.com/k/11/show#record=" + record.レコード番号.value; //Get the URL of the record. Pay attention to the domain name when applying it.
      var eventPoint = [lat, lng, name, recURL];
      eventPoints.push(eventPoint);
    }

    // Reference Point
    // Set the Tokyo Metropolitan Government as the default location. Used when location information could not be obtained.
    var referencePointGPS = [35.6896, 139.6921];
    var indexkintoneMap = L.map('indexmap').setView(referencePointGPS, 12);

    // Map layer setting using OSM
    var geo_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 19
    });

    geo_layer.addTo(indexkintoneMap);

    // Mark the POI for each record
    for(var i = 0; i < event.records.length; i++){
      var event_POI = [eventPoints[i][0], eventPoints[i][1]];
      var events = L.marker(event_POI).addTo(indexkintoneMap);
      events.bindPopup(eventPoints[i][2] + "<br><a href=" + eventPoints[i][3] + ">Click</a>" , {autoClose: false}).openPopup();
    }

    // Mark the Tokyo Metropolitan Government as a reference.

    var reference = L.marker(referencePointGPS).addTo(indexkintoneMap);
    reference.bindPopup('Tokyo Metropolitan Government', {autoClose: false}).openPopup();
    indexkintoneMap.setView(referencePointGPS, 11);

  });

  // Show event location in Record Detail page

  kintone.events.on('app.record.detail.show', function(event) {

    // Kintone API
    var record = event.record;          // Accesses the Record in the Kintone App
    var lat = record.Lat.value; // Gets data form latitude text field from the Record
    var lng = record.Lng.value; // Gets data form longitude text field from the Record
    var eventName = record.Event.value;      // Gets data from "Place" text field from the Record


    var headerSpace = kintone.app.record.getHeaderMenuSpaceElement(); // Fetches the header space

    var mapSpace = document.createElement('div');
    mapSpace.style.height = '450px';
    mapSpace.setAttribute('id', 'kintone');
    headerSpace.appendChild(mapSpace);


    // Reference Point
    // Set the Tokyo Metropolitan Government as the default location. Used when location information could not be obtained.
    var referencePointGPS = [35.6896, 139.6921];
    var kintoneMap = L.map('kintone').setView(referencePointGPS, 17);

    // Map Layer with Geographical Features
    var geo_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 19
    });

    geo_layer.addTo(kintoneMap);

    // Register the location of the event by [latitude, longitude].
    var event_POI = [lat, lng];
    var events = L.marker(event_POI).addTo(kintoneMap);
    // Change the center position of the map.
    kintoneMap.setView(event_POI, 17);
    events.bindPopup(eventName, {autoClose: false}).openPopup();

  });

  // Show event location in Record Edit page
  kintone.events.on('app.record.edit.show', function(event) {

    // Kintone API
    var record = event.record;          // Accesses the Record in the Kintone App
    var lat = record.Lat.value; // Gets data form latitude text field from the Record
    var lng = record.Lng.value; // Gets data form longtitude text field from the Record

    var headerSpace = kintone.app.record.getHeaderMenuSpaceElement(); // Fetches the header space

    var mapSpace = document.createElement('div');
    mapSpace.style.height = '450px';
    mapSpace.setAttribute('id', 'kintone');
    headerSpace.appendChild(mapSpace);


    // Leaflet Library
    var referencePointGPS = [lat, lng];
    var kintoneMap = L.map('kintone').setView(referencePointGPS, 17);

    // Map Layer with Geographical Features
    var geo_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 19
    });

    geo_layer.addTo(kintoneMap);

    // Change the center position of the map.
    // Display the cross mark in the center of the map
    // The source of the crosshairs is the Geospatial Information Authority of Japan.

    var crossIcon = L.icon({
      iconUrl: 'https://maps.gsi.go.jp/image/map/crosshairs.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Register and display the center cross image.

    var crossMarker = L.marker( kintoneMap.getCenter(),{
      icon:crossIcon,
      zIndexOffset:1000,
      interactive:false
    }).addTo(kintoneMap);

    // Move the center cross with kintone's movend event and change the field value.
    // Since the field value cannot be changed dynamically, the location information will be displayed as an alert and the operation will be copy and paste.


    kintoneMap.on('moveend', function(e) {
      crossMarker.setLatLng(kintoneMap.getCenter());
      var msg = kintoneMap.getCenter().lat + '/' + kintoneMap.getCenter().lng;
      alert(msg);
    });
    return event;
  });

})();
