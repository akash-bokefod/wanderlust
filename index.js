require("dotenv").config();

console.log(process.env.SECRET);


const express=require('express');
const mongoose=require('mongoose');
const MONGO_URI='mongodb://127.0.0.1:27017/wanderlust'
const dburl=process.env.ATLAS_URL;
const path=require('path');
const methodOverride = require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require("./util/ExpressError.js");
const listingRouter=require("./Routes/listing.js");
const reviewRouter=require("./Routes/reviews.js");
const userRouter=require("./Routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport"); 
const LocalStrategy=require("passport-local");
const user=require("./models/user.js");
const { log } = require("console");

mongoose.connect(dburl).then(()=>{console.log("connnection sucuessful");})
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

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})

store.on("error",(err)=>{
    console.log("error in mongo session store",err);
})

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 7*24*60*60*1000}
}

app.use(session(sessionOption));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success") ||[];
    res.locals.error=req.flash("error") ||[];
    res.locals.currUser=req.user;
    res.locals.search = req.query.search || "";
    next();
})


app.use('/listings',listingRouter);
app.use('/listings/:id/reviews',reviewRouter);
app.use('/',userRouter);

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    console.log(err);
    let {statusCode=500,message="somthing is wrong"}=err;
    res.status(statusCode).render('listings/error.ejs',{message});
})

app.listen(port,()=>{
    console.log("server is starting...in port ",port);
})  