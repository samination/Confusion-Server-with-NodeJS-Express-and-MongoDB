const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/').options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser,(req,res,next) => {

    var id_user=req.user.id
    Favorites.find({user:id_user})
    .populate('user').populate('dishes')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    var id_user=req.user.id
    Favorites.findOne({user:id_user}).populate('user').populate('dishes')
    .then((favourite) => {

 //Create a favourite list if the use doesn't have one       
if (favourite == null){
    Favorites.create({user:id_user})
    .then((favorite) => {
        console.log('Favorites Created', favorite.toObject());
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));

}



       if(favourite!=null) {

        
           
            for (var i=0; i<req.body.length;i++){
               //Check if a dish already exists in dishes
                var isInArray = favourite.dishes.some(function (favourite) {
                    return favourite.equals(req.body[i]._id);
                });
         
            if(isInArray===false){
            favourite.dishes.push(req.body[i]);
            }

        
        
        }


            favourite.save()
            .then((favourite) => {
                Favorites.findOne({user:id_user})
                .populate('user').populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })            
            }, (err) => next(err));
        }
        /*else {
            err = new Error("Dishes  not found");
            err.status = 404;
            return next(err);
        }*/
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {

    var id_user=req.user.id;
    
    Favorites.findOne({user:id_user}).populate('user').populate('dishes')
    .then((favourite) => {

        
        if (favourite != null) {

            for (var i =0;i<favourite.dishes.length;i++) {
                favourite.dishes.shift();
            }
            favourite.save()
            .then((favourite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Favorites  not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
    
});

favoriteRouter.route('/:dishId').options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    var id_user=req.user.id
    Favorites.findOne({user:id_user}).populate('user').populate('dishes')
    .then((favourite) => {

 //Create a favourite list if the use doesn't have one       
if (favourite == null){
    Favorites.create({user:id_user})
    .then((favorite) => {
        console.log('Favorites Created', favorite.toObject());
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));

}



       if(favourite!=null) {

        
           
           
               //Check if a dish already exists in dishes
                var isInArray = favourite.dishes.some(function (favourite) {
                    return favourite.equals(req.params.dishId);
                });
         
            if(isInArray===false){
            favourite.dishes.push(req.params.dishId);
            }

        
        
        


            favourite.save()
            .then((favourite) => {
                Favorites.findOne({user:id_user})
                .populate('user').populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })            
            }, (err) => next(err));
        }
        /*else {
            err = new Error("Dishes  not found");
            err.status = 404;
            return next(err);
        }*/
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {

    var id_user=req.user.id;
    
    Favorites.findOne({user:id_user}).populate('user').populate('dishes')
    .then((favourite) => {

        
        if (favourite != null) {

            
                favourite.dishes.pull(req.params.dishId);
            
            favourite.save()
            .then((favourite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Favorites  not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
    
});

module.exports = favoriteRouter;