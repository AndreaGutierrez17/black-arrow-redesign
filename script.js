
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu){
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.hasAttribute('hidden') ? false : true;
    if (open){ mobileMenu.setAttribute('hidden',''); hamburger.setAttribute('aria-expanded','false'); }
    else { mobileMenu.removeAttribute('hidden'); hamburger.setAttribute('aria-expanded','true'); }
  });
  // close menu on anchor click
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.setAttribute('hidden',''); hamburger.setAttribute('aria-expanded','false');
  }));
}

// Booking modal
const bookModal = document.getElementById('bookModal');
const openers = document.querySelectorAll('[data-open-book]');
openers.forEach(btn => btn.addEventListener('click', () => bookModal.showModal()));
// Generate .ics file for calendar
function buildICS({name,email,service,datetime,notes}){
  const start = new Date(datetime);
  const durationHours = service.includes('2,000') ? 4 : service.includes('2 hrs') ? 2 : 1;
  const end = new Date(start.getTime() + durationHours*60*60*1000);
  function fmt(d){ return d.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z'; }
  const summary = `${service} — Black Arrow Group`;
  const desc = `Booked by ${name} (${email}).\n\nNotes:\n${notes||''}`;
  const ics = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Black Arrow Group//Booking//EN',
    'BEGIN:VEVENT',
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${desc.replace(/\n/g,'\\n')}`,
    'LOCATION:Online Meeting',
    'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
  return ics;
}
const form = document.getElementById('bookingForm');
const toast = document.getElementById('toast');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const ics = buildICS(data);
  const blob = new Blob([ics], {type:'text/calendar'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'black-arrow-booking.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  bookModal.close();
  // toast
  toast.textContent = 'Booking created — check your downloads to add the event to your calendar.';
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'), 3800);
});

// Cerrar modal al confirmar
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  // ... aquí ya generas el .ics
  bookModal.close(); // asegúrate de que se ejecute
});

// Cerrar modal al dar clic en la "X"
document.querySelector('#bookModal .close')
  ?.addEventListener('click', () => bookModal.close());

  // cerrar menú móvil al dar click en cualquier enlace
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    mobileMenu.setAttribute('hidden','');
    hamburger.setAttribute('aria-expanded','false');
  })
);

// Botón "X" para cerrar
document.querySelector('#bookModal .close')
  ?.addEventListener('click', () => bookModal.close());

// Cerrar automáticamente al confirmar (submit)
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  // tu lógica de generar .ics aquí...
  bookModal.close(); // 👈 esto lo cierra
});

(function(){
    const header = document.querySelector('.site-header');
    const btn = header.querySelector('.hamburger');

    btn.addEventListener('click', () => {
      const open = header.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Cerrar al hacer click en un enlace del menú (móvil)
    header.querySelectorAll('nav a, nav .book-btn').forEach(el=>{
      el.addEventListener('click', ()=> {
        if (header.classList.contains('is-open')) {
          header.classList.remove('is-open');
          btn.setAttribute('aria-expanded','false');
        }
      });
    });
  })();

 const header = document.querySelector('.site-header');
const burger = header.querySelector('.hamburger');
const nav = header.querySelector('nav');

// Abrir / cerrar menú al hacer click en hamburguesa
burger.addEventListener('click', () => {
  header.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', header.classList.contains('is-open'));
});

// Cerrar el menú al hacer click en cualquier link
nav.querySelectorAll('a, .book-btn').forEach(el => {
  el.addEventListener('click', () => {
    header.classList.remove('is-open');
    burger.setAttribute('aria-expanded','false');
  });
});
