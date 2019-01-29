const pizzas = require("./pizzas");

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

module.exports = handlers;
