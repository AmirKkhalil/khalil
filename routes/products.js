const express = require('express');
const router = express.Router();

const Product = require('../models/Product');

router.get('/', (req, res, next) => {
    Product.find().select('_id name price qte')
        .then(results => {
            if (results) {
                res.status(200).json(
                    results.map(prod => {
                        return {
                            name: prod.name,
                            price: prod.price,
                            qte: prod.qte,
                            _id: prod._id,
                            url: {
                                type: 'GET',
                                urls: 'http://127.0.0.1:3000/products/' + prod._id
                            }
                        }
                    })
                );
            } else {
                res.status(200).json({
                    message: 'no product found'
                });
            }
        })
        .catch(error => {
            res.status(404).json({
                error: error
            });
        })

});

router.get('/:id', (req, res, next) => {
    Product.findOne({ _id: req.params.id }).select('_id name price')
        .then(result => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(200).json({
                    message: 'product not found'
                });
            }
        })
        .catch(error => {
            res.status(404).json({
                error: error
            });
        })

});

router.post('/addproduct', (req, res, next) => {
    // create new object
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        qte: req.body.qte
    });
    // enregistrer dans DB
    product.save()
        .then(result => {
            res.status(201).json({
                message: 'product added success !'
            });
            console.log(result); // consol log product 
        })
        .catch(error => {
            res.status(404).json({
                error: error
            })
        });
});

router.patch('/:id', (req, res, next) => {
    //create new product :
    /*const prod = new Product({
        _id: req.params.id,
        name: req.body.name,
        price: req.body.price
    });*/
    Product.findOneAndUpdate({ _id: req.params.id }, {
            // les parametre a modifier ( psq on utilise patch )
            name: req.body.name,
            price: req.body.price
        })
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: 'update product success'
                });
            } else {
                res.status(404).json({
                    message: 'product not found !'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });

        });
});

router.delete('/:id', (req, res, next) => {
    Product.findOneAndDelete({ _id: req.params.id })
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: 'delete product success'
                });
            } else {
                res.status(404).json({
                    message: 'product not found !'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

module.exports = router;