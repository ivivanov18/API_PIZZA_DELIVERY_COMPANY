const pizzas = require("./pizzas");

const handlers = {};

// NOT FOUND handler
handlers.notFound = (data, callback) => {
  callback(404);
};

handlers.ping = (data, callback) => {
  callback(200, { name: "PINGING" });
};

handlers.pizzas = (data, callback) => {
  callback(200, { pizzas });
};

module.exports = handlers;
