"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Check the README.md file for instructions to the exercise
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = __importDefault(require("url"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const filepath = path_1.default.join(__dirname, "../");
const publicPath = path_1.default.join(filepath, "public");
const server = http_1.default.createServer((req, res) => {
    const { method } = req;
    const parsedUrl = url_1.default.parse(req.url || "", true);
    const { pathname, query } = parsedUrl;
    const filename = query.filename || undefined;
    // method GET POST PUT DELETE
    // parsedUrl { pathname: "/users", query: { filename: "test.jpg" } }
    // query { filename: "test.jpg" }
    // pathname "/users"
    if (pathname === "/" && method === "GET") {
        const file = path_1.default.join(publicPath, "index.html");
        fs_1.default.readFile(file, (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
            }
            else {
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
        }
        else {
            const file = path_1.default.join(publicPath, "images/", filename);
            const content = fs_1.default.readFileSync(file);
            fs_1.default.readFile(file, (err, data) => {
                if (err) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("File not found");
                }
                else {
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
