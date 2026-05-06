const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const uploadEventImage = require('../middleware/uploadEventImage');

const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET;

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');

const {
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

const { dashboardController } = require('../controllers/dashboardController');

router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    const admin = await Admin.findOne({ login });

    if (!admin) return res.status(401).json({ error: 'Неверный логин' });

    if (admin.password !== password) {
      return res.status(401).json({ error: 'Неверный пароль' });
    }

    const token = jwt.sign({ userId: admin._id.toString() }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      token,
      admin: { id: admin._id, login: admin.login },
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Успех!',
    admin: req.admin,
  });
});

router.post('/menu', authMiddleware, createMenuItem);
router.put('/menu/:id', authMiddleware, updateMenuItem);
router.delete('/menu/:id', authMiddleware, deleteMenuItem);

router.get('/categories', authMiddleware, getCategories);
router.post('/categories', authMiddleware, createCategory);
router.put('/categories/:id', authMiddleware, updateCategory);
router.delete('/categories/:id', authMiddleware, deleteCategory);

router.post('/events', authMiddleware, uploadEventImage.single('image'), createEvent);
router.put('/events/:id', authMiddleware, uploadEventImage.single('image'), updateEvent);
router.delete('/events/:id', authMiddleware, deleteEvent);

router.get('/dashboard', authMiddleware, dashboardController);


module.exports = router;