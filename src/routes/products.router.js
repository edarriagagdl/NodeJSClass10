import express from 'express';
const router = express.Router();
import { productManager } from '../ProductManager.js';

productManager.loadProductsFromFile('./src/models/products.json').then(() => {
  if (!productManager.isFileLoaded())
    console.log('The products file could not be loaded, please try later');
});

/**
 * returns the list of products:
 * http GET call:
 *  localhost:8080/api/Products
 *  localhost:8080/api/Products?limit=2  to limit 2 products
 */
router.get('/', (req, res) => {
  if (!productManager.isFileLoaded())
    return res.status(500).send({
      error: 'The products file could not be loaded, please try later',
    });
  let limit = req.query.limit;
  console.log('Limit is ' + limit);
  if (limit) {
    if (!isNaN(limit)) {
      let productLimited = productManager.getProducts().slice(0, limit);
      return res.send(productLimited);
    } else {
      return res.status(400).send({
        error: 'The limit is not a numeric value',
      });
    }
  } else {
    if (productManager.getProducts().length > 0)
      return res.send(productManager.getProducts());
    else
      return res.status(500).send({
        error: 'The products catalog is empty',
      });
  }
});

/**
 * return the details of a specific product
 * http GET call:
 *   localhost:8080/api/Products/1
 */
router.get('/:idProduct', (req, res) => {
  if (!productManager.isFileLoaded())
    return res.status(500).send({
      error: 'The products file could not be loaded, please try later',
    });
  let idProduct = req.params.idProduct;
  if (idProduct && !isNaN(idProduct)) {
    let product = productManager.getProductById(idProduct);
    if (product !== undefined) {
      return res.send(product);
    }
    return res.status(404).send({
      error:
        'The product with id ' +
        idProduct +
        ' is not found in the products catalog',
    });
  } else {
    return res.status(404).send({
      error:
        'The product with id ' +
        idProduct +
        ' is invalid or not a numeric value',
    });
  }
});

/**
 * Add a new product
 * http POST call:
 *    localhost:8080/api/Products
 *    body:
 *       {
        "code": 1212,
        "title": "product 1212",
        "description": "Monitor",
        "price": 120,
        "stock": 3,
        "category" : "hardware",
        "thumbnails": [
            "monitor1.jpg",
            "monitor2.jpg"
        ] 
    }
 *
 */
router.post('/', (req, res) => {
  try {
    let io = req.app.get('socketio');
    console.log('io:' + io);
    let product = req.body;
    product = productManager.addProduct(product);
    io.emit('server:productadded', product);
    productManager.persistProductsToFile();
    res.status(201).send({
      status: 201,
      message: 'The product with id: ' + product.id + ' was added sucessfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 500,
      error: '' + err,
    });
  }
});

/**
 *
 * Update a new product
 * http PUT call:
 *    localhost:8080/api/Products/1
 *    body:
 *    {
      "price": 150
      }
 *
 */
router.put('/:idProduct', (req, res) => {
  if (!productManager.isFileLoaded())
    return res.status(500).send({
      error: 'The products file could not be loaded, please try later',
    });
  let idProduct = req.params.idProduct;
  // Validate the id
  if (idProduct && !isNaN(idProduct)) {
    let product = productManager.getProductById(idProduct);
    if (product !== undefined) {
      try {
        let productUpd = req.body;
        let mergedProduct = Object.assign({}, product, productUpd);
        productManager.updateProduct(mergedProduct);
        productManager.persistProductsToFile();
        res.status(201).send({
          status: 201,
          message:
            'The product with id: ' +
            mergedProduct.id +
            ' was updated sucessfully',
        });
      } catch (err) {
        console.log(err);
        res.status(500).send({
          status: 500,
          error: 'There was a problem updating the product: ' + err,
        });
      }
    } else {
      return res.status(404).send({
        error:
          'The product with id ' +
          idProduct +
          ' is not found in the products catalog',
      });
    }
  } else {
    return res.status(404).send({
      error:
        'The product with id ' +
        idProduct +
        ' is invalid or not a numeric value',
    });
  }
});

/**
 * Delete a product
 * http DELETE call
 *  localhost:8080/api/Products/2
 */
router.delete('/:idProduct', (req, res) => {
  let io = req.app.get('socketio');
  // Load the file with the products if it has not been loaded
  if (!productManager.isFileLoaded())
    return res.status(500).send({
      error: 'The products file could not be loaded, please try later',
    });
  let idProduct = req.params.idProduct;
  // Validate the id
  if (idProduct && !isNaN(idProduct)) {
    let product = productManager.getProductById(idProduct);
    if (product !== undefined) {
      try {
        productManager.deleteProductById(idProduct);
        io.emit('server:productdeleted', idProduct);
        productManager.persistProductsToFile();
        res.status(201).send({
          status: 201,
          message:
            'The product with id: ' + idProduct + ' was deleted sucessfully',
        });
      } catch (err) {
        console.log(err);
        res.status(500).send({
          status: 500,
          error: 'There was a problem deleting the product: ' + err,
        });
      }
    } else {
      return res.status(404).send({
        status: 404,
        error:
          'The product with id ' +
          idProduct +
          ' is not found in the products catalog',
      });
    }
  } else {
    return res.status(404).send({
      status: 404,
      error: 'The id ' + idProduct + ' is invalid or not a numeric value',
    });
  }
});

export default router;
