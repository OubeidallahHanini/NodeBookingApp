const router = require("express").Router();
const photoUpload = require("../middlewares/photoUpload");
const {createSalleCtrl, getAllAvailableSallesCtrl,getSingleSalleCtrl,deleteSalleCtrl,updateSalleCtrl,updateSalleImageCtrl} = require("../controller/salleController");
const {verifyTokenAndAdmin} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");





router
  .route("/")
  .post( verifyTokenAndAdmin ,photoUpload.single("image"),createSalleCtrl ) 
  .get(getAllAvailableSallesCtrl) ;


  // /api/salles/:id
router
.route("/:id")
.get(validateObjectId, getSingleSalleCtrl)
.delete(validateObjectId, verifyTokenAndAdmin, deleteSalleCtrl)
.put(validateObjectId, verifyTokenAndAdmin, updateSalleCtrl);

  // /api/salles/update-image/:id
  router
  .route("/update-image/:id")
  .put(validateObjectId, verifyTokenAndAdmin, photoUpload.single("image"), updateSalleImageCtrl);

  

  



 


module.exports = router ;