const mongoose = require('mongoose');

const salleSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  capacite: {
    type: Number,
    required: true
  },
  equipements: {
    type: [String] // Tableau de chaînes pour les équipements
  },
  adresse: {
    type: String
  },
  description: {
    type: String
  },
  disponible: {
    type: Boolean,
    default: true // Par défaut, la salle est disponible
  },
  image: {
    type: Object,
    default: {
      url: "",
      publicId: null,
    },
  },
});

const Salle = mongoose.model('Salle', salleSchema);


// salleSchema.methods.reserverSalle = function (callback){
//   this.save(callback);
// }





module.exports = Salle;