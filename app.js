var express = require('express');

var app = express();
app.use(express.static(__dirname+'/public'));
app.get('/', function(req, res) {
    res.render('main.ejs');
});
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable ESPECE DE FILS DE PUTE');
});
app.listen(8080);