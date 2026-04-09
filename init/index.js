const mongoose =require("mongoose")
const initdata=require("./data")
const listing=require("../models/listing")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("connect to db");
    })
    .catch((err)=>{
        console.log(err)
    })

async function main(){
    await mongoose.connect(MONGO_URL)
}
const initDB=async()=>{
    await listing.deleteMany({})
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"69c812683f1230c0f6a576bc"}))
    await listing.insertMany(initdata.data)
    console.log("data was initialise")
}
initDB()