import Products from './models/products.schema.js';

class ProductsDAO {
  static async getALL() {
    return await Products.find().lean();
  }

  static async getAllWithStock() {
    return await Products.find({ stock: { $gt: 0 } }).lean();
  }

  static async exists(id) {
    try {
      const product = await Products.exists({ _id: id });
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  static async getById(id) {
    try {
      const product = await Products.findOne({ _id: id });
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  static async add(
    code,
    title,
    description,
    price,
    stock,
    category,
    thumbnail,
    status
  ) {
    try {
      const product = new Products({
        code,
        title,
        description,
        price,
        stock,
        category,
        thumbnail,
        status,
      });
      await product.save();
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  static async update(id, data) {
    try {
      const product = await Products.findOneAndUpdate({ _id: id }, data);
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  static async remove(id) {
    try {
      const product = await Products.findByIdAndDelete({ _id: id });
      return product;
    } catch (error) {
      console.log(error);
    }
  }
}

export { ProductsDAO as productsDAO };
