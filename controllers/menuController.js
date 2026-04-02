const MenuItem = require('../models/MenuItem');

const createMenuItem = async (req, res) => {
  try {
    const { name, price, weight_value, weight_unit, category, group } = req.body;
    if (!name || !price || !category || !group) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    const itemData = {
      name: name.trim(),
      price: Number(price),
      weight_value: weight_value ? Number(weight_value) : null,
      weight_unit: weight_unit === '' ? null : weight_unit,
      category: category.trim(),
      group,
    };

    const item = await MenuItem.create(itemData);
    res.status(201).json(item);
  } catch (err) {
    console.error('Ошибка создания:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const updateMenuItem = async (req, res) => {
  console.log('PUT controller сработал', req.params.id);
  
  try {
    const { id } = req.params;
    const { name, price, weight_value, weight_unit, category, group } = req.body;

    if (!name || !price || !category || !group) {
      return res.status(400).json({ error: 'name, price, category, group обязательны' });
    }

    const updated = await MenuItem.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        price: Number(price),
        weight_value: weight_value ? Number(weight_value) : null,
        weight_unit: weight_unit || null,
        category: category.trim(),
        group,
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
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};