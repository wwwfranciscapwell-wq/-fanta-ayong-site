const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }));
}
const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

// Réservation WhatsApp de FANTA AYONG : +241 745 018 98
const whatsappNumber = "24174501898";
const bookingForm = document.getElementById("bookingForm");
const formStatus = document.getElementById("formStatus");
if (bookingForm) {
  bookingForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(bookingForm);
    const labels = {name:"Nom et prénom",email:"Adresse e-mail",event:"Type d'événement",date:"Date souhaitée",place:"Ville / Pays",message:"Message"};
    const lines = ["Bonjour FANTA AYONG,","","Je souhaite faire une demande de réservation pour une prestation.",""];
    for (const [key, value] of data.entries()) {
      const clean = String(value).trim();
      if (clean) lines.push(`${labels[key] || key} : ${clean}`);
    }
    lines.push("", "Merci.");
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\\n"))}`;
    if (formStatus) formStatus.textContent = "WhatsApp s'ouvre avec votre demande. Vérifiez le message puis appuyez sur Envoyer.";
    window.open(url, "_blank", "noopener,noreferrer");
  });
}
const lightbox = document.getElementById("photoLightbox");
if (lightbox) {
  const lightboxImage = lightbox.querySelector("img");
  document.querySelectorAll(".gallery-item").forEach(item => item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.querySelector("img").alt;
    lightbox.showModal();
  }));
  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", event => { if (event.target === lightbox) lightbox.close(); });
}


// Animations d'apparition au défilement, sans bloquer le contenu si non pris en charge.
document.documentElement.classList.add("js-motion");
const revealTargets = document.querySelectorAll(
  ".section-kicker, .section-grid, .section-heading, .track, .video-card, .gallery-intro, .gallery-item, .booking-grid"
);
revealTargets.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
});
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(element => revealObserver.observe(element));
} else {
  revealTargets.forEach(element => element.classList.add("is-visible"));
}

// Barre de progression discrète en haut de page.
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
progressBar.setAttribute("aria-hidden", "true");
document.body.appendChild(progressBar);
const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${progress}%`;
};
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Mise en évidence du lien correspondant à la section visible.
const sectionLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const pageSections = sectionLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
if ("IntersectionObserver" in window && pageSections.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sectionLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  pageSections.forEach(section => sectionObserver.observe(section));
}
