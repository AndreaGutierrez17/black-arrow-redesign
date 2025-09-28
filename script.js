// === Año automático en el footer ===
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// === Booking Modal ===
const bookModal = document.getElementById('bookModal');
const openers = document.querySelectorAll('[data-open-book]');
const form = document.getElementById('bookingForm');
const toast = document.getElementById('toast');

// Abrir modal
openers.forEach(btn => btn.addEventListener('click', () => bookModal.showModal()));

// Botón "X" para cerrar modal
document.querySelector('#bookModal .close')
  ?.addEventListener('click', () => bookModal.close());

// Función para generar archivo .ics
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

// Envío de formulario (descarga .ics + cierra modal + toast)
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
  // Mostrar toast
  toast.textContent = 'Booking created — check your downloads to add the event to your calendar.';
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'), 3800);
});


// === Menú hamburguesa (móvil) ===
const header = document.querySelector('.site-header');
const burger = header.querySelector('.hamburger');
const nav = header.querySelector('nav');

// Abrir / cerrar menú
burger.addEventListener('click', () => {
  header.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', header.classList.contains('is-open'));
});

// Cerrar menú al hacer click en un link o botón Book
nav.querySelectorAll('a, .book-btn').forEach(el => {
  el.addEventListener('click', () => {
    header.classList.remove('is-open');
    burger.setAttribute('aria-expanded','false');
  });
});
