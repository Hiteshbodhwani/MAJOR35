const Listing = require("../models/listing");

// module.exports.index = async (req,res)=>{
//     const alllistings = await Listing.find({});
//     res.render("index.ejs",{alllistings});
// };

module.exports.index = async (req, res) => {
  let search = req.query.search || "";
  let category = req.query.category || "";
  let allListings = [];
  if (category != "") {
    allListings = await Listing.find({ category: `${category}` });
  } else if (search !== "") {
    // allListings = await Listing.find({ title: { $regex: `\\b${search}`, $options: 'i' } }).populate("owner");
    // allListings = await Listing.find({
    //     $or: [
    //       { title: { $regex: `\\b${search}`, $options: 'i' } },
    //       { location: { $regex: `\\b${search}`, $options: 'i' } },
    //       { country: { $regex: `\\b${search}`, $options: 'i' } },
    //       { 'owner.username': { $regex: `\\b${search}`, $options: 'i' } }
    //     ]
    //   }).populate("owner").populate("reviews");
    allListings = await Listing.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $match: {
          $or: [
            { title: { $regex: `\\b${search}`, $options: "i" } },
            { location: { $regex: `\\b${search}`, $options: "i" } },
            { country: { $regex: `\\b${search}`, $options: "i" } },
            { "result.username": { $regex: `\\b${search}`, $options: "i" } },
            { category: { $regex: `\\b${search}`, $options: "i" } },
          ],
        },
      },
    ]);
    if (allListings.length === 0) {
      throw new Error("No match found");
    }
  } else {
    allListings = await Listing.find({});
  }

  res.render("index.ejs", { allListings });
};
module.exports.rendernewform = (req,res)=>{
    
    res.render('new.ejs');
};
module.exports.showlisting = async (req, res) => {
    
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",}}).populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("show.ejs", { listing });
    
  };
  
module.exports.createnewlisting = async(req, res,next) => {
      
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
     await newListing.save();
     req.flash("success","New listing created!");
     res.redirect("/listings");
     };

module.exports.editlisting = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("edit.ejs", { listing });
  };

 module.exports.updatelisting = async (req, res) => {
      
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success"," listing updated!");
    res.redirect(`/listings/${id}`);
  };
  
module.exports.deletelisting = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
  };