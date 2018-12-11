module.exports = { // 함수를 모듈화해서 외부에서 사용할 수 있게 export 한다.
    HTML:function(title, list, body, control){
        return `
        <!doctype html>
        <html>
        <head>
        <title>WEB - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${body}
        </body>
        </html>
    `;
    },list:function(filelist){
        var list = '<ul>';
        for (var i = 0 ; i < filelist.length ; i++){
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
        }
        list += '</ul>';
        return list;
    }
}

// module.exports = temp; // 위에서 var temp 대신에 module.exports 사용할 수 있다.