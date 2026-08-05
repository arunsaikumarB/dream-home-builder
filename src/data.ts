export const brand = {
  name: 'Dream Home Builders',
  short: 'DHB',
  phone: '(908) 797-1777',
  phoneHref: 'tel:+19087971777',
  email: 'dreamhomebuildersnj@gmail.com',
  address: '25 Parker Rd, Edison NJ 08820',
  hours: 'Mon – Fri: 9am – 6pm',
  since: '2015',
}

export const nav = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'Get Inspired', href: '#inspired' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
  { label: 'Request Quote', href: '#quote' },
]

export const heroSlides = [
  {
    image: '/images/home/exterior-modern-1.webp',
    title: 'Crafting Your Dream Home',
    text: 'Innovative designs, exceptional quality. Let’s build your future, together.',
    cta: { label: 'Explore Projects', href: '#inspired' },
  },
  {
    image: '/images/home/interior-modern-1.webp',
    title: 'Sophisticated Interiors',
    text: 'Where comfort meets contemporary elegance, every detail designed for living.',
    cta: { label: 'Our Services', href: '#services' },
  },
  {
    image: '/images/home/interior-kitchen-1.webp',
    title: 'Beyond Just Remodeling',
    text: 'Transforming spaces into breathtaking realities, tailored for your lifestyle.',
    cta: { label: 'Get a Quote', href: '#quote' },
  },
]

export const services = [
  {
    title: 'New Home Construction',
    image: '/images/services/construction.jpeg',
    text: 'Building a custom home with Dream Home Builders is a journey of turning your unique vision into a structural masterpiece. Dileep oversees every phase, from the initial architectural sketches to the final walkthrough, ensuring every beam and brick meets our rigorous quality standards.',
  },
  {
    title: 'House Renovation',
    image: '/images/services/renovation.webp',
    text: 'Our remodeling services are designed for homeowners who love their neighborhood but need their living space to evolve with their changing lifestyle. We specialize in transformative kitchen and bathroom renovations that blend modern functionality with the classic character of your home.',
  },
  {
    title: 'Architecture Design',
    image: '/images/services/architecture.webp',
    text: 'Great construction begins with a thoughtful plan that balances aesthetic beauty with structural logic. Our architecture design service focuses on maximizing your property’s potential, utilizing natural light and smart layouts to create an effortless flow throughout the home.',
  },
  {
    title: 'Interior Design',
    image: '/images/services/interior-design.jpg',
    text: 'The fine details are what truly elevate a house into a home, and our interior design approach focuses on those sophisticated finishing touches. We help you select premium materials, from crown molding and custom cabinetry to high-end flooring that reflects your personal style.',
  },
  {
    title: 'Fixing & Support',
    image: '/images/services/support.webp',
    text: 'A home is a living investment that requires expert care to maintain its value and safety over time. Our fixing and support service provides homeowners with reliable solutions for structural repairs, moisture protection, and general maintenance.',
  },
  {
    title: 'Painting',
    image: '/images/services/painting.jpg',
    text: 'A fresh coat of paint is the ultimate finishing touch that defines the mood and quality of your interior and exterior spaces. We provide professional-grade painting services that prioritize clean lines, thorough surface preparation, and premium, long-lasting finishes.',
  },
]

export const galleryCategories = [
  {
    id: 'elevation',
    label: 'Elevations',
    images: [
      'modern-elevation1.jpg',
      'modern-elevation2.jpg',
      'modern-elevation3.jpg',
      'modern-elevation4.jpg',
      'elevation-1.avif',
      'elevation-2.avif',
      'elevation-10.webp',
      'elevation-11.webp',
    ],
  },
  {
    id: 'kitchen',
    label: 'Kitchens',
    images: [
      'kitchen-1.jpg',
      'kitchen-2.jpg',
      'kitchen-3.jpg',
      'kitchen-4.jpg',
      'kitchen-5.jpg',
      'kitchen-24.webp',
      'kitchen-25.webp',
      'kitchen-26.webp',
    ],
  },
  {
    id: 'bedroom',
    label: 'Bedrooms',
    images: [
      'bedroom-1.jpg',
      'bedroom-2.webp',
      'bedroom-3.jpg',
      'bedroom-4.jpg',
      'bedroom-5.jpg',
      'bedroom-6.jpg',
    ],
  },
  {
    id: 'bathroom',
    label: 'Bathrooms',
    images: [
      'bath-1.JPG',
      'bath-2.JPG',
      'bath-4.jpg',
      'bath-5.jpg',
      'bath-9.webp',
      'bath-11.webp',
    ],
  },
  {
    id: 'living',
    label: 'Living Rooms',
    images: [
      'living-1.jpg',
      'living-2.jpg',
      'living-3.jpg',
      'living-4.jpg',
      'living-5.jpg',
      'living-6.jpg',
    ],
  },
  {
    id: 'interior',
    label: 'Interiors',
    images: [
      'interior-1.jpg',
      'interior-2.jpg',
      'interior-3.jpg',
      'interior-5.jpg',
      'interior-6.jpg',
      'interior-7.jpg',
    ],
  },
  {
    id: 'wetbar',
    label: 'Wet Bars',
    images: [
      'wetbar1.webp',
      'wetbar2.png',
      'wetbar3.jpeg',
      'wetbar4.webp',
      'wetbar5.webp',
      'wetbar6.webp',
    ],
  },
] as const

export const testimonials = [
  {
    quote:
      'Dileep’s honesty was refreshing. We did a full kitchen remodel, and he was upfront about costs and timelines from day one. Highly recommend!',
    name: 'Sarah J.',
    project: 'Kitchen Remodel',
  },
  {
    quote:
      'Building a new home is stressful, but Dileep’s responsiveness made it manageable. He always answered his phone, even for the smallest questions.',
    name: 'Madhu D.',
    project: 'New Construction',
  },
  {
    quote:
      'The fast turnaround on our bathroom upgrade was incredible. Dileep’s dedication to finishing on schedule while maintaining quality was impressive.',
    name: 'Elena R.',
    project: 'Bathroom Upgrade',
  },
  {
    quote:
      'Dileep is a true professional. He guided us through our patio upgrade with great care. His communication was top-notch throughout the process.',
    name: 'David L.',
    project: 'Outdoor Living',
  },
  {
    quote:
      'We needed a major structural wall removed to create an open concept. Dileep handled the engineering and permits seamlessly. Truly expert work.',
    name: 'Priya K.',
    project: 'Structural Renovation',
  },
  {
    quote:
      'Our custom basement finished ahead of schedule. Dileep has a great eye for detail and suggested a layout we hadn’t even considered. We love it!',
    name: 'Linda K.',
    project: 'Basement Finishing',
  },
  {
    quote:
      'Professional, clean, and reliable. Dream Home Builders transformed our old siding and roof. The house looks brand new again. Exceptional value.',
    name: 'Robert P.',
    project: 'Exterior Remodel',
  },
]

export const quoteServices = [
  'New Home Construction',
  'Home Renovation',
  'Room Extension',
  'Interior Design',
]
