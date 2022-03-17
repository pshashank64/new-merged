const express = require("express");
const Product = require("../models/productModel");
const Order = require("../models/orders");
const Users = require("../../../userBackend/src/model/userModel");
const auth = require("../auth/auth");
const jwt = require("jsonwebtoken");
const route = express.Router();

// route.post("/prod", async (req, res) => {
//   try {
//     // console.log(req.body);
//     const prod = await new Product(req.body);
//     await prod.save();
//     res.status(201).send(prod);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });


// GET Products By Id
route.get("/products/:id?", async (req, res) => {
  try {
    if (!req.params.id) {
      // console.log(`"1" ${req.params.id}`)
      const products = await Product.find({});
      res.status(200).send(products);
    } else if (req.params.id) {
      // console.log(`"2" ${req.params.id}`)
      const product = await Product.findById(req.params.id);
      res.status(200).send(product);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//add to cart
route.post("/addtocart/:productid/:quantity", auth, async (req, res) => {
  try {
    const prod = await Product.findById(req.params.productid);
    const cart = await new Order({
      owner: req.user._id,
      product: prod._id,
      quantity: req.params.quantity,
    });
    await cart.save();
    res.status(201).send(cart);
  } catch (error) {
    res.status(400).send(error);
  }
});
// get cart
route.get("/cart", auth, async (req, res) => {
  try {
  
    const token = req.header("Authorization").replace("Bearer ", "");
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
    const prod = await Order.find({owner:verifiedToken._id}).populate("product");
    // console.log(prod)
    res.status(200).send(prod);
  } catch (error) {
    res.status(400).send(error);
  }
});
//remove product from cart
route.delete("/deletecart/:orderid", auth, async (req, res) => {
  try {
    const prod = await Order.findByIdAndDelete(req.params.orderid);
    res.status(200).json({ message: "Product Deleted" });
  } catch (error) {
    res.status(400).send(error);
  }
});
//update quantity
route.put("/updatecart/:orderid/:quantity", auth, async (req, res) => {
  try {
    const updateorder = await Order.findByIdAndUpdate(req.params.orderid, {
      quantity: req.params.quantity,
    });
    res.status(201).json({ message: "Order Updated" });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = route;
