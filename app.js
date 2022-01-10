/* Uso Estricto de JavaScript */
'use strict'

/* Ejecutamos Modulos de Node para crear servidor */
    var express = require('express');

/* Ejecutar Express para Http */
    var app = express();
    
/* Cargar Rutas y ficheros */
var article_routes = require('./routes/article');  

/* Middlewares */
app.use(express.urlencoded({extended: false}));
app.use(express.json());


/* CORS */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});




/* Añadir Prefijos a Rutas // Cargar Rutas */
app.use('/api' , article_routes);

/* Exportar Modulo {Fichero Actual} */
module.exports = app;