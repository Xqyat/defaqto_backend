const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

const createMenuItem = async (req, res) => {
  try {
    const { name, price, weight_value, weight_unit, categoryId } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'name, price, categoryId обязательны' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Категория не найдена' });
    }

    const itemData = {
      name: name.trim(),
      price: Number(price),
      weight_value: weight_value ? Number(weight_value) : null,
      weight_unit: weight_unit === '' ? null : weight_unit,
      categoryId, 
      group: category.group
    };

    const item = await MenuItem.create(itemData);
    res.status(201).json(item);
  } catch (err) {
    console.error('Ошибка создания:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, weight_value, weight_unit, categoryId } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'name, price, categoryId обязательны' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Категория не найдена' });
    }

    const updated = await MenuItem.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        price: Number(price),
        weight_value: weight_value ? Number(weight_value) : null,
        weight_unit: weight_unit === '' ? null : weight_unit,
        categoryId, 
        group: category.group
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Позиция не найдена' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Ошибка редактирования:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MenuItem.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Позиция не найдена' });
    }

    res.json({ message: 'Удалено успешно', id: deleted._id });
  } catch (err) {
    console.error('Ошибка удаления:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

module.exports = {
  // getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};