const helpers = {};

helpers.parseJSONToObject = str => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return {};
  }
};

module.exports = helpers;
