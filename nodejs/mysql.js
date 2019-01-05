var mysql = require('mysql'); // 'mysql'라는 모듈 가져옴

// mysql 데이터베이스 서버에 접속할 접속정보 입력하기
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'opentutorials'
});
 
// 데이터베이스 서버에 연결하기
connection.connect();
 
// 쿼리 날리기
connection.query('SELECT * FROM topic', function (error, results, fields) {
  if (error) {
      console.log(error);
  }
  console.log(results);
});
 
// 데이터베이스 서버 연결끊기
connection.end();