const express = require("express");

const router = express.Router();

let PRODUCT_MOCK = [
    {
        id: 1,
        name: "Laptop",
        price: 14000000,
    },
    {
        id: 2,
        name: "Mechanical Keyboard",
        price: 1400000,
    },
    {
        id: 3,
        name: "Silent Logitec Mouse",
        price: 450000,
    },
];

// Get all product
router.get("/", (req, res) => {
    let result = PRODUCT_MOCK;

    res.json({
        success: true,
        data: result,
    });
});

// Get  product by id
router.get("/:id", (req, res) => {
    const { id } = req.params;
    let result = PRODUCT_MOCK.find((product) => product.id === Number(id));

    if (!result) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }

    res.json({
        success: true,
        data: result,
    });
});

// post product
router.post("/", (req, res) => {
    // Tugas
    // Buat validasi ketika user input nama yang sama.
    // cth:
    // nama product = Sabun A
    // input berikutnya.
    // nama product = Sabun A
    // maka sistem akan mengembalikan response Nama product Duplicate


    // Tugas ke 2
    // Buatkan API CRUD user, GET ALL, GET BY, POST, PUT, DELETE
    const { name, price } = req.body;

    const product = {
        id: PRODUCT_MOCK.length + 1,
        name: name,
        price: price
    }

    PRODUCT_MOCK.push(product);

    res.status(201).json({
        success: true,
        data: {
            product_id: product.id
        }
    });
});

router.put("/:id", (req, res) => {
    const { name, price } = req.body;
    const { id } = req.params;
    let result = PRODUCT_MOCK.find((product) => product.id === Number(id));

    if (!result) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }

    PRODUCT_MOCK = PRODUCT_MOCK.map((product) => {
        if (product.id === Number(id)) {
            console.log(product)
            return {
                id: Number(id),
                name: name,
                price: price
            }
        } else {
            return product
        }
    })

    res.status(201).json({
        success: true,
        data: PRODUCT_MOCK
    });
});

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = PRODUCT_MOCK.findIndex(
        (product) => product.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    PRODUCT_MOCK.splice(index, 1);

    res.json({
        success: true,
        message: "Product deleted"
    });
})

module.exports = router;
