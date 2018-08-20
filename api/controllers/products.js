const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

exports.products_get_all =  (req, res, next) => {
    Product.find() //no arg finds all elements
    .select('name price _id productImage') //choose which fields you want to select/include
    .exec()
    .then(docs => { //return all products
        const response = {
          count: docs.length, //info/metadata on amount of elements fetched
          products: docs.map(doc => {
              return {
                  name: doc.name,
                  price: doc.price,
                  productImage: doc.productImage,
                  _id: doc._id,
                  request: {   ///meta data to pass into request and what to do to bring it back etc.
                      type: 'GET',
                      url: 'https://personal-iamkiko.c9users.io/products/' + doc._id
                  }
              };
          })
        };
        // if(docs.length >= 0){
            res.status(200).json(response);
        // } else {
        //     res.status(404).json({
        //         message: "NO ENTRIES FOUND"
        //     });      
        // }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.products_create_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path //get path from multer
    });
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
                type: 'GET',
                url: 'https://personal-iamkiko.c9users.io/products/' + result._id
            }
        }
    });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId; //extract by name in first arg above
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc){ //async so this block allows sync execution
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: 'https://personal-iamkiko.c9users.io/products/'
                }
            });
        } else {
         res.status(404).json({message: "No valid entry found for provided ID"});   
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps})  //2nd arg describes how we want to update this, describes key value pairs and how to update; $set is a mongoose method
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'https://personal-iamkiko.c9users.io/products/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})   //pass in filter criteria
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Product deleted',
          request: {
              type: 'POST',
              url: 'https://personal-iamkiko.c9users.io/products',
              body: { name: 'String', price: 'Number' }
          }
      });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
}