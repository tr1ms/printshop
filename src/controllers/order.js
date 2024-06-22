const Order = require("@models/Order");
const autoCatch = require("@utils/autoCatch");

exports.listOrders = autoCatch(async (req, res) => {
  if (!req.isAdmin) req.query.buyerEmail = req.user.email;
  const { limit = 10, offset = 0, productId, status, buyerEmail } = req.query;
  const orders = await Order.list({
    limit: +limit,
    offset: +offset,
    productId,
    status,
    buyerEmail,
  });
  return res.json(orders);
});

exports.getOrder = autoCatch(async (req, res, next) => {
  const order = await Order.get(req.params.id);
  if (!order) return next();
  return res.json(order);
});

exports.createOrder = autoCatch(async (req, res) => {
  const order = await Order.create(req.body);
  return res.status(201).json(order);
});
