// Check the README.md file for instructions to the exercise
import http from "http";
import fs from "fs";
import path from "path";
import url from "url";
import dotenv from "dotenv";
dotenv.config();

const filepath = path.join(__dirname, "../");
const publicPath = path.join(filepath, "public");
const dataFilePath = path.join(filepath, "data/data.json");

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
      fs.readFile(file, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("File not found");
        } else {
          res.writeHead(200, { "Content-Type": "image/jpg" });
          res.end(data);
        }
      });
    }
  }

  // GET /api/data
  if (pathname === "/api/data" && method === "GET") {
    fs.readFile(dataFilePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end(JSON.stringify({ message: "No data found" }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(data);
      }
    });
  }

  // POST /api/data
  if (pathname === "/api/data" && method === "POST") {
    let errorMsg: string = "";
    let body: string = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const existingData = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
        console.log("Received data:", data);
        try {
          existingData.push(data);
          fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));
          console.log("Data saved successfully");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Data received successfully", receivedData: data }));
          return;
        } catch (error) {
          console.error("Error saving data:", error);
          errorMsg = "Error saving data";
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        errorMsg = "Invalid JSON";
      }
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: errorMsg }));
    });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
