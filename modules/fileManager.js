const fs = require("fs");

class FileManager {
    appendToFile(fileName, text, callback) {
        fs.appendFile(fileName, text + "\n", (error) => {
            callback(error);
        });
    }

    readFile(fileName, callback) {
        fs.readFile(fileName, "utf8", (error, data) => {
            callback(error, data);
        });
    }
}

module.exports = FileManager;