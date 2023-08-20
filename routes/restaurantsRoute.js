const express = require("express");
const Restaurant = require("../model/resModel");
const middleware = require("../middleware/auth");

const router = express.Router();

// GET route to fetch restaurant data with pagination
router.get("/", middleware, async (req, res) => {
    try {
        let { page } = req.query;
        if (!page) {
            page = 1;
        }
        const restaurantsPerPage = 10;
        const skipAmount = (page - 1) * restaurantsPerPage;
        const restaurants = await Restaurant.find().skip(skipAmount).limit(restaurantsPerPage);
        return res.status(200).json({ data: restaurants, currentPage: page });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});

// POST route to add a new restaurant
router.post("/add", middleware, async (req, res) => {
    try {
        const { userId, name } = req;
        const addRes = await Restaurant.create({ ...req.body, creator: userId, name: name });
        return res.status(201).json(addRes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});

// PATCH route to update a restaurant
router.patch("/update/:resId", middleware, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.resId);

        if (!restaurant) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        if (restaurant.creator.toString() !== req.userId) {
            return res.status(403).json({ msg: "You do not have permission to update this restaurant" });
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.resId,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedRestaurant);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

router.delete("/delete/:resId", middleware, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.resId);

        if (!restaurant) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        if (restaurant.creator.toString() !== req.userId) {
            return res.status(403).json({ msg: "You do not have permission to update this restaurant" });
        }

        const updatedRestaurant = await Restaurant.findByIdAndDelete(
            req.params.resId,
            { new: true }
        );

        res.status(200).json({msg:"restaurant deleted"});

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

module.exports = router;
