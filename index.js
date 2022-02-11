const express=require('express')
const cors=require('cors')
const path = require('path');


const ArticleInfo=require('./src/model/blogDB')
const UserInfo=require('./src/model/userdb')



const app=express()

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('./build/'));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname +
    /build/index.html));
    });

app.post('/api/login',(req,res)=>{
    res.header("Access-Control-Allow-Origin: *");
    var user={
        username:req.body.username,
        email:req.body.email,
        password:req.body.password
    }
    const usernew=new UserInfo(user);
    usernew.save();
    res.redirect('/home')
    

})


app.post('/api/home',(req,res)=>{
    res.header("Access-Control-Allow-Origin: *");
  let useremail=req.body.email;
  let userpass=req.body.password;
      //console.log(req.body)
      UserInfo.find({"email":req.body.email})
      .then(function(user){
          console.log(user)
          if(user.length>0){
              var dataemail=Object.values(user)[0].email
              var datapass=Object.values(user)[0].password
              if(useremail==dataemail&&userpass==datapass){
                  return res.json('authentication success').redirect('/home')
              }else{
                return res.json('authentication failed')
              }


          }else{
              return res.json("Invalid email and password")
          }
          
      })
 

    

})




app.get('/api/article/:name',(req,res)=>{
    
    try {
        const articleName=req.params.name;
        
        ArticleInfo.findOne({name:articleName})
        .then(function(article){
            res.status(200).json(article)
        })
    } catch (error) {
        res.status(500).json({message:'Error',error})
    }
    
})
//Upvotes Routing
app.post('/api/article/:name/upvote',(req,res)=>{

    const articleName=req.params.name
    const filter = { name: articleName };
    const update = { $inc: { upvotes: 1 } };
    ArticleInfo.findOneAndUpdate(filter, update, { new: true })
        .then(function (article) {
            res.json(article);
        })
})

//CommentsRouting
app.post('/api/article/:name/comments',(req,res)=>{
    
    const articleName=req.params.name;
    const { username, text } = req.body;
    const filter = { name: articleName };
    const update = { $push: { comments: { username, text } } };
    ArticleInfo.findOneAndUpdate(filter, update, { new: true })
        .then(function (article) {
            res.json(article);
        })
})



app.listen(5000,()=>console.log('Server on 5000'))