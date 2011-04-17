/* Twillio App */

var http = require('http');
var meryl = require('meryl');
var fs = require('fs');

meryl.handle('GET /',function(req,res){
console.log(req.params);
  fs.readFile('./page.html',encoding='utf8',function(err,data){
    if(err) console.loge(err);
    console.log(data);    
var node = {from:req.params.FromCity,
body:'<Say voice="woman" loop="2">Hello, and welcome to the internet</Say>'}
    substitute(data,node,function(html){
      res.setHeader('Content-Type','text/xml');
      res.end(html);  
      console.log(html);
    });
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
