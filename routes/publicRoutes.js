const express = require('express');
const router = express.Router();

const MenuItem = require('../models/MenuItem');
const Event = require('../models/Event');
const Category = require('../models/Category');
const { sendBookingRequest } = require('../controllers/bookingController');


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

    const categories = await Category.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    const items = await MenuItem.find().sort({ createdAt: 1 });

    const result = {
      food: {},
      drinks: {},
    };

    categories.forEach((category) => {
      const sectionKey = category.slug || String(category._id);

      const categoryItems = items.filter(
        (item) => String(item.categoryId) === String(category._id)
      );

      result[category.group][sectionKey] = {
        title: category.name,
        items: categoryItems,
      };
    });

    return res.json(result);
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
      date: event.date.toISOString().split('T')[0],
      time: event.time,
      endDate: event.endDate ? event.endDate.toISOString().split('T')[0] : event.date.toISOString().split('T')[0],
      endTime: event.endTime || event.time,
      entranceType: event.entranceType,
      entrancePrice: event.entrancePrice,
    }))
  );
});

router.post('/booking', sendBookingRequest);

module.exports = router;