/*
 *  Twillio App
 *  Quick little app for setting meetings 
 *
 */
 
 var http = require('http');
 var meryl = require('meryl');
 var dust = require('dust');
 var fs = require('fs');
meryl.handle('GET /',function(req,res){
 fs.readFile('./page.html',encoding='utf8',function(err,data){
   if(err) console.log(err);
   node = {
     title:'<div>Title goes here</div>',
     body:'<Say voice="woman" loop="2">Hello</Say>'
   }
   substitute(data,node,function(html){
     res.setHeader("Content-Type", "text/xml");
     res.end(html);
     console.log(html);
   }); 
 });
});   
  function substitute(string,array,callback){
    var re = /<:\s(\w+)\s:>/g;
    var searchString = string;
    var result = searchString.match(re);
    for (i = 0;i<result.length;i++){
      var reg = /\s(\w+)\s/;
      var tarray = reg.exec(result[i]);
      var templateName = tarray[1];
      var replacement = array[templateName];
      searchString = searchString.replace(result[i],replacement);
    }
    callback(searchString);
  }
meryl.run();