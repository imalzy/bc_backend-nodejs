const http = require("http"); // memasukkan library http ke dalam file app.js

const server = http.createServer((req, res) => { // membuat server
  // res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Type", "application/json");

  // res.end('Server is running!');
  res.end(
    JSON.stringify({
      message: "Server is running!",
    }),
  );
});
// 3000 = port
server.listen(3000, () => console.log("Server berjalan di port 3000"));
