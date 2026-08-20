/* =========================================================
   Roman Mudra — sdílený JS pro všechny stránky
   - mobilní navigace
   - scroll reveal animace
   - odeslání poptávkového formuláře přes mailto (dočasné řešení,
     dokud web nemá vlastní hosting / backend — viz README.md)
   ========================================================= */

// ⚠️ DOPLŇ SVŮJ SKUTEČNÝ E-MAIL — do té doby jde jen o ukázkovou adresu.
const CONTACT_EMAIL = "info@romanmudra.cz";

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initReveal();
  initYear();
  document.querySelectorAll("[data-inquiry-form]").forEach(initInquiryForm);
});

function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
    document.body.style.overflow = !isOpen ? "hidden" : "";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((el) => io.observe(el));
}

function initYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = year;
  });
}

function initInquiryForm(form) {
  const successBox = form.querySelector(".form-success");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const subjectPrefix = form.dataset.subject || "Poptávka z webu";
    const name = (formData.get("name") || "").toString().trim();
    const subject = name ? `${subjectPrefix} – ${name}` : subjectPrefix;

    const lines = [];
    form.querySelectorAll("[data-label]").forEach((field) => {
      if (field.type === "checkbox") return;
      const value = (formData.get(field.name) || "").toString().trim();
      if (value) lines.push(`${field.dataset.label}: ${value}`);
    });

    const body = lines.join("\n");
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;

    if (successBox) {
      successBox.classList.add("is-visible");
      successBox.setAttribute("tabindex", "-1");
      successBox.focus({ preventScroll: true });
    }
  });
}
