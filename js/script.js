(function () {
  "use strict";

  /* ──────────────────────────────────────────
     Age gate
  ────────────────────────────────────────── */
  var ageGate = document.getElementById("ageGate");
  var AGE_KEY = "tangent_age_verified";

  function hideAgeGate() {
    ageGate.classList.add("is-hidden");
    ageGate.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  try {
    if (sessionStorage.getItem(AGE_KEY) === "yes") {
      hideAgeGate();
    } else {
      document.body.style.overflow = "hidden";
    }
  } catch (e) { /* storage unavailable — leave gate visible */ }

  document.getElementById("ageYes").addEventListener("click", function () {
    try { sessionStorage.setItem(AGE_KEY, "yes"); } catch (e) {}
    hideAgeGate();
  });
  document.getElementById("ageNo").addEventListener("click", function () {
    window.location.href = "https://www.google.com";
  });

  /* ──────────────────────────────────────────
     Sticky nav
  ────────────────────────────────────────── */
  var nav = document.getElementById("siteNav");

  function onScroll() {
    if (window.scrollY > 50) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
    rafParallax();
  }

  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ──────────────────────────────────────────
     Mobile menu (full-screen overlay)
  ────────────────────────────────────────── */
  var burger = document.getElementById("navBurger");
  var mobileMenu = document.getElementById("navMobile");

  burger.addEventListener("click", function () {
    var open = mobileMenu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  });

  /* Close on link click */
  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  /* Close on Escape */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
      mobileMenu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      burger.focus();
    }
  });

  /* ──────────────────────────────────────────
     Hero parallax (subtle depth on bottle)
  ────────────────────────────────────────── */
  var heroArt = document.querySelector(".hero__art");
  var ticking = false;

  function rafParallax() {
    if (!heroArt || ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var scrolled = window.scrollY;
      var maxScroll = window.innerHeight;
      var ratio = Math.min(scrolled / maxScroll, 1);
      heroArt.style.transform = "translateY(" + (ratio * 60) + "px)";
      ticking = false;
    });
  }

  /* ──────────────────────────────────────────
     Scroll reveal with stagger
  ────────────────────────────────────────── */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ──────────────────────────────────────────
     Animated bottle SVG — floating
  ────────────────────────────────────────── */
  var bottle = document.querySelector(".hero__bottle");
  if (bottle) {
    var floatStart = null;
    var FLOAT_RANGE = 14; // px
    var FLOAT_PERIOD = 5000; // ms

    function floatBottle(ts) {
      if (!floatStart) floatStart = ts;
      var elapsed = ts - floatStart;
      var phase = (elapsed % FLOAT_PERIOD) / FLOAT_PERIOD; // 0–1
      var y = -FLOAT_RANGE * Math.sin(phase * Math.PI * 2) * 0.5;
      // Add parallax offset on top
      var scrolled = window.scrollY;
      var maxScroll = window.innerHeight;
      var ratio = Math.min(scrolled / maxScroll, 1);
      bottle.parentElement.style.transform = "translateY(" + (ratio * 60 + y) + "px)";
      requestAnimationFrame(floatBottle);
    }
    requestAnimationFrame(floatBottle);

    // Remove the separate parallax since we handle it here
    heroArt = null;
  }

  /* ──────────────────────────────────────────
     Gallery lightbox
  ────────────────────────────────────────── */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lightboxFrame   = document.getElementById("lightboxFrame");
    var lightboxCaption = document.getElementById("lightboxCaption");
    var lightboxClose   = document.getElementById("lightboxClose");

    document.querySelectorAll(".gallery__item").forEach(function (item) {
      item.addEventListener("click", function () {
        var label   = item.getAttribute("data-label") || "";
        var caption = item.getAttribute("data-caption") || "";
        lightboxFrame.setAttribute("data-label", label);
        lightboxCaption.textContent = caption;
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        lightboxClose.focus();
      });
    });

    var closeLightbox = function () {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
    });
  }

})();
