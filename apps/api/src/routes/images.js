'use strict';

const { Router } = require('express');
const router = Router();

// CAT-10: GET /api/images       → paginated list of user's generated images
// CAT-10: GET /api/images/:id   → single image metadata + figmaUrl

module.exports = router;
