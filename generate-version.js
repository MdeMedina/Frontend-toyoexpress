// generate-version.js
const fs = require('fs');
const path = require('path');

const version = Date.now(); // O usa un hash de Git si prefieres

const versionData = { version };

fs.writeFileSync(
  path.join(__dirname, 'build', 'version.json'),
  JSON.stringify(versionData)
);
console.log(`Version ${version} generated and saved to build/version.json`);