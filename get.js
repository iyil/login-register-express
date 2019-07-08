const express = require('express');
const app = express();
//const util = require('util');

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});
//数据库相关配置
const mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'demo'
});
connection.connect();
//注册接口
app.get('/register', function (req, res) {
  //console.log('监听到有人请求');
  var repeatCount = 'SELECT count(id) as num FROM user where username="'+req.query.username+'"';//数量
  connection.query(repeatCount, function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    if(results[0].num==0){//用户名不存在时,插入一条数据
      var sql = 'INSERT INTO user ( id, username,password ) VALUES ( null, "'+req.query.username+'", "'+req.query.password+'" )';
      connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        //接口返回值
        response = {
          'success': true
        }
        res.send(response)//当返回字符串时需要引入util对数据做处理,否则报错
      });
    }else if(results[0].num==1){/*用户名已存在,返回false*/
      response = {
        'success': false,
        'msg': '用户名已被占用'
      }
      res.send(response)//当返回字符串时需要引入util对数据做处理,否则报错
    }
  });
})

//登录接口
app.get('/login', function (req, res) {
  var loginUser = 'SELECT * FROM user where username="'+req.query.username+'"';
  connection.query(loginUser, function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    if(results.length == 0){
      response = {
        'success': false,
        'status': 2,
        'msg': '用户名不存在'
      }
      res.send(response)
    }else if(results.length == 1 && results[0].password == req.query.password){
      response = {
        'success': true,
        'status': 200,
        'msg': '登录成功'
      }
      res.send(response)
    }
    else if(results.length == 1 && results[0].password !== req.query.password){
      response = {
        'success': false,
        'status': 1,
        'msg': '用户名或密码错误'
      }
      res.send(response)
    }
  })
})

app.listen(8086,()=>console.log('服务启动'))
