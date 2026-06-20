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
          if (req.url === '/api/news' && req.method === 'GET') {
            try {
              const rssResponse = await fetch('https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=6936');
              if (!rssResponse.ok) {
                throw new Error(`Failed to fetch RSS feed: ${rssResponse.status}`);
              }
              const xmlText = await rssResponse.text();
              
              const items = [];
              const itemRegex = /<item>([\s\S]*?)<\/item>/g;
              let match;
              while ((match = itemRegex.exec(xmlText)) !== null) {
                const itemContent = match[1];
                
                // Parse Title
                let title = (itemContent.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/) || [])[1] || '';
                title = title.trim();
                
                // Parse Link
                let link = (itemContent.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
                link = link.trim();
                
                // Parse Description
                let description = (itemContent.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/) || [])[1] || '';
                description = description.trim();
                
                // Parse PubDate
                let pubDate = (itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
                pubDate = pubDate.trim();
                
                if (title) {
                  // Determine Category based on title/description keywords
                  let category = 'Finance & Markets';
                  let categoryClass = 'badgeRegulation';
                  
                  const combinedText = (title + ' ' + description).toLowerCase();
                  if (combinedText.includes('property') || combinedText.includes('housing') || combinedText.includes('real estate') || combinedText.includes('absd') || combinedText.includes('hdb') || combinedText.includes('condo')) {
                    category = 'Real Estate';
                    categoryClass = 'badgeRealEstate';
                  } else if (combinedText.includes('mas') || combinedText.includes('guideline') || combinedText.includes('regulat') || combinedText.includes('compliance') || combinedText.includes('rules')) {
                    category = 'Regulation';
                    categoryClass = 'badgeRegulation';
                  } else if (combinedText.includes('cpf') || combinedText.includes('retirement') || combinedText.includes('annuity') || combinedText.includes('annuities') || combinedText.includes('pension')) {
                    category = 'CPF & Annuities';
                    categoryClass = 'badgeCPFAnnuities';
                  } else if (combinedText.includes('tax') || combinedText.includes('income tax') || combinedText.includes('gst')) {
                    category = 'Tax & Compliance';
                    categoryClass = 'badgeRegulation';
                  } else if (combinedText.includes('estate planning') || combinedText.includes('will ') || combinedText.includes('trust') || combinedText.includes('legacy')) {
                    category = 'Estate Planning';
                    categoryClass = 'badgeEstatePlanning';
                  }
                  
                  // Construct a realistic full text if description is empty or too short
                  const fullText = description && description.length > 50 
                    ? description 
                    : `${title}. This development is expected to have significant implications for financial planning, wealth management, and strategic asset allocation strategies within Singapore and the broader Asian markets. Advisors are encouraged to review their portfolios and coordinate with relevant stakeholders.`;
                  
                  const dateObj = new Date(pubDate);
                  const formattedDate = isNaN(dateObj.getTime()) 
                    ? pubDate 
                    : dateObj.toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });

                  items.push({
                    id: `live-${items.length}`,
                    title,
                    source: 'CNA Business',
                    date: formattedDate,
                    category,
                    categoryClass,
                    snippet: description.substring(0, 150) || `${title.substring(0, 100)}...`,
                    fullText: fullText,
                    link
                  });
                }
              }
              
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ articles: items.slice(0, 6) }));
            } catch (err) {
              console.error('RSS Fetch/Parse Error:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message || 'Error fetching news' }));
            }
          } else if (req.url === '/api/generate' && req.method === 'POST') {
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

