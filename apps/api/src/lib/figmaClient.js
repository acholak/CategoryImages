'use strict';

// CAT-11: Figma API client. Authenticated via FIGMA_ACCESS_TOKEN env var.

/**
 * Upload a base64 PNG to the Figma file, placed in a frame named after the category.
 * @param {string} base64 - base64-encoded PNG
 * @param {string} category - category name (used as frame name)
 * @returns {Promise<string>} Figma node URL
 */
async function uploadImage(base64, category) {
  // TODO: implement — CAT-11, CAT-12
}

module.exports = { uploadImage };
