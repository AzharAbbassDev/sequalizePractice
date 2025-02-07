const express = require('express');
const sequelize = require('../config/database');
const router = express.Router();

router.post('/user', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const createdAt = new Date();
    const updatedAt = new Date();
    const [results, metadata] = await sequelize.query(
      'INSERT INTO Users (name, email, age, createdAt, updatedAt) VALUES (:name, :email, :age, :createdAt, :updatedAt)',
      { replacements: { name, email, age, createdAt, updatedAt } }
    );
    res.status(201).json({ message: 'User created successfully', user: { id: results, name, email, age, createdAt, updatedAt } });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.get('/user', async (req, res) => {
  const { id } = req.query;
  try {
    const [user] = await sequelize.query(
      'SELECT * FROM Users WHERE id = :id',
      { replacements: { id }, type: sequelize.QueryTypes.SELECT }
    );
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await sequelize.query(
      'SELECT * FROM Users',
      { type: sequelize.QueryTypes.SELECT }
    );
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  const updatedAt = new Date();
  try {
    const [user] = await sequelize.query(
      'SELECT * FROM Users WHERE id = :id',
      { replacements: { id }, type: sequelize.QueryTypes.SELECT }
    );
    if (user) {
      await sequelize.query(
        'UPDATE Users SET name = :name, email = :email, age = :age, updatedAt = :updatedAt WHERE id = :id',
        { replacements: { name: name || user.name, email: email || user.email, age: age || user.age, updatedAt, id } }
      );
      res.status(200).json({ message: 'User updated successfully', user: { id, name: name || user.name, email: email || user.email, age: age || user.age, updatedAt } });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/user', async (req, res) => {
  const { id } = req.body;
  try {
    const [user] = await sequelize.query(
      'SELECT * FROM Users WHERE id = :id',
      { replacements: { id }, type: sequelize.QueryTypes.SELECT }
    );
    if (user) {
      await sequelize.query(
        'DELETE FROM Users WHERE id = :id',
        { replacements: { id } }
      );
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
