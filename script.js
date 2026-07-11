/* =============================================================
   The Marriage Operating Manual — shared interactions
   Vanilla JS, no dependencies. Runs on both index.html + book.html
   ============================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Close after choosing a destination
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Scroll reveal via IntersectionObserver ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Radar / dial draw-on-scroll ---------- */
  const drawEls = document.querySelectorAll(".radar-draw");
  if (drawEls.length) {
    // Pre-measure stroke lengths so the dash animation is exact
    drawEls.forEach((svg) => {
      svg.querySelectorAll("path, polygon, circle, line").forEach((shape) => {
        try {
          const len = shape.getTotalLength ? shape.getTotalLength() : 400;
          shape.style.setProperty("--len", Math.ceil(len));
        } catch (e) { /* getTotalLength unsupported for some shapes */ }
      });
    });
    if (prefersReduced || !("IntersectionObserver" in window)) {
      drawEls.forEach((el) => el.classList.add("in"));
    } else {
      const dio = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.35 }
      );
      drawEls.forEach((el) => dio.observe(el));
    }
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const panel = item.querySelector(".faq-a");
      const isOpen = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      panel.style.maxHeight = isOpen ? panel.scrollHeight + "px" : null;
    });
  });
  // Recompute open panel heights on resize (text can reflow)
  window.addEventListener("resize", () => {
    document.querySelectorAll(".faq-item.open .faq-a").forEach((panel) => {
      panel.style.maxHeight = panel.scrollHeight + "px";
    });
  });

  /* ---------- Testimonial carousel arrows ---------- */
  const track = document.querySelector(".ttrack");
  if (track) {
    const step = () => {
      const card = track.querySelector(".tcard");
      return card ? card.getBoundingClientRect().width + 20 : 360;
    };
    const prev = document.querySelector(".tprev");
    const next = document.querySelector(".tnext");
    if (prev) prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    if (next) next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
  }

  /* ---------- Current year in footer ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Cookie notice ----------
     Proportionate to this site's low tracking footprint: an informational
     notice + a remembered acknowledgement. It does NOT currently gate any
     scripts, because the site runs no analytics/ad-tracking — only the
     functional MailerLite signup form and Google Fonts.
     IMPORTANT: if you later add Google Analytics, the Meta pixel, or any
     ad-tracking, upgrade this to a real consent manager that loads those
     scripts ONLY after the visitor accepts. */
  (function cookieNotice() {
    var KEY = "mom-cookie-consent";
    try {
      if (localStorage.getItem(KEY)) return; // already acknowledged
    } catch (e) {
      return; // storage blocked (e.g. private mode) — don't nag
    }
    var bar = document.createElement("div");
    bar.className = "cookie-banner";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Cookie notice");
    bar.innerHTML =
      '<p>We use a couple of cookies to run the signup form and keep the site working — nothing is sold on, and there’s no ad tracking. <a href="privacy.html">Privacy &amp; cookies</a>.</p>' +
      '<div class="cookie-actions"><button type="button" class="btn cookie-accept">Got it</button></div>';
    document.body.appendChild(bar);
    requestAnimationFrame(function () { bar.classList.add("in"); });
    bar.querySelector(".cookie-accept").addEventListener("click", function () {
      try { localStorage.setItem(KEY, "1"); } catch (e) { /* ignore */ }
      bar.classList.remove("in");
      setTimeout(function () { bar.remove(); }, 450);
    });
  })();

  /* ---------- Basic spam protection for the MailerLite form ----------
     Two cheap, no-server signals that stop the majority of bot sign-ups:
       1. Honeypot — a hidden decoy field (name="ml-website"). Humans never
          see it; bots that auto-fill every input give themselves away.
       2. Time trap — a submission that arrives within ~1.5s of page load is
          almost always scripted, not a person who typed a name and email.
     The guard runs in the capture phase so it fires BEFORE MailerLite's own
     submit handler and can cancel the send. Real submissions pass straight
     through untouched. */
  var mlWrap = document.getElementById("mlb2-43616541");
  if (mlWrap) {
    var mlForm = mlWrap.querySelector("form.ml-block-form");
    var honeypot = mlWrap.querySelector('input[name="ml-website"]');
    if (mlForm) {
      var mlLoadedAt = Date.now();
      var looksLikeBot = function () {
        var tooFast = Date.now() - mlLoadedAt < 1500;
        var potFilled = honeypot && honeypot.value.trim() !== "";
        return tooFast || potFilled;
      };
      var guard = function (e) {
        if (looksLikeBot()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
      };
      // Cover both the form submit and the button click (MailerLite may bind
      // to either); capture phase guarantees we run first.
      mlForm.addEventListener("submit", guard, true);
      var submitBtn = mlForm.querySelector('.ml-form-embedSubmit button[type="submit"]');
      if (submitBtn) submitBtn.addEventListener("click", guard, true);
    }
  }
})();
