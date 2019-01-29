const fs = require("fs");
const path = require("path");

const helpers = require("./helpers");

const lib = {};
// baseDir of the folder
lib.baseDir = path.join(__dirname, "/../.data/");

lib.create = (dir, file, data, callback) => {
  const fileNameToOpen = lib.baseDir + dir + "/" + file + ".json";

  fs.open(fileNameToOpen, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, err => {
        if (!err) {
          fs.close(fileDescriptor, err => {
            if (!err) {
              callback(false);
            } else {
              callback("Error when closing the file");
            }
          });
        } else {
          callback("Error when writing to file");
        }
      });
    } else {
      callback("Could not create new file. It may already exist");
    }
  });
};

lib.read = (dir, file, callback) => {
  const fileToRead = lib.baseDir + dir + "/" + file + ".json";
  fs.readFile(fileToRead, "utf8", (err, data) => {
    if (!err && data) {
      const parsedData = helpers.parseJSONToObject(data);
      callback(err, parsedData);
    } else {
      callback(err, data);
    }
  });
};

lib.update = (dir, file, data, callback) => {
  const fileNameToUpdate = lib.baseDir + dir + "/" + file + ".json";

  fs.open(fileNameToUpdate, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringToWrite = JSON.stringify(data);
      fs.truncate(fileDescriptor, err => {
        if (!err) {
          fs.writeFile(fileDescriptor, stringToWrite, err => {
            if (!err) {
              fs.close(fileDescriptor, err => {
                if (!err) {
                  callback(false);
                } else {
                  callback("Error while closing the file");
                }
              });
            } else {
              callback("Error while writing to the file.");
            }
          });
        } else {
          callback("Error while truncating the file.");
        }
      });
    } else {
      callback("Could not open the file. It may not exist yet");
    }
  });
};

lib.delete = (dir, file, callback) => {
  const fileToDelete = lib.baseDir + dir + "/" + file + ".json";

  fs.unlink(fileToDelete, err => {
    if (!err) {
      callback(false);
    } else {
      callback("Problem while deleting file");
    }
  });
};
module.exports = lib;
