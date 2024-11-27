const express = require("express");
const router = express.Router();
const wrapasync=require("../utils/wrapasync.js");
const Listing =require("../models/listing.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const expresserror=require("../utils/expresserror.js");
const {isLoggedIn,isOwner} = require("../middleware.js");


const listingcontroller = require("../controller/listing.js");
//index route
router.get('/', 
    wrapasync(listingcontroller.index)
  );

  //new route
  router.get('/new',isLoggedIn,listingcontroller.rendernewform);
  
  //show route
 router.get("/:id", wrapasync(listingcontroller.showlisting));

    
//create route
router.post("/",isLoggedIn,
    wrapasync (
    listingcontroller.createnewlisting));
  //Edit Route
  router.get("/:id/edit",isLoggedIn,isOwner,wrapasync(listingcontroller.editlisting));
    
    //Update Route
    router.put("/:id",isLoggedIn,isOwner,wrapasync(listingcontroller.updatelisting));
  
     //Delete Route
  router.delete("/:id",isLoggedIn,isOwner,wrapasync(listingcontroller.deletelisting));

module.exports = router;