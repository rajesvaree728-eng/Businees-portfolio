/**
 * Rayaweb - Core Website Functionality
 * Handles: Dark/Light Mode, Scroll Animations, Navbar Shadows, and Performance Tuning
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeManager();
    initScrollAnimations();
    initNavbarStickyState();
    initMobilePerformance();
});

/**
 * 1. THEME MANAGER (Dark / Light Mode Toggle)
 * Synchronises UI state with localStorage settings for continuous user experience
 */
function initThemeManager() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    // Check for saved preference or user system setting
    const savedTheme = localStorage.getItem('rayaweb-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply initial theme state
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        themeToggleBtn.textContent = 'Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggleBtn.textContent = 'Dark Mode';
    }

    // Toggle click event with state handling
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        const isDarkNow = document.body.classList.contains('dark-mode');
        themeToggleBtn.textContent = isDarkNow ? 'Light Mode' : 'Dark Mode';
        localStorage.setItem('rayaweb-theme', isDarkNow ? 'dark' : 'light');
        
        // Micro-interaction click effect
        themeToggleBtn.style.transform = 'scale(0.95)';
        setTimeout(() => themeToggleBtn.style.transform = 'none', 100);
    });
}

/**
 * 2. INTERSECTION OBSERVER SCROLL ANIMATIONS
 * Hardware-accelerated entry transitions as the user browses layout sections
 */
function initScrollAnimations() {
    // Add smooth CSS transition definitions dynamically to prevent layout shifts on load
    const styleSheet = document.createElement('style');
    styleSheet.innerText = `
        .reveal-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1), 
                        transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
            will-change: transform, opacity;
        }
        .reveal-element.active {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(styleSheet);

    // Target parent layouts to animate their children smoothly
    const animatedSelectors = [
        '.hero-text', '.hero-image', 
        '.work-item', '.build-item', 
        '.why-item', '.process-step',
        '.about-text', '.about-image',
        '.tech-item', '.faq-item', '.final-cta'
    ];

    const elementsToAnimate = document.querySelectorAll(animatedSelectors.join(','));
    
    // Add base hidden state class
    elementsToAnimate.forEach(el => el.classList.add('reveal-element'));

    // Create threshold configurations for structural activation
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Kill monitoring once rendered to save memory
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px' // Activates just before entering visible screen space
    });

    elementsToAnimate.forEach(el => animationObserver.observe(el));
}

/**
 * 3. STICKY NAVBAR BACKDROP CONTROL
 * Elevates header layout with drop-shadow layers on scrolling actions
 */
function initNavbarStickyState() {
    const header = document.querySelector('header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.style.boxShadow = 'var(--shadow-md)';
            header.style.padding = '4px 0'; // Slight collapse compression effect
        } else {
            header.style.boxShadow = 'none';
            header.style.padding = '0';
        }
    };

    // Debounce scroll listener calculation loops for native device rendering safety
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * 4. MOBILE INTERACTION TUNING
 * Smooths performance parameters for custom link target navigation paths
 */
function initMobilePerformance() {
    // Offset correction logic for modern floating navbar positions
    const allInternalLinks = document.querySelectorAll('a[href^="#"]');
    const headerHeight = document.querySelector('header')?.offsetHeight || 80;

    allInternalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 10;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
