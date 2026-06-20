/**
 * Call the local backend Vertex AI proxy endpoint instead of signing JWTs client-side.
 * This simplifies dependencies (removing 'jose') and secures credentials.
 */
export async function generateVertexContent(promptText) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }]
        }
      ]
    }),
  });

  if (!response.ok) {
    throw new Error(`Proxy error: ${await response.text()}`);
  }

  const data = await response.json();
  return data.text || '';
}
