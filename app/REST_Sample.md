部屋を作成する
-----------------------
* limitなしクエリ

```
http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/newroom?description=this%20is%20test&title=testroom&userID=mizuno&type=gachi
```

* limitありクエリ
```
http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/newroom?description=this%20is%20test&title=testroom&userID=mizuno&type=gachi&limit=2
```

部屋にメンバを追加する
-------------------------
```
http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/addmember?rid=1&userID=saint
```

部屋からメンバを削除する
-------------------------
```
ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/reducemember?rid=1&userID=mizuno
```

ログアウトする
-------------------------
```
http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/logout?userID=mizuno
```

部屋のチャットのログを取得する
--------------------------
```
http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/getchatlog?rid=3&userID=mizuno
```

部屋のレシピのプロセスのログを取得する
---------------------------
```
http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/getprocess?rid=3&userID=mizuno
```

部屋の材料のログを取得する
---------------------------
```
http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/getingredient?rid=3&userID=mizuno
```

部屋の材料ログに対応する栄養データを取得する
----------------------------
```
http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/getnutrition?rid=3&userID=mizuno
```