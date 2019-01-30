const pizzas = require("./pizzas");
const { validateEmail } = require("./helpers");
const _data = require("./data");

const handlers = {};

// NOT FOUND handler
handlers.notFound = (data, callback) => {
  callback(404, { error: "The requested URL was not found" });
};

// PING HANDLER
handlers.ping = (data, callback) => {
  callback(200, { name: "PINGING" });
};

// PIZZA HANDLER
handlers.pizzas = (data, callback) => {
  callback(200, { pizzas });
};

handlers.users = (data, callback) => {
  const allowedMethods = ["get", "put", "post", "delete"];
  const { method } = data;
  if (allowedMethods.indexOf(method) > -1) {
    handlers._users[method](data, callback);
  } else {
    callback(405, { error: "Unknown method" });
  }
};

handlers._users = {};

handlers._users.post = (data, callback) => {
  let { name, email, streetAddress, password } = data.payload;

  name = typeof name === "string" && name.trim().length > 0 ? name : false;
  email =
    typeof email === "string" && email.trim().length > 0 && validateEmail(email)
      ? email
      : false;
  streetAddress =
    typeof streetAddress === "string" && streetAddress.trim().length > 0
      ? streetAddress
      : false;
  password =
    typeof password === "string" && password.trim().length > 0
      ? password
      : false;

  if (name && email && streetAddress && password) {
    // TODO hash password
    const data = {
      name,
      email,
      streetAddress,
      password
    };
    _data.create("users", email, data, (err, data) => {
      if (!err) {
        callback(200);
      } else {
        callback(500, { error: "Could not create user" });
      }
    });
  } else {
    callback(400, { error: "Missing required fields" });
  }
};

// TODO only authenticated users
handlers._users.get = (data, callback) => {
  let { email } = data.queryStringObject;

  email =
    typeof email === "string" && email.trim().length > 0 && validateEmail(email)
      ? email
      : false;

  if (email) {
    _data.read("users", email, (err, data) => {
      if (!err && data) {
        callback(200, data);
      } else {
        callback(400, { error: err });
      }
    });
  } else {
    callback(400, { error: "Missing required fields" });
  }
};

// TODO only authenticated
handlers._users.put = (data, callback) => {
  let { streetAddress, name, password } = data.payload;
  let { email } = data.queryStringObject;

  // Check for email
  email =
    typeof email === "string" && email.trim().length > 0 && validateEmail(email)
      ? email
      : false;

  // Check for other fields to be updated
  name = typeof name === "string" && name.trim().length > 0 ? name : false;
  streetAddress =
    typeof streetAddress === "string" && streetAddress.trim().length > 0
      ? streetAddress
      : false;
  password =
    typeof password === "string" && password.trim().length > 0
      ? password
      : false;

  if (email) {
    if (name || streetAddress || password) {
      _data.read("users", email, (err, dataRead) => {
        let dataToUpdate = {};
        if (!err && dataRead) {
          if (name) {
            dataToUpdate = Object.assign({}, { ...dataRead, name });
          }
          if (streetAddress) {
            dataToUpdate = Object.assign(
              {},
              { ...dataToUpdate, streetAddress }
            );
          }
          if (password) {
            dataToUpdate = Object.assign({}, { ...dataToUpdate, password });
          }

          //updating
          _data.update("users", email, dataToUpdate, err => {
            if (!err) {
              callback(200);
            } else {
              callback(500, {
                error: "Could not update the user information."
              });
            }
          });
        } else {
          callback(403, {
            error:
              "The specified mail does not exist. Could not update the user information."
          });
        }
      });
    } else {
      callback(400, {
        error:
          "Missing fields to update. Could not update the user information."
      });
    }
  } else {
    callback(400, {
      error:
        "Missing compulsory email field to update the record. Could not update the user information."
    });
  }
};

handlers._users.delete = (data, callback) => {
  let { email } = data.payload;

  email =
    typeof email === "string" && email.trim().length > 0 && validateEmail(email)
      ? email
      : false;

  if (email) {
    _data.read("users", email, (err, dataRead) => {
      if (!err && dataRead) {
        _data.delete("users", email, err => {
          if (!err) {
            callback(200);
          } else {
            callback(500, { error: "Error while deleting file" });
          }
        });
      } else {
        callback(400, { error: "Cannot find data to delete" });
      }
    });
  } else {
    callback(400, { error: "Missing required field" });
  }
};
module.exports = handlers;
