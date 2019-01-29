const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

// Lib, routes, handlers imports
const router = require("./routes");
const notFound = require("./lib/handlers").notFound;
const helpers = require("./lib/helpers");
const config = require("./config");
const _data = require("./lib/data");

const unifiedServer = (req, res) => {
  // get url and parse
  const parsedUrl = url.parse(req.url, true);

  //get the path from url
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  //get the http method
  const method = req.method.toLowerCase();

  //get query string as an object
  const queryStringObject = parsedUrl.query;

  //get the headers as an object
  const headers = req.headers;

  //get the payload if any --> stringDecoder library
  const decoder = new StringDecoder("utf-8");

  let buffer = "";
  req.on("data", data => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();

    // construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJSONToObject(buffer)
    };

    const chosenHandler =
      typeof router[trimmedPath] === "undefined"
        ? notFound
        : router[trimmedPath];

    chosenHandler(data, (statusCode, payload) => {
      // use status code provided by the handler or default to 200
      const statusCodeToSend = typeof statusCode == "number" ? statusCode : 200;

      // use the payload provided by the handler or default to empty object
      const payloadToSend = typeof payload === "object" ? payload : {};

      const payloadToSendString = JSON.stringify(payloadToSend);

      //Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCodeToSend);
      res.end(payloadToSendString);
    });
  });
};

const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

httpServer.listen(config.httpPort, () => {
  console.log(
    `Listening on port ${config.httpPort} on ${config.envName} environmnent`
  );
});
