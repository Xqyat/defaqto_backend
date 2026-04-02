const express = require('express');
const router = express.Router();

const MenuItem = require('../models/MenuItem');
const Event = require('../models/Event');

router.get('/menu', async (req, res) => {
  const data = await MenuItem.find();

  const result = {
    food: {},
    drinks: {},
  };

  data.forEach(item => {
    const groupData = item.group === 'food' ? result.food : result.drinks;
    const category = item.category || 'other';

    if (!groupData[category]) {
      groupData[category] = { title: category, items: [] };
    }

    groupData[category].items.push({
      id: item._id,
      name: item.name,
      price: item.price,
      weight_value: item.weight_value ?? null,
      weight_unit: item.weight_unit ?? null,
    });
  });

  res.json(result);
});

router.get('/events', async (req, res) => {
  const data = await Event.find();
  res.json(
    data.map(event => ({
      id: event._id.toString(),
      img: event.img,
      name: event.name,
      description: event.description,
      date: event.date,
      time: event.time,
      entrance: event.entrance,
    }))
  );
});

module.exports = router;