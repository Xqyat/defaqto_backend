const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const uploadEventImage = require('../middleware/uploadEventImage');

const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = 'defaqto-super-secret-2026';

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

router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    console.log('Входяший LOGIN:', login);
    console.log('Входяший PASSWORD:', password);

    console.log('Все админы:', await Admin.find({}, 'login'));

    const admin = await Admin.findOne({ login });
    console.log('Админ из БД:', admin ? admin.login : 'не найден');

    if (!admin) return res.status(401).json({ error: 'Неверный логин' });

    console.log('Проверка пароля:', admin.password, '==', password);

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


// router.get('/menu', authMiddleware, getMenuItem);
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


module.exports = router;