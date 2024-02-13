import express from 'express';
const router = express.Router();
import { productsDAO } from '../daos/products.dao.js';

/**
 * returns the list of products:
 * http GET call:
 *  localhost:8080/api/Products
 *  localhost:8080/api/Products?limit=2  to limit 2 products
 */
router.get('/', (req, res) => {
  let limit = req.query.limit;
  console.log('Limit is ' + limit);
  productsDAO.getALL().then((products) => {
    if (products.length == 0) {
      return res.status(500).send({
        error: 'The products catalog is empty',
      });
    } else {
      if (limit) {
        if (!isNaN(limit)) {
          const productLimited = products.slice(0, limit);
          return res.send(productLimited);
        } else {
          return res.status(400).send({
            error: 'The limit is not a numeric value',
          });
        }
      } else {
        return res.send(products);
      }
    }
  });
});

/**
 * return the details of a specific product
 * http GET call:
 *   localhost:8080/api/Products/1
 */
router.get('/:idProduct', (req, res) => {
  let idProduct = req.params.idProduct;
  if (idProduct && isNaN(idProduct)) {
    productsDAO.getById(idProduct).then((product) => {
      if (product !== undefined && product !== null) {
        console.log(product);
        return res.send(product);
      }
      return res.status(404).send({
        error:
          'The product with id ' +
          idProduct +
          ' is not found in the products catalog',
      });
    });
  } else {
    return res.status(404).send({
      error:
        'The product with id ' +
        idProduct +
        ' is invalid or not a string value',
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
        ],
        "status" : true
    }
 *
 */
router.post('/', (req, res) => {
  try {
    const io = req.app.get('socketio');
    const product = req.body;
    console.log('product', product);
    productsDAO
      .add(
        product.code,
        product.title,
        product.description,
        product.price,
        product.stock,
        product.category,
        product.thumbnails,
        product.status
      )
      .then((product) => {
        res.status(201).send({
          status: 201,
          message:
            'The product with id: ' + product._id + ' was added sucessfully',
        });
        io.emit('server:productadded', product);
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
 *    localhost:8080/api/Products/65c9923173c2e6a9bc1cb968
 *    body:
 *    {
      "price": 150
      }
 *
 */
router.put('/:idProduct', (req, res) => {
  let io = req.app.get('socketio');
  let idProduct = req.params.idProduct;
  // Validate the id
  if (idProduct && isNaN(idProduct)) {
    productsDAO.exists(idProduct).then((product) => {
      if (product) {
        let productUpd = req.body;
        productsDAO.update(idProduct, productUpd).then((product) => {
          io.emit('server:productupdated', product);
          res.status(201).send({
            status: 201,
            message:
              'The product with id: ' + product.id + ' was updated sucessfully',
          });
        });
      } else {
        return res.status(404).send({
          error:
            'The product with id ' +
            idProduct +
            ' is not found in the products catalog',
        });
      }
    });
  } else {
    return res.status(404).send({
      error:
        'The product with id ' + idProduct + ' is invalid or a numeric value',
    });
  }
});

/**
 * Delete a product
 * http DELETE call
 *  localhost:8080/api/Products/65c9923173c2e6a9bc1cb968
 */
router.delete('/:idProduct', (req, res) => {
  const io = req.app.get('socketio');
  const idProduct = req.params.idProduct;
  // Validate the id
  if (idProduct && isNaN(idProduct)) {
    productsDAO.exists(idProduct).then((product) => {
      if (product) {
        let productUpd = req.body;
        productsDAO.remove(idProduct).then((product) => {
          io.emit('server:productdeleted', idProduct);
          res.status(201).send({
            status: 201,
            message:
              'The product with id: ' + idProduct + ' was deleted sucessfully',
          });
        });
      } else {
        return res.status(404).send({
          error:
            'The product with id ' +
            idProduct +
            ' is not found in the products catalog',
        });
      }
    });
  } else {
    return res.status(404).send({
      error:
        'The product with id ' + idProduct + ' is invalid or a numeric value',
    });
  }
});

export default router;
