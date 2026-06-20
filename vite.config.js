import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { GoogleGenAI } from '@google/genai'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'gemini-vertex-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/generate' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', async () => {
              try {
                const { contents, systemInstruction } = JSON.parse(body);

                // Configure Vertex AI using local google.json credentials
                const credPath = path.resolve(process.cwd(), 'src/credentials/google.json');
                if (!fs.existsSync(credPath)) {
                  throw new Error(`Google credentials file not found at ${credPath}`);
                }

                const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
                
                process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;
                process.env.GOOGLE_CLOUD_PROJECT = creds.project_id;
                process.env.GOOGLE_CLOUD_LOCATION = 'us-central1';
                process.env.GOOGLE_GENAI_USE_ENTERPRISE = 'true';

                const ai = new GoogleGenAI({});

                const requestPayload = {
                  model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
                  contents: contents,
                  config: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                    topP: 0.9,
                  },
                };

                // Use systemInstruction if provided
                if (systemInstruction) {
                  requestPayload.config.systemInstruction = systemInstruction;
                }

                const response = await ai.models.generateContent(requestPayload);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ text: response.text || '' }));
              } catch (err) {
                console.error('Vertex AI Proxy Error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message || 'Error calling Vertex AI' }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
})

