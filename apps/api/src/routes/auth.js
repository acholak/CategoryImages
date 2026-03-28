'use strict';

const { Router } = require('express');
const router = Router();

// CAT-5: Google OAuth backend
// GET  /api/auth/google    → redirect to Google consent screen
// GET  /api/auth/callback  → exchange code, issue JWT
// POST /api/auth/logout    → clear session

module.exports = router;
