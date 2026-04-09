const Listing= require("../models/listing")


module.exports.index=async (req,res)=>{
    const alllisting=await Listing.find({})
    res.render("listings/index.ejs",{alllisting})
}


module.exports.filterByCategory = async (req, res) => {
    let { category } = req.params;
    
    const alllisting = await Listing.find({ category: category });
    
    if (alllisting.length === 0) {
        req.flash("error", `No Result found for ${category}`);
        return res.redirect("/listing");
    }

 
    res.render("listings/category.ejs", { alllisting, category }); 
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.showListing=async(req, res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error"," The listing you trying to access is does not exist")
        return res.redirect("/listing")
    }
    res.render("listings/show.ejs",{listing})
}


module.exports.createListing=async(req,res, next)=>{
    let url=req.file.path;
    let filename=req.file.filename;

    const newlisting=new Listing(req.body.listing)
    newlisting.owner=req.user._id;
    newlisting.image={url,filename}
    await newlisting.save()
    req.flash("success","New Listing Created")


    res.redirect("/listing")

}


module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id)
    if(!listing){
        req.flash("error"," The listing you trying to access is does not exist")
        return res.redirect("/listing")
    }

    let orignalImageUrl=listing.image.url
   orignalImageUrl= orignalImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing,orignalImageUrl})
}

module.exports.updateListing=async(req,res)=>{

    let {id}=req.params;
    let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing})
    
    if(typeof req.file !=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename}
    await listing.save();
}
    req.flash("success","Listing Edited Successfully")
    res.redirect(`/listing/${id}`)
}

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    let deletelisting= await Listing.findByIdAndDelete(id)
    req.flash("success","Listing Deleted successfully")
   
    res.redirect("/listing")
}

