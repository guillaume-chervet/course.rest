const Data = require("./data");

describe("Place/data", () => {
  it("should return an array of place", async () => {
    const data = new Data();
    const places = await data.getPlacesAsync();
    expect(Array.isArray(places)).toBe(true);
  });

  it("should get a place", async () => {
    const data = new Data();
    const place = await data.getPlaceAsync("1");
    expect(place.name).toBe("Londre");
  });

  it("should save a new place", async () => {
    const data = new Data();
    const place = {
      name: "Lens",
      author: "Louis",
      review: 3,
      image: null
    };
    const id = await data.savePlaceAsync(place)
    expect(id).not.toBeUndefined();
  });

  it("should remplace an existing place because id is set", async () => {
    const data = new Data();
    const place = {
      id: "2",
      name: "Lens2",
      author: "Louis2",
      review: 3,
      image: null
    };
    const id = await data.savePlaceAsync(place);
    expect(id).toBe("2");
  });

  it("should delete a place then fail to delete it again", async () => {
    const data = new Data();
    let success = await data.deletePlaceAsync("3");
    expect(success).toBe(true);
    success = await data.deletePlaceAsync("3")
    expect(success).toBe(false);
  });
});
