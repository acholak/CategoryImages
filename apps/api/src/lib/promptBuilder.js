'use strict';

// Builds Deliveroo-brand prompt pairs from generation inputs.
// See BRAND_GUIDE.md §11 for template rules.
// Enriches prompts for known categories using assetRules.json.

const assetRules = require('../data/assetRules.json');

const VALID_ANGLES = ['45-degree', 'top-down', 'side-on', 'POV'];

const BASE_NEGATIVE =
  'no illustration, no cartoons, no 3D render, no surreal colours, no dark or moody lighting, ' +
  'no restaurant tablecloths, no fine dining plates, no messy kitchen background, no people\'s faces, ' +
  'no overlapping food items, no outlines or keylines around objects, no stretched or distorted food, ' +
  'no rotated plates or bowls, no shadows from multiple directions, no missing shadows, ' +
  'no unrealistic editing or patterns on food, no competitor logos, transparent background';

// Build a lookup map from group name → image record for fast access
const categoryKnowledge = Object.fromEntries(
  assetRules.images.map(img => [img.group.toLowerCase(), img])
);

// Market rules from grocery_category_image_rules
const marketRules = assetRules.grocery_category_image_rules.market_rules;

// Grocery composition rules as a single string
const groceryCompositionRules = assetRules.grocery_category_image_rules.composition_rules.join('. ');

/**
 * @param {{
 *   category: string,
 *   market: string,
 *   angle: string,
 *   isGrocery?: boolean,
 *   keyTexture?: string,
 *   notes?: string
 * }} params
 * @returns {{ positive: string, negative: string }}
 */
function buildPrompt({ category, market, angle, isGrocery = false, keyTexture, notes }) {
  if (!VALID_ANGLES.includes(angle)) {
    throw new Error(`angle must be one of: ${VALID_ANGLES.join(', ')}`);
  }

  // Look up existing knowledge for this category
  const known = categoryKnowledge[category.toLowerCase()];

  // Build market localisation note
  const marketNote = market ? ` typical of the ${market} market` : '';

  // Pull in what has worked before for this category
  const whatWorksNote = known?.what_works?.length
    ? ` Emphasise: ${known.what_works.join(', ')}.`
    : '';

  // Pull market-specific packaging rules if available
  const marketKey = market.toLowerCase().replace(/\s+/g, '_');
  const marketPackagingRules = marketRules[marketKey]?.join('. ') ?? '';

  // Grocery-specific composition rules
  const groceryNote = isGrocery
    ? ` ${groceryCompositionRules}. Keep to 2–3 items maximum, tightly grouped, strong silhouettes that read clearly at very small sizes.`
    : '';

  const textureNote = keyTexture ? `, with appetising highlights on the ${keyTexture}` : '';
  const notesNote = notes ? ` ${notes}.` : '';
  const marketPackagingNote = marketPackagingRules ? ` ${marketPackagingRules}.` : '';

  const positive =
    `Bright, high-resolution food photograph in Deliveroo's brand style. ` +
    `A ${category} hero food item${marketNote}, shown as takeaway at home, on a flat teal background. ` +
    `The food looks imperfect and delicious, with small crumbs and sauce drips that feel natural. ` +
    `Shot from a ${angle} view. Hands may be interacting with the food, holding it naturally. ` +
    `Lighting comes from left to right with soft, realistic shadows on the right side of the food. ` +
    `Colours are bright and natural${textureNote}. ` +
    `No text, no logos, no keylines, no overlapping dishes.` +
    whatWorksNote +
    marketPackagingNote +
    groceryNote +
    notesNote;

  // Add known issues to the negative prompt to actively avoid past problems
  const issueNegatives = known?.issues?.length
    ? ', ' + known.issues.map(i => `avoid: ${i}`).join(', ')
    : '';

  return {
    positive,
    negative: BASE_NEGATIVE + issueNegatives,
  };
}

module.exports = { buildPrompt, VALID_ANGLES };
