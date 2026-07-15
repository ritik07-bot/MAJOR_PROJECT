// const mongoose = require("mongoose");

// const initData = require("./data.js");
// const Listing= require("../models/listing.js");

// const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlusts";

// main().then(()=>{
//     console.log("connected to DB");
// })
// .catch((err)=>{
//     console.log(err);
// })

// async function main(){
//     await mongoose.connect(MONGO_URL);
// } 
// const initDB = async ()=>{
//    await Listing.deleteMany({});
//    await Listing.insertMany(initData.data);
//    console.log("data was initialized");
// };

// initDB();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlusts";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    await Listing.deleteMany({});

    initData.data = initData.data.map((obj)=>({
       ...obj,owner:"6a573477d019c56c66dd9a0c"
    }));
    await Listing.insertMany(initData.data);

    console.log("Data was initialized");

    mongoose.connection.close();
}

main().catch(console.log);