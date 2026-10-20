const http = require("http"); // memasukkan library http ke dalam file app.js

// Endpoint /api/profile
const server = http.createServer((req, res) => { // membuat server
    // res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Type", "application/json");

    if (req.url === "/api/profile" && req.method === "GET") {
        // status code = 200
        // {
        //  success: true,
        //  data: {
        // name: 'Budi',
        // email: 'budi77@gmail.com',
        // age: 30
        // }
        // }

        res.statusCode = 200;
        res.end(
            JSON.stringify({
                success: true,
                data: {
                    name: 'Budi',
                    email: 'budi77@gmail.com',
                    age: 30
                }
            })
        );
        return;
    }

    if (req.url === "/api/products" && req.method === "GET") {
        res.statusCode = 200;
        res.end(
            JSON.stringify({
                success: true,
                data: [{
                    id: 1,
                    name: 'Buku Gambar',
                    price: 2000
                }, {
                    id: 2,
                    name: 'Pensil Warna',
                    price: 200000
                }]
            })
        );

        return;
    }

    // Endpoint api/about
    // response berupa json
    // {
    //     success: true,
    //     data: {
    //         app: 'api-v1',
    //         version: "1.0.0",
    //         author: 'Reynard Joshua'
    //     }
    // }

    res.statusCode = 404; // NOT_FOUND
    res.end(
        JSON.stringify({
            success: false,
            message: "Endpoint not found!"
        })
    );
});
// 3000 = port
server.listen(3000, () => console.log("Server berjalan di port 3000"));
