var express = require('express');

var app = express();

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.render('main.ejs', {etage: req.params.etagenum});
});

app.listen(8080);