const express = require('express');
const router = express.Router();

const MenuItem = require('../models/MenuItem');
const Event = require('../models/Event');
const Category = require('../models/Category');

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/menu', async (req, res) => {
  try {
    const { categoryId } = req.query;

    if (categoryId) {
      const items = await MenuItem.find({ categoryId }).sort({ createdAt: 1 });
      return res.json(items);
    }

    return res.json([]);
  } catch (err) {
    console.error('Ошибка получения меню:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
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