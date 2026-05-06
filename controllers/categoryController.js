const Category = require('../models/Category');

const getCategories = async (req, res) => {
    try {
      const { group } = req.query;
  
      const filter = {};
      if (group) {
        filter.group = group;
      }
  
      const categories = await Category.find(filter).sort({ order: 1, createdAt: 1 });
      res.json(categories);
    } catch (err) {
      console.error('Ошибка получения категорий:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  };

const createCategory = async (req, res) => {
  try {
    const { name, group, order, isActive } = req.body;

    if (!name || !group) {
      return res.status(400).json({ error: 'name и group обязательны' });
    }

    const categoryData = {
      name: name.trim(),
      group,
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    };

    const category = await Category.create(categoryData);
    res.status(201).json(category);
  } catch (err) {
    console.error('Ошибка создания категории:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const updateCategory = async (req, res) => {

  try {
    const { id } = req.params;
    const { name, group, order, isActive } = req.body;

    if (!name || !group) {
      return res.status(400).json({ error: 'name и group обязательны' });
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        group,
        order: order !== undefined ? Number(order) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Ошибка редактирования категории:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }

    res.json({ message: 'Удалено успешно', id: deleted._id });
  } catch (err) {
    console.error('Ошибка удаления категории:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};