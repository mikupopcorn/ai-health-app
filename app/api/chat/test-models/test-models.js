// test-models.js
const API_KEY = 'AIzaSyDuDwEsxxIEJPhyyb3SNxOBIFfMv9FCufw'; // Replace with your real API key

async function discoverModels() {
  console.log('🔍 Discovering available models...');
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );

    console.log('📡 Response Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Available models:');
      
      const availableModels = data.models
        .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
        .map(model => ({
          name: model.name,
          displayName: model.displayName,
          methods: model.supportedGenerationMethods
        }));
      
      availableModels.forEach(model => {
        console.log(`📝 ${model.name} - ${model.displayName}`);
      });
      
      if (availableModels.length === 0) {
        console.log('❌ No models found with generateContent support');
      }
    } else {
      const error = await response.text();
      console.log('❌ Failed to fetch models:', error);
    }
  } catch (error) {
    console.log('💥 Connection Error:', error.message);
  }
}

discoverModels();