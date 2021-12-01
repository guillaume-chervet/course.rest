const _ = require("lodash");
const { v1: uuidv1 } = require("uuid");
const jsonData = require("./data.json");

const cloneJsonData = _.cloneDeep(jsonData);

const waitAsync = (value) =>
    new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 1, value));

function _loadAsync(_data) {
  return waitAsync(_.cloneDeep(_data));
}

function _saveAsync(data, _data) {
  Object.assign(_data, data);
  return waitAsync();
}

class Data {
  constructor() {
    this._data = cloneJsonData;
  }

  async getPlacesAsync() {
    const data = await _loadAsync(this._data);
    return _.cloneDeep(data.places);
  }

  async getPlaceAsync(id) {
    const data =  await _loadAsync(this._data);
    const places = data.places;
    let place = _.find(places, {
      id: id
    });
    return _.cloneDeep(place);
  }

  async savePlaceAsync(place) {
    const data = await _loadAsync(this._data);
    const places = data.places;
    let id;
    if (!place.id) {
      // insert
      id = uuidv1();
      let newPlace = _.cloneDeep(place);
      newPlace.id = id;
      places.push(newPlace);
    } else {
      // replace
      id = place.id;
      _.remove(places, {
        id
      });
      places.push(_.cloneDeep(place));
    }
    await  _saveAsync(data, this._data);
    return id;
  }

  async deletePlaceAsync(id) {
    const data = await  _loadAsync(this._data);
      let places = data.places;
      let place = _.find(places, {
        id: id
      });
      if (place !== undefined) {
        var index = places.indexOf(place);
        places.splice(index, 1);
      } else {
        return false;
      }
      await _saveAsync(
        {
          places
        },
        this._data
      );
        return true;
  }
}

module.exports = Data;
