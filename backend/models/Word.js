// models/Word.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Word = sequelize.define('Word', {
  word: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  meaning: {
    type: DataTypes.TEXT,
  },
  synonyms: {
    type: DataTypes.TEXT,
  },
  translation: {
    type: DataTypes.TEXT,
  },
}, { timestamps: true });

module.exports = Word;
