'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

/* Esta Linea de Codigo hay que verificarla */
/*  mongoose.set('useFindAndModify' , false);*/

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', {useNewUrlParser: true , useUnifiedTopology: true})
    .then(()=>{
        console.log('Conexion A la Base de Datos, Correcta!!');

        /* Creando Servidor Para Escuchar Http */
        app.listen(port,()=>{
            console.log('Servidor Corriendo en http://localHost:' +port);
        });

});
