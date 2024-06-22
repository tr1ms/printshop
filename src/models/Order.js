const cuid = require('cuid')
const { isEmail } = require('validator')
const db = require('db')

const emailSchema = (opts = {}) => {
	const { required = false } = opts
	return {
		type: String,
		required,
		validate: {
			validator: isEmail,
			message: props => `${props.value} is not a valid email`
		},
		index: true
	}
}

const Order = db.model("Order", {
	_id: { type: String, default: cuid },
	buyerEmail: emailSchema({ required: true }),
	products: [{ type: String, ref: 'Product', index: true, required: true }],
	status: { type: String, default: 'CREATED', index: true, enum: ['CREATED', 'PENDING', 'COMPLETED'] }
})

const list = async (opts = {}) => {
	const { limit = 10, offset = 0, productId, status = 'CREATED', buyerEmail } = opts
	const query = { status }
	if (productId) query.products = productId
	if (buyerEmail) query.buyerEmail = buyerEmail
	return await Order.find(query)
		.sort({ _id: 1 })
		.skip(offset)
		.limit(limit)
}

const get = async (id) => {
	return await Order.findById(id).populate('products').exec()
}

const create = async (fields) => {
	return await new Order(fields).save()
}

module.exports = {
	list,
	get,
	create,
}