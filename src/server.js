const App = require("./app");

const Places = require("./places/controller");
const Data = require("./places/data");
const Files = require("./files/controller");

const files = new Files();
const places = new Places(new Data());

const app = new App(places, files).app;

var server = app.listen(8082, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});
