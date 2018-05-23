const express = require('express');
const router = express.Router();
const Product = require('../model/Product');
const ProductLines = require('../model/ProductLines');
	
const app = express();

router.get('/', (req, res, next) => {

    res.redirect('/shop');    
});

router.get('/:keyword', (req, res, next) => {
	const keyword = req.params.keyword
    res.redirect(`/search/all/${keyword}`);
});

router.get('/:productline/:keyword', async (req, res, next) => {
	const productline = req.params.productline
	const keyword = req.params.keyword
	var product_lines

	if (productline == 'all') {
		product_lines = await ProductLines.find().exec()
	}
	else {
		product_lines = await ProductLines.find({name : productline}).exec()
	}

	var products
	for (var line in product_lines) {
		products = await Product.find({ productLines : product_lines[line], name : {$regex:keyword}}).exec()

		for (var i in products) {
			console.log(products[i])
		}
	}
	
	/*
	if (productline == 'all') {
		product_line = ProductLines.find()
	}
	else {
		product_line = ProductLines.find({name : productline})
	}

	product_line.then(proLines => {
		for (var line in proLines)	 {
			console.log(proLines[line]);

			Product.find({ productLines: proLines[line]._id, name : {$regex:keyword}})
        	.then(products => {
        		for (var i in products) {
        			console.log(products[i]);
        		}
        	})
		}
	})
	.catch(err => {
        return next(err);
    });
    */
});

module.exports = router;