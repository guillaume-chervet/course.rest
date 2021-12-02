const jsonpatch = require('fast-json-patch');
const Validator = require('jsonschema').Validator;

const regexurl="(https|http):?:\/\/.*";

class Places {
  constructor(data) {
    this.data = data;
  }
  configure(app) {
    const data = this.data;
    app.get("/api/places", async function(request, response) {
    const places = await data.getPlacesAsync();
      response.json({
        places: places
      });
    });

    app.get("/api/places/:id", async function(request, response) {
      const id = request.params.id;
      const place = await data.getPlaceAsync(id);
      if (place !== undefined) {
        response.status(200).json(place);
        return;
      }
      response.status(404).json({
        key: "entity.not.found"
      });
    });

    app.delete("/api/places/:id", async function(request, response) {
      const id = request.params.id;
      const success = await data.deletePlaceAsync(id);
      if (success) {
        response.status(204).json();
      } else {
        response.status(404).json({
          message: "entity.not.found"
        });
      }
    });

    app.post("/api/places", async function(request, response) {
      let newPlace = request.body;

      var placeSchema = {
        "id": "/Place",
        "type": "object",
        "properties": {
          "image": {
            "type": "object",
            "properties": {
              "url": {"type": "string",  "pattern": regexurl},
              "title": {"type": "string", "minLength": 3, "maxLength": 100}
            },
            "required": ["url", "title"]
          },
          "author": {"type": "string", "minLength": 3, "maxLength": 100, pattern:'^[a-zA-Z -]*$'},
          "review": {"type": "integer", "minimum": 1, "maximum": 9},
          "name": {"type": "string", "minLength": 3, "maxLength": 100, pattern:'^[a-zA-Z -]*$'}
        },
        "required": ["author", "review", "name"]
      };

      var validator = new Validator();
      var validationResult = validator.validate(newPlace, placeSchema)

      if (validationResult.errors.length > 0) {
        response.status(400).json(validationResult.errors);
        return;
      }

      const newId = await data.savePlaceAsync(newPlace);
      response.setHeader("Location", `/api/places/${newId}`);
      response.status(201).json();
    });

    app.put("/api/places/:id", async function(request, response) {
      let id = request.params.id;
      console.log(`put /api/places/:id called with id ${id}`);

      const newPlace = request.body;
      
      var placeSchema = {
        "id": "/Place",
        "type": "object",
        "properties": {
          "image": {
            "type": "object",
            "properties": {
              "url": {"type": "string",  "pattern": regexurl},
              "title": {"type": "string", "minLength": 3, "maxLength": 100}
            },
            "required": ["image", "title"]
          },
          "author": {"type": "string", "minLength": 3, "maxLength": 100, pattern:'^[a-zA-Z -]*$'},
          "review": {"type": "integer", "minimum": 1, "maximum": 9},
          "name": {"type": "string", "minLength": 3, "maxLength": 100, pattern:'^[a-zA-Z -]*$'}
        },
        "required": ["author", "review", "name"]
      };

      var validator = new Validator();
      var validationResult = validator.validate(newPlace, placeSchema)

      if (validationResult.errors.length > 0) {
        response.status(400).json(validationResult.errors);
        return;
      }

      const place = await data.getPlaceAsync(id);
      await data.savePlaceAsync(newPlace);
      if (place === undefined) {
        response.status(201).json();
      } else {
        response.status(204).json();
      }
    });

    app.patch("/api/places/:id", async function(request, response) {

      let id = request.params.id;
      console.log(`patch /api/places/:id called with id ${id}`);
      if(request.get('content-type') === 'application/json-patch+json') {
        // Manage json patch
        const patch = request.body;
        const place = await data.getPlaceAsync(id);
        if (place === undefined) {
          response.status(404).json({
            message: "entity.not.found"
          });
          return;
        }
        const newPlace = jsonpatch.applyPatch(place, patch).newDocument;
        await data.savePlaceAsync(newPlace);
        response.status(204).json();

      } else {     
          const newData = request.body

          var placeSchema = {
            "id": "/Place",
            "type": "object",
            "properties": {
              "image": {
                "type": "object",
                "properties": {
                  "url": {"type": "string",  "pattern": regexurl},
                  "title": {"type": "string", "minLength": 3, "maxLength": 100}
                },
                "required": ["image", "title"]
              },
              "author": {"type": "string", "minLength": 3, "maxLength": 100, pattern:'^[a-zA-Z -]*$'},
              "review": {"type": "integer", "minimum": 1, "maximum": 1},
              "name": {"type": "string", "minLength": 3, "maxLength": 100, pattern:'^[a-zA-Z -]*$'}
            },
            "required": []
          };

          var validator = new Validator();
          var validationResult = validator.validate(newData, placeSchema)

          if (validationResult.errors.length > 0) {
            response.status(400).json(validationResult.errors);
            return;
          }

          const place = await data.getPlaceAsync(id);
          if (place === undefined) {
            response.status(404).json({
              message: "entity.not.found"
            });
            return;
          }
          Object.assign(place, newData);
          await data.savePlaceAsync(place);
          response.status(204).json();
        }
      });
      
  }
}
module.exports = Places;
