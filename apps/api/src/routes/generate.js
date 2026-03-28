'use strict';

const { Router } = require('express');
const { randomUUID } = require('crypto');
const { body, validationResult } = require('express-validator');
const { buildPrompt, VALID_ANGLES } = require('../lib/promptBuilder');
const { generateImage } = require('../lib/providers/fal');
const { saveImage } = require('../lib/db');
const { saveImageFromUrl } = require('../lib/storage');

const router = Router();

const validate = [
  body('category')
    .trim()
    .notEmpty().withMessage('category is required')
    .isLength({ max: 100 }).withMessage('category must be 100 characters or fewer'),
  body('market')
    .trim()
    .notEmpty().withMessage('market is required')
    .isLength({ max: 100 }).withMessage('market must be 100 characters or fewer'),
  body('angle')
    .trim()
    .notEmpty().withMessage('angle is required')
    .isIn(VALID_ANGLES).withMessage(`angle must be one of: ${VALID_ANGLES.join(', ')}`),
  body('isGrocery')
    .optional()
    .isBoolean().withMessage('isGrocery must be a boolean'),
  body('keyTexture')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('keyTexture must be 200 characters or fewer'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('notes must be 500 characters or fewer'),
];

// POST /api/generate
// Generates 2 PNG options with transparent background
router.post('/', validate, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { category, market, angle, isGrocery, keyTexture, notes } = req.body;

  try {
    const prompt = buildPrompt({ category, market, angle, isGrocery, keyTexture, notes });

    // Generate 2 options in parallel
    const [option1, option2] = await Promise.all([
      generateImage(prompt),
      generateImage(prompt),
    ]);

    const id = randomUUID();
    const base = `${req.protocol}://${req.get('host')}`;

    // Download and persist both images before responding
    const [local1, local2] = await Promise.all([
      saveImageFromUrl(option1, id, 1),
      saveImageFromUrl(option2, id, 2),
    ]);

    saveImage({ id, category, market, angle, notes: notes ?? null, url_1: local1, url_2: local2 });

    res.json({
      id,
      category,
      market,
      images: [
        { id: 1, url: `${base}${local1}` },
        { id: 2, url: `${base}${local2}` },
      ],
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
