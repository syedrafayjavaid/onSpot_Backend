const Product = require("../models/product");
const Event = require('../models/event');
const Category = require('../models/category')
const fetch = require('node-fetch');

exports.getProductsBySlug = (req, res) => {

    const {slug} = req.params

    Event.findOne({event: slug})
    .exec((err, eventType) =>{
        if(err) return res.status(400).json({message: err});
        if(eventType){

            Product.find({event: eventType._id})
            .exec((error, products) => {
                if (error) return res.status(400).json({ error });
                if(products){
                    return res.status(200).json({ products });
                }
            });

        }
    });
};

exports.getProductsByGenderAndEvent = (req, res) => {

    const {cat, event} = req.params

    Category.findOne({name: cat})
    .exec((error, category) =>{
        if(error) return res.status(400).json({error});
        if(category){
            Event.findOne({event: event})
            .exec((err, eventType) =>{
                if(err) return res.status(400).json({message: err});
                if(eventType){

                    Product.find({
                        event: eventType._id,
                        category: category._id
                    })
                    .exec((error, products) => {
                        if (error) return res.status(400).json({ error });
                        if(products){
                            return res.status(200).json({ products });
                        }
                    });
                }
            });
        }
    });
};

exports.searchProductByImage = (req, res)=>{

    console.log(`${process.env.API}/public/${req.file.filename}`)
    // res.status(200).json({file: req.file, body: req.body});

    const image = req.file.path;
    const imagePath = `${image}@`

    fetch("http://127.0.0.1:5000/", {method: 'POST', body:imagePath})
    .then(response => response.json())
    .then(data => {
        
        const matchedImagesList = data.images;
        console.log(matchedImagesList)

        titlesList =[];
        var i;
        for(i =0; i<matchedImagesList.length; i++){
            matchedImagesList[i] = matchedImagesList[i].split(".")[0];
            // console.log(titlesList[i])
        }
        console.log(matchedImagesList)

        Product.find({
            title: {"$in": matchedImagesList}
        })
        .exec((error, products) =>{
            if(error) return res.status(400).json({error});
            if(products){
                console.log(products);
                return res.status(200).json({suggestedProducts: products})
            }
        });
    });
};