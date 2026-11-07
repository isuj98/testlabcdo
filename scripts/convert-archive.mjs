// Turns the archived WordPress/Divi homepage into local Astro partials.
// Usage: node scripts/convert-archive.mjs <archived.html> <dir with et-cache css>
// Re-run whenever a newer capture is found; it overwrites src/divi/* and public/divi/site.css.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

const [src, cssDir] = process.argv.slice(2);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let html = fs.readFileSync(src, 'utf8');

// Cloudflare email obfuscation: hex string, first byte is the XOR key.
const decode = (hex) => { const k = parseInt(hex.slice(0, 2), 16); let o = ''; for (let i = 2; i < hex.length; i += 2) o += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ k); return o; };
assert.equal(decode('06726375726a676465626946616b676f6a2865696b'), 'testlabcdo@gmail.com');

const localize = (s) => s
  .replace(/<span class="__cf_email__" data-cfemail="([0-9a-f]+)">\[email&#160;protected\]<\/span>/g, (_, h) => decode(h))
  .replace(/\/cdn-cgi\/l\/email-protection#([0-9a-f]+)/g, (_, h) => 'mailto:' + decode(h))
  .replace(/\s(srcset|sizes)="[^"]*"/g, '')
  .replace(/(https?:)?\/\/testlabcdo\.com\/wp-content\/uploads\/\d{4}\/\d{2}\//g, '/images/')
  .replace(/(https?:)?\/\/testlabcdo\.com\/wp-content\/themes\/Divi\/core\/admin\/fonts\/modules\/all\//g, '/divi/fonts/')
  .replace(/https?:\/\/(www\.)?testlabcdo\.com\//g, '/')
  // shortcut: the WordPress form handler is gone; mailto opens the visitor's mail app. Swap for a form service once hosted.
  .replace('<form class="et_pb_contact_form clearfix" method="post" action="/">', '<form class="et_pb_contact_form clearfix" method="post" action="mailto:testlabcdo@gmail.com" enctype="text/plain">')
  .replace(/<input type="hidden"[^>]*name="(_wpnonce[^"]*|_wp_http_referer)"[^>]*\/>/g, '')
  .replace(/<input type="hidden" name="_wp_http_referer"[^>]*\/>/g, '');

// CSS in document order: inline <style> blocks plus the Divi et-cache files that were archived.
const head = html.slice(0, html.indexOf('<body'));
const keepLinks = ['et-divi-dynamic', 'et-core-unified'];
let css = '';
for (const m of head.matchAll(/<style[^>]*>([\s\S]*?)<\/style>|<link[^>]+href=['"]([^'"]+)['"][^>]*>/g)) {
  if (m[1] !== undefined) { css += m[1] + '\n'; continue; }
  const href = m[2];
  if (!/stylesheet/.test(m[0]) || !keepLinks.some((k) => href.includes(k))) continue;
  const file = path.join(cssDir, path.basename(href.split('?')[0]));
  css += fs.readFileSync(file, 'utf8') + '\n';
}
// Divi's JS fades these in on scroll; without it they would stay invisible.
css += '.et_animated{opacity:1!important;animation:none!important}\n';
fs.mkdirSync(path.join(root, 'public/divi'), { recursive: true });
fs.writeFileSync(path.join(root, 'public/divi/site.css'), localize(css));

const slice = (a, b) => { const i = html.indexOf(a); const j = html.indexOf(b, i); assert(i > 0 && j > i, `markers ${a}..${b}`); return html.slice(i, j + b.length); };
const out = path.join(root, 'src/divi');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'header.html'), localize(slice('<header class="et-l et-l--header">', '</header>')));
fs.writeFileSync(path.join(out, 'footer.html'), localize(slice('<footer class="et-l et-l--footer">', '</footer>')));
const article = localize(slice('<article id="post-24"', '</article>'));
fs.writeFileSync(path.join(out, 'home.html'), article);
// Contact block (last section) is reused on /contact-us/ and the subpages.
const contactStart = article.indexOf('<div class="et_pb_section et_pb_section_5');
fs.writeFileSync(path.join(out, 'contact.html'), article.slice(contactStart, article.lastIndexOf('</div>', article.lastIndexOf('</article>'))));
fs.writeFileSync(path.join(out, 'body-class.txt'), html.match(/<body class="([^"]*)"/)[1].replace(/\bosx\b/, ''));

const left = (fs.readFileSync(path.join(out, 'home.html'), 'utf8') + css).match(/testlabcdo\.com|cdn-cgi/g);
console.log('done; leftover remote refs:', left ? left.length : 0);
