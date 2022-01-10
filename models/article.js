'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = Schema({
    title: String,
    content: String,
    date:{ type: Date, default: Date.now},
    image:String
});

module.exports = mongoose.model('article',ArticleSchema);
/*Con Mongoose model Guardamos Estructuras de Los Documentos en la coleccion*/