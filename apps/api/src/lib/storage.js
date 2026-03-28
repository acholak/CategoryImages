'use strict';

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = process.env.IMAGES_DIR
  || path.join(__dirname, '../../data/images');

fs.mkdirSync(IMAGES_DIR, { recursive: true });

/**
 * Fetch a PNG from a remote URL and save it to disk.
 * @param {string} remoteUrl
 * @param {string} id — generation UUID
 * @param {1|2} index — option number
 * @returns {string} local API path e.g. /api/images/uuid/1
 */
async function saveImageFromUrl(remoteUrl, id, index) {
  const res = await fetch(remoteUrl);
  if (!res.ok) throw new Error(`Failed to fetch image (${res.status}): ${remoteUrl}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(IMAGES_DIR, `${id}-${index}.png`), buffer);
  return `/api/images/${id}/${index}`;
}

/**
 * Resolve the on-disk path for a stored image.
 */
function getImagePath(id, index) {
  return path.join(IMAGES_DIR, `${id}-${index}.png`);
}

module.exports = { saveImageFromUrl, getImagePath };
