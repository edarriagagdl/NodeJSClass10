import * as fs from 'fs';

class ProductManager {
  // Array that holds all the products
  #products = [];
  // id for the products
  #id = 0;
  // this is the default path to the products file.
  #path = './src/daos/models/products.json';
  #fileLoaded = false;

  constructor(pathToProductos) {
    this.#path = pathToProductos;
  }

  // returns the array that contains the products
  getProducts() {
    return this.#products;
  }

  isFileLoaded() {
    return this.#fileLoaded;
  }

  validateProductFields(product) {
    /*
      id: Number/String 
      title:String,
      description:String
      code:String
      price:Number
      status:Boolean
      stock:Number
      category:String
      thumbnails:Array de Strings que contenga las rutas donde están almacenadas las imágenes referentes a dicho producto
      Status es true por defecto.
    */
    if (product.code == undefined)
      throw new Error('Code of the product is missing or invalid');
    if (product.title == undefined)
      throw new Error('Title of the product is missing or invalid');
    if (product.description == undefined)
      throw new Error('Description of the product is missing or invalid');
    if (product.price == undefined)
      throw new Error('Price of the product is missing or invalid');
    if (product.stock == undefined)
      throw new Error('Stock of the product is missing or invalid');
    if (product.category == undefined)
      throw new Error('Category of the product is missing or invalid');
  }

  // Add a product created with the parameters received if it pass some validations
  addProduct(product) {
    // validate that all all fields were received
    this.validateProductFields(product);
    product.status = true;
    const isCodeFound = (element) => element.code == product.code;
    const codeFound = this.#products.findIndex(isCodeFound);
    // Validate if the code already exists, -1 means the code was not found and can be inserted
    if (codeFound < 0) {
      this.#id = this.#id + 1;
      product.id = this.#id;
      this.#products.push(product);
      console.log(
        'The product with id ' + product.id + ' was added scuessfully'
      );
      return product;
    } else {
      throw new Error(
        'The code ' +
          product.code +
          ' for the product you are trying to insert already exists'
      );
    }
  }

  // Will update a product with the values contained in the product object parameter
  updateProduct(product) {
    try {
      const isIdFound = (element) => element.id == product.id;
      const productIndex = this.#products.findIndex(isIdFound);
      this.#products[productIndex] = product;
    } catch (error) {
      console.error(error);
    }
  }

  // returns a prodcust that matches an id, otherwise will return "Not found"
  getProductById(id) {
    const isIdFound = (element) => element.id == id;
    const productIdFound = this.#products.find(isIdFound);
    // if id is not found, an undefined is returned
    return productIdFound;
  }

  // Will delete a product by Id
  deleteProductById(id) {
    const isIdFound = (element) => element.id == id;
    const productIndex = this.#products.findIndex(isIdFound);
    // if id is not found, an undefined is returned
    if (productIndex >= 0) {
      this.#products.splice(productIndex, 1);
    } else {
      throw new Error(
        'The product with id ' + id + ' does not exist in the products catalog'
      );
    }
  }

  async loadProductsFromFile(pathToProducts) {
    try {
      if (fs.existsSync(pathToProducts)) {
        console.log(
          'The json file ' + pathToProducts + ' exists and will be loaded'
        );
        const data = await fs.promises.readFile(pathToProducts, 'utf-8');
        if (data) {
          const obj = JSON.parse(data); //now it an object
          if (obj) {
            this.#products = obj.products;
            this.#id = obj.id;
          }
        }
        this.#fileLoaded = true;
        console.log('The file was read: ' + this.#fileLoaded);
      } else {
        console.error(
          'Error: The file ' +
            pathToProducts +
            ' does not exists or it is not readable'
        );
      }
    } catch (err) {
      console.error(
        'Error: There was an error loading the file ' + pathToProducts
      );
      console.error(err);
    }
  }

  persistProductsToFile() {
    try {
      const obj = {
        id: this.#id,
        products: this.#products,
      };
      const json = JSON.stringify(obj);
      fs.writeFile(this.#path, json, (err) => {
        if (err) {
          console.log(err.message);
          throw err;
        }
      });
      console.log('Products persisted to file');
    } catch (err) {
      console.error(err);
    }
  }
}

const productManager = new ProductManager('./src/daos/models/products.json');
export { productManager };
