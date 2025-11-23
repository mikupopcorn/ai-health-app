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
          description: model.description,
          methods: model.supportedGenerationMethods
        }));
      
      console.log('\n📋 Models with generateContent support:');
      availableModels.forEach(model => {
        console.log(`\n📝 ${model.name}`);
        console.log(`   ${model.displayName}`);
        console.log(`   ${model.description}`);
      });
      
      if (availableModels.length === 0) {
        console.log('\n❌ No models found with generateContent support');
        console.log('💡 Try enabling Gemini API in Google Cloud Console');
      } else {
        console.log(`\n🎯 Total available models: ${availableModels.length}`);
        console.log('💡 Use the exact model names above in your API calls');
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