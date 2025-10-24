import Replicate from 'replicate';
import config from '../config/index.js';

const replicate = new Replicate({
  auth: config.replicate.apiToken
});

/**
 * Generate image using Replicate
 */
export async function generateImage(prompt, modelParams = {}) {
  try {
    const model = modelParams.model || 'bytedance/sdxl-lightning-4step';
    
    const output = await replicate.run(model, {
      input: {
        prompt: prompt,
        num_outputs: 1,
        ...modelParams
      }
    });
    
    // Output is usually an array of URLs
    const imageUrl = Array.isArray(output) ? output[0] : output;
    
    return {
      success: true,
      url: imageUrl,
      model: model
    };
  } catch (error) {
    console.error('Replicate generation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate video using Replicate
 */
export async function generateVideo(prompt, modelParams = {}) {
  try {
    const model = modelParams.model || 'anotherjesse/zeroscope-v2-xl';
    
    const output = await replicate.run(model, {
      input: {
        prompt: prompt,
        ...modelParams
      }
    });
    
    const videoUrl = Array.isArray(output) ? output[0] : output;
    
    return {
      success: true,
      url: videoUrl,
      model: model
    };
  } catch (error) {
    console.error('Video generation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Check if generation is complete
 */
export async function checkPrediction(predictionId) {
  try {
    const prediction = await replicate.predictions.get(predictionId);
    return prediction;
  } catch (error) {
    console.error('Prediction check error:', error);
    return null;
  }
}

export default {
  generateImage,
  generateVideo,
  checkPrediction
};
