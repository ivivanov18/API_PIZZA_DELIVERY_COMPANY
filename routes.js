const handlers = require("./lib/handlers");

const router = {
  pizzas: handlers.pizzas,
  ping: handlers.ping,
  users: handlers.users
};

module.exports = router;
