/* Mobile menu, theme toggle and scrollspy. No dependencies. */
(function () {
    "use strict";

    /* ---- Theme toggle ------------------------------------------------- */
    var root = document.documentElement;
    var toggle = document.querySelector("[data-theme-toggle]");

    function systemPrefersDark() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    function currentTheme() {
        return root.getAttribute("data-theme") ||
               (systemPrefersDark() ? "dark" : "light");
    }

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        if (toggle) {
            toggle.setAttribute("aria-label",
                theme === "light" ? "Switch to light theme" : "Switch to dark theme");
        }
        try {
            localStorage.setItem("theme", theme);
        } catch (e) {
            /* Private browsing or blocked storage — the toggle still works
               for this page view. */
        }
    }

    if (toggle) {
        toggle.addEventListener("click", function () {
            applyTheme(currentTheme() === "dark" ? "light" : "dark");
        });
    }

    /* ---- Mobile menu -------------------------------------------------- */
    var navToggle = document.querySelector("[data-nav-toggle]");
    var navList = document.getElementById("nav-list");
    var desktop = window.matchMedia("(min-width: 901px)");

    function setMenu(open) {
        if (!navToggle || !navList) return;
        navToggle.setAttribute("aria-expanded", String(open));
        navList.hidden = !open && !desktop.matches;
    }

    function syncMenu() {
        if (!navList) return;
        if (desktop.matches) {
            navList.hidden = false;
            if (navToggle) navToggle.setAttribute("aria-expanded", "false");
        } else {
            setMenu(false);
        }
    }

    if (navToggle && navList) {
        navToggle.addEventListener("click", function () {
            setMenu(navToggle.getAttribute("aria-expanded") !== "true");
        });

        navList.addEventListener("click", function (event) {
            if (event.target.closest("a") && !desktop.matches) setMenu(false);
        });

        desktop.addEventListener("change", syncMenu);
        syncMenu();
    }

    /* ---- Scrollspy ---------------------------------------------------- */
    /* links and sections are kept index-aligned: a nav link whose target is
       missing is dropped from both. */
    var links = [];
    var sections = [];

    Array.prototype.forEach.call(
        document.querySelectorAll('.nav__link[href^="#"]'),
        function (link) {
            var section = document.querySelector(link.getAttribute("href"));
            if (section) {
                links.push(link);
                sections.push(section);
            }
        }
    );

    if (!sections.length) return;

    /* Section offsets are measured once (and on resize) so the scroll handler
       stays pure arithmetic — no layout reads, so it needs no rAF throttle. */
    var tops = [];

    function measure() {
        var scrollY = window.pageYOffset;
        tops = sections.map(function (section) {
            return section.getBoundingClientRect().top + scrollY;
        });
    }

    /* The section whose top most recently crossed a line 30% down the viewport
       wins. Comparing positions rather than intersection ratios keeps a short
       section from outranking a tall one that actually fills the screen. */
    function activeIndex() {
        var scrollY = window.pageYOffset;

        /* At the very bottom the last section can never reach the line. */
        if (scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
            return sections.length - 1;
        }

        var line = scrollY + window.innerHeight * 0.3;
        var index = 0;
        for (var i = 0; i < tops.length; i++) {
            if (tops[i] <= line) index = i;
        }
        return index;
    }

    var activeLink = null;

    function highlight() {
        var link = links[activeIndex()];
        if (link === activeLink) return;
        if (activeLink) activeLink.removeAttribute("aria-current");
        link.setAttribute("aria-current", "true");
        activeLink = link;
    }

    window.addEventListener("scroll", highlight, { passive: true });
    window.addEventListener("resize", function () {
        measure();
        highlight();
    });

    measure();
    highlight();

    /* Webfonts land after first paint and shift every offset. */
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
            measure();
            highlight();
        });
    }
})();
