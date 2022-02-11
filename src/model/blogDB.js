const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://vimmy:blog123@cluster0.wospw.mongodb.net/blog-application?retryWrites=true&w=majority')
const Schema=mongoose.Schema;
const articleSchema=new Schema({
    name:String,
    username:String,
    upvotes:Number,
    comments:Array,
    
})

const ArticleInfo=mongoose.model('articles',articleSchema)
module.exports=ArticleInfo;
//mongodb+srv://vimmy:blog123@cluster0.wospw.mongodb.net/blog-application?retryWrites=true&w=majority