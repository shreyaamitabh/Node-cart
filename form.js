var express=require('express');
var app= express();
var session= require("express-session");
var handlebars=require("express-handlebars").create({defaultLayout:"main"});
var bodyParser= require("body-parser");
var cookieParser = require('cookie-parser')
app.engine("handlebars",handlebars.engine);
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set("view engine",'handlebars');
app.set('port', 8000);
app.use(express.static(__dirname+'/public'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie:{
      maxAge: 1000*60*60,
      sameSite:true,
      secure:false
    }
  }))
var mysql=require("mysql");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://shreya_amitabh:8170800701@cluster0-xixrj.mongodb.net/shopping_cart?retryWrites=true&w=majority";
var dbo;
MongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
    if (err) throw err;
     dbo = db.db("shopping_cart");
});


var con= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"amitabhs",
    database: "demo"
});
con.connect(function(err){
        if(err)
        {throw err;}
app.get("*", (req, res, next)=>{
 
  res.locals.cart= req.session.cart;
 
  next();
})
app.get("/home", urlencodedParser, function(req, res){

        dbo.collection("products").find({}).toArray(function(err, result) {
          if (err) throw err;
         res.render("home", {docs:result});
         
        });
})
app.get("/login", urlencodedParser, function(req, res){
   res.render("login");
});
app.get("/signup", urlencodedParser, function(req, res){
    res.render("signup");
 });


app.post('/home/user',urlencodedParser, function (req, res) {
    var email=req.body.Email;
    var pass= req.body.Password;
    var sess;
    console.log(req.session.user);
    con.query("Select * from Users where Email=? and Password=?", [email, pass], function(error, result){
        if(result.length>0)
        {
          sess.username= result.Username;
            dbo.collection("products").find({}).toArray(function(err, results) {
                if (err) throw err;
               res.render("Products", {docs:results,data: sess});
            });
        }
        else
        res.send('Incorrect Username and/or Password!');
    }); 
  });
  app.post('/home/Users', urlencodedParser, function (req, res) {
    console.log(req.body);
    var user=[
       req.body.Email,
        req.body.Name,
       req.body.Password
  ]
    
    con.query("Insert into Users values(?, ?, ?)",user, function(err, result){
        if(err)
       {
        res.send('Email Already exists');
        throw err;
       } 
       dbo.collection("products").find({}).toArray(function(err, result) {
        if (err) throw err;
       res.render("Products", {docs:result,data: req.body.Name });
       
      });
    })
   
  });
});
app.get("/home/:productId", function(req, res){
  
    var productId= req.params.productId;
    dbo.collection("products").findOne({id:productId},function(err, result) {
        if (err) throw err;
      // console.log(result);
      console.log(req.session.reqData);
        console.log("before",  (req.session.cart));
      if(typeof (req.session.cart) === 'undefined')
        {
          req.session.cart=[];
        req.session.cart.push(result.name);
          console.log(req.session.cart);
         
        }
        else
        {
        req.session.cart.push(result.name);
        req.session.save((function(err) {
          console.log('saved!');
       
        
        }));
       
      }
        //     var cart= req.session.cart;
        //     var newItem= true;
        //     for(var i=0; i<cart.length; i++)
        //     {
        //         if(cart[i].name===result.name)
        //         {
        //             cart[i]= {...cart[i], quantity:quantity+1};
        //             newItem= false;
        //             break;
        //         }
        //     }
        //     if(newItem)
        //     {
        //         cart.push({...result, quantity:1});
        //     }
        // }
        console.log(req.session.reqData);
       console.log("after", req.session.cart);
      
      
      });
})
app.get("/home/:category", urlencodedParser, function(req, res){
  var query = {category: req.params.category };
  dbo.collection("products").find(query).toArray(function(err, result) {
    if (err) throw err;
   res.render("category", {docs:result});
  });
});

  app.listen(8000, ()=>{
    console.log("Listening");
});