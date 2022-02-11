const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://vimmy:blog123@cluster0.wospw.mongodb.net/blog-application?retryWrites=true&w=majority')
const Schema=mongoose.Schema;
const userSchema=new Schema({
    username:String,
    email:String,
    password:String
})

const UserInfo=mongoose.model('users',userSchema)
module.exports=UserInfo;