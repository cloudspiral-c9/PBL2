
#Recipeers Server
--------------------------------

ソケットに関してはまだ動作は未確認なので，変更可能です．
クライアントに合わせて実装してもらって大丈夫ですが，servicesの中のデータはRESTの方でも使っているので，
メソッドの追加はいいですが，変更はしないでください．
※ちょいちょい仕様ブレがあるのはご容赦ください．

##RESTful API
###ログイン
Login認証には，GoogleのOAuth2.0の認証機構を利用しています．  
認証ページのURLは [http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/auth/google](http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/auth/google) です．  
なので，クライアント側では，下のような感じでリンクを張ってもらえばよいです．  
```
<a href="http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/auth/google">Googleでログイン</a>
<input type="button" onclick="location.href='http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/auth/google';">Googleでログイン</input>

```
認証すると，mongoDBにuserIDとuserNameを格納し，次のURLにリダイレクトするようになっています．  
http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com/recipeers/public/  
このときGETでuser情報に関するオブジェクトが返されます．  
```
user={userID: '234223232', userName: 'mizuno seiya'}
```
以降の処理で，これらの情報が必要になるので，クライアントでも保持しておいてください.  
なお，現状セッションの管理等はしていません．  

###部屋作成
部屋を作成する際は次のURLにリクエストを送信してください．  
[http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/newroom](http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/newroom?description=this%20is%20test&title=testroom&userID=115834882653598693998&type=gachi&limit=2&userName=Seiya%20Mizuno)  

部屋の作成には，クエリに次のフィールドが必要です．  

* description: レシピの説明
* title: レシピ名
* userID: 作成者のuserID
* userName: 作成者のuserName
* type: 部屋の種類 (enjoy, hyperenjoy, gachi)

これに加えて部屋に入室できる人数の上限を設定できます．

* limit: (デフォルトは200名)


部屋の作成に成功した場合は，部屋情報を表すオブジェクトが返されます．
```
{'rid': 08809809708, 'description': 'this is a test recipe', 'title': 'test recipe', 'limit': 200, timestamp: '2014/11/06 16:09:11', type: 'gachi'}

```
失敗した場合は，falseが返されます．  
なお，部屋作成者は自動的に部屋のメンバに加えられます．  

###入室
部屋に入室する際は次のURLにリクエストを送信してください．  
[http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/addmember](http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/addmember?rid=2&userID=115834882653598693998&userName=Seiya%20Mizuno)  

入室のクエリには次のフィールドが必要です．  

* rid: 部屋のID
* userID

入室処理が成功した場合はtrue，失敗した場合はfalseが返されます．

###退室
部屋から退室する際は次のURLにリクエストを送信してください．  
[http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/reducemember](http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/reducemember?rid=2&userID=115834882653598693998)  

退室のクエリには次のフィールドが必要です．  

* rid: 部屋のID
* userID

退室処理が成功した場合はtrue，失敗した場合はfalseが返されます．  


###部屋リストの取得
部屋の種類別に部屋情報の一覧を取得するには，次のURLにリクエストを送信してください．
[http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/getroomlist](http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/getroomlist?type=gachi&userID=115834882653598693998)  

取得には次のフィールドが必要です．  

* userID
* type: 部屋の種類(gachi, enjoy, hyperenjoy)

取得できるオブジェクトは次のような感じです．
```
[{"rid":2,"description":"this is test","title":"testroom","limit":"2","members":['userID': '115834882653598693998', "userName": "Seiya Mizuno"}, ... ],"timestamp":"2014/11/08 07:03:12","type":"gachi"}]
```

###ログアウト
ログアウトする際は次のURLにリクエストを送信してください．  
[http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/logout](http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/logout?userID=115834882653598693998)

ログアウトのクエリには，次のフィールドが必要です．  

* userID  

ログアウトに成功した場合はtrueを，失敗した場合はfalseが返されます．

###チャットログの取得
以降の部屋のログ取得はログインしているユーザであれば誰でも取得できます．  
ログのチャットログの取得には次のURLへリクエストを送信してください．  
[http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/getchatlog](http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/getchatlog?userID=115834882653598693998&rid=1)  

チャットログ取得のクエリには次のフィールドが必要です．

* rid  
* userID

また全件取得せずに部分的に取得したい場合は，次のフィールドも指定可能です．  

* pos: 最新から何番目からのログを取得するか
* limit: いくつ分取得するか

取得されたオブジェクトの形式は次のような感じです．  
```
[{"_id":"545bf0b83188bb1f7ca7c155","message":"test1","timestamp":"2014/11/07 07:05:44","userName": "水野聖也"}, {"_id": "3242...."}]
```
* _id: mongo内でのID(後にメッセージの編集や削除をすることを考慮して付与しておいた)
* message: チャットのメッセージ
* timestamp: 日時を表す文字列
* userName: 投稿した人のGoogleアカウントの名前 (IDとは別)

ログがない場合でも，空の配列が返されます．  
falseやundefinedが返されている場合には，おそらくクエリに不正があります．

###材料データのログの取得
Ingredientのログの取得には，次のURLへアクセスします．  
[http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/getingredient](http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/getingredient?userID=115834882653598693998&rid=1)

Ingredientのログの取得には，次のフィールドが必須です．  
* rid
* userID

取得されたオブジェクトの形式は次のような感じです．

```
[{"_id":"545c4200d37e33d70d800693","ingredient":"フランスパン","amount":100,"userName":"水野聖也"}, {"_id": "4343554..."}]
```

* \_id: mongo内でのID
* ingredient: 材料名
* amount: 量 (たぶん大体のものはグラム)
* userName: 投稿した人

ログがない場合でも空の配列が返されます．  
falseやundefinedが返されている場合には，おそらくクエリに不正があります．

###栄養データのログの取得
nutritionのログの取得には，次のURLにアクセスします．  
[http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/getnutrition](http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/getnutrition?userID=115834882653598693998&rid=1)

必要なフィールドは次の2つです．  
* rid
* userID

取得されるオブジェクトの形式は次のような感じです．  

```
[{"ingredient":"フランスパン","rates":{"energy":0.32823529411764707,"protein":0.376,"lipid":0.052000000000000005,"carbohydrate":0.575,"calcium":0.07272727272727272,"iron":0.36,"vitaminE":0.03333333333333333,"vitaminB1":0.2285714285714286,"vitaminB2":0.09615384615384616,"vitaminC":0,"cholesterol":0,"solt":0.5333333333333333}}, {"ingredient": ....}]
```
* ingredient: 材料名
* rates: 各種栄養価の，1食の理想摂取量に対する割合 (一応ちょい調べた一食分の摂取量に対する栄養価の割合を返しています．なので，単純に各栄養項目の割合を足していってもらえばよいです．)  

ログがない場合でも空の配列が返されます．  
falseやundefinedが返されている場合には，おそらくクエリに不正があります．  

### 調理手順のログの取得
調理手順のログを取得するには次のURLにアクセスします．  
[http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/getprocess](http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/getprocess?userID=115834882653598693998&rid=1)  

必要なフィールドは次の2つです．  
* rid
* userID

取得されるオブジェクトの形式は次のような感じです．  

```
[{"_id":"545c4365ebb2e1da0e51308f","process":"卵を割る","timestamp":"2014/11/07 12:58:29","index":1,"userName":"水野聖也"},{"_id":"545c4365ebb2e1da0e513090","process":"卵をまぜる","timestamp":"2014/11/07 12:58:29","index":2,"userName":"水野聖也"},...]
```
* _id: mongo内でのID
* process: 調理手順の記述
* timestamp: 投稿された日時
* (index: 何番目の調理手順かの予定)
* userName: 投稿者の名前

ログがない場合でも空の配列が返されます．  
falseやundefinedが返されている場合には，おそらくクエリに不正があります．  


##各ソケットの利用方法 (更新してない)
