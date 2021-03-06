var db = require('./db');
var template = require('./template');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html'); // 사용자가 데이터 입력시 코드를 입력하여 공격하는 것을 방지

exports.home = function(request,response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error){
        throw error;
        }
        // console.log(topics);
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        
        var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
    });
};

exports.page = function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          }
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(topics);
          
          var html = template.HTML(title, list,
            `<h2>${sanitizeHtml(title)}</h2>
            <p>${sanitizeHtml(description)}</p>
            by ${sanitizeHtml(topic[0].name)}
            `,
            `<a href="/create">create</a>
            <a href="/update?id=${queryData.id}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${queryData.id}">
              <input type="submit" value="delete">
            </form>`
          );
          
          response.writeHead(200);
          response.end(html);
        });
      });
}

exports.create = function(request, response){
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error){
      throw error;
    }
    // console.log(topics);
    var title = 'Create';
    var list = template.list(topics);
    
    db.query(`SELECT * FROM author`, function(error2, authors){
      if(error2){
        throw error2;
      }

      var html = template.HTML(title, list,
        `<form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          ${template.authorSelect(authors)}
          <p>
            <input type="submit">
          </p>
        </form>`,
        ``
      );
      response.writeHead(200);
      response.end(html);
    });
  });
}

exports.create_process = function(request,response){
  var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        // console.log(body);
        var post = qs.parse(body);

        db.query(`
        INSERT INTO topic (title,description,created,author_id) 
          VALUES(?, ?, NOW(), ?)
        `, [post.title, post.description, post.author], function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/?id=${result.insertId}`});
          response.end();
        });
    });
}

exports.update = function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2,topic){
      if(error2){
        throw error2;
      }
      
      db.query(`SELECT * FROM author`, function(error3, authors){
        if(error3){
          throw error3;
        }
        var title = topic[0].title;
        var list = template.list(topics);
        
        var html = template.HTML(title, list,
          `<form action="/update_process" method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"></p>
            <p>
              <textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea>
            </p>
            <p>
            ${template.authorSelect(authors, topic[0].author_id)}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>`,
          ``
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  });
}

exports.update_process = function(request,response){
  var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      console.log(body);

      db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
      [post.title, post.description, post.author, post.id],
        function(error,result){
        if(error){
          throw error;
        }
        response.writeHead(302, {Location: `/?id=${post.id}`});
        response.end();
      });
  });
}

exports.delete_process = function(request,response){
  var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(error,result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/`});
          response.end();
      });
  });
}