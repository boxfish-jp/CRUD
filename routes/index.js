var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var mysql_setting = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'board'
}

/* GETアクセスの処理 */
router.get('/', function(req, res, next) {
  
  //コネクションの用意
  var connection = mysql.createConnection(mysql_setting);

  //データベースに接続
  connection.connect();

  //データを取り出す
  connection.query('SELECT * from message', function(error, results ,fields){
    //データベースアクセスの完了時の処理
    if (error == null){
      var data = {
        title: 'Index',
        content: results
      };
      res.render('index',data);
    }else{
      res.render('error:' + error);
    }
  });
  //接続を解除
  connection.end();
});

//新規作成ページへのアクセス
router.get('/add',(req, res, next) => {
  var data = {
    title: "Add",
    content: '新しいレコードを入力'
  }
  res.render('add',data);
});

//新規作成フォーム送信の処理
router.post('/add', (req, res, next) => {
  var data = {
    'user_id' : req.body.id,
    'name' : req.body.view_name,
    'message' : req.body.message,
    'post_data' : req.body.post_data,
  };

  //データベースの設定情報
  var connection = mysql.createConnection(mysql_setting);
  //データベースに接続
  connection.connect();

  //データを登録する
  connection.query('insert into message set ?', data, function (error, results, fields){
    res.redirect('/');
  });
  //接続を解除
  connection.end();
});

//指定IDのレコードを表示する
router.get('/edit', (req, res, next) => {
  var id = req.query.id;
  //データベースの設定情報
  var connection = mysql.createConnection(mysql_setting);
  //データベースに接続
  connection.connect();
  //データを取り出す
  connection.query('SELECT * from message where id = ?', id, function (error, results, dields){
    //データアクセス完了時の処理
    if (error == null) {
      var data = {
        title: 'Edit',
        content: 'id = ' + id + 'のレコードを更新します。',
        mydata: results[0]
      }
      res.render('edit', data);
    }
  });
  //接続を解除
  connection.end();
});

//編集フォーム送信の処理
router.post('/edit', (req, res, next) => {
  var id = req.body.id;
  var data = {
    'user_id' : req.body.id,
    'name' : req.body.view_name,
    'message' : req.body.message,
    'post_data' : req.body.post_data,
  };
  //データベースの設定情報
  var connection = mysql.createConnection(mysql_setting);
  //データベースに接続
  connection.connect();
  //データを更新する
  connection.query('update message set ? where id = ?', [data,id], function (error, results, fields){
      res.render('/');
    
  });
  //接続を解除
  connection.end();
});

//指定レコードの削除
router.get('/delete', (req, res, next) => {
  var id = req.query.id;

  //データベースの設定情報
  var connection = mysql.createConnection(mysql_setting);
  //データベースに接続
  connection.connect();
  //データを取り出す
  connection.query('SELECT * from message where id = ?', id, function (error, results, dields){
    //データアクセス完了時の処理
    if (error == null) {
      var data = {
        title: 'Delete',
        content: 'id = ' + id + 'のレコードを削除します。',
        mydata: results[0]
      }
      res.render('delete', data);
    }
  });
  //接続を解除
  connection.end();
});

//削除フォームの送信処理
router.post('/delete', (req ,res, next) => {
  var id = req.body.id;

  //データベースの設定情報
  var connection = mysql.createConnection(mysql_setting);
  //データベースに接続
  connection.connect();
  //データを削除する
  connection.query('delete from message where id = ?', id, function (error, results, fields){
    res.redirect('/');
  });
  //接続を解除
  connection.end();
});

module.exports = router;