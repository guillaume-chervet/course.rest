const Data = require("./data");

describe("Place/data", () => {
  it("should return an array of place", () => {
    const data = new Data();
    data.getPlacesAsync().then(function(places) {
      expect(Array.isArray(places)).toBe(true);
    });
  });

  it("should get a place", () => {
    const data = new Data();
    return data.getPlaceAsync("1").then(function(place) {
      expect(place.name).toBe("Londre");
    });
  });

  it("should save a new place", () => {
    const data = new Data();
    const place = {
      name: "Lens",
      author: "Louis",
      review: 3,
      image: null
    };
    return data.savePlaceAsync(place).then(function(id) {
      expect(id).toBe("d02ee460-0d45-11ea-a247-8312af632f4f");
    });
  });

  it("should remplace an existing place because id is set", () => {
    const data = new Data();
    const place = {
      id: "2",
      name: "Lens2",
      author: "Louis2",
      review: 3,
      image: null
    };
    return data.savePlaceAsync(place).then(function() {
      expect(true).toBe(true);
    });
  });

  it("should delete a place then fail to delete it again", () => {
    const data = new Data();
    return data.deletePlaceAsync("3").then(function(success) {
      expect(true).toBe(true);
      return data.deletePlaceAsync("3").then(function(success) {
        expect(success).toBe(false);
      });
    });
  });
});
