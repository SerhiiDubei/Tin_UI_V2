import Replicate from 'replicate';
import config from '../config/index.js';
import { getModelConfig } from '../config/models.js';

const replicate = new Replicate({
  auth: config.replicate.apiToken
});

/**
 * Generate content using Replicate (unified function)
 */
export async function generateContent(prompt, contentType, modelKey, customParams = {}) {
  try {
    const modelConfig = getModelConfig(contentType, modelKey);
    
    if (!modelConfig) {
      throw new Error(`Model ${modelKey} not found for content type ${contentType}`);
    }

    console.log(`Generating ${contentType} with model ${modelConfig.name}...`);
    console.log(`Replicate ID: ${modelConfig.replicateId}`);

    // Build model identifier
    let modelIdentifier = modelConfig.replicateId;
    if (modelConfig.version && modelConfig.version !== 'latest') {
      modelIdentifier = `${modelConfig.replicateId}:${modelConfig.version}`;
    }

    // Merge params: default model params + custom params
    const inputParams = {
      prompt: prompt,
      ...modelConfig.params,
      ...customParams
    };

    console.log('Input params:', inputParams);

    // Run prediction
    const output = await replicate.run(modelIdentifier, {
      input: inputParams
    });

    console.log('Generation output:', output);

    // Extract URL from output
    let url;
    if (Array.isArray(output)) {
      url = output[0];
    } else if (typeof output === 'string') {
      url = output;
    } else if (output && output.url) {
      url = output.url;
    } else {
      url = output;
    }

    return {
      success: true,
      url: url,
      model: modelConfig.name,
      modelKey: modelKey,
      contentType: contentType
    };

  } catch (error) {
    console.error(`${contentType} generation error:`, error);
    return {
      success: false,
      error: error.message,
      contentType: contentType
    };
  }
}

/**
 * Generate image using Replicate (backward compatibility)
 */
export async function generateImage(prompt, modelParams = {}) {
  const modelKey = modelParams.modelKey || 'seedream-4';
  return generateContent(prompt, 'image', modelKey, modelParams);
}

/**
 * Generate video using Replicate (backward compatibility)
 */
export async function generateVideo(prompt, modelParams = {}) {
  const modelKey = modelParams.modelKey || 'ltx-video';
  return generateContent(prompt, 'video', modelKey, modelParams);
}

/**
 * Generate audio using Replicate
 */
export async function generateAudio(prompt, modelParams = {}) {
  const modelKey = modelParams.modelKey || 'lyria-2';
  return generateContent(prompt, 'audio', modelKey, modelParams);
}

/**
 * Batch generation - generate multiple items
 */
export async function batchGenerate(prompt, contentType, modelKey, count = 1, customParams = {}) {
  try {
    console.log(`Batch generating ${count} ${contentType} items...`);
    
    const promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(generateContent(prompt, contentType, modelKey, customParams));
    }

    const results = await Promise.all(promises);
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    return {
      success: failed.length === 0,
      total: count,
      successful: successful.length,
      failed: failed.length,
      results: results
    };

  } catch (error) {
    console.error('Batch generation error:', error);
    return {
      success: false,
      error: error.message,
      total: count,
      successful: 0,
      failed: count
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
  generateContent,
  generateImage,
  generateVideo,
  generateAudio,
  batchGenerate,
  checkPrediction
};
