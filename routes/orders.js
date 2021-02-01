const express = require('express');
const router = express.Router();
const Order = require('../models/Order');


router.get('/', (req, res, next) => {
    Order.find().populate('user', 'username') // populate('collection','champ a afficher')  :pour afficher l'user 
        .then(resuls => {
            if (resuls) {
                res.status(200).json(resuls)
            } else {
                res.status(404).json({
                    message: 'order not found !'
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
});

router.get('/:orderId', (req, res, next) => {
    Order.findById({ _id: req.params.orderId })
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.post('/addorder', function(req, res) {
    const newOrder = new Order({
        user: req.body.user,
        products: req.body.products
    });
    newOrder.save()
        .then(result => {
            res.status(201).json({
                message: 'created order success'
            })
        }).catch(error => {
            res.status(500).json({
                error: error
            })
        });
});

router.patch('/updatorder/:orderId', function(req, res) {
    let newProducts = req.body.products;
    Order.findOne({ _id: req.params.orderId })
        .then(doc => {
            let oldProducts = doc.products;
            for (var indexOfNewProduct = 0; indexOfNewProduct < newProducts.length; indexOfNewProduct++) {
                for (var indexOfOldProduct = 0; indexOfOldProduct < oldProducts.length; indexOfOldProduct++) {
                    if (newProducts[indexOfNewProduct]._id === oldProducts[indexOfOldProduct]._id) {
                        // addition des qte 
                        oldProducts[indexOfOldProduct].qte += newProducts[indexOfNewProduct].qte;
                        // suppression du prod de l liste des newProducts
                        newProducts.splice(indexOfNewProduct, 1);
                    }
                }
            }
            // si le tableau est encore plein
            if (newProducts.length > 0) {
                //ajouter les produits restants dans la liste des newpord  a la liste des oldProd
                for (const newProduct of newProducts) {
                    oldProducts.push(newProduct);
                }
            }
            // requet de modification :
            Order.update({ _id: req.params.orderId }, { products: oldProducts })
                .then(results => {
                    res.status(200).json({
                        message: 'update success ',
                        results: results
                    })
                })
                .catch(error => {
                    res.status(500).json({
                        error: error
                    })
                });

        })
        .catch(error => {
            res.status(500).json({
                error1: error
            })
        });
});

router.delete('/deletorder/:orderId', function(req, res) {
    const id = req.params.orderId;
    Order.findOneAndDelete({ _id: id })
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: 'order delete succuss !'
                })
            } else {
                res.status(404).json({
                    message: 'order  not found !'
                })
            }
        })
        .catch(error => {
            res.status.json({
                error: error
            })
        });
});

module.exports = router;