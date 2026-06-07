// ===== KADAE S.A. — Shared JS =====
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initWhatsAppFab();
  initScrollAnimations();
});

// ===== MOBILE MENU =====
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      menu.classList.add('open');
      toggle.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ===== WHATSAPP FAB =====
function initWhatsAppFab() {
  const fab = document.getElementById('whatsappFab');
  if (!fab) return;
  fab.style.opacity = '0';
  fab.style.transform = 'scale(0.5)';
  fab.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      fab.style.opacity = '1';
      fab.style.transform = 'scale(1)';
    } else {
      fab.style.opacity = '0';
      fab.style.transform = 'scale(0.5)';
    }
  }, { passive: true });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ===== CONTACT FORM =====
function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const nombre = form.querySelector('[name="nombre"]')?.value || '';
  const email = form.querySelector('[name="email"]')?.value || '';
  const mensaje = form.querySelector('[name="mensaje"]')?.value || '';

  const mailtoLink = `mailto:ventas@kadae.com.ar?subject=Consulta Web - ${nombre}&body=${encodeURIComponent(`Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`)}`;
  window.open(mailtoLink, '_blank');

  const btn = form.querySelector('button[type="submit"]');
  if (btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> ¡Enviado!';
    btn.style.background = '#16a34a';
    btn.style.color = 'white';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.style.color = ''; form.reset(); }, 3000);
  }
}
