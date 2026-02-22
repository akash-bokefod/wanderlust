const mongoose=require('mongoose');
const reviews = require('./reviews');
const { ref } = require('joi');

const schma=mongoose.Schema;

const listingSchma=new schma({
    title:{
        type:String,
        require:true,
    },
    description:{ 
        type:String,
        default:"no description",
    },
    image:{
      filename:String,
      url:String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"review"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },

})

listingSchma.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await reviews.deleteMany({_id:{$in:listing.reviews}});
    }
})

const listing=mongoose.model('listing',listingSchma);


module.exports=listing;


