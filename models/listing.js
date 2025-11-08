const mongoose=require('mongoose');

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
    image:
        {
            type: String,
            default: "https://st.depositphotos.com/2288675/2455/i/950/depositphotos_24553989-stock-photo-hotel.jpg",
        },
    price:Number,
    location:String,
    country:String,
})

const listing=mongoose.model('listing',listingSchma);


module.exports=listing;


