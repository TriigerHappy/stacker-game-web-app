var http = require('http');
var mysql = require('mysql');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var validator = require('validator');


var con = mysql.createConnection({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: "3306",
    user: "Lbcsadmin",
    password: "Lbcsadmin",
    database: "stacker"
});

con.connect(function(err) {
   if (err) throw err;
   console.log("connected");
   // let query = "CREATE TABLE hi_score (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), score VARCHAR(255), ip_address VARCHAR(255))"
   // con.query(query, function(err, result) {
   //     if(err) throw err;
   //     console.log("Succeeded");
   // });
});



http.createServer(function (req, res) {
    var requrl = url.parse(req.url, true);
    var data = "";
    if (requrl.pathname == '/submit_scores') {
        // return high scores
        console.log("Got GET request");
        var callback = function(err, result) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(result);
        };
        getHighScores(callback);
    }

    else {
        fs.readFile('index.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    }
    if (req.method == 'POST') {
        req.setEncoding('utf-8');
        var body = "";
        req.on('data', function (chunk) {
            console.log(chunk);
            body += chunk;
        });
        req.on('end', function () {
            // Score submission handled here
            let submission = qs.parse(body);
            console.log('POSTed: ' + body);
            var playerScore = validator.escape(submission.input_score);
            var playerName = validator.escape(submission.input_name);
            submitScore(playerName, playerScore);
        });
    }

}).listen(8080);

function getHighScores(callback) {
    var json = "";
    con.query("SELECT * FROM hi_score", function (err, result, fields) {
        if (err) return callback(err, null);
        console.log("result: " + result);
        json = JSON.stringify(result);

        callback(null, json);
    });
}

function submitScore(name, score) {
    let sql = "INSERT INTO hi_score (name, score) VALUES ('" + name + "', '" + score + "')"
    con.query(sql, function(err, result) {
        if(err) throw err;
        console.log("Succeeded");
    });
}