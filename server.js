/* Twillio App */

var http = require('http');
var meryl = require('meryl');
var fs = require('fs');
var https = require('https');

meryl.handle('GET /',function(req,res){
  fs.readFile('./index.html',encoding='utf8',function(err,data){
    if(err) console.loge(err);
      res.setHeader('Content-Type','text/html');
      res.end(data);  
      console.log(data);
  });
});
meryl.handle('GET /recievedcall', function(req,res){
  console.log(req.params);
  fs.readFile('./recieveform.xml',encoding='utf8',function(err,data){
    if(err) console.log(err);
    console.log(data);
    var resarray = {from:req.params.From}
    substitute(data,resarray,function(html){
      res.setHeader('Content-Type','text/xml');
      res.end(html);
      console.log(html);
    });
  });
});
meryl.handle('POST /makecall',function(req,res){
  console.log('making call...');
  console.log(req.params);
  var options = {
    host: 'ACacb4ecc7916a22d1eaefcc880b616f02:7891b9bc268b99111bc1ecdc92e9e8a1@api.twilio.com',
    port: 80,
    path: '/2010-04-01/Accounts/ACacb4ecc7916a22d1eaefcc880b616f02/CallsFrom='+ req.params.from+ '&TO=' + req.params.to + '&Url=http://ec2-50-16-59-162.compute-1.amazonaws.com/recievedcall',
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
meryl.run();
