'use strict';

const fs = require('fs');
const { Router } = require('express');
const { query, validationResult } = require('express-validator');
const { listImages, getImage } = require('../lib/db');
const { getImagePath } = require('../lib/storage');

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

// GET /api/images/:id/:option — serve the PNG file (option = 1 or 2)
router.get('/:id/:option', (req, res) => {
  const { id, option } = req.params;
  if (!['1', '2'].includes(option)) {
    return res.status(400).json({ error: 'option must be 1 or 2' });
  }
  const filepath = getImagePath(id, option);
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'Image file not found' });
  }
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  fs.createReadStream(filepath).pipe(res);
});

module.exports = router;
