const http = require("http");
const url = require("url");

const Utils = require("./modules/utils");
const EnglishMessages = require("./lang/en/en");
const FileManager = require("./modules/fileManager");

class Server {
    constructor() {
        this.port = process.env.PORT || 8080;
        this.utils = new Utils();
        this.messages = new EnglishMessages();
        this.fileManager = new FileManager();
    }

    start() {
        const server = http.createServer((request, response) => {
            this.handleRequest(request, response);
        });

        server.listen(this.port, () => {
            console.log(`Server is running at http://localhost:${this.port}`);
        });
    }

    handleRequest(request, response) {
        const parsedUrl = url.parse(request.url, true);

        if (parsedUrl.pathname === "/COMP4537/labs/4/getDate/") {
            const name = parsedUrl.query.name;
            const currentDate = this.utils.getDate();

            const greeting = this.messages.greeting.replace("%1", name);

            response.writeHead(200, {
                "Content-Type": "text/html"
            });

            response.end(
                `<p style="color: blue;">${greeting} ${currentDate}</p>`
            );
        } else if (parsedUrl.pathname === "/COMP4537/labs/4/writeFile/") {
            const text = parsedUrl.query.text;

            this.fileManager.appendToFile("file.txt", text, (error) => {
                if (error) {
                    response.writeHead(500, {
                        "Content-Type": "text/plain"
                    });

                    response.end("Error writing to file");
                } else {
                    response.writeHead(200, {
                        "Content-Type": "text/plain"
                    });

                    response.end("Text appended to file.txt");
                }
            });
        } else if (parsedUrl.pathname.startsWith("/COMP4537/labs/4/readFile/")) {
            const fileName = parsedUrl.pathname.split("/").pop();

            this.fileManager.readFile(fileName, (error, data) => {
                if (error) {
                    response.writeHead(404, {
                        "Content-Type": "text/plain"
                    });

                    response.end(`404: File ${fileName} not found`);
                } else {
                    response.writeHead(200, {
                        "Content-Type": "text/plain"
                    });

                    response.end(data);
                }
            });
        } else {
            response.writeHead(404, {
                "Content-Type": "text/plain"
            });

            response.end("404 Not Found");
        }
    }
}

const server = new Server();
server.start();