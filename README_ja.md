node-red-contrib-radian6
========================

このモジュールは、<a href="http://www.exacttarget.com/products/social-media-marketing/radian6" target="_new">radian6</a> の<a href="http://nodered.org" target="_new">Node-RED</a> ノードのコレクションです。

[![NPM](https://nodei.co/npm/node-red-contrib-radian6.png?downloads=true)](https://nodei.co/npm/node-red-contrib-radian6/)

前提条件
-------

node-red-contrib-radian6は、<a href="http://nodered.org" target="_new">Node-RED</a>のインストールが必要です。

インストール
-------

Node-REDをインストールしたルートディレクトリで以下のコマンドを実行します。

    npm install node-red-contrib-radian6

Node-REDインスタンスを再起動すると、パレットにradian6ノードが表示されて使用可能になります。


概要
-------

node-red-contrib-radian6は、Radian6 APIを使用して、トピックプロファイルから投稿データを取得します。

投稿データを取得する際のメディアタイプや対象時間などのパラメータは、ノードの設定で指定します。

Radian6 APIは、取得したデータをXMLで返しますが、node-red-contrib-radian6がJSONオブジェクトに変換して<code>msg.payload</code>を出力しているので、フロー上で変換する必要がありません。


謝辞
-------

node-red-contrib-radian6は、次のオープンソースソフトウェアを使用しています。

- [Requet] (https://github.com/request/request): 簡略化されたHTTPリクエストクライアント
- [node-xml2js] (https://github.com/Leonidas-from-XIV/node-xml2js): 単純なXMLからJavaScriptオブジェクトへのコンバーター。双方向変換をサポートしています。sax-jsおよびxmlbuilder-jsを使用します。

ライセンス
-------

こちらを参照してください。 [license] (https://github.com/joeartsea/node-red-contrib-radian6/blob/master/LICENSE) (Apache License Version 2.0).

貢献
-------

[GitHub issues](https://github.com/joeartsea/node-red-contrib-radian6/issues)への問題提起、Pull requestsのどちらもあなたの貢献を歓迎します。


開発者
-------

開発者がnode-red-contrib-radian6のソースを改変する場合、以下のコードを実行してクローンを作成します。

```
cd ~\.node-red\node_modules
git clone https://github.com/joeartsea/node-red-contrib-radian6.git
cd node-red-contrib-radian6
npm install
```
