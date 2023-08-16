const fs = require('fs');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const readline = require('readline');

if (process.argv.length !== 3) {
  console.error('Usage: node urls.js FILENAME');
  process.exit(1);
}

const fileName = process.argv[2];

function saveHtmlToFile(url, html) {
  const parsedUrl = new URL(url);
  const outputFileName = parsedUrl.hostname;
  const outputPath = `${outputFileName}.html`;

  fs.writeFile(outputPath, html, (err) => {
    if (err) {
      console.error(`Couldn't download ${outputPath}: ${err.message}`);
    } else {
      console.log(`Wrote to ${outputPath}`);
    }
  });
}

function downloadUrl(url) {
  const httpModule = url.startsWith('https') ? https : http;

  httpModule.get(url, (response) => {
    let html = '';

    response.on('data', (chunk) => {
      html += chunk;
    });

    response.on('end', () => {
      saveHtmlToFile(url, html);
    });
  }).on('error', (err) => {
    console.error(`Couldn't download ${url}: ${err.message}`);
  });
}

try {
  const fileStream = fs.createReadStream(fileName);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  rl.on('line', (line) => {
    const url = line.trim();
    downloadUrl(url);
  });

  rl.on('close', () => {
    console.log('All URLs processed.');
  });
} catch (err) {
  console.error(`Error reading ${fileName}: ${err.message}`);
}
