require('module-alias/register')
const express = require('express')
const cookieParser = require('cookie-parser')
const products = require('@routes/products')
const orders = require('@routes/orders')
const { auth } = require('@routes/auth')
const middleware = require('middleware')

const app = express()
const port = 3000

app.use(middleware.cors)
app.use(express.json())
app.use(cookieParser())

app.use(auth)
app.use('/products', products)
app.use('/orders', orders)

app.use(middleware.notFound)
app.use(middleware.errHandler)

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})