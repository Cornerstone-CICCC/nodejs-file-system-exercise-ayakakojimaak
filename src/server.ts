// Check the README.md file for instructions to the exercise
import http from "http";
import fs from "fs";
import path from "path";
import url from "url";
import dotenv from "dotenv";
dotenv.config();

const filepath = path.join(__dirname, "../");
const publicPath = path.join(filepath, "public");

const server = http.createServer((req, res) => {
  const { method } = req;
  const parsedUrl = url.parse(req.url || "", true);
  const { pathname, query } = parsedUrl;
  const filename = (query.filename as string) || undefined;
  // method GET POST PUT DELETE
  // parsedUrl { pathname: "/users", query: { filename: "test.jpg" } }
  // query { filename: "test.jpg" }
  // pathname "/users"

  if (pathname === "/" && method === "GET") {
    const file = path.join(publicPath, "index.html");
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
    return;
  }

  if (pathname === "/hello" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Hello World");
  }

  //view-image?filename=veryhappydog.jpg
  if (pathname === "/view-image" && method === "GET") {
    if (!filename) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end("Filename is required");
    } else {
      const file = path.join(publicPath, "images/", filename);
      const content = fs.readFileSync(file);
      fs.readFile(file, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("File not found");
        } else {
          res.writeHead(200, { "Content-Type": "image/jpg" });
          res.end(content);
        }
      });
    }
  }

  //   if (pathname === "/api/data" && method === "GET") {

  //   }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
