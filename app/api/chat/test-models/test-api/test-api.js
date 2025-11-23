const API_KEY = 'AIzaSyBTZdmp118TkgKgFsE3DNo_p4CQhOowDRIAIzaSyBTZdmp118TkgKgFsE3DNo_p4CQhOowDRI'; // Replace with your real key

async function testAPI() {
  console.log('🔍 Testing Google Gemini API...');
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Hello! Please respond with "API is working!"'
                }
              ]
            }
          ]
        }),
      }
    );

    console.log('📡 Response Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Response:', data.candidates[0].content.parts[0].text);
    } else {
      const error = await response.text();
      console.log('❌ API FAILED:', error);
    }
  } catch (error) {
    console.log('💥 Connection Error:', error.message);
  }
}

testAPI();