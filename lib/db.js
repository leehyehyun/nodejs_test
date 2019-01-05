var mysql = require('mysql'); // 'mysql'라는 모듈 가져옴
var db = mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'111111',
   database:'opentutorials'
 });
db.connect();
module.exports = db;
