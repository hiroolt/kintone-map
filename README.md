# kintone_map

kintoneにOpenStreetMapで位置情報を可視化するためのカスタマイズに用いる

# Features

公共分野でkintoneを使う際、地図表現を実施する時に費用がない場合に、とりあえず位置情報を可視化するために低コストで実施できる。

# Requirement

kintoneのアプリ 管理画面から、本JavaScriptファイルを追加した後、以下のJavaScriptを追加
https://js.kintone.com/jquery/3.4.1/jquery.min.js
https://unpkg.com/leaflet@1.7.1/dist/leaflet.js

kintoneのアプリ 管理画面から、以下のCSSを追加
https://unpkg.com/leaflet@1.7.1/dist/leaflet.css

# Note

登録された位置情報の変更は、"一応"できるが現時点でスマートではない。
やり方としては、レコード詳細画面から編集ボタンをクリックし、地図の中心を移動させると、その中心座標がポップアップで表示される。
その中心座標をコピーして、緯度経度のフィールドに上書き保存する。
