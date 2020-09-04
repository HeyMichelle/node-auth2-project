const express = require("express");
const db = require("./carsDb.js");

const router = express.Router();


// The client for this API is a car dealer who has provided the following specs:

// - The critical information for each car is the VIN, make, model, and mileage.
// - They also track transmission type and status of the title (clean, salvage, etc.), but this information is not always immediately known.


router.get("/", async (req, res, next) => {
  try {
    const cars = await db.find();
    res.status(200).json(cars);
    
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const car = await db.findById(req.params.id); // if not account, send 404, otherwise send 200
    if (!car) {
    res.status(404).json({ message: 'car could not be found with that ID'});
    } else {
      res.status(200).json(car);
    }
  } catch (err) {
      res.status(500).json({ message: "Something went wrong, could not find car by ID" })
    next(err);
  }
});

router.post("/", async (req, res, next) => {
    try {
		const payload = {
          vin: req.body.vin, 
          model: req.body.model, 
          make: req.body.make, 
          mileage: req.body.mileage, 
          transType: req.body.transType, 
          titleStatus: req.body.titleStatus
		};
		
		const newCar = await db.insert(payload);
		res.status(201).json(newCar);
	} catch (err) {
        res.status(500).json({ message: "Something went wrong, could not add car" });
		next(err);
	}
})

router.put("/:id", async (req, res, next) => {
    try {
        
      const changes = {
            vin: req.body.vin, 
            model: req.body.model, 
            make: req.body.make, 
            mileage: req.body.mileage, 
            transType: req.body.transType, 
            titleStatus: req.body.titleStatus
      };

      console.log("this is on the id: ", req.params.id);
        
      const updatedCar = await db.update(req.params.id, changes);
      
      res.status(204).json(updatedCar);
      
    } catch (err) {
      res.status(500).json({ message: "Something went wrong, could not update car" });
      next(err);
    }
  });


router.delete("/:id", async (req, res, next) => {
	try {
        await db.remove(req.params.id)
        
		res.status(204).end()
	} catch (err) {
        res.status(500).json({ message: "Something went wrong, could not delete car" });
      
		next(err);
	}
})


module.exports = router;
