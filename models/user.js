const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose").default;

console.log(typeof passportLocalMongoose);


const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("user",userSchema);