
#Recipeers Server
--------------------------------

##基本的な流れ
方針として，チャット，栄養素，レシピ，それぞれにおいて独立して動作するように作成しています．　

それぞれソケットの名前空間は， _/chat_ , _/process_ , _/nutrition_ です． 

よって，例えばchat用のソケットに接続する場合は

```

io.connect('http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/chat');

``` 

となります． 

基本的に部屋単位の情報は，ridで関連付けて保存されています．
なので，それぞれのソケットの利用の流れとしては，

1. 部屋のridを取得する．
2. 上記のソケット接続を行う．
3. ソケットにridを添えてenterRoomイベントをエミットする．
4. ソケットごとに必要な情報の送受信をする．

となります．


##REST APIの利用方法

###部屋の作成
部屋の作成にはまずridを取得する必要があります．
ridは次のREST APIで取得できます． 

```
http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/rid

```

これをGETリクエストで送信すると，ridが数値で返されます．ただし，処理に失敗した場合はfalseが返されます． 

これを基に部屋を作成する際はさらに次のGETリクエストをサーバに送信します．

```
http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/newroom?クエリ

```
クエリに利用できるフィールドは次の4つです．

* rid: 作成する部屋のrid 
* name: 部屋の名前 
* isGachi: ガチ部屋かどうかのフラグ　(true or false)
* limit (opetional): 入室可能な人数の上限 (デフォルトは200人) 

作成に成功するとtrueが，失敗するとfalseが返されます．


###入室
部屋に設定されているridを使って入室し処理を行います．　
入室時は次のURLにGETリクエストを送信します．

```

http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/addmember?rid=ridの値

```
このAPIでは部屋の人数制限に違反していないかなどをチェックしたのち，入室可能かの判定をtrueまたはfalseで返します．

###退室
退室時も同様です．URLは以下です．

```

http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/reducemember?rid=ridの値

```

##各ソケットの利用方法
--------------------
###chatソケット
--------------------

チャットソケットはチャットのメッセージをDBに保存し，かつ同室のメンバーにメッセージをブロードキャストします． 

クライアントからエミットするイベントは次の4つです．
* enterRoom
* leaveRoom
* addMessage
* loadMessage

####enterRoom
入室後にはridをデータとして渡し，このイベントをエミットしてください． 
このイベントをエミットすることで，指定されたridの部屋にソケットチャネルを切り替えます．
結果として，部屋にたまっているチャットログのうち最新50件が取得されます．

例としては次のような感じです.

```
var chat = io.connect('http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/chat');
chat.emit('enterRoom', {'rid': rid}, function(chatLog) {
	//ここでchatLogは最新50件のチャットオブジェクトを格納している配列
	//[{'rid': rid, 'sender': sender, 'message': message, 'timestamp': timestamp}, {'rid': rid, 'sender': sender2, 'message': message2, 'timestamp': timestamp2}, ...];
});

```

####leaveRoom
ソケットをcloseします． 

####sendMessage
メッセージを同室のメンバーにブロードキャストし，ログをDBに格納します． 
データにはrid, message, senderを格納して送信します．

```
chat.emit('sendMessage', {'rid': rid, 'message': message, 'sender': sender}, function(result) {
	//resultはundefined
});

```

ブロードキャストされたメッセージはbroadcastSendMessageイベントとして送信されてきます． 
そのため，受け取るには，ソケットに次のイベントハンドラを登録します． 

```
chat.on('broadcastSendMessage', function(data, resFunc) {
	//dataにはブロードキャストされたメッセージ
	//{'message': message, 'sender': sender, 'timestamp': timestamp}が格納されている．
});

```

####loadChatLog

rid, pos, numを指定してチャット履歴を読み出します． 

* pos: 何番目からのログを読み出すか
* num: いくつ分のログを読み出すか

返されるデータの形式はenterRoomのものと同様です． 

--------------------------
###processソケット
--------------------------

レシピの調理手順に関するデータを扱うソケットです． 
手順をDBに格納し，同室のメンバーにブロードキャストします．

####enterRoom
chatのものと同様ridを指定して，チャネルを切り替えます．　
結果として，今までのprocessのログが全件返されます．　
processオブジェクトの形式は以下です． 

```

{'process': process, 'sender': sender, 'timestamp': timestamp, 'processSequence': processSequence};

```

####leaveRoom
ソケットを閉じます．

####sendProcess
rid, process, senderを指定して，調理手順を投稿します． 
投稿されたprocessはbroadcastSendProcessイベントとしてブロードキャストされます．

```

var process = io.connect('http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/process');

process.on('broadcastSendProcess', function(data) {
	//dataはブロードキャストされたプロセス
});

process.emit('sendProcess', {'rid': 1, 'process': '卵をまぜる', 'sender': 'Saint'}, function(result) {
	//resultは送信成功フラグtrueかfalse
});


```


----------
###nutritionソケット
----------

栄養素データを扱うソケットです． 
食材データを受け取りDBに保存し，栄養素と食材のデータをブロードキャストします．

※後日追記します．


