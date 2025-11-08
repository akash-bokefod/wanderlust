const express=require('express');
const mongoose=require('mongoose');
const MONGO_URI='mongodb://127.0.0.1:27017/wanderlust'
const listing=require('./models/listing.js');
const path=require('path');
const methodOverride = require('method-override');
const ejsMate=require('ejs-mate');


mongoose.connect(MONGO_URI).then(()=>{console.log("connnection sucuessful");})
.catch((err)=>{console.log(err);})

const app=express();
const port=3000;
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('ejs',ejsMate);

app.get('/listings',async (req,res)=>{
    const listings=await listing.find();
    // console.log(listings);
    res.render('listings/index.ejs',{listings});
});

app.get('/listings/new',(req,res)=>{
    res.render('listings/newListing');
})
app.get('/listings/:id/edit',async (req,res)=>{
    const {id}=req.params;
    const editListing=await listing.findById(id);
    res.render('listings/edit',{editListing})
});

app.get('/listings/:id',async (req,res)=>{
    const {id}=req.params;
    const showDetail=await listing.findById(id);
    res.render('listings/show',{showDetail})
});

app.post('/listings',async (req,res)=>{
    await listing.insertOne(req.body.listing);
    res.redirect('/listings');
})

app.delete('/listings/:id/delete',async (req,res)=>{
    const {id}=req.params;
    const list=await listing.findByIdAndDelete(id);
    res.redirect('/listings')
})

app.put('/listings/:id',async (req,res)=>{
    const {id}=req.params;
    const temp=req.body;
    const updateListing=await listing.findByIdAndUpdate(id,temp.listing,{new:true});
    res.redirect(`/listings/${id}`);
})

app.listen(port,()=>{
    console.log("server is starting...in port ",port);
})  