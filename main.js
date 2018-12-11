var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring'); // post로 전송된 데이터 받을때 필요
var temp = require('./lib/temp.js'); //함수를 템플릿화 한것을 모듈로 따로떼어 가져오도록 함 (./는 현재 디렉토리를 뜻함)

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    // console.log(url.parse(_url, true));
    
    if(pathname === "/"){
        if(queryData.id === undefined){
            fs.readdir('./data', function(error, filelist) {
                var title = 'Welcome!!';
                var description = 'Hello Node.js~~~ :)';
                var list = temp.list(filelist);
                var template = temp.HTML(title, list, 
                    `<h2>${title}</h2>${description}`, 
                    `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(template); 
            });
        }else{
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                fs.readdir('./data', function(error, filelist) {
                    var title = queryData.id;
                    var list = temp.list(filelist);
                    var template=temp.HTML(title, list, 
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a> 
                        <a href="/update?id=${title}">update</a> 
                        <form action="delete_process" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                        </form>`);
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    }else if(pathname === "/create"){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            fs.readdir('./data', function(error, filelist) {
                var title = queryData.id;
                var list = temp.list(filelist);
                var template=temp.HTML(title, list, `
                <form action="/process_create" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `, '');
                response.writeHead(200);
                response.end(template);
            });
        });
    }else if(pathname === "/process_create"){
        var body = '';
        request.on('data', function(data){
            body += data; // 조각조각의 data를 수신한 뒤, data를 정보 수신이 될 때마다 body에 붙여넣음
        });
        request.on('end', function(){ // 정보 수신이 끝남
            var post = qs.parse(body); // post데이터에 post정보가 들어있음
            // console.log(post);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                response.writeHead(302, { // 리다이렉션
                    Location: `/?id=${title}`
                });
                response.end();
            });
        });
    }else if(pathname === "/update"){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            fs.readdir('./data', function(error, filelist) {
                var title = queryData.id;
                var list = temp.list(filelist);
                var template=temp.HTML(title, list, 
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${description}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,
                    '');
                response.writeHead(200);
                response.end(template);
            });
        });
    }else if(pathname === "/update_process"){
        var body = '';
        request.on('data', function(data){
            body += data; // 조각조각의 data를 수신한 뒤, data를 정보 수신이 될 때마다 body에 붙여넣음
        });
        request.on('end', function(){ // 정보 수신이 끝남
            var post = qs.parse(body); // post데이터에 post정보가 들어있음
            // console.log(post);
            var id = post.id;
            var title = post.title;
            var description = post.description;

            fs.rename(`data/${id}`, `data/${title}`,function(err){ // 파일이름 변경하기
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){ // 파일내용 변경하기
                    response.writeHead(302, { // 리다이렉션
                        Location: `/?id=${title}`
                    });
                    response.end();
                });
            });
        });
    }else if(pathname === "/delete_process"){
        var body = '';
        request.on('data', function(data){
            body += data; // 조각조각의 data를 수신한 뒤, data를 정보 수신이 될 때마다 body에 붙여넣음
        });
        request.on('end', function(){ // 정보 수신이 끝남
            var post = qs.parse(body); // post데이터에 post정보가 들어있음
            // console.log(post);
            var id = post.id;
            fs.unlink(`data/${id}`, function(err){
                response.writeHead(302, { // 리다이렉션
                    Location: `/`
                });
                response.end();
            });
        });
    }else{
        response.writeHead(404);
        response.end('Not found');
    }

 
});
app.listen(3000);