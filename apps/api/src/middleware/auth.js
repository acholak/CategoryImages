'use strict';

// CAT-6: Verify JWT on protected routes. Returns 401 if missing or expired.

function requireAuth(req, res, next) {
  // TODO: implement JWT verification
  next();
}

module.exports = { requireAuth };
