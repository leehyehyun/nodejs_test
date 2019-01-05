var http = require('http');
var url = require('url');
var qs = require('querystring');
var topic = require('./lib/topic');
var template = require('./lib/template');
var db = require('./lib/db');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){ // 메인화면
        topic.home(request,response);
      } else { // 상세보기
        topic.page(request,response);
      }
    } else if(pathname === '/create'){ // create 클릭함
      topic.create(request, response);
    } else if(pathname === '/create_process'){ // create에서 제출 클릭함
      topic.create_process(request, response);
    } else if(pathname === '/update'){
      topic.update(request, response);
    } else if(pathname === '/update_process'){
      topic.update_process(request, response);
    } else if(pathname === '/delete_process'){
      topic.delete_process(request, response);
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
