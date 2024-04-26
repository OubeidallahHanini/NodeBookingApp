const mongoose = require("mongoose") ;
const Joi = require("joi");

const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema ({
    username : {
        type:String ,
        required : true ,
        trim:true ,
        minlength : 2 ,
        maxlenght : 100 ,
        unique:true , 
    },

    email : {
        type:String ,
        required : true ,
        trim:true ,
        minlength : 5 ,
        maxlenght : 100 ,
        unique:true , 
    },

    password : {
        type:String ,
        required : true ,
        trim:true ,
        minlength : 8 ,
         
    },
    profilephoto : {
        type:Object ,
        default : {
            url:"https://media.istockphoto.com/id/1433039224/fr/photo/ic%C3%B4ne-3d-de-lutilisateur-bleu-concept-de-profil-de-personne-isol%C3%A9-sur-fond-blanc-avec.webp?b=1&s=612x612&w=0&k=20&c=n1QA3bGtBS6T03r1BpaaAkYhpvzYckpgmYVzhTcgFoo=" ,
            publicId:null,
        }
    },

    adresse : {
        type:String ,
        required : false,
        trim:true ,
        minlength : 2 ,
        maxlenght : 100 ,
    },

    numtel : {
        type:String ,
        required : false ,
        trim:true ,
       length:8 ,
        unique:true , 
    },

    isAdmin : {
        type:Boolean,
        default:false,
    },

    

    

   
}, {
    timestamps:true ,
   
});

function validateRegisterUser(obj) {
    const schema = Joi.object({
        username: Joi.string().trim().min(2).max(100).required(),
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().min(8).required(),
        numtel: Joi.string().trim().max(8), // Add phone number validation
        adresse: Joi.string().trim().min(2).max(100),
    });
    return schema.validate(obj);
}

function validateLoginUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().min(8).required(),
    });
    return schema.validate(obj);
}

// Generate Auth Token
UserSchema.methods.generateAuthToken = function() {
    return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET);
}

const User= mongoose.model("User",UserSchema) ;
module.exports= { User,
    validateRegisterUser,
    validateLoginUser,
    
}