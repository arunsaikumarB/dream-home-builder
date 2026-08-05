import { FormEvent, useEffect, useMemo, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import {
  brand,
  galleryCategories,
  heroSlides,
  nav,
  quoteServices,
  services,
  testimonials,
} from './data'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const [category, setCategory] = useState<(typeof galleryCategories)[number]['id']>('elevation')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [contactMode, setContactMode] = useState<'in-person' | 'virtual'>('in-person')
  const [formStatus, setFormStatus] = useState('')

  const activeHero = heroSlides[heroIndex]
  const activeGallery = useMemo(
    () => galleryCategories.find((item) => item.id === category) ?? galleryCategories[0],
    [category],
  )

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    const reveals = gsap.utils.toArray<HTMLElement>('.reveal')
    reveals.forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
        },
      })
    })

    return () => {
      gsap.ticker.remove(ticker)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length)
    }, 6500)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen || lightbox !== null ? 'hidden' : ''
  }, [menuOpen, lightbox])

  function closeMenu() {
    setMenuOpen(false)
  }

  function onQuoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormStatus('Thanks — your quote request is ready to send. We’ll follow up shortly.')
    event.currentTarget.reset()
  }

  function onContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormStatus('Message received. Our team will get back to you soon.')
    event.currentTarget.reset()
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#hero" aria-label="Dream Home Builders home">
          <img src="/images/dhb.png" alt="" />
          <span className="brand-name">Dream Home Builders</span>
        </a>
        <nav className="nav-desktop" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className={item.href === '#quote' ? 'is-cta' : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
        <button className="menu-btn" type="button" onClick={() => setMenuOpen(true)}>
          Menu
        </button>
      </header>

      <div className={`menu-overlay${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <button className="menu-close" type="button" onClick={closeMenu}>
          Close
        </button>
        <nav>
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <main>
        <section className="hero" id="hero">
          <div className="hero-media" aria-hidden="true">
            {heroSlides.map((slide, index) => (
              <img
                key={slide.image}
                src={slide.image}
                alt=""
                className={index === heroIndex ? 'is-active' : undefined}
              />
            ))}
            <div className="hero-shade" />
          </div>
          <div className="hero-content">
            <div className="hero-kicker">Edison, New Jersey · Est. {brand.since}</div>
            <h1>{activeHero.title}</h1>
            <p>{activeHero.text}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={activeHero.cta.href}>
                {activeHero.cta.label}
              </a>
              <a className="btn btn-ghost" href="#services">
                View Services
              </a>
            </div>
          </div>
          <div className="hero-dots" aria-label="Hero slides">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                className={index === heroIndex ? 'is-active' : undefined}
                aria-label={`Show slide ${index + 1}`}
                onClick={() => setHeroIndex(index)}
              />
            ))}
          </div>
        </section>

        <section className="section" id="about">
          <div className="section-head reveal">
            <h2>Built to return to</h2>
            <p>
              Custom construction, thoughtful renovations, and refined interiors — crafted for New Jersey
              homeowners who want lasting quality without compromise.
            </p>
          </div>
          <div className="reasons">
            <article className="reason reveal">
              <h3>Real-life locations</h3>
              <p>
                From Edison to communities statewide, we design and build around how you actually live —
                light, flow, family, and the long view.
              </p>
            </article>
            <article className="reason reveal">
              <h3>Built to stay</h3>
              <p>
                Dileep oversees every phase with rigorous standards, clear communication, and materials
                chosen to age beautifully.
              </p>
            </article>
            <article className="reason reveal">
              <h3>Boutique approach</h3>
              <p>
                Not a faceless volume builder — a hands-on team that treats each home like a private
                residence, not a product line.
              </p>
            </article>
          </div>
        </section>

        <section className="section" id="services">
          <div className="section-head reveal">
            <h2>Services</h2>
            <p>Make your dream a reality. Let us turn our blueprints into your doorsteps.</p>
          </div>
          <div className="services-grid">
            {services.map((service) => (
              <article className="service-item reveal" key={service.title}>
                <figure>
                  <img src={service.image} alt={service.title} loading="lazy" />
                </figure>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="inspired">
          <div className="section-head reveal">
            <h2>Get Inspired</h2>
            <p>Seeing is believing. Explore exceptional designs and let new ideas take shape.</p>
          </div>
          <div className="gallery-tabs reveal" role="tablist" aria-label="Project categories">
            {galleryCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={category === item.id}
                className={category === item.id ? 'is-active' : undefined}
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="gallery-grid reveal">
            {activeGallery.images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setLightbox(index)}
                aria-label={`Open ${activeGallery.label} image ${index + 1}`}
              >
                <img src={`/images/projects/${activeGallery.id}/${image}`} alt="" loading="lazy" />
              </button>
            ))}
          </div>
          <div className="gallery-cta">
            <a className="btn btn-dark" href="#quote">
              Start Your Project
            </a>
          </div>
        </section>

        <section className="section testimonials" id="testimonials">
          <div className="section-head reveal">
            <h2>Testimonials</h2>
            <p>Action speaks louder than words. Our clients say it even better.</p>
          </div>
          <div className="testimonial-track">
            {testimonials.map((item) => (
              <article className="testimonial reveal" key={item.name + item.project}>
                <div className="stars" aria-label="5 stars">
                  ★★★★★
                </div>
                <p>“{item.quote}”</p>
                <span>
                  {item.name}, {item.project}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="contact">
          <div className="section-head reveal">
            <h2>Contact Us</h2>
            <p>In person at our Edison studio, or virtually from wherever you are in New Jersey.</p>
          </div>
          <div className="contact-tabs reveal">
            <button
              type="button"
              className={contactMode === 'in-person' ? 'is-active' : undefined}
              onClick={() => setContactMode('in-person')}
            >
              In Person
            </button>
            <button
              type="button"
              className={contactMode === 'virtual' ? 'is-active' : undefined}
              onClick={() => setContactMode('virtual')}
            >
              Virtual
            </button>
          </div>
          <div className="contact-wrap">
            {contactMode === 'in-person' ? (
              <div className="panel split reveal">
                <div>
                  <p>
                    Prefer to chat over coffee? We’d love to host you at our Edison location to discuss
                    your vision.
                  </p>
                  <ul className="info-list">
                    <li>{brand.address}</li>
                    <li>{brand.hours}</li>
                    <li>
                      <a href={brand.phoneHref}>{brand.phone}</a>
                    </li>
                  </ul>
                  <div className="map-frame" style={{ marginTop: '1.25rem' }}>
                    <iframe
                      title="Dream Home Builders office map"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.035345717311!2d-74.3734674!3d40.5407981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3c90710609b1f%3A0xc6c4f8d956b6b3e!2s25%20Parker%20Rd%2C%20Edison%2C%20NJ%2008820!5e0!3m2!1sen!2sus!4v1700000000000"
                    />
                  </div>
                </div>
                <form onSubmit={onContactSubmit}>
                  <p>Send project details so we can prepare for a productive conversation.</p>
                  <input name="name" placeholder="Full Name" required />
                  <input name="email" type="email" placeholder="Email Address" required />
                  <input name="phone" type="tel" placeholder="Phone Number" />
                  <textarea name="message" placeholder="Tell us about your project" required />
                  <button className="btn btn-dark" type="submit">
                    Send Message
                  </button>
                </form>
              </div>
            ) : (
              <div className="panel split reveal">
                <div>
                  <p>
                    Busy schedule? We offer seamless virtual meetings to discuss your dream home from
                    the comfort of your couch.
                  </p>
                  <ul className="info-list">
                    <li>Zoom or Google Meet</li>
                    <li>Flexible evening slots</li>
                    <li>Operating statewide in NJ</li>
                  </ul>
                </div>
                <form onSubmit={onContactSubmit}>
                  <select name="platform" defaultValue="Zoom" required>
                    <option>Zoom</option>
                    <option>Google Meet</option>
                    <option>Phone Call</option>
                  </select>
                  <input name="name" placeholder="Full Name" required />
                  <input name="email" type="email" placeholder="Email Address" required />
                  <input name="phone" type="tel" placeholder="Phone Number" required />
                  <textarea name="message" placeholder="Preferred times & project notes" required />
                  <button className="btn btn-dark" type="submit">
                    Schedule Call
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>

        <section className="section" id="quote">
          <div className="section-head reveal">
            <h2>Request a Quote</h2>
            <p>Transparent pricing, no hidden surprises. Tell us about your dream project.</p>
          </div>
          <div className="quote-wrap reveal">
            <div>
              <p>
                A short conversation is enough to understand whether you need a family home, a
                renovation that evolves with your life, or a place you’ll return to for years.
              </p>
              <ul className="info-list">
                <li>
                  Call <a href={brand.phoneHref}>{brand.phone}</a>
                </li>
                <li>
                  Email <a href={`mailto:${brand.email}`}>{brand.email}</a>
                </li>
                <li>{brand.address}</li>
              </ul>
            </div>
            <form onSubmit={onQuoteSubmit}>
              <select name="service" defaultValue="" required>
                <option value="" disabled>
                  Service Required *
                </option>
                {quoteServices.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              <input name="budget" placeholder="Approx. Budget (USD) *" required />
              <input name="sqft" placeholder="Total Square Footage (Optional)" />
              <input name="start" type="date" aria-label="Desired start date" />
              <textarea name="description" placeholder="Project Description *" required />
              <input name="location" placeholder="Location / Address *" required />
              <button className="btn btn-dark" type="submit">
                Request Detailed Quote
              </button>
              {formStatus ? <p className="form-note">{formStatus}</p> : null}
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h3>Dream Home Builders</h3>
            <p>Building excellence since {brand.since}.</p>
          </div>
          <div>
            <strong>Quick Links</strong>
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Contact Info</strong>
            <ul>
              <li>
                <a href={brand.phoneHref}>Call Us</a>
              </li>
              <li>
                <a href={`mailto:${brand.email}`}>Email Us</a>
              </li>
              <li>{brand.address}</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Dream Home Builders. All rights reserved.</span>
          <a href="#hero">Back to top ↑</a>
        </div>
      </footer>

      {lightbox !== null ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Project image">
          <button className="lightbox-close" type="button" onClick={() => setLightbox(null)}>
            ×
          </button>
          <button
            className="lightbox-nav prev"
            type="button"
            onClick={() =>
              setLightbox((current) => {
                if (current === null) return 0
                return (current - 1 + activeGallery.images.length) % activeGallery.images.length
              })
            }
          >
            ‹
          </button>
          <img
            src={`/images/projects/${activeGallery.id}/${activeGallery.images[lightbox]}`}
            alt={`${activeGallery.label} project`}
          />
          <button
            className="lightbox-nav next"
            type="button"
            onClick={() =>
              setLightbox((current) => {
                if (current === null) return 0
                return (current + 1) % activeGallery.images.length
              })
            }
          >
            ›
          </button>
        </div>
      ) : null}
    </>
  )
}
