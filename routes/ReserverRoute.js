const router = require("express").Router();
const { reserver, AllReservations, UpdateReservation, deleteReservation, Calendrier } = require("../controller/ReservationController")
const {verifyToken} = require("../middlewares/verifyToken")

router.post("/reserver", reserver);

// router.get("/AllReservations", verifyToken, AllReservations);


router.route("/AllReservations").get(verifyToken,AllReservations);

router.route("/DeleteReservation/:id").delete(verifyToken,deleteReservation);

 router
 .route("/:id")
 .delete(verifyToken, deleteReservation)
 .put( verifyToken, UpdateReservation);



router.route("/UpdateReservation/:id").put(verifyToken,UpdateReservation);

router.route("/Calendrier").get(verifyToken,Calendrier);




module.exports = router;
