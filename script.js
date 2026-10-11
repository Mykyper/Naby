/* ═══════════════════════════════════════════════════════════
   CONFIG — change cette date pour le compteur de jours
   ═══════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════
   CONFIG — les 12 raisons (personnalise-les librement)
   ═══════════════════════════════════════════════════════════ */
const REASONS = [
  "J'adore ton sourire.",
  "J'adore te voir rire",
  "J'adore te voir être heureuse.",
  "J'adore quand tu pleures de joie",
  "J'adore quand tu prends ton air sérieux.",
  "J'adore quand tu m'envoies des snaps \"débiles\".",
  "j'adore quand tu me fais des hauls",
  "J'adore tes storytimes toujours + farfelues les unes que les autres.",
  "J'adore quand tu boudes t'es trop mignonne.(quand tu boudes pas vraiment)",
  "J'adore le fait que tu t'inquietes pour moi.",
  "J'adore quand tu me demandes à chaque fois quand je reviens,je ressens vraiment que je te manque.",
  "J'adore tes lolos(FAIS PAS DE REDUCTION STP).",
];

/* ═══════════════════════════════════════════════════════════
   ÉTOILES EN CANVAS
   ═══════════════════════════════════════════════════════════ */
(() => {
  const canvas = document.querySelector('.stars');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let w, h;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    w = canvas.width = innerWidth * devicePixelRatio;
    h = canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';

    const count = Math.min(140, Math.floor(innerWidth / 8));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random(),
      speed: Math.random() * 0.015 + 0.003,
      dir: Math.random() > 0.5 ? 1 : -1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.a += s.speed * s.dir;
      if (s.a > 1 || s.a < 0.15) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 230, 235, ${s.a})`;
      ctx.fill();
    }
    if (!reduced) requestAnimationFrame(draw);
  }

  addEventListener('resize', resize);
  resize();
  draw();
})();

/* ═══════════════════════════════════════════════════════════
   NAVIGATION ENTRE SCÈNES
   ═══════════════════════════════════════════════════════════ */
const scenes = [...document.querySelectorAll('.scene')];
const dots = [...document.querySelectorAll('.dot')];

function goTo(index) {
  if (index < 0 || index >= scenes.length) return;
  scenes.forEach((s, i) => s.classList.toggle('active', i === index));
  dots.forEach((d, i) => d.classList.toggle('on', i === index));
  scrollTo({ top: 0, behavior: 'smooth' });
}

/* ═══════════════════════════════════════════════════════════
   SCÈNE 1 — OUVERTURE DE L'ENVELOPPE
   ═══════════════════════════════════════════════════════════ */
const envelope = document.querySelector('#envelope');
const tapHint = document.querySelector('#tapHint');
let envelopeOpened = false;

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  envelope?.classList.add('open');
  if (tapHint) tapHint.textContent = "Ça s'ouvre…";

  burstHearts();

  setTimeout(() => goTo(1), 1800);
}

envelope?.addEventListener('click', openEnvelope);
envelope?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openEnvelope();
  }
});

/* ═══════════════════════════════════════════════════════════
   BURST DE CŒURS (depuis l'enveloppe)
   ═══════════════════════════════════════════════════════════ */
function burstHearts() {
  if (!envelope) return;

  const rect = envelope.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 14; i++) {
    const heart = document.createElement('span');
    heart.textContent = Math.random() > 0.5 ? '♥' : '♡';
    heart.setAttribute('aria-hidden', 'true');
    Object.assign(heart.style, {
      position: 'fixed',
      left: cx + 'px',
      top: cy + 'px',
      color: Math.random() > 0.5 ? '#e8a1b3' : '#b52643',
      fontSize: (12 + Math.random() * 14) + 'px',
      pointerEvents: 'none',
      zIndex: 9999,
      transition: 'transform 1.4s cubic-bezier(.2,.8,.2,1), opacity 1.4s ease',
    });
    document.body.appendChild(heart);

    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 180;

    requestAnimationFrame(() => {
      heart.style.transform =
        `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist - 60}px) ` +
        `rotate(${(Math.random() - 0.5) * 360}deg) scale(${1 + Math.random() * 0.8})`;
      heart.style.opacity = '0';
    });

    setTimeout(() => heart.remove(), 1600);
  }
}

/* ═══════════════════════════════════════════════════════════
   BOUTONS DE NAVIGATION
   ═══════════════════════════════════════════════════════════ */
document.querySelector('#toMemories')?.addEventListener('click', () => goTo(2));
document.querySelector('#toReasons')?.addEventListener('click', () => goTo(3));

/* ═══════════════════════════════════════════════════════════
   REDÉMARRER
   ═══════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   REDÉMARRER (depuis la dernière scène)
   ═══════════════════════════════════════════════════════════ */
document.querySelector('#restart')?.addEventListener('click', () => {
  envelopeOpened = false;
  envelope?.classList.remove('open');
  if (tapHint) tapHint.textContent = "Touche l'enveloppe pour l'ouvrir";

  // Réinitialise la boîte à raisons
  currentReason = -1;
  isReasonAnimating = false;
  reasonCard?.classList.remove('show');
  reasonsBox?.classList.remove('opening');
  if (reasonsCount) reasonsCount.textContent = '0';
  reasonsDotsList.forEach((d) => d.classList.remove('on'));
  if (reasonText) reasonText.textContent = 'Touche la boîte…';
  if (reasonNumber) reasonNumber.textContent = '1';

  goTo(0);
});

/* ═══════════════════════════════════════════════════════════
   GALERIE — AJOUT DE PHOTOS
   ═══════════════════════════════════════════════════════════ */
const photoInput = document.querySelector('#photoInput');
const polaroids = document.querySelector('#polaroids');
const uploadNote = document.querySelector('#uploadNote');
let photoUrls = [];

photoInput?.addEventListener('change', () => {
  photoUrls.forEach(URL.revokeObjectURL);

  const files = [...photoInput.files]
    .filter((f) => f.type.startsWith('image/'))
    .slice(0, 8);

  if (!files.length) return;

  photoUrls = files.map(URL.createObjectURL);

  polaroids.innerHTML = files
    .map(
      (file, i) => `
      <figure class="polaroid">
        <img src="${photoUrls[i]}" alt="Souvenir ${i + 1}" loading="lazy">
        <figcaption>${file.name.replace(/\.[^.]+$/, '').slice(0, 40)}</figcaption>
      </figure>
    `
    )
    .join('');

  uploadNote.textContent =
    `${files.length} photo${files.length > 1 ? 's' : ''} ` +
    `ajoutée${files.length > 1 ? 's' : ''} ✨`;
});

/* Double-clic sur la galerie pour ouvrir le sélecteur */
polaroids?.addEventListener('dblclick', () => photoInput?.click());

/* ═══════════════════════════════════════════════════════════
   SCÈNE 4 — BOÎTE À RAISONS
   ═══════════════════════════════════════════════════════════ */
const reasonsBox = document.querySelector('#reasonsBox');
const reasonCard = document.querySelector('#reasonCard');
const reasonNumber = document.querySelector('#reasonNumber');
const reasonText = document.querySelector('#reasonText');
const reasonsCount = document.querySelector('#reasonsCount');
const reasonsDots = document.querySelector('#reasonsDots');

let currentReason = -1;
let isReasonAnimating = false;

/* Initialise les petits points de progression */
if (reasonsDots) {
  reasonsDots.innerHTML = REASONS.map(() => '<span></span>').join('');
}
const reasonsDotsList = reasonsDots ? [...reasonsDots.children] : [];

function showNextReason() {
  if (isReasonAnimating || !reasonsBox || !reasonCard) return;
  isReasonAnimating = true;

  // Passe à la raison suivante (boucle infinie)
  currentReason = (currentReason + 1) % REASONS.length;

  // Ouvre le couvercle
  reasonsBox.classList.add('opening');

  // Cache la carte actuelle
  reasonCard.classList.remove('show');

  setTimeout(() => {
    // Met à jour le contenu
    if (reasonNumber) reasonNumber.textContent = currentReason + 1;
    if (reasonText) reasonText.textContent = REASONS[currentReason];

    // Affiche la carte
    reasonCard.classList.add('show');

    // Compteur + points
    if (reasonsCount) {
      reasonsCount.textContent = Math.min(currentReason + 1, REASONS.length);
    }
    reasonsDotsList.forEach((dot, i) =>
      dot.classList.toggle('on', i <= currentReason)
    );

    // Petite pluie de cœurs
    burstReasonHearts();

    // Referme le couvercle après un instant
    setTimeout(() => reasonsBox.classList.remove('opening'), 400);

    isReasonAnimating = false;
  }, 250);
}

/* Déclencheurs : clic + clavier */
reasonsBox?.addEventListener('click', showNextReason);
reasonsBox?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    showNextReason();
  }
});

/* Petite pluie de cœurs depuis la boîte */
function burstReasonHearts() {
  if (!reasonsBox) return;

  const rect = reasonsBox.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height * 0.35;

  for (let i = 0; i < 8; i++) {
    const h = document.createElement('span');
    h.className = 'reason-heart';
    h.textContent = Math.random() > 0.5 ? '♥' : '♡';
    h.setAttribute('aria-hidden', 'true');
    Object.assign(h.style, {
      left: cx + 'px',
      top: cy + 'px',
      fontSize: (10 + Math.random() * 10) + 'px',
      color: Math.random() > 0.5 ? '#e8a1b3' : '#b52643',
    });
    document.body.appendChild(h);

    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
    const dist = 60 + Math.random() * 100;

    requestAnimationFrame(() => {
      h.style.transform =
        `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) ` +
        `rotate(${(Math.random() - 0.5) * 180}deg)`;
      h.style.opacity = '0';
    });

    setTimeout(() => h.remove(), 1300);
  }
}

/* ═══════════════════════════════════════════════════════════
   COMPTEUR DE JOURS
   ═══════════════════════════════════════════════════════════ */


/* Lance le compteur dès qu'on arrive sur la lettre */
const letterObserver = new MutationObserver(() => {
  const letter = document.querySelector('#scene-letter');
  if (letter?.classList.contains('active')) updateCounter();
});
scenes.forEach((s) =>
  letterObserver.observe(s, { attributes: true, attributeFilter: ['class'] })
);

/* ═══════════════════════════════════════════════════════════
   NAVIGATION CLAVIER (flèches ← →)
   ═══════════════════════════════════════════════════════════ */
addEventListener('keydown', (e) => {
  // Ne pas interférer si l'utilisateur écrit dans un champ
  if (e.target.matches('input, textarea, [contenteditable]')) return;

  const current = scenes.findIndex((s) => s.classList.contains('active'));
  if (e.key === 'ArrowRight' && current < scenes.length - 1) {
    goTo(current + 1);
  }
  if (e.key === 'ArrowLeft' && current > 0) {
    goTo(current - 1);
  }
});
/* ═══════════════════════════════════════════════════════════
   POLAROIDS — MODALE PHOTO + VIDÉO
   ═══════════════════════════════════════════════════════════ */
const mediaModal = document.querySelector('#mediaModal');
const modalImage = document.querySelector('#modalImage');
const modalVideo = document.querySelector('#modalVideo');
const modalCaption = document.querySelector('#modalCaption');
const mediaClose = document.querySelector('#mediaClose');

function openMediaModal(type, src, caption, alt) {
  if (!mediaModal) return;

  // Reset
  if (modalImage) {
    modalImage.hidden = true;
    modalImage.removeAttribute('src');
  }
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.hidden = true;
    modalVideo.removeAttribute('src');
    modalVideo.load();
  }

  // Photo
  if (type === 'photo' && modalImage) {
    modalImage.src = src;
    modalImage.alt = alt || '';
    modalImage.hidden = false;
  }

  // Vidéo
  if (type === 'video' && modalVideo) {
    modalVideo.src = src;
    modalVideo.hidden = false;
    modalVideo.load();
    // Léger délai pour laisser le DOM se mettre à jour
    requestAnimationFrame(() => {
      modalVideo.play().catch(() => { /* autoplay bloqué, tant pis */ });
    });
  }

  if (modalCaption) modalCaption.textContent = caption || '';

  mediaModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeMediaModal() {
  if (!mediaModal) return;

  if (modalVideo) {
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    modalVideo.hidden = true;
  }
  if (modalImage) {
    modalImage.removeAttribute('src');
    modalImage.hidden = true;
  }

  mediaModal.hidden = true;
  document.body.style.overflow = '';
}

// Clic sur un polaroid
document.addEventListener('click', (e) => {
  const polaroid = e.target.closest('.polaroid');
  if (!polaroid) return;

  const type = polaroid.dataset.type;
  const src = polaroid.dataset.src;
  if (!type || !src) return;

  const caption = polaroid.querySelector('figcaption')?.textContent || '';
  const img = polaroid.querySelector('img');
  const alt = img?.alt || '';

  openMediaModal(type, src, caption, alt);
});

// Fermeture
mediaClose?.addEventListener('click', closeMediaModal);
mediaModal?.querySelector('[data-close]')?.addEventListener('click', closeMediaModal);

addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mediaModal && !mediaModal.hidden) {
    closeMediaModal();
  }
});