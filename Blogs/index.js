const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const Blog = require('./models/blog');

mongoose.connect('mongodb://127.0.0.1:27017/Blogss')
.then(()=>{
    console.log("Db is connected");
}).catch(()=>{
    console.log("db not connected");
})

app.use(methodOverride('_method'))


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }))  //body parsing middleware -> formdata


// task1 -> display all the blogs
app.get('/blogs',async(req,res)=>{
    let allBlogs = await Blog.find({});
    res.render('index',{allBlogs});
})

app.get('/blog/new', (req,res)=>{
    res.render('new');
})


// actually adding in the db
app.post('/blogs' ,async(req,res)=>{
    let {title , author , comment} = req.body;
    let newBlog = await Blog.create({title , author , comment});
    res.redirect('/blogs')
 })

 //show a particular blog
 app.get('/blogs/:id' , async(req,res)=>{
    let {id} = req.params;
    let foundProduct = await Blog.findById(id);
    res.render('show' , {foundProduct})
})

//edit
app.get('/blogs/:idd/edit' , async(req,res)=>{
    let {idd} = req.params;
    let foundProduct =  await Blog.findById(idd);
    res.render('edit' , {foundProduct});
})

//update a blog
app.patch('/blogs/:id' , async(req,res)=>{
    let {id} =  req.params;
    // console.log(req.params.id);
    let {comment} = req.body;
    // console.log(req.body.comment)
    await Blog.findByIdAndUpdate(id , {comment});
    res.redirect('/Blogs')
})

// deleting
app.delete('/blogs/:id' , async(req,res)=>{
    let {id} =  req.params;
    await Blog.findByIdAndDelete(id);
    res.redirect('/blogs')
})

app.listen(8080,()=>{
    console.log("server is connected to port 8080");
})