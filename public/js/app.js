const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));

function closeMobileMenu() {
    if (!mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
}

function toggleMobileMenu() {
    const isOpen = !mobileMenu.classList.contains('hidden');
    if (isOpen) {
        closeMobileMenu();
        return;
    }

    mobileMenu.classList.remove('hidden');
    menuToggle.setAttribute('aria-expanded', 'true');
}

function setActiveLink(hash) {
    navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === hash;
        link.classList.toggle('text-primary', isActive);
        link.classList.toggle('border-b-2', isActive);
        link.classList.toggle('border-primary', isActive);
        link.classList.toggle('text-on-surface-variant', !isActive);
    });
}

function handleLinkClick(event) {
    const href = event.currentTarget.getAttribute('href');
    if (!href.startsWith('#')) {
        return;
    }

    event.preventDefault();
    const targetSection = document.querySelector(href);
    if (!targetSection) {
        return;
    }

    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveLink(href);
    closeMobileMenu();
}

menuToggle?.addEventListener('click', toggleMobileMenu);
navLinks.forEach((link) => link.addEventListener('click', handleLinkClick));

const sections = Array.from(document.querySelectorAll('section[id]'));
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            setActiveLink(`#${entry.target.id}`);
        });
    },
    {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.2,
    }
);

sections.forEach((section) => observer.observe(section));

document.addEventListener('click', (event) => {
    if (!mobileMenu || !menuToggle) {
        return;
    }

    const target = event.target;
    if (mobileMenu.contains(target) || menuToggle.contains(target)) {
        return;
    }

    closeMobileMenu();
});
