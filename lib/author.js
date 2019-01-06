var db = require('./db');
var template = require('./template');

exports.home = function(request,response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        db.query(`SELECT * FROM author`, function(error2, authors){
            if(error || error2){
                throw error;
            }
            var title = 'author';
            var list = template.list(topics);
            var html = template.HTML(title, list,
            `
            ${template.authorTable(authors)}
            <style>
                table{
                    border-collapse:collapse; // 표의 셀 사이사이의 기본 간격 붙이기
                }
                td{
                    border:1px solid black;
                }
            </style>
            `,
            `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}