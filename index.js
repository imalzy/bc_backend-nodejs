const express = require('express');
const productRoutes = require("./routes/product.routes");
const app = express();
const port = 3000;

// middleware
app.use(express.json());

// Global middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next();
})

// Routes
app.use("/api/products", productRoutes)

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route api not found!"
    })
})

app.listen(port, () => console.log(`Server running on http://localhost:${port}`))