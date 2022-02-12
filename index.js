const express=require('express')
const cors=require('cors')
const path = require('path');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')


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

app.post('/api/signup',(req,res)=>{
    res.header("Access-Control-Allow-Origin: *");
    try {
        UserInfo.find({email:req.body.email},(err,data)=>{
            if(data.length==0){
                var user={
                    username:req.body.username,
                    email:req.body.email,
                    password:bcrypt.hashSync(req.body.password,10)
                }
                //console.log(user)
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


app.post('/api/login',(req,res)=>{
    res.header("Access-Control-Allow-Origin: *");
  let useremail=req.body.email;
  let userpass=req.body.password;
      //console.log(req.body)
      UserInfo.find({"email":useremail},(err,data)=>{
          if(data.length>0){
              const passwordValidator=bcrypt.compareSync(userpass,data[0].password)
              //console.log(passwordValidator)
                if(passwordValidator){

                    //token generation
                    jwt.sign({email:data[0].email,id:data[0]._id},
                        'secrettoken',
                        {expiresIn:'1d'},
                        (err,token)=>{
                            if(err){
                                res.json("Error in token generation")
                            }else{
                                //console.log(token)
                                res.json("Authentication success")
                            }
                        })
                  
              }else{
                  res.json("Invalid password")
              }
          }else{
              res.json("User does not exist")
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