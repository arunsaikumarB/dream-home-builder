import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
const ids = [...h.matchAll(/<(?:section|footer)[^>]*\bid="([^"]+)"/g)].map((m) => m[1])
console.log(
  'key ids:',
  ids.filter((id) =>
    [
      'hero',
      'services',
      'inspired',
      'testimonials',
      'contact',
      'quote',
      'portfolio-scene',
      'dhb-site-footer',
    ].includes(id),
  ),
)
console.log({
  robert: h.includes('Robert P.'),
  formspree: (h.match(/formspree\.io\/f\//g) || []).length,
  emptyGallery: /id="dhb-gallery">\s*<\/div>/.test(h),
  lightbox: h.includes('dhb-lightbox'),
  footer: h.includes('dhb-site-footer'),
  success: fs.existsSync('public/success.html'),
  projectsJs: fs.existsSync('public/js/dhb-projects.js'),
  elev: fs.readdirSync('public/images/projects/elevation').length,
  kitchen: fs.readdirSync('public/images/projects/kitchen').length,
  bath: fs.readdirSync('public/images/projects/bathroom').length,
  divDiff:
    (h.match(/<div\b/g) || []).length - (h.match(/<\/div>/g) || []).length,
})
