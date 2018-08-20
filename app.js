const express = require('express');
const app = express();
const morgan = require('morgan'); //behind scenes it will call next part in get/post function
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect("mongodb://iamkiko:" + process.env.MONGO_ATLAS_PW + "@cluster0-shard-00-00-oqsun.mongodb.net:27017,cluster0-shard-00-01-oqsun.mongodb.net:27017,cluster0-shard-00-02-oqsun.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",
{useNewUrlParser: true})

mongoose.Promise = global.Promise; // rids of depreciated error when starting server by using default node Promise implementation instead of mongoose


app.use(morgan('dev'));
app.use('/uploads', express.static('uploads')); //makes folder statically/publically available
app.use(bodyParser.urlencoded({extended: false})); //false to only support simple bodies for URLencoded data
app.use(bodyParser.json());

//append headers to not have CORS issues
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*'); //* gives access to any origin
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); //define which kind of headers we want to accept with the request
	if(req.method === 'OPTIONS') { //browser sends option request first before GET/POST etc.
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); //allow the http requests
		return res.status(200).json({});
	}
	next(); //put this so other routes can take over as we await requests
});

//set up middleware that funnels every request -> forwards to products.js
//Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => { //i want to handle every request that makes it past the middleware/routes above
    const error = new Error('Not found');
    error.status = 404;
    next(error); //forward the request
});

app.use((error, req, res, next) => {
   res.status(error.status || 500) ;
   res.json({
       error: {
           message: error.message
       }
   });
});

module.exports = app;