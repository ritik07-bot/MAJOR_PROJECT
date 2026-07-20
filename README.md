# MAJOR_PROJECT
A hotel or place booking website
#  
  
        // .post(isLoggedIn,validateListing ,wrapAsync(listingController.createListing));

        .post(uploads.single("listing[image]"),(req,res)=>{
  console.log(req.file);
  res.send(req.file);
})