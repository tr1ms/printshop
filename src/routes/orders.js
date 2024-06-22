const express = require('express')
const orderController = require('@controllers/order')
const router = express.Router()
const { isAuthenticated } = require('@routes/auth')

router.route("/")
	.get(isAuthenticated, orderController.listOrders)
	.post(isAuthenticated, orderController.createOrder)

router.route("/:id")
	.get(isAuthenticated, orderController.getOrder)

module.exports = router