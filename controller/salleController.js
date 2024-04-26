const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const Salle = require("../models/Salle");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage
  
} = require("../utils/cloudinary");



/**-----------------------------------------------
 * @desc    Create New Salle
 * @route   /api/salles
 * @method  POST
 * * @access  private (only admin)
 
 ------------------------------------------------*/
 module.exports.createSalleCtrl = asyncHandler(async (req, res) => {
    // 1. Validation for image
    if (!req.file) {
      return res.status(400).json({ message: "no image provided" });
    }
  
    
  
    // 3. Upload photo
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);
  
    
// Create new announcement and save it to DB
const salle = await Salle.create({
    nom: req.body.nom,
    description: req.body.description,
    capacite: req.body.capacite,
    equipements: req.body.equipements,
    adresse: req.body.adresse,
    disponible: req.body.disponible,
    image: {
        url: result.secure_url,
        publicId: result.public_id,
      },
  });
  
    // 5. Send response to the client
    res.status(201).json(salle);
  
    // 6. Remove image from the server
    fs.unlinkSync(imagePath);
  });



  /**-----------------------------------------------
 * @desc    Get All Available Salles
 * @route   /api/salles
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getAllAvailableSallesCtrl = asyncHandler(async (req, res) => {
    // Fetch all salles where disponible is true from the database
    const availableSalles = await Salle.find({ disponible: true });
  
    // Send the list of available salles as response
    res.status(200).json(availableSalles);
});

/**-----------------------------------------------
 * @desc    Get Single Salle
 * @route   /api/salles/:id
 * @method  GET
 * @access  public
 ------------------------------------------------*/
 module.exports.getSingleSalleCtrl = asyncHandler(async (req, res) => {
  const salle = await Salle.findById(req.params.id) ;
  
  if (!salle) {
    return res.status(404).json({ message: "salle  not found" });
  }

  res.status(200).json(salle);
});


 /**-----------------------------------------------
 * @desc    Delete salle
 * @route   /api/salles/:id
 * @method  DELETE
 * @access  private (only admin )
 ------------------------------------------------*/
 module.exports.deleteSalleCtrl = asyncHandler(async (req, res) => {
  const salle = await Salle.findById(req.params.id);
  if (!salle) {
    return res.status(404).json({ message: "salle not found" });
  }

  if (req.user.isAdmin ) {
    await Salle.findByIdAndDelete(req.params.id);
    await cloudinaryRemoveImage(salle.image.publicId);
     return res.status(400).json({ message: "deleted" });

   
  } else {
    res.status(403).json({ message: "access denied, forbidden" });
  }
});


 /**-----------------------------------------------
 * @desc    Update Salle
 * @route   /api/salles/:id
 * @method  PUT
 * @access  private (only admin)
 ------------------------------------------------*/
 module.exports.updateSalleCtrl = asyncHandler(async (req, res) => {
  

  
  const salle = await Salle.findById(req.params.id);
  
  if (!salle) {
    return res.status(404).json({ message: "salle not found" });
  }

  // 3. check admin is logged
  if (req.user.isAdmin) {
    
  

  // 4. Update salle
  const updatedSalle= await Salle.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        nom: req.body.nom,
    description: req.body.description,
    capacite: req.body.capacite,
    equipements: req.body.equipements,
    adresse: req.body.adresse,
    disponible: req.body.disponible,
      },
    },
    { new: true }
 );

 

res.status(200).json(updatedSalle);
} else {
res.status(403).json({ message: "Access denied, forbidden" });
}

  
});

 /**-----------------------------------------------
 * @desc    Update Salle Image
 * @route   /api/salles/update-image/:id
 * @method  PUT
 * @access  private (only admin)
 ------------------------------------------------*/
 module.exports.updateSalleImageCtrl = asyncHandler(async (req, res) => {
  // 1. Validation
  if (!req.file) {
    return res.status(400).json({ message: "no image provided" });
  }

  // 2. Get the salle from DB and check if salle exist
  const salle = await Salle.findById(req.params.id);
  if (!salle) {
    return res.status(404).json({ message: "salle not found" });
  }

  // 3. Check only admin
  if (req.user.isAdmin) {

  // 4. Delete the old image
  await cloudinaryRemoveImage(salle.image.publicId);

  // 5. Upload new photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  // 6. Update the image field in the db
  const updatedSalle = await Salle.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        }
      }
    },
    { new: true, });

  // 7. Send response to client
  res.status(200).json(updatedSalle);

  // 8. Remvoe image from the server
  fs.unlinkSync(imagePath);
} else {
  res.status(403).json({ message: "Access denied, forbidden" });
  }
});








