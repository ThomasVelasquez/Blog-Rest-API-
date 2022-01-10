'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Article = require('../models/article');
/* Siempre Utilizar Las Variables Acorde  models */


var controller = {

    datosCurso: (req , res) =>{
        
        /* var hola = req.body.hola; */

        return res.status(200).send({
            proyecto: 'Master en Frameworks',
            autor: 'Thomas Velasquez',
            url: 'ThomasVWeb',
            /* hola */
        });
    },

    test: (req , res) => {
        return res.status(200).send({
            message: 'Soy la Opcion Test De Mi Controlador De Articulos'
        });
    
    },

    save: (req , res) => {
    /* Recoger Parametros por Post */
        var params = req.body;
        
    /* Validamos con Validator */
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan Datos Por enviar'
            });
        }

        if (validate_title && validate_content) {
            /* Crear El Objeto a Guardar */
            var article = new Article();

            /* Asignar Valores */
            article.title = params.title
            article.content = params.content
            article.image = null
            /* Guardar Articulos */
            article.save((err , articleStored) =>{
               
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'Error',
                        message: 'El Articulo No Se Ha Guardado'
                    })
                }

                /* Devolver Una Respuesta */
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });

            });
            
        }else{
                return res.status(200).send({
                    status: 'error',
                    message: 'Los Datos No Son Validos'
                });
            };
    },

    getArticles: (req , res) =>{

        var query = Article.find({});
    
        var last = req.params.last;
         if (last || last != undefined) {
            query.limit(5)
        } 

        /* Find */
        query.sort('-_id').exec((err, articles)=>{
            
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articles '
                })
            }

            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error No Hay articulos Para Mostrar'
                })
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        })
    },

    getArticle: (req, res) =>{
        
        /* Recoger el ID */
        var articleId = req.params.id;

        /* Comprobar que Existe */
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'Error',
                message: 'Articulo No Encontrado'
            })
        }
        /* Buscar el articulo */
        Article.findById(articleId, (err , article) =>{
            if (err || !article) {
                return res.status(404).send({
                    status: ' Error',
                    message: 'El Articulo No Existe'
                })
            };

                /* Devolver En JSON */
                return res.status(200).send({
                status: 'success',
                article
            }); 
        });
        
    },

    update: (req, res) =>{
        /*Recoger La ID por La URL*/
        var articleId = req.params.id;
        /* Recoger Los Datos */
        var params = req.body;
        /* Validar datos */
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(404).send({
                status:'Error',
                message:'Articulo No Encontrado'
            })
        };

        if (validate_title && validate_content) {
            /* Hacer Find and Update */
            Article.findOneAndUpdate({_id: articleId}, params , {new:true}, (err , articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'Error',
                        message: 'Error Al Actualizar'
                    });
                };

                if (!articleUpdated) {
                    return res.status(404).send({
                        status:'error',
                        message:'El Articulo No Existe'
                    })
                };

                if (articleUpdated) {
                    return res.status(200).send({
                        status: 'success',
                        message:'Articulo Actualizado',
                        article: articleUpdated
                    })
                }
            });
        
        }else{
            return res.status(500).send({
                status: 'error',
                message: 'La Validacion No es Correcta'
            })
        }

      
      
        /*   return res.status(200).send({
            status: 'Succes',
            message: 'Articulo Actualizado'
        }) */
    },

    delete: (req , res) =>{
        /* Recoger el ID de la URL */
        var articleId = req.params.id;
        
        /* Find and Delete */
        Article.findByIdAndDelete({_id: articleId}, (err , articleRemoved)=>{

            if (err || !articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Mensaje No Removido o No Existe'
                }); 
            };

            return res.status(200).send({
                status: 'deleted',
                message: 'Articulo Borrado',
                articleRemoved
            });
        });

        /* return res.status(200).send({
            status:'Borrado',
            message:'Se Ha Borrado El Articulo'
        }); */
    },

    upload: (req , res) =>{
        /* Configurar el Connect MultiParty Router/articles.js */

        /* Recoger el Fichero */
        var file_name = 'Imagen No Subida..'

        if (!req.files) {
            return res.status(404).send({
                status:'error',
                message: file_name 
            });
        }

        /* Conseguir Nombre Y extension */
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        /* Nombre Del Archivo */
        var file_name = file_split[2];

        /* Extension Del Fichero */
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];


        /* Comprobar La Extension,Solo Imagenes Si Es Valida Borrar El Fichero */
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif' ) {
                /* Borramos El Archivo */
                
                fs.unlink(file_path, () =>{
                    return res.status(200).send({
                        status:'Error',
                        message:'La extension del Formato No es valida'
                    });
                });
        }else{
            /* Si Todo Es Valido sacando el ID de la URL */
            var articleId = req.params.id;
            if(articleId){
            /* Buscar El Articulo asignarle el nombre da la imagen y actualizarlo */
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true} , (err,articleUpdated)=>{

                if (err || !articleUpdated) {
                    return res.status(500).send({
                        status:'Error',
                        message:'Error al guardar la Imagen del articulo '
                    });
                };

                return res.status(200).send({
                    status: 'success',
                    articles: articleUpdated
                });     
            });
            }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
            }
        };

    }, /* Final del Upload */
    
    getImage: (req, res) => {
        var file = req.params.image; /* Siempre Utilizar Las Variables Acorde  models */
        var path_file = './upload/articles/' + file;

        if (path_file) {
            return res.sendFile(path.resolve(path_file));
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'La imagen no existe !!!'
            });
            }
      },

    search: (req,res)=>{
        /* Sacar el String A Buscar */
        var searchString = req.params.search;
        /* Find or */
        Article.find({ "$or":[
            {'title': {'$regex': searchString, '$options':'i'}},
            {'content': {'$regex': searchString, '$options':'i'}}
        ]})
        .sort([['date', 'descending']])
        .exec((err , articles) =>{

            if (err) {
                return res.status(500).send({
                    status:'Error',
                    message:'Error en la peticion'
                });
            }else if(!articles || articles.length <= 0){
                return res.status(500).send({
                    status:'Error',
                    message:'No hay Articulos Para Mostrar'
                });
            }else{
                return res.status(200).send({
                    status:'success',
                    articles
                })
            }



        })
    }
       

};/* Esta es el final de la funcion Controller */
module.exports = controller;