const express = require('express');
const router = express.Router();
const Product = require('../model/Product');
const ProductLines = require('../model/ProductLines');


/* GET shop page. */
router.get('/', (req, res, next) => {
    res.redirect('/shop/tshirt/1');
});

router.get('/product/:id', (req, res, next) => {
    Product.findById(req.params.id)
        .then(product => {
            res.render('page/productDetails', { product });
        })
});

router.get('/:productline', (req, res, next) => {
    const productline = req.params.productline;
    res.redirect(`/shop/${productline}/1`);
});

router.get('/:productline/:page', (req, res, next) => {
    const perPage = 24;
    const page = req.params.page || 1;
    const productline = req.params.productline;

    ProductLines.find({ name: productline })
        .then(productLine => {
            Product.find({ productLines: productLine[0]._id })
                .limit(perPage)
                .skip((perPage * page) - perPage)
                .then(products => {
                    res.render('page/shop', {
                        products,
                        current: page,
                        pages: Math.ceil(products.length / perPage),
                        productlines: productLine[0].name
                    })
                })
        })
        .catch(err => {
            return next(err);
        });
});

module.exports = router;
