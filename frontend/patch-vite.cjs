const fs = require('fs');
const path = require('path');

const chunkPath = path.join(__dirname, 'node_modules', 'vite', 'dist', 'node', 'chunks', 'dep-BK3b2jBa.js');
if (fs.existsSync(chunkPath)) {
  let content = fs.readFileSync(chunkPath, 'utf8');
  const target = 'if (fsevents) {';
  const safeCheck = 'if (fsevents && typeof fsevents.watch !== "function") { fsevents = undefined; }\nif (fsevents) {';
  if (!content.includes('typeof fsevents.watch') && content.includes(target)) {
    content = content.replace(target, safeCheck);
    fs.writeFileSync(chunkPath, content, 'utf8');
    console.log('Patched Vite fsevents watcher.');
  }
}
