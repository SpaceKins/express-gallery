var express= require('express');
var querystring=require('querystring');

var PORT=8080;

var app= express();

//var bodyParser= require('body-parser');
var bodyParser = require('body-parser');
var morgan=require('morgan');


morgan('dev');


app.get('/',function(req,res){
  res.send('hello');
})

app.post('/userEncode',bodyParser.urlencoded());

app.post('/users',function(req,res,nex){
  if(!req.body.name){
    throw new Error('Name is missing or not valid');
  }
  if(!req.body.email){
    var err=new Error('Email is missing')
    err.statusCode=400;
    throw err;
  }
  res.send('creating user');
}
/*
, function(req,res){
  res.status(400).json({
    message: err.message
  });
}
*/
)

app.use('/r/',function(req,res,next){
  console.log('custom middleware');
  req.on('data',function(data){
    console.log(data);
    req.body=querystring.parse(data.toString());
  });

  req.on('end',function(){
    req.body=req.body || {};
    next();
  })


},
function(req,res,next){
  console.log('custom middleware 2');
})

app.use(function(err,req,res,next){
  if(err){
    res.status(400).json({
    message: err.message,
    statusCode: err.statusCode
  });
  }
  res.send("Yo can't find that page");
})

var server = app.listen(PORT,function(){
  console.log('Listening on Port ' + PORT);
});