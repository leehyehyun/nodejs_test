var fs = require('fs');

fs.readdir('./data', function(error, filelist) {
    console.log(filelist);
})

//node nodejs/readdir.js
//[ 'CSS', 'HTML', 'JavaScript' ]
