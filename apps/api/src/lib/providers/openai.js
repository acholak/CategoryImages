'use strict';

// CAT-9 / CAT-20: OpenAI DALL-E 3 provider.
// Implements the standard provider interface: generateImage(prompt, options) → base64PNG

const name = 'openai';

/**
 * @param {string} prompt
 * @param {{ size?: string }} options
 * @returns {Promise<string>} base64-encoded PNG
 */
async function generateImage(prompt, options = {}) {
  // TODO: implement via OpenAI SDK — CAT-9
}

module.exports = { name, generateImage };
