const environments = {};

environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
  hashingSecret: "This is a very secret staging secret"
};

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
  hashingSecret: "This is also a very secret but production secret"
};

const currentEnv =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

const envToExport =
  typeof environments[currentEnv] === "object"
    ? environments[currentEnv]
    : environments.staging;

module.exports = envToExport;
