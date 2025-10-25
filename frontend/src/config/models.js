/**
 * Models configuration for frontend (matches backend)
 */

export const MODELS_CONFIG = {
  image: {
    'seedream-4': {
      name: 'Seedream 4',
      description: 'Висока якість, 2K роздільна здатність',
      price: '$0.03',
      speed: 'Середньо (~1 хв)',
      isDefault: true
    },
    'flux-schnell': {
      name: 'FLUX Schnell',
      description: 'Швидка генерація',
      price: '$0.003',
      speed: 'Швидко (~30 сек)'
    },
    'flux-dev': {
      name: 'FLUX Dev',
      description: 'Деталізовані зображення',
      price: '$0.025',
      speed: 'Повільно (~2 хв)'
    },
    'sdxl': {
      name: 'Stable Diffusion XL',
      description: 'Стабільна генерація',
      price: '$0.008',
      speed: 'Середньо (~1 хв)'
    }
  },
  
  video: {
    'ltx-video': {
      name: 'LTX Video',
      description: 'Рекомендовано для відео',
      price: '$0.05',
      speed: '~1-2 хв',
      isDefault: true
    },
    'cogvideox': {
      name: 'CogVideoX-5B',
      description: 'Висока якість відео',
      price: '$0.03',
      speed: '~2-3 хв'
    },
    'svd': {
      name: 'Stable Video Diffusion',
      description: 'Відео з зображення',
      price: '$0.08',
      speed: '~3-4 хв'
    }
  },
  
  audio: {
    'lyria-2': {
      name: 'Google Lyria 2',
      description: 'Рекомендовано для музики',
      price: '$0.03',
      speed: '~30-60 сек',
      isDefault: true
    },
    'musicgen': {
      name: 'MusicGen (Meta)',
      description: 'Музика та звуки',
      price: '$0.05',
      speed: '~1-2 хв'
    },
    'riffusion': {
      name: 'Riffusion',
      description: 'Музика з тексту',
      price: '$0.03',
      speed: '~30-60 сек'
    }
  },
  
  text: {
    'gpt-4o': {
      name: 'GPT-4o',
      description: 'Розширена генерація тексту',
      price: '$0.01',
      speed: '~5 сек',
      isDefault: true
    }
  }
};

export const CONTENT_TYPES = [
  { value: 'image', label: '🖼️ Зображення', icon: '🖼️' },
  { value: 'video', label: '🎥 Відео', icon: '🎥' },
  { value: 'audio', label: '🎵 Аудіо', icon: '🎵' },
  { value: 'text', label: '📝 Текст', icon: '📝' }
];

export function getDefaultModel(contentType) {
  const models = MODELS_CONFIG[contentType];
  if (!models) return null;
  
  const defaultModel = Object.entries(models).find(([key, model]) => model.isDefault);
  return defaultModel ? defaultModel[0] : Object.keys(models)[0];
}

export function getModelsForType(contentType) {
  return MODELS_CONFIG[contentType] || {};
}

export default MODELS_CONFIG;
