var express = require('express'); 

var app = express();
// For cookies
var cookieParser = require('cookie-parser');
app.use(cookieParser());



  
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.render('main.ejs');
    // res.cookie(C)
});

// If 404:
app.use(function(req, res, next){
    res.render('404.ejs');
});



app.listen(8080);