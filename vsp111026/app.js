/* ==========================================================
   VenSoeng Portfolio — interactions
   ========================================================== */
(function () {
    'use strict';

    // Flag JS so CSS can safely hide .reveal elements before animating
    document.documentElement.classList.add('js');

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Mobile menu ---------- */
    function initMenu() {
        const toggle = $('#menu-toggle');
        const menu = $('#nav-links');
        if (!toggle || !menu) return;

        const setOpen = (open) => {
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            menu.classList.toggle('is-open', open);
            document.body.style.overflow = open ? 'hidden' : '';
        };

        toggle.addEventListener('click', () => {
            setOpen(toggle.getAttribute('aria-expanded') !== 'true');
        });

        // Close on link click, Escape, or resizing to desktop
        $$('a', menu).forEach((link) => link.addEventListener('click', () => setOpen(false)));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('is-open')) {
                setOpen(false);
                toggle.focus();
            }
        });
        window.matchMedia('(min-width: 834px)').addEventListener('change', (e) => {
            if (e.matches) setOpen(false);
        });
    }

    /* ---------- Nav border on scroll ---------- */
    function initNavScroll() {
        const nav = $('#nav');
        if (!nav) return;
        const update = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
        update();
        window.addEventListener('scroll', update, { passive: true });
    }

    /* ---------- Active link (scroll spy) ---------- */
    function initScrollSpy() {
        const links = $$('.nav__link[href^="#"]');
        const sections = links
            .map((link) => $(link.getAttribute('href')))
            .filter(Boolean);
        if (!sections.length || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = '#' + entry.target.id;
                links.forEach((link) => {
                    const active = link.getAttribute('href') === id;
                    link.classList.toggle('is-active', active);
                    if (active) link.setAttribute('aria-current', 'true');
                    else link.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        sections.forEach((section) => observer.observe(section));
    }

    /* ---------- Reveal on scroll ---------- */
    function initReveal() {
        const items = $$('.reveal');
        if (reduceMotion || !('IntersectionObserver' in window)) {
            items.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        // Stagger siblings inside the same grid for a smooth cascade
        items.forEach((el) => {
            const siblings = $$(':scope > .reveal', el.parentElement);
            const index = siblings.indexOf(el);
            if (index > 0) el.style.setProperty('--delay', `${Math.min(index, 6) * 70}ms`);
        });

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        items.forEach((el) => observer.observe(el));
    }

    /* ---------- Lazy YouTube embed (loads only on click) ---------- */
    function initVideos() {
        $$('.video[data-video-id]').forEach((wrap) => {
            const button = $('.video__play', wrap);
            if (!button) return;

            button.addEventListener('click', () => {
                const id = wrap.dataset.videoId;
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
                iframe.title = button.getAttribute('aria-label') || 'YouTube video player';
                iframe.allow = 'autoplay; encrypted-media; picture-in-picture; web-share';
                iframe.referrerPolicy = 'strict-origin-when-cross-origin';
                iframe.allowFullscreen = true;
                wrap.replaceChildren(iframe);
                iframe.focus();
            }, { once: true });
        });
    }

    /* ---------- Footer year ---------- */
    function initYear() {
        const year = $('#year');
        if (year) year.textContent = new Date().getFullYear();
    }

    /* ---------- Boot ---------- */
    initMenu();
    initNavScroll();
    initScrollSpy();
    initReveal();
    initVideos();
    initYear();
})();