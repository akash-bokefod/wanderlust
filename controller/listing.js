const listing=require("../models/listing.js");

module.exports.index=async (req,res)=>{
    const search=req.query.search;
    if(search){
        const listings=await listing.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } }
            ]
        })
            
        if(listings.length===0){
            req.flash("error", `No listings found for ${search}`)
            return res.redirect('/listings');
        }
        else{
            return res.render('listings/index.ejs',{listings,search});
        }
    }
   else{
    const listings=await listing.find();
    res.render('listings/index.ejs',{listings});
   }
};

module.exports.renderNewFrom=(req,res,next)=>{
    res.render('listings/newListing');  
};

module.exports.editListing=async (req,res)=>{
    const {id}=req.params;
    const editListing=await listing.findById(id);
    if(!editListing){
        req.flash("error","Listing Not Found .")
        return res.redirect('/listings');
    }
    let originalImageUrl=editListing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render('listings/edit',{editListing,originalImageUrl})
}

module.exports.showListing=async (req,res,next)=>{
        const {id}=req.params;
        const showDetail=await listing.findById(id).populate({path:"reviews",populate:("author")}).populate("owner");
        if(!showDetail){
            req.flash("error","Listing Not Found .")
            return res.redirect('/listings');
        }
        res.render('listings/show',{showDetail})
}

module.exports.addListing=async (req,res,next)=>{
    const filename=req.file.filename;
    const url=req.file.path;
    req.body.listing.owner=req.user._id;
    req.body.listing.image={filename,url};
    await listing.insertOne(req.body.listing);
    req.flash("success","new listing create successfully!");
    res.redirect('/listings');
}

module.exports.deleteListing=async (req,res)=>{
    const {id}=req.params;
    const list=await listing.findByIdAndDelete(id);
    console.log(list);
    req.flash("success","listing delete successfully!");
    res.redirect('/listings')
}

module.exports.updateListing=async (req,res)=>{
    const {id}=req.params;
    const temp=req.body;
    
    const updateListing=await listing.findByIdAndUpdate(id,{...temp.listing});
    
    if(req.file){
        const filename=req.file.filename;
        const url=req.file.path;
        updateListing.image={filename,url};
        await updateListing.save();
    }
    req.flash("success","listing update!");
    res.redirect(`/listings/${id}`);
}