const mongoose = require('mongoose');



const flowerSchema = new mongoose.Schema({
    commonName: {
        type: String,
        required: true,
    },
    scientificName: {
        type: String,
        required: false,
    },
    dateFound: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: false,
    },
    fieldNotes: {
        type: String,
        required: false,
    },
    photo: {
        type: String,
        required: false,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    flowerBed: [flowerSchema]
});



const User = mongoose.model('User', userSchema);

module.exports = User;