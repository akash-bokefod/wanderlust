const initData=require('./data.cjs');
const mongoose=require('mongoose');
const listing=require('../models/listing');

mongoose.connect('mongodb://127.0.0.1:27017/wanderlust').then(()=>{console.log("conection sucuuesful");})
.catch(err=>{console.log(err);
})

listing.insertMany(initData.data).then(()=>{console.log("data inserted")})
.catch((err)=>{console.log(err)});
// listing.deleteMany({}).then(res=>{console.log(res,"delate all item")}).catch(err=>{console.log(err)})
listing.find().then(res=>{console.log(res);
})
.catch(err=>{console.log(err)});


