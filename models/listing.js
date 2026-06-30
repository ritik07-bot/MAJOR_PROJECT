;const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image: {
    filename: {
        type: String,
        default: "listingimage",
    },
    url: {
        type: String,
        default:
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop",
        set: (v) =>
            v === ""
                ? "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop"
                : v,
    },
},
    price:Number,
    location:String,
    country:String,
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports= Listing;