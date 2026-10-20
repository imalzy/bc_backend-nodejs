const express = require('express');
const app = express()
const port = 3000

const logger = (req, res, next) => {
    console.log(req.method, req.url)

    next();
}

app.use(logger);

app.get('/profile', (req, res) => {
    res.json(
        {
            success: true,
            data: {
                name: 'Budi',
                email: 'budi77@gmail.com',
                age: 30
            }
        }
    )
})

app.get('/products', (req, res) => {
    // localhost:3000/products?page=1&per_page=10&sort=asc
    const { page, per_page, sort } = req.query;
    res.json({
        success: true,
        data: [],
        metadata: {
            page, per_page, sort
        }
    })
})

app.post('/product', (req, res) => {
    res.status(201).json({
        success: true,
        message: 'Oke',
    })
})
app.put('/product/:id', (req, res) => {
    // localhost:3000/products/1234
    const { id } = req.params;

    res.status(204).json({
        success: true,
        message: 'Oke',
        product_id: id
    })
})
app.delete('product/:id', (req, res) => {
})

app.get('/api/about', (req, res) => {
    res.send('Hello World!')
})

app.get('/', (req, res) => {
    // res.send('Hello World!')
    res.json({
        message: 'Hello buddy! test tes'
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})