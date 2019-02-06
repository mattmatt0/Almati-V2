var express = require('express');

var app = express();
app.use(express.static(__dirname+'/public'));
app.get('/', function(req, res) {
    res.render('main.ejs');
});
app.use(function(req, res, next){

    res.render('404.ejs');
});
app.listen(8080);