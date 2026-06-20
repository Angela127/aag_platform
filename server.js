import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer(async (req, res) => {
  // Parse URL
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // 1. API: /api/news
  if (pathname === '/api/news' && req.method === 'GET') {
    try {
      const rssResponse = await fetch('https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=6936');
      if (!rssResponse.ok) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Failed to fetch RSS feed: ${rssResponse.status}` }));
        return;
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
    return;
  }

  // 2. API: /api/generate
  if (pathname === '/api/generate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const { contents } = JSON.parse(body);

        // Configure Vertex AI using local credentials if present, or fallback to default GCP metadata credentials
        const credPath = path.resolve(process.cwd(), 'src/credentials/google.json');
        if (fs.existsSync(credPath)) {
          const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
          process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;
          process.env.GOOGLE_CLOUD_PROJECT = creds.project_id;
        }
        
        process.env.GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
        process.env.GOOGLE_GENAI_USE_ENTERPRISE = 'true';

        const ai = new GoogleGenAI({});
        const response = await ai.models.generateContent({
          model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
          contents: contents
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ text: response.text || '' }));
      } catch (err) {
        console.error('Vertex AI Proxy Error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || 'Error calling Vertex AI' }));
      }
    });
    return;
  }

  // 3. Serve Static Files
  // Clean pathname to prevent directory traversal
  const safePathname = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(DIST_DIR, safePathname);

  // If directory, check for index.html
  try {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch (e) {
    // If file doesn't exist, we fallback to dist/index.html (Single Page App routing)
    filePath = path.join(DIST_DIR, 'index.html');
  }

  // Read and serve file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Production server running on port ${PORT}`);
});
