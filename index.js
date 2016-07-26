var phantom = require('phantom'),
    express = require('express'), 
    app = express(), 
    fs = require("fs");

var sitepage = null;
var phInstance = null;


app.get('/', function (req, res) {
    var targetUrl = req.query.origin ? req.query.origin : "http://tw.yahoo.com/";
    console.log("Go:" + targetUrl)
    phantom.create()
        .then(instance => {
            phInstance = instance;
            return instance.createPage();
        })
        .then(page => {
            sitepage = page;
            return page.open(targetUrl);
        })
        .then(status => {
            console.log(status);
            return sitepage.property('content');
        })
        .then(content => {
            console.log(content);
            var fileName = 'output.html';
            sitepage.close();
            fs.writeFile(fileName, content, function(){});
            phInstance.exit();
            console.log(fileName)
            res.send(content);

        })
        .catch(error => {
            console.log(error);
            phInstance.exit();
        });

});

var server = app.listen(8081, function () { 
    var host = server.address().address 
    var port = server.address().port 
    console.log("Service listening at http://%s:%s", host, port) 
})