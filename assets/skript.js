/* =========================================================
   Roman Mudra — sdílený skript pro celý web
   ========================================================= */

/* ---------------------------------------------------------
   NASTAVENÍ — tady se mění kontaktní údaje a odesílání formuláře
   --------------------------------------------------------- */

/* E-mail, na který chodí poptávky (a který se zobrazuje jako záloha) */
const CONTACT_EMAIL = "roman.mudra@icloud.com";

/* Adresa služby, která poptávky doručí (např. Formspree).
   Dokud je prázdná, formulář jede v nouzovém režimu: otevře
   e-mailového klienta. To NENÍ spolehlivé — návštěvník s webmailem
   nemusí odeslat nic. Jakmile sem vložíš adresu z Formspree, začne
   se poptávka odesílat na pozadí a návštěvník dostane potvrzení.

   Postup: formspree.io → registrace → New Form → zkopírovat
   adresu ve tvaru https://formspree.io/f/xxxxxxxx a vložit sem. */
const FORM_ENDPOINT = "";

/* --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  initHeaderHeight();
  initHeaderScroll();
  initNavToggle();
  initActiveNav();
  initReveal();
  initYear();
  document.querySelectorAll("[data-inquiry-form]").forEach(initInquiryForm);
});

/**
 * Mobilní menu se otevírá pod hlavičkou. Kdyby se výška hlavičky
 * napevno napsala do CSS, po načtení fontu nebo při delším nadpisu
 * by menu hlavičku překrývalo. Proto ji měříme a předáváme do CSS.
 */
function initHeaderHeight() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const apply = () => {
    const h = Math.round(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--header-h", `${h}px`);
  };

  apply();
  if ("ResizeObserver" in window) {
    new ResizeObserver(apply).observe(header);
  } else {
    window.addEventListener("resize", apply);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(apply);
  }
}

/**
 * Na stránkách s fotkou v úvodu leží lišta průhledně přes fotku a
 * čitelnost jí zajišťuje horní pruh závoje. Jakmile návštěvník
 * odroluje z úvodu pryč, závoj pod lištou skončí — proto si od té
 * chvíle musí přinést vlastní tmavé pozadí.
 */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header || !document.body.classList.contains("uvod-foto")) return;

  const apply = () => {
    header.classList.toggle("je-posunuta", window.scrollY > 24);
  };

  apply();
  window.addEventListener("scroll", apply, { passive: true });
}

function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  if (!toggle || !nav) return;

  const setState = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggle.addEventListener("click", () => {
    setState(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setState(false));
  });

  // Escape zavře menu a vrátí fokus na tlačítko
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setState(false);
      toggle.focus();
    }
  });
}

/**
 * Označí v navigaci odkaz na právě otevřenou stránku.
 * Díky tomu nemusí každá stránka nést vlastní "active" třídu.
 */
function initActiveNav() {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const target = link.getAttribute("href");
    if (target && !target.startsWith("#") && target === here) {
      link.setAttribute("aria-current", "page");
    }
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

/* ---------------------------------------------------------
   Poptávkový formulář
   --------------------------------------------------------- */

const ICON_OK =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
const ICON_ERR =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L14.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';

function initInquiryForm(form) {
  const note = form.querySelector("[data-form-note]");
  const submit = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Honeypot: pole je skryté, takže ho vyplní jen robot.
    const trap = form.querySelector('input[name="_gotcha"]');
    if (trap && trap.value) return;

    const formData = new FormData(form);
    const subjectPrefix = form.dataset.subject || "Poptávka z webu";
    const name = (formData.get("name") || "").toString().trim();
    const subject = name ? `${subjectPrefix} – ${name}` : subjectPrefix;

    if (FORM_ENDPOINT) {
      await sendViaEndpoint({ form, formData, subject, note, submit });
    } else {
      sendViaMailClient({ form, formData, subject, note });
    }
  });
}

/** Ostrý režim: poptávka se odešle na pozadí. */
async function sendViaEndpoint({ form, formData, subject, note, submit }) {
  const originalLabel = submit ? submit.textContent : "";
  if (submit) {
    submit.disabled = true;
    submit.textContent = "Odesílám…";
  }

  formData.set("_subject", subject);

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    form.reset();
    showNote(
      note,
      "ok",
      "Poptávka odeslána. Ozvu se vám co nejdříve — obvykle do jednoho pracovního dne."
    );
  } catch (error) {
    showNote(
      note,
      "err",
      `Poptávku se nepodařilo odeslat. Napište mi prosím přímo na <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> nebo zavolejte.`
    );
  } finally {
    if (submit) {
      submit.disabled = false;
      submit.textContent = originalLabel;
    }
  }
}

/**
 * Nouzový režim, dokud není nastavený FORM_ENDPOINT.
 * Otevře e-mailového klienta s předvyplněnou zprávou. Pozor:
 * odesláním to nekončí — návštěvník musí zprávu ještě sám odeslat,
 * a bez nastaveného klienta se nemusí stát vůbec nic. Text hlášky
 * proto neslibuje, že poptávka dorazila.
 */
function sendViaMailClient({ form, formData, subject, note }) {
  const lines = [];
  form.querySelectorAll("[data-label]").forEach((field) => {
    if (field.type === "checkbox") return;
    const value = (formData.get(field.name) || "").toString().trim();
    if (value) lines.push(`${field.dataset.label}: ${value}`);
  });

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(lines.join("\n"))}`;

  window.location.href = mailto;

  showNote(
    note,
    "ok",
    `Otevírám váš e-mailový klient s předvyplněnou zprávou — <strong>zprávu je ještě potřeba odeslat</strong>. Pokud se nic neotevřelo, napište mi prosím přímo na <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.`
  );
}

function showNote(note, kind, html) {
  if (!note) return;
  note.className = `form-note form-note--${kind} is-visible`;
  note.innerHTML = `${kind === "ok" ? ICON_OK : ICON_ERR}<span>${html}</span>`;
  note.setAttribute("tabindex", "-1");
  note.focus({ preventScroll: true });
}
