const asyncHandler = require("express-async-handler");
const Reservation = require("../models/reservation");
const Salle = require("../models/Salle");
const verifyToken = require("../middlewares/verifyToken");

const verifierDisponibiliteSalle = async (salleId, checkInDate, checkOutDate) => {
  try {
    const reservations = await Reservation.find({
      salleId: salleId,
      $or: [
        // La nouvelle plage horaire chevauche une réservation existante
        {
          checkInDate: { $lt: checkOutDate },
          checkOutDate: { $gt: checkInDate }
        },
        // La nouvelle plage horaire commence pendant une réservation existante
        {
          checknDate: { $gte: checkInDate, $lt: checkOutDate }
        },
        // La nouvelle plage horaire se termine pendant une réservation existante
        {
          checkOutDate: { $gt: checkInDate, $lte: checkOutDate }
        }
      ]
    });
    console.log(reservations)
    
    return reservations.length === 0;
   
  } catch (error) {
    console.error("Erreur lors de la vérification de la disponibilité de la salle :", error);
    throw error;
  }
};

module.exports.reserver = asyncHandler(async (req, res) => {
  try {

    if (new Date(req.body.checkOutDate) <= new Date(req.body.checkInDate)) {
      return res.status(400).json({ message: "La date de check-out doit être ultérieure à la date de check-in" });
    }

    const salle = await Salle.findOne({ _id: req.body.salle._id });
    if (!salle) {
      return res.status(404).json({ message: "Salle not found" });
    }

    const disponible = await verifierDisponibiliteSalle(req.body.salle._id, req.body.checkInDate, req.body.checkOutDate);
    if (!disponible) {
      return res.status(400).json({ message: "La salle n'est pas disponible pour cette plage horaire" });
    } 

    const reservation = new Reservation({
      userId: req.body.user._id,
      salleId: req.body.salle._id,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate
    });



    await reservation.save();
    return res.json("Reservation successfully created");
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



module.exports.AllReservations = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;// ou tout autre moyen d'obtenir l'ID de l'utilisateur à partir de la requête
    console.log(req.user);

    // Rechercher les réservations
    const reservations = await Reservation.find({
      userId: userId
    });

    return res.json(reservations);
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations de l'utilisateur :", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports.deleteReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  
  if (!reservation) {
    return res.status(404).json({ message: "reservation not found" });
  } else { 


    try {
      await Reservation.findByIdAndDelete(req.params.id);
        return res.status(400).json({ message: "deleted" });


     } catch(error)
     {console.error("Erreur lors de l'annulation de la réservations :", error);
    return res.status(500).json({ message: "Internal server error" });}

     }

});









module.exports.UpdateReservation = asyncHandler(async (req, res) => {

  const checkInDate = new Date(req.body.checkInDate);
const checkOutDate = new Date(req.body.checkOutDate);


  const reservation = await Reservation.findById(req.params.id);
  
  if (!reservation) {
    return res.status(404).json({ message: "Reservation not found" });
  } else {

    if (checkInDate > checkOutDate) {
      // La date de début est postérieure à la date de fin
      res.status(400).json({ error: "La date de début ne peut pas être postérieure à la date de fin." });
  } else {
    Reservation.findByIdAndUpdate(
      req.params.id, // ID de la réservation à mettre à jour
      {
          $set: {
              salleId: req.body.salleId,
              checkInDate: req.body.checkInDate,
              checkOutDate: req.body.checkOutDate,
              creditCard: req.body.creditCard,
              securityCode: req.body.securityCode,
              Nom: req.body.Nom
        
            }
      },

      { new: true })
      .then(updatedReservation => {
          // Envoyer la réservation mise à jour en réponse
          res.status(200).json(updatedReservation);
      })
      .catch(err => {
          // Gérer l'erreur ici
          console.error(err);
          res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour de la réservation." });
      });
}
  } 

});




module.exports.Calendrier = asyncHandler(async (req, res) => { 

  Salle.find()
  .then(salles => {
    const promises = salles.map(salle =>
      Reservation.find({ salleId: salle._id })
        .exec()
        .then(reservations => {
          return { salle, reservations };
        })
    );

    return Promise.all(promises);
  })
  .then(sallesAvecReservations => {
    res.status(200).json(sallesAvecReservations);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des réservations des salles." });
  });



  })















