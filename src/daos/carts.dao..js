import Carts from './models/carts.schema.js';

class CartsDAO {
  static async getALL() {
    return await Carts.find().lean();
  }

  static async exists(id) {
    try {
      const cart = await Carts.exists({ _id: id });
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  static async getById(id) {
    try {
      const cart = await Carts.findOne({ _id: id });
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  static async add(products) {
    console.log(products);

    try {
      const cart = new Carts();
	  const productList = new ProductsList(products);
      cart.products = productList;
      console.log(cart);

      await cart.save();
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  static async update(id, data) {
    try {
      const cart = await Carts.findOneAndUpdate({ _id: id }, data);
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * This method will update an existing cart to
   * add 1 to the existing quantity of a product that is already in the cart or
   * add a new product to the cart, with a quantity of 1
   */
  static async updateProductQty(cid, pid) {
    try {
      const cart = await Carts.findOne({ _id: id });
      if (cart) {
        const products = cart.products;
        const isIdFound = (element) => element.id == pid;
        const productIndex = cart.products.findIndex(isIdFound);
        if (productIndex >= 0) {
          const product = products[productIndex];
          console.log(
            'Product ' +
              product.id +
              ' was found and will be updated in the cart'
          );
          product.quantity += 1;
          products[productIndex] = product;
          this.update(cid, products);
        }
      }
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  static async remove(id) {
    try {
      const cart = await Carts.findByIdAndDelete({ _id: id });
      return cart;
    } catch (error) {
      console.log(error);
    }
  }
}

export { CartsDAO as cartsDAO };
