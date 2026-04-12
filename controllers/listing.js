const Listing= require("../models/listing")



module.exports.index = async (req, res) => {
    let { search } = req.query; // Ensure this matches name="search" in navbar
    let filter = {};

    if (search) {
        filter.$or = [
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } }
        ];
    }

    const alllisting = await Listing.find(filter);

    if (search && alllisting.length === 0) {
        req.flash("error", "No listings match your search.");
        return res.redirect("/listing");
    }

    res.render("listings/index.ejs", { 
        alllisting,
        category: "Trending",
        search
    });
};


module.exports.filterByCategory = async (req, res) => {
    let { category } = req.params;
    let { search } = req.query;

    let filter = { category };

    if (search) {
        filter.$or = [
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } }
        ];
    }

    const alllisting = await Listing.find(filter);

    if (alllisting.length === 0) {
        req.flash("error", "No results found");
        return res.redirect("/listing");
    }

    res.render("listings/index.ejs", {   
        alllisting,
        category,
        search
    });
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

