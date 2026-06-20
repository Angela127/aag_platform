import * as jose from 'jose';
import googleCreds from '../credentials/google.json';

const PROJECT_ID = googleCreds.project_id || 'advisoralliancegroup';
const LOCATION = 'us-central1';
const MODEL = 'gemini-2.5-flash';

let cachedToken = null;
let tokenExpiry = 0;

/**
 * Manually sign a JWT and exchange it for a Google OAuth Access Token.
 * Required because standard Google SDKs do not work in the browser with google.json.
 */
async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && tokenExpiry > now + 60) {
    return cachedToken;
  }

  try {
    const privateKeyStr = googleCreds.private_key;
    const clientEmail = googleCreds.client_email;

    // Parse the private key
    const privateKey = await jose.importPKCS8(privateKeyStr, 'RS256');

    // Create the JWT payload
    const payload = {
      iss: clientEmail,
      sub: clientEmail,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600, // Valid for 1 hour
      scope: 'https://www.googleapis.com/auth/cloud-platform',
    };

    // Sign the JWT
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
      .sign(privateKey);

    // Exchange JWT for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get access token: ${await tokenResponse.text()}`);
    }

    const tokenData = await tokenResponse.json();
    cachedToken = tokenData.access_token;
    tokenExpiry = now + tokenData.expires_in;

    return cachedToken;
  } catch (error) {
    console.error('Error generating Google OAuth token:', error);
    throw error;
  }
}

/**
 * Call the Vertex AI REST API using the manually generated access token.
 */
export async function generateVertexContent(promptText) {
  const token = await getAccessToken();

  const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: promptText }]
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Vertex AI API error: ${await response.text()}`);
  }

  const data = await response.json();
  
  // Extract text from the Gemini response structure
  try {
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error('Failed to parse Vertex response', data);
    return "Error parsing response";
  }
}
