/**
 * Test Seedream 4.0 Integration
 * Tests the 11-parameter system in OpenAI service
 */

import { enhancePrompt, detectUsedParameters } from './src/services/openai.service.js';
import config from './src/config/index.js';

console.log('🧪 TESTING SEEDREAM 4.0 INTEGRATION\n');

// Test cases
const testCases = [
  {
    name: 'Simple Dating Prompt',
    prompt: 'Фото дівчини в кафе',
    context: {
      category: 'dating',
      insights: {
        likes: [
          { keyword: 'гарна посмішка', count: 3 },
          { keyword: 'натуральне освітлення', count: 2 }
        ],
        dislikes: [
          { keyword: 'штучні фільтри', count: 1 }
        ]
      }
    }
  },
  {
    name: 'Variation Test',
    prompt: 'Фото дівчини яка пригає у воду в купальнику',
    context: {
      category: 'dating',
      variationIndex: 1,
      insights: {
        likes: [
          { keyword: 'динамічна поза', count: 2 },
          { keyword: 'природне тло', count: 3 }
        ],
        dislikes: []
      }
    }
  }
];

async function runTests() {
  console.log('📋 Test Configuration:');
  console.log('   OpenAI API Key:', config.openai.apiKey ? '✅ Set' : '❌ Missing');
  console.log('   Test Cases:', testCases.length);
  console.log('\n' + '='.repeat(80) + '\n');
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n🧪 TEST ${i + 1}: ${testCase.name}`);
    console.log('─'.repeat(80));
    console.log('Input Prompt:', testCase.prompt);
    console.log('Context:', JSON.stringify(testCase.context, null, 2));
    
    try {
      const result = await enhancePrompt(testCase.prompt, testCase.context);
      
      if (result.success) {
        console.log('\n✅ TEST PASSED');
        console.log('\n📝 ENHANCED PROMPT:');
        console.log(result.enhancedPrompt);
        
        console.log('\n📊 SEEDREAM ANALYSIS:');
        console.log('   Parameters Used:', result.meta.seedream.parametersUsed, '/ 11');
        console.log('   Parameters List:', result.meta.seedream.parametersList.join(', '));
        console.log('   Optimal Count:', result.meta.seedream.isOptimal ? '✅ Yes' : '⚠️  No');
        console.log('   Has Smartphone Style:', result.meta.seedream.hasSmartphoneStyle ? '✅ Yes' : '❌ No');
        console.log('   Has Subject:', result.meta.seedream.hasSubject ? '✅ Yes' : '❌ No');
        
        console.log('\n📈 METRICS:');
        console.log('   Duration:', result.meta.duration, 'ms');
        console.log('   Tokens:', result.meta.tokens);
        console.log('   Original Length:', result.meta.originalLength, 'chars');
        console.log('   Enhanced Length:', result.meta.enhancedLength, 'chars');
        console.log('   Growth:', `+${result.meta.enhancedLength - result.meta.originalLength} chars`);
      } else {
        console.log('\n❌ TEST FAILED');
        console.log('Error:', result.error);
      }
    } catch (error) {
      console.log('\n❌ TEST ERROR');
      console.error(error);
    }
    
    console.log('\n' + '='.repeat(80) + '\n');
    
    // Wait 2 seconds between tests to avoid rate limiting
    if (i < testCases.length - 1) {
      console.log('⏳ Waiting 2 seconds before next test...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n✅ ALL TESTS COMPLETED');
}

// Test parameter detection separately
function testParameterDetection() {
  console.log('\n🔍 TESTING PARAMETER DETECTION\n');
  
  const samplePrompts = [
    'IMG_5847.HEIC, iPhone 14 Pro, 2023 casual aesthetic. A 26-year-old woman with shoulder-length blonde hair and subtle freckles, genuine smile while sitting at a café table. Close-up shot from slightly above eye level, subject positioned using rule of thirds. Soft natural window light from the left creating gentle shadows on the right side of face. Warm, inviting atmosphere with slightly boosted saturation. Slight motion blur on hands, small lens flare visible in upper right corner.',
    'Young woman in casual summer dress walking through a sunlit park path.',
    'IMG_2847.JPG, iPhone 6, 2014, Instagram Valencia filter applied. 22-year-old woman in high-waisted jeans and crop top at music festival.'
  ];
  
  samplePrompts.forEach((prompt, idx) => {
    console.log(`\nSample ${idx + 1}:`);
    console.log('Prompt:', prompt.substring(0, 100) + '...');
    
    const analysis = detectUsedParameters(prompt);
    console.log('Parameters Used:', analysis.usedCount, '/ 11');
    console.log('List:', analysis.usedList.join(', '));
    console.log('─'.repeat(80));
  });
}

// Run tests
if (!config.openai.apiKey) {
  console.log('❌ ERROR: OpenAI API key not configured');
  console.log('Please set OPENAI_API_KEY in environment variables');
  process.exit(1);
}

console.log('Starting tests...\n');
testParameterDetection();

runTests()
  .then(() => {
    console.log('\n✅ Test suite completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  });
