const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    salleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salle', required: true },
    checkInDate: Date,
	checkOutDate: Date,
    creditCard: String,
	securityCode: Number,
    Nom : String,

  });


  const Reservation = mongoose.model('Reservat', reservationSchema);

module.exports = Reservation;
