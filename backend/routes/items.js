// routes/items.js
const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// สร้างไอเท็มใหม่
router.post('/', async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// อ่านข้อมูลไอเท็มทั้งหมด
router.get('/', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
