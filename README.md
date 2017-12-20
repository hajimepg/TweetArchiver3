ツイート保存アプリ プロトタイプ3
====

### 概要

引数で指定したURLのツイートをアイコンや添付画像と一緒にローカルにアーカイブします。(クライアント/サーバ型)

その他の大きな機能

- ツイートを追加
- フィルタリング
- 無限スクロール

### 使い方

以下の環境変数を設定します。

- TWITTER_ACCESS_TOKEN_KEY
- TWITTER_ACCESS_TOKEN_SECRET
- TWITTER_CONSUMER_KEY
- TWITTER_CONSUMER_SECRET

コマンドラインから

$ node dist/server/main.js

で起動し、ブラウザで以下のURLにアクセスします。

http://localhost:3000/

