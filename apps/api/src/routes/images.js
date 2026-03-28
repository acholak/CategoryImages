'use strict';

const { Router } = require('express');
const { query, validationResult } = require('express-validator');
const { listImages, getImage } = require('../lib/db');

const router = Router();

// GET /api/images?page=1
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const page = parseInt(req.query.page ?? '1', 10);
  res.json(listImages(page));
});

// GET /api/images/:id
router.get('/:id', (req, res) => {
  const record = getImage(req.params.id);
  if (!record) return res.status(404).json({ error: 'Not found' });
  res.json(record);
});

module.exports = router;
