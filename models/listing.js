const mongoose =require("mongoose")
const Schema=mongoose.Schema
const Review= require("./review")

const listingSchema= new Schema({
    title:{
        type:String,
        required:true,

    },
    description: String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:[String],
        enum: [
            "Rooms", 
            "Iconic Cities", // Added the 's'
            "Mountains", 
            "Castles",       // Capitalized to match general convention
            "Amazing Pools", // Changed from "Swimming Pool" to match your UI
            "Camping", 
            "Farms", 
            "Arctic", 
            "Beach"
        ]    }
})


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
           await Review.deleteMany({_id:{$in:listing.reviews}})
 
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;