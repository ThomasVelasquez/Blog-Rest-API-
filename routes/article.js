'use strict'

var express = require('express');
var articleController = require('../controllers/article');

var router = express.Router();

var multiParty = require('connect-multiparty');
var md_upload = multiParty({uploadDir: './upload/articles'});

/* Apis de Prueba */
router.post('/datos-curso', articleController.datosCurso);
router.get('/test-de-controlador', articleController.test);

/* Rutas Usables */
router.post('/save', articleController.save);
router.get('/articles/:last?' , articleController.getArticles);
router.get('/article/:id' , articleController.getArticle);
router.put('/update/:id', articleController.update);
router.delete('/delete/:id', articleController.delete);
router.post('/upload-image/:id', md_upload, articleController.upload);
router.get('/get-image/:image', articleController.getImage);
router.get('/search/:search',articleController.search);
module.exports = router;