// === Auto year in footer ===
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// === Booking Modal ===
const bookModal = document.getElementById('bookModal');
const openers = document.querySelectorAll('[data-open-book]');
const form = document.getElementById('bookingForm');
const toast = document.getElementById('toast');

openers.forEach((btn) => btn.addEventListener('click', () => bookModal?.showModal()));

document.querySelector('#bookModal .close')
  ?.addEventListener('click', () => bookModal?.close());

function buildICS({ name, email, service, datetime, notes }) {
  const start = new Date(datetime);
  const durationHours = service.includes('2,000') ? 4 : service.includes('2 hrs') ? 2 : 1;
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

  function fmt(d) {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  const summary = `${service} - Black Arrow Group`;
  const desc = `Booked by ${name} (${email}).\n\nNotes:\n${notes || ''}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Black Arrow Group//Booking//EN',
    'BEGIN:VEVENT',
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${desc.replace(/\n/g, '\\n')}`,
    'LOCATION:Online Meeting',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const ics = buildICS(data);
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'black-arrow-booking.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  bookModal?.close();

  if (toast) {
    toast.textContent = 'Booking created - check your downloads to add the event to your calendar.';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3800);
  }
});

// === Mobile menu ===
const header = document.querySelector('.site-header');
const burger = header?.querySelector('.hamburger');
const nav = header?.querySelector('nav');

burger?.addEventListener('click', () => {
  header?.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', header?.classList.contains('is-open') ? 'true' : 'false');
});

nav?.querySelectorAll('a, .book-btn').forEach((el) => {
  el.addEventListener('click', () => {
    header?.classList.remove('is-open');
    burger?.setAttribute('aria-expanded', 'false');
  });
});

// === Smooth scroll for internal anchors ===
(function () {
  const localHeader = document.querySelector('.site-header');
  const headerOffset = () => (localHeader ? localHeader.getBoundingClientRect().height : 0);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset() - 8;
      window.scrollTo({ top: y, behavior: 'smooth' });

      if (localHeader?.classList.contains('is-open')) {
        localHeader.classList.remove('is-open');
        localHeader.querySelector('.hamburger')?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.documentElement.style.setProperty('--header-h', headerOffset() + 'px');
  window.addEventListener('resize', () => {
    document.documentElement.style.setProperty('--header-h', headerOffset() + 'px');
  });
})();

// === About carousel ===
(function () {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('[data-track]');
  const slides = Array.from(track?.querySelectorAll('img') || []);
  const prevBtn = carousel.querySelector('[data-prev]');
  const nextBtn = carousel.querySelector('[data-next]');

  if (!slides.length) return;

  let index = 0;
  const showSlide = (nextIndex) => {
    slides[index].classList.remove('active');
    index = (nextIndex + slides.length) % slides.length;
    slides[index].classList.add('active');
  };

  prevBtn?.addEventListener('click', () => showSlide(index - 1));
  nextBtn?.addEventListener('click', () => showSlide(index + 1));

  setInterval(() => showSlide(index + 1), 5500);
})();
