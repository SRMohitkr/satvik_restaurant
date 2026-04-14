const body = document.body;

const toggleMenu = () => {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const close = document.querySelector(".menu-close");

  if (!toggle || !menu) return;

  const openMenu = () => {
    menu.hidden = false;
    body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    close?.focus();
  };

  const closeMenu = () => {
    menu.hidden = true;
    body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  };

  toggle.addEventListener("click", openMenu);
  close?.addEventListener("click", closeMenu);

  menu.addEventListener("click", (event) => {
    if (event.target === menu || event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      closeMenu();
    }
  });
};

const setupShowMore = () => {
  document.querySelectorAll(".btn-show-more").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.previousElementSibling;
      if (!group) return;
      group.querySelectorAll(".is-hidden").forEach((item) => item.classList.remove("is-hidden"));
      button.remove();
    });
  });
};

const setupTabs = () => {
  const nav = document.querySelector("[data-tab-nav]");
  if (!nav) return;

  const links = [...nav.querySelectorAll(".tab-link")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  links.forEach((link) => {
    link.addEventListener("click", () => {
      links.forEach((item) => item.classList.remove("is-active"));
      link.classList.add("is-active");
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const active = entries.find((entry) => entry.isIntersecting);
      if (!active) return;
      const current = links.find((link) => link.getAttribute("href") === `#${active.target.id}`);
      if (!current) return;
      links.forEach((item) => item.classList.remove("is-active"));
      current.classList.add("is-active");
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0.1 }
  );

  sections.forEach((section) => observer.observe(section));
};

const setupGallery = () => {
  const filterRoot = document.querySelector("[data-gallery-filter]");
  const grid = document.querySelector("[data-gallery-grid]");
  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImage = document.querySelector("[data-lightbox-image]");
  const closeButton = document.querySelector(".lightbox__close");
  if (!grid) return;

  const items = [...grid.querySelectorAll(".gallery-item")];
  filterRoot?.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterRoot.querySelectorAll(".tab-link").forEach((node) => node.classList.remove("is-active"));
      button.classList.add("is-active");
      items.forEach((item) => {
        const match = filter === "all" || item.dataset.category === filter;
        item.hidden = !match;
      });
    });
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;
      const image = item.querySelector("img");
      lightbox.hidden = false;
      body.classList.add("menu-open");
      lightboxImage.src = item.dataset.full || image?.src || "";
      lightboxImage.alt = image?.alt || "Gallery image";
    });
  });

  closeButton?.addEventListener("click", () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    body.classList.remove("menu-open");
  });

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.hidden = true;
      body.classList.remove("menu-open");
    }
  });
};

const setupBookingForm = () => {
  const bookingForm = document.querySelector("[data-booking-form]");
  if (!bookingForm) return;

  const nameInput = bookingForm.querySelector("input[name='name']");
  nameInput?.focus({ preventScroll: true });

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(bookingForm);
    const required = ["name", "phone", "date", "time", "guests"];
    const invalid = required.some((field) => !String(data.get(field) || "").trim());
    if (invalid) {
      bookingForm.reportValidity();
      return;
    }

    const message = [
      "Hi! I would like to book a cabin at Satvik The Inside Kitchen.",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Date: ${data.get("date")}`,
      `Time: ${data.get("time")}`,
      `Guests: ${data.get("guests")}`,
      `Special requests: ${data.get("notes") || "None"}`
    ].join("\n");

    window.location.href = `https://wa.me/918709055980?text=${encodeURIComponent(message)}`;
  });
};

const setupContactForm = () => {
  const contactForm = document.querySelector("[data-contact-form]");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const message = [
      "Hi! I want to contact Satvik The Inside Kitchen.",
      `Name: ${data.get("name") || ""}`,
      `Phone: ${data.get("phone") || ""}`,
      `Message: ${data.get("message") || ""}`
    ].join("\n");
    window.location.href = `https://wa.me/918709055980?text=${encodeURIComponent(message)}`;
  });
};

const registerServiceWorker = () => {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
};

toggleMenu();
setupShowMore();
setupTabs();
setupGallery();
setupBookingForm();
setupContactForm();
registerServiceWorker();
