const mongoose = require('mongoose');
const createMovie = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
   
    genre:{
        type: String,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    release_date:{
        type: Date,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    director:{
        type: String,
        required: true
    },
    cast:{
        type: [String],
        required: true
    },
    poster:{
        type: String,
        required: true
    },
    trailer:{
        type: String,
        required: true
    },
    subtitles :{
        type: String,
        required: true
    },
    voice_actors:{
        type: [String],
        required: true
    },
    country:{
        type: String,
        required: true
    },
    limit:{
        type: Number,
        required: true
    },
});
const movies = mongoose.model('movies', createMovie);
module.exports = movies;

