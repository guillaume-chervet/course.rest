const App = require("./app");

const PlaceData = require("./places/data");
const Places = require("./places/controller");
const places = new Places(new PlaceData());
const app = new App(places).app;

var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});
