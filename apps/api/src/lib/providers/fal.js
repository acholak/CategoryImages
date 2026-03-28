'use strict';

const { fal } = require('@fal-ai/client');

const name = 'fal';

fal.config({ credentials: () => process.env.IMAGE_API_KEY });

/**
 * Generate a single image via fal.ai FLUX and strip its background.
 * @param {{ positive: string, negative: string }} prompt
 * @returns {Promise<string>} public URL of a PNG with transparent background
 */
async function generateImage({ positive, negative }) {
  // Step 1: generate image with FLUX
  const result = await fal.subscribe('fal-ai/flux/dev', {
    input: {
      prompt: positive,
      negative_prompt: negative,
      image_size: 'square_hd',
      num_images: 1,
      output_format: 'png',
    },
  });

  const imageUrl = result.data.images[0].url;

  // Step 2: remove background
  const rbResult = await fal.subscribe('fal-ai/imageutils/rembg', {
    input: { image_url: imageUrl },
  });

  return rbResult.data.image.url;
}

module.exports = { name, generateImage };
