require('./test/common');
var http = require('http'),
    util = require('util'),
    https = require('https'),
    fs = require('fs'),
    formidable = require('formidable'),
    server;

server = http.createServer(function(req, res) {
  if (req.url == '/') {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
      '<form action="/post" method="post">'+
      'from:<input type="text" name="from"><br>'+
      'to:<input type="text" name="to"><br>'+
      '<input type="submit" value="Submit">'+
      '</form>'
    );
  } else if (req.url == '/post') {
    var form = new formidable.IncomingForm(),
        fields = [];

    form
      .on('error', function(err) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('error:\n\n'+util.inspect(err));
      })
      .on('field', function(field, value) {
        p([field, value]);
        fields.push([field, value]);
      })
      .on('end', function() {
        puts('-> post done');
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('received fields:\n\n '+util.inspect(fields));
          var options = {
            host: 'ACacb4ecc7916a22d1eaefcc880b616f02:7891b9bc268b99111bc1ecdc92e9e8a1@api.twilio.com',
            port: 80,
            path: '/2010-04-01/Accounts/ACacb4ecc7916a22d1eaefcc880b616f02/CallsFrom=+1'+ fields[0][1] + '&TO=+1' + fields[1][1] + '&Url=http://ec2-50-16-59-162.compute-1.amazonaws.com/recievedcall',
            method: 'POST'
          }
          console.log(options);
          var request = https.request(options, function(response){
            console.log('statusCode: ',response.statusCode);
            console.log('headers: ',response.headers);
            response.on('data',function(data){
              process.stdout.write(data);
            });
          }); 
          request.end();
          request.on('error', function(err){
            console.log(err);
          }); 
      });
    form.parse(req);
  } else if (req.url == '/recievedcall') {
    console.log(req);
    fs.readFile('./recieveform.xml',encoding='utf8',function(err,data){
      if(err) console.log(err);
      console.log(data);
      var resarray = {};
      resarray.from = '';
      substitute(data,resarray,function(html){
        res.setHeader('Content-Type','text/xml');
        res.end(html);
        console.log(html);
      });
    });
  } else if (req.url == '/index') {
    fs.readFile('./index.xml',encoding='utf8',function(err,data){
      if(err) console.log(err);
      console.log(data);
      var resarray = {};
      resarray.cityfrom = '';
      substitute(data,resarray,function(html){
        res.setHeader('Content-Type','text/xml');
        res.end(html);
        console.log(html);
      });
    });
  } else {
    res.writeHead(404, {'content-type': 'text/plain'});
    res.end('404');
  }
});

function substitute(string,array,callback){
  var re = /<:\s(\w+)\s:>/g;
  var searchString = string;
  var result = searchString.match(re);
  for (i=0;i<result.length;i++){
    var reg = /\s(\w+)\s/;
    var tarray = reg.exec(result[i]);
    var templateName = tarray[1];
    var replacement = array[templateName];
    searchString = searchString.replace(result[i],replacement);
  }
  callback(searchString);
};
server.listen(TEST_PORT);
util.puts('listening on http://localhost:'+TEST_PORT+'/');
