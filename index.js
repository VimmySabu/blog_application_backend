const express=require('express')
const cors=require('cors')
const path = require('path');
const bcrypt=require('bcrypt')


const ArticleInfo=require('./src/model/blogDB')
const UserInfo=require('./src/model/userdb')



const app=express()

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('./build'));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname +'/build/index.html'));
    });

app.post('/api/login',(req,res)=>{
    res.header("Access-Control-Allow-Origin: *");
    try {
        UserInfo.find({email:req.body.email},(data)=>{
            if(data.length==0){
                var user={
                    username:req.body.username,
                    email:req.body.email,
                    password:bcrypt.hashSync(req.body.password,10)
                }
                console.log(user)
                const usernew=new UserInfo(user);
                usernew.save();
                res.status(200).json("User registered")
            }else{
                res.json("Email ID already exists")

            }

        })
        
    
        
        
    } catch (error) {
        res.status(500).json({error})
    }
    
    

})


app.post('/api/home',(req,res)=>{
    res.header("Access-Control-Allow-Origin: *");
  let useremail=req.body.email;
  let userpass=req.body.password;
      console.log(req.body)
      UserInfo.find({"email":useremail},
        {"password":userpass})
      .then(function(user){
          console.log(user)
          if(user.length>0){
              res.json("authentication success")
          }else{
              res.json("authentication failed")
          }
     })

})


app.get('/api/article/:name',(req,res)=>{
    res.header("Access-Control-Allow-Origin: *");
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
    res.header("Access-Control-Allow-Origin: *");
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
    res.header("Access-Control-Allow-Origin: *");
    const articleName=req.params.name;
    const { username, text } = req.body;
    const filter = { name: articleName };
    const update = { $push: { comments: { username, text } } };
    ArticleInfo.findOneAndUpdate(filter, update, { new: true })
        .then(function (article) {
            res.json(article);
        })
})

const port=process.env.PORT || 5000

app.listen(port,()=>console.log('Server on 5000'))