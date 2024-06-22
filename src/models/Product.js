const cuid = require('cuid')
const { isURL } = require('validator')
const db = require('db')


function urlSchema(opts = {}) {
	const { required = false } = opts
	return {
		type: String,
		required,
		validate: {
			validator: isURL,
			message: props => `${props.value} is not a valid url`
		}
	}
}

const Product = db.model("Product", {
	_id: { type: String, default: cuid },
	description: { type: String, required: true },
	imgThumb: urlSchema({ required: true }),
	img: urlSchema({ required: true }),
	link: String,
	userId: { type: String, required: true },
	userName: { type: String, required: true },
	userLink: urlSchema(),
	tags: { type: [String], index: true }
})

const list = async (opts = {}) => {
	const { limit = 10, offset = 0, tag } = opts
	const query = tag ? { tags: tag } : {}
	return await Product.find(query)
		.sort({ _id: 1 })
		.skip(offset)
		.limit(limit)
}

const get = async (id) => {
	return await Product.findById(id)
}

const create = async (fields) => {
	const product = await new Product(fields).save()
	return product
}

const update = async (id, change) => {
	const product = await get(id)
	Object.keys(change).forEach(key => product[key] = change[key])
	await product.save()
	return product
}

const remove = async (_id) => {
	await Product.deleteOne({ _id })
}

module.exports = {
	list,
	get,
	create,
	update,
	remove
}