import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('--- Building application ---');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

// Add .nojekyll so GitHub Pages doesn't ignore files starting with underscore
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

console.log('--- Publishing to gh-pages branch ---');
const distGit = path.join(distDir, '.git');
if (fs.existsSync(distGit)) {
  fs.rmSync(distGit, { recursive: true, force: true });
}

execSync('git init -b gh-pages', { cwd: distDir, stdio: 'inherit' });
execSync('git config user.email "kristofvrn@users.noreply.github.com"', { cwd: distDir, stdio: 'inherit' });
execSync('git config user.name "KristoFVRN"', { cwd: distDir, stdio: 'inherit' });
execSync('git add -A', { cwd: distDir, stdio: 'inherit' });
execSync('git commit -m "Deploy PWA app to GitHub Pages"', { cwd: distDir, stdio: 'inherit' });
execSync('git remote add origin https://github.com/KristoFVRN/grani-app.git', { cwd: distDir, stdio: 'inherit' });
execSync('git push -f origin gh-pages', { cwd: distDir, stdio: 'inherit' });

console.log('--- Successfully deployed to gh-pages! ---');
