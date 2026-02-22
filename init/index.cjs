const initData=require('./data.cjs');
const mongoose=require('mongoose');
const listing=require('../models/listing');
const { init } = require('../models/reviews');

mongoose.connect('mongodb://127.0.0.1:27017/wanderlust').then(()=>{console.log("conection sucuuesful");})
.catch(err=>{console.log(err);
})


// console.log(initData.data);



const data=initData.data.map(listing=>({...listing,owner:"694d29828ea4d681578d476c"}));
 console.log(data);


listing.insertMany(data).then(()=>{console.log("data inserted")})
// .catch((err)=>{console.log(err)});
//listing.deleteMany({}).then(res=>{console.log(res,"delate all item")}).catch(err=>{console.log(err)})
// listing.find().then(res=>{console.log(res);
// })
// .catch(err=>{console.log(err)});


