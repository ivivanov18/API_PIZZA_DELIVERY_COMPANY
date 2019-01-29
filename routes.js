const handlers = require("./lib/handlers");

const router = {
  pizzas: handlers.pizzas,
  ping: handlers.ping
};

module.exports = router;
