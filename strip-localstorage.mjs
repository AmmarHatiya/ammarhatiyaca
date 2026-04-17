import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const outDir = '/home/user/workspace/portfolio/out';

// Collect all HTML files recursively
function getFiles(dir, ext) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(getFiles(full, ext));
    else if (full.endsWith(ext)) results.push(full);
  }
  return results;
}

// Collect all JS files recursively
const jsFiles = getFiles(outDir, '.js');
const htmlFiles = getFiles(outDir, '.html');

let totalReplacements = 0;

// --- JS files: replace localStorage.getItem/setItem with no-ops ---
for (const file of jsFiles) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Replace localStorage.getItem(...) with (()=>null)()
  // This makes any getItem call return null (theme falls back to system)
  content = content.replace(/localStorage\.getItem\(/g, '((k)=>null)(');

  // Replace localStorage.setItem(...) with a no-op
  content = content.replace(/localStorage\.setItem\(/g, '((k,v)=>{})(');

  // Replace localStorage.removeItem(...) with a no-op
  content = content.replace(/localStorage\.removeItem\(/g, '((k)=>{})(');

  // Replace addEventListener for "storage" events - make it a no-op
  // Pattern: window.addEventListener("storage", ...)
  // We'll leave this as-is since addEventListener itself isn't blocked

  if (content !== original) {
    fs.writeFileSync(file, content);
    const count = (original.match(/localStorage/g) || []).length;
    totalReplacements += count;
    console.log(`[JS] Fixed ${count} localStorage refs in: ${path.relative(outDir, file)}`);
  }
}

// --- HTML files: replace inline script localStorage references ---
for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // The next-themes inline script pattern typically looks like:
  // (function(e,t,r,n,o,l,a,i){...localStorage.getItem(t)||r...})("class","theme","system",...)
  // We need to replace localStorage calls within these inline scripts

  // Replace localStorage.getItem(...) with null coalescing to default
  content = content.replace(/localStorage\.getItem\(/g, '((k)=>null)(');
  content = content.replace(/localStorage\.setItem\(/g, '((k,v)=>{})(');
  content = content.replace(/localStorage\.removeItem\(/g, '((k)=>{})(');

  if (content !== original) {
    fs.writeFileSync(file, content);
    const count = (original.match(/localStorage/g) || []).length;
    totalReplacements += count;
    console.log(`[HTML] Fixed ${count} localStorage refs in: ${path.relative(outDir, file)}`);
  }
}

console.log(`\nTotal localStorage references replaced: ${totalReplacements}`);

// Verify no localStorage remains
let remaining = 0;
for (const file of [...jsFiles, ...htmlFiles]) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/localStorage/g);
  if (matches) {
    remaining += matches.length;
    console.log(`WARNING: ${matches.length} localStorage refs still in: ${path.relative(outDir, file)}`);
  }
}
if (remaining === 0) {
  console.log('✓ All localStorage references successfully removed!');
} else {
  console.log(`✗ ${remaining} localStorage references still remain!`);
}
