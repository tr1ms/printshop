const Product = require("@models/Product");
const autoCatch = require("@utils/autoCatch");

exports.listProducts = autoCatch(async (req, res) => {
  const { limit = 10, offset = 0, tag } = req.query;
  const products = await Product.list({ limit: +limit, offset: +offset, tag });
  res.json(products);
});

exports.getProduct = autoCatch(async (req, res, next) => {
  const product = await Product.get(req.params.id);
  if (!product) return next();
  return res.json(product);
});

exports.createProduct = autoCatch(async (req, res) => {
  const product = await Product.create(req.body);
  return res.status(201).json(product);
});

exports.updateProduct = autoCatch(async (req, res) => {
  const product = await Product.update(req.params.id, req.body);
  return res.json(product);
});

exports.deleteProduct = autoCatch(async (req, res) => {
  await Product.remove(req.params.id);
  return res.status(204).json({ success: true });
});
