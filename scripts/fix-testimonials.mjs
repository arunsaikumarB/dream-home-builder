import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

const testimonialsSection = `<section id="testimonials" data-bg="dark" class="section clip theme_on-dark dhb-block">
  <div class="dhb-inner">
    <div class="dhb-head">
      <h2 data-scroll-reveal="h" class="h1 a-center">Testimonials</h2>
      <p data-scroll-reveal="p" class="p1 a-center">Action speaks louder than the words! Our work speaks for itself, but our clients say it even better.</p>
    </div>
    <div class="dhb-testimonials-grid">
      <article class="dhb-testimonial" data-scroll-reveal="p">
        <div class="stars" aria-label="5 stars">★★★★★</div>
        <p class="h5 quote">“Dileep’s honesty was refreshing. We did a full kitchen remodel, and he was upfront about costs and timelines from day one. Highly recommend!”</p>
        <div class="who l1">Sarah J. · Kitchen Remodel</div>
      </article>
      <article class="dhb-testimonial" data-scroll-reveal="p">
        <div class="stars" aria-label="5 stars">★★★★★</div>
        <p class="h5 quote">“Building a new home is stressful, but Dileep’s responsiveness made it manageable. He always answered his phone, even for the smallest questions.”</p>
        <div class="who l1">Madhu D. · New Construction</div>
      </article>
      <article class="dhb-testimonial" data-scroll-reveal="p">
        <div class="stars" aria-label="5 stars">★★★★★</div>
        <p class="h5 quote">“The fast turnaround on our bathroom upgrade was incredible. Dileep's dedication to finishing on schedule while maintaining quality was impressive.”</p>
        <div class="who l1">Elena R. · Bathroom Upgrade</div>
      </article>
      <article class="dhb-testimonial" data-scroll-reveal="p">
        <div class="stars" aria-label="5 stars">★★★★★</div>
        <p class="h5 quote">“Dileep is a true professional. He guided us through our patio upgrade with great care. His communication was top-notch throughout the process.”</p>
        <div class="who l1">David L. · Outdoor Living</div>
      </article>
      <article class="dhb-testimonial" data-scroll-reveal="p">
        <div class="stars" aria-label="5 stars">★★★★★</div>
        <p class="h5 quote">“We needed a major structural wall removed to create an open concept. Dileep handled the engineering and permits seamlessly. Truly expert work.”</p>
        <div class="who l1">Priya K. · Structural Renovation</div>
      </article>
      <article class="dhb-testimonial" data-scroll-reveal="p">
        <div class="stars" aria-label="5 stars">★★★★★</div>
        <p class="h5 quote">“Our custom basement finished ahead of schedule. Dileep has a great eye for detail and suggested a layout we hadn't even considered. We love it!”</p>
        <div class="who l1">Linda K. · Basement Finishing</div>
      </article>
      <article class="dhb-testimonial" data-scroll-reveal="p">
        <div class="stars" aria-label="5 stars">★★★★★</div>
        <p class="h5 quote">“Professional, clean, and reliable. Dream Home Builders transformed our old siding and roof. The house looks brand new again. Exceptional value.”</p>
        <div class="who l1">Robert P. · Exterior Remodel</div>
      </article></div>
  </div>
</section>

`

if (html.includes('id="testimonials"')) {
  html = html.replace(
    /<section id="testimonials"[\s\S]*?<\/section>/,
    testimonialsSection.trim(),
  )
} else {
  // Insert before contact after gallery script
  if (!html.includes('src="/js/dhb-projects.js"')) {
    console.error('gallery script missing')
    process.exit(1)
  }
  html = html.replace(
    /(<script src="\/js\/dhb-projects\.js" defer><\/script>\s*)/,
    `$1\n${testimonialsSection}`,
  )
}

const divDiff =
  (html.match(/<div\b/g) || []).length - (html.match(/<\/div>/g) || []).length

fs.writeFileSync(path, html)
console.log({
  divDiff,
  hasTestimonials: html.includes('id="testimonials"'),
  robert: html.includes('Robert P.'),
  contactAfter: html.indexOf('id="testimonials"') < html.indexOf('id="contact"'),
})
