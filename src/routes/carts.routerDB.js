import express from 'express';
import { cartsDAO } from '../daos/carts.dao..js';
const router = express.Router();

/**
 * Get the details of a specific shopping cart
 * http GET call:
 * localhost:8080/api/carts/1
 *
 */
router.get('/:cid', (req, res) => {
  let cid = req.params.cid;
  if (cid && isNaN(cid)) {
    cartsDAO.getById(cid).then((cart) => {
      if (cart != undefined && cart !== null) {
        console.log(cart);
        return res.send(cart);
      } else {
        return res.status(404).send({
          error:
            'The cart with id ' +
            cid +
            ' is not found in the shopping cart catalog',
        });
      }
    });
  } else {
    return res.status(404).send({
      error: 'The cart id ' + cid + ' is invalid or not a numeric value',
    });
  }
});

/**
 * Add a new shopping cart
 *  
 * http POST call:
 *  localhost:8080/api/carts/
 * body:
    {
    "products":[
      {"id":10, "quantity": 1}
    ]
    }
 * 
 */
router.post('/', (req, res) => {
  try {
    let products = req.body;
    console.log('products', products);
    cartsDAO.add(products).then((cart) => {
      res.status(201).send({
        status: 201,
        message: 'The cart with id: ' + cart.id + ' was added sucessfully',
        cart,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 500,
      error: '' + err,
    });
  }
});

// Post to add/update a product in an existing shopping cart
/**
 *  Add or update a product in an existing shopping cart
 *  if the product exists the quantity will be increased by 1
 *  otherwise the product will be added to cart.
 *
 *  HTTP POST request:
 *     localhost:8080/api/carts/1/product/1
 *
 *
 */
router.post('/:cid/product/:pid', (req, res) => {
  try {
    let cid = req.params.cid;
    let pid = req.params.pid;
    if (cid && !isNaN(cid)) {
      let cart = cartManager.updateProductQty(cid, pid);
      cartManager.persistCartsToFile();
      res.send(cart);
    } else {
      return res.status(404).send({
        error: 'The id ' + cid + ' is invalid or not a numeric value',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 500,
      error: '' + err,
    });
  }
});

export default router;
