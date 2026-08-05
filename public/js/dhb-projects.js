const projectInventory = {
    elevation: ['modern-elevation1.jpg','modern-elevation2.jpg','modern-elevation3.jpg','modern-elevation4.jpg','modern-elevation5.png','modern-elevation6.jpg','modern-elevation7.jpg','modern-elevation8.jpg','modern-elevation9.jpg','modern-elevation10.jpg','elevation-1.avif','elevation-2.avif','elevation-3.avif','elevation-4.avif','elevation-5.avif','elevation-6.avif','elevation-7.avif','elevation-8.avif','elevation-9.avif','elevation-10.webp','elevation-11.webp','elevation-12.webp','elevation-13.JPG'],
    kitchen: ['kitchen-1.jpg','kitchen-2.jpg','kitchen-3.jpg','kitchen-4.jpg','kitchen-5.jpg','kitchen-6.jpg','kitchen-7.jpg','kitchen-8.jpg','kitchen-9.jpg','kitchen-10.jpg','kitchen-11.jpg','kitchen-12.jpg','kitchen-13.jpg','kitchen-14.jpg','kitchen-15.JPG','kitchen-16.JPG','kitchen-17.JPG','kitchen-18.JPG','kitchen-19.JPG','kitchen-20.JPG','kitchen-21.JPG','kitchen-22.JPG','kitchen-23.JPG','kitchen-24.webp','kitchen-25.webp','kitchen-26.webp','kitchen-27.webp','kitchen-28.webp','kitchen-29.png','kitchen-30.webp','kitchen-31.webp','kitchen-32.webp','kitchen-33.jpg','kitchen-34.jpg'],
    bedroom: ['bedroom-1.jpg','bedroom-2.webp','bedroom-3.jpg','bedroom-4.jpg','bedroom-5.jpg','bedroom-6.jpg'],
    bathroom: ['bath-1.JPG','bath-2.JPG','bath-3.JPG','bath-4.jpg','bath-5.jpg','bath-6.jpg','bath-7.jpg','bath-8.JPG','bath-9.webp','bath-10.JPG','bath-11.webp','bath-12.webp','bath-13.webp','bath-14.webp','bath-15.webp','bath-16.webp','bath-17.JPG','bath-18.JPG'],
    living: ['living-1.jpg','living-2.jpg','living-3.jpg','living-4.jpg','living-5.jpg','living-6.jpg'],
    wetbar: ['wetbar1.webp','wetbar2.png','wetbar3.jpeg','wetbar4.webp','wetbar5.webp','wetbar6.webp'],
    interior: ['interior-1.jpg','interior-2.jpg','interior-3.jpg','interior-5.jpg','interior-6.jpg','interior-7.jpg','interior-8.jpg','interior-9.jpg']
};

(() => {
  const gallery = document.getElementById('dhb-gallery');
  const tabs = document.querySelectorAll('#dhb-tabs [data-dhb-tab]');
  const lightbox = document.getElementById('dhb-lightbox');
  const lightboxImg = document.getElementById('dhb-lightbox-img');
  if (!gallery || !tabs.length) return;

  let currentCategory = 'elevation';
  let currentIndex = 0;

  const labels = {
    elevation: 'Elevations',
    kitchen: 'Kitchens',
    bedroom: 'Bedrooms',
    bathroom: 'Bathrooms',
    living: 'Living Rooms',
    interior: 'Interiors',
    wetbar: 'Wet Bars',
  };

  function render(category) {
    currentCategory = category;
    const files = projectInventory[category] || [];
    gallery.innerHTML = '';
    files.forEach((file, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dhb-gal-item is-visible';
      btn.setAttribute('data-dhb-cat', category);
      btn.setAttribute('aria-label', (labels[category] || category) + ' ' + (index + 1));
      const img = document.createElement('img');
      img.src = '/images/projects/' + category + '/' + file;
      img.alt = '';
      img.loading = 'lazy';
      btn.appendChild(img);
      btn.addEventListener('click', () => openLightbox(index));
      gallery.appendChild(btn);
    });
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    currentIndex = index;
    const files = projectInventory[currentCategory] || [];
    lightboxImg.src = '/images/projects/' + currentCategory + '/' + files[currentIndex];
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function showOffset(delta) {
    const files = projectInventory[currentCategory] || [];
    if (!files.length) return;
    currentIndex = (currentIndex + delta + files.length) % files.length;
    lightboxImg.src = '/images/projects/' + currentCategory + '/' + files[currentIndex];
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.getAttribute('data-dhb-tab');
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      render(id);
    });
  });

  if (lightbox) {
    lightbox.querySelector('[data-dhb-lightbox-close]')?.addEventListener('click', closeLightbox);
    lightbox.querySelector('[data-dhb-lightbox-prev]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      showOffset(-1);
    });
    lightbox.querySelector('[data-dhb-lightbox-next]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      showOffset(1);
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showOffset(-1);
      if (e.key === 'ArrowRight') showOffset(1);
    });
  }

  render('elevation');
})();
