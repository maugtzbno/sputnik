// Include the axios npm package (Don't forget to run "npm install axios" in this folder first!)
var axios = require("axios");

// Then run a request with axios to the OMDB API with the movie specified

var quandl = {
  get: function(ticker, cb) {
    query =
      "https://www.quandl.com/api/v3/datasets/WIKI/" +
      ticker +
      ".json?column_index=4&start_date=2017-03-31&end_date=2018-03-27&collapse=monthly&transform=rdiff&api_key=qjhyrF4_No-CtKrx6_o_";
    console.log(query);
    axios
      .get(query)
      .then(function(response) {
        console.log(response);
        cb(response.data);
      })
      .catch(function(error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log("---------------Data---------------");
          console.log(error.response.data);
          console.log("---------------Status---------------");
          console.log(error.response.status);
          console.log("---------------Status---------------");
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an object that comes back with details pertaining to the error that occurred.
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  }
};

module.exports = quandl;
