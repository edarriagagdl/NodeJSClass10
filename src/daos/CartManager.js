import * as fs from 'fs';
import { productManager } from './product.manager.js';

class CartManager {
  /** array that holds all the carts */
  #carts = [];
  // id for the carts
  #id = 0;
  // this is the default path to the products file.
  #path = './src/models/shoppingCart.json';
  constructor(pathToCarts) {
    this.#path = pathToCarts;
  }

  /**
   * This method will return the array that contain the carts
   * @returns the array conatining the carts
   */
  getCarts() {
    return this.#carts;
  }

  /**
   *  This method will add the cart object passed as parameter into the array of carts if the products of the carts are valid.
   * @param {*} cart
   * @returns
   */
  createNewCart(cart) {
    this.#id = this.#id + 1;
    cart.id = this.#id;
    if (cart.products == undefined) cart.products = [];
    this.#carts.push(cart);
    console.log('The cart with id ' + cart.id + ' was created scuessfully');
    console.log('Content of the cart:' + JSON.stringify(this.#carts));
    return cart;
  }

  // returns a cart that matches an id, otherwise will return "Not found"
  /**
   * This method will return a cart object from the array that matches an id, otherwise will return undefined
   * @param {*} id
   * @returns
   */
  getCartById(id) {
    const isIdFound = (element) => element.id == id;
    let cart = this.#carts.find(isIdFound);
    // if id is not found, an undefined is returned
    if (cart != undefined) {
      let cartWithDetails = [];
      cart.products.forEach((element) => {
        let productWithDetails = JSON.parse(JSON.stringify(element));
        const productDetails = productManager.getProductById(element.id);
        productWithDetails.productDetails = productDetails;
        console.log('Product' + productWithDetails.id);
        cartWithDetails.push(productWithDetails);
      });
      return cartWithDetails;
    }
    return cart;
  }

  /**
   *  This methid will update a cart with the values contained in the cart parameter
   * @param {*} cart
   */
  updateCart(cart) {
    try {
      const isIdFound = (element) => element.id == cart.id;
      const cartIndex = this.#carts.findIndex(isIdFound);
      this.#carts[cartIndex] = cart;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * This method will update an existing cart to
   * add 1 to the existing quantity of a product that is already in the cart or
   * add a new product to the cart, with a quantity of 1
   */
  updateProductQty(cid, pid) {
    const isIdFound = (element) => element.id == cid;
    let cart = this.#carts.find(isIdFound);
    if (cart != undefined) {
      console.log('The cart ' + cart.id + ' was found and will be updated');
      const products = cart.products;
      const isIdFound = (element) => element.id == pid;
      const productIndex = cart.products.findIndex(isIdFound);
      if (productIndex >= 0) {
        const product = products[productIndex];
        console.log(
          'Product ' + product.id + ' was found and will be updated in the cart'
        );
        product.quantity += 1;
        products[productIndex] = product;
      } else {
        console.log(
          'Product ' + pid + ' was not found and will be added to the cart'
        );
        let product = {
          id: pid,
          quantity: 1,
        };
        products.push(product);
      }
      cart.products = products;
      this.updateCart(cart);
    } else {
      throw new Error('The cart with id ' + cid + ' does not exist');
    }
    return cart;
  }
  /**
   * This methid will load carts contained in a file into an array
   * @param {*} pathToCarts
   */
  async loadCartsFromFile(pathToCarts) {
    try {
      if (fs.existsSync(pathToCarts)) {
        console.log(
          'The json file ' + pathToCarts + ' exists and will be loaded'
        );
        const data = await fs.promises.readFile(pathToCarts, 'utf-8');
        if (data) {
          const obj = JSON.parse(data); //now it an object
          if (obj) {
            this.#carts = obj.carts;
            this.#id = obj.id;
          }
        }
        console.log('The file with the carts was read ');
      } else {
        console.error(
          'Warn: The file ' +
            pathToCarts +
            ' does not exists or it is not readable'
        );
      }
    } catch (err) {
      console.error(
        'Error: There was an error loading the file ' + pathToCarts
      );
      console.error(err);
    }
  }

  /**
   * This method will persist the array containing the carts to the file ShoppingCarts.json
   */
  persistCartsToFile() {
    try {
      const obj = {
        id: this.#id,
        carts: this.#carts,
      };
      const json = JSON.stringify(obj);
      fs.writeFile(this.#path, json, (err) => {
        if (err) {
          console.log(err.message);
          throw err;
        }
      });
      console.log('Carts persisted to file');
    } catch (err) {
      console.error(err);
    }
  }
}

// const productManager = new ProductManager('products.json');
const cartManager = new CartManager('./src/daos/models/shoppingCart.json');
export { cartManager };
