document.addEventListener('DOMContentLoaded', function () {
    // Add animate-on-scroll class to relevant elements
    const sectionElements = document.querySelectorAll('section');
    const headings = document.querySelectorAll('section h2');
    const sectionSubtitles = document.querySelectorAll('.section-subtitle');
    const cards = document.querySelectorAll('.course-card, .service-card, .instructor-card, .pricing-card, .gallery-item');
    
    // Add animation classes
    headings.forEach(heading => heading.classList.add('animate-on-scroll'));
    sectionSubtitles.forEach(subtitle => subtitle.classList.add('animate-on-scroll'));
    cards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.transitionDelay = `${index % 3 * 0.1}s`;
    });
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    // Activate animations when scrolling
    function activateAnimations() {
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('active');
            }
        });
    }
    
    // Initial check
    activateAnimations();
    
    // Check on scroll
    window.addEventListener('scroll', activateAnimations);

    // Parallax Effect
    const parallaxElements = document.querySelectorAll('.parallax-section, .hero');

    function updateParallax() {
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const parallaxImage = element.querySelector('.parallax-image');
                if (parallaxImage) {
                    parallaxImage.style.transform = `translateY(${rate}px)`;
                }
            }
        });
    }

    // Use requestAnimationFrame for smoother animations
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Mobile Menu Toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    mobileMenu.addEventListener('click', function () {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu')) {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(faqItem => faqItem.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Image Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item img');
    let lightbox = document.querySelector('.lightbox');
    
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = '<img />';
        document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('img');

    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
        });
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // Fixed Header on Scroll
    const header = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active Link Highlighting
    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links li a[href="#${sectionId}"]`);

            if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links li a').forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // Carousel functionality
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevButton = document.querySelector('.carousel-nav.prev');
    const nextButton = document.querySelector('.carousel-nav.next');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    let autoAdvanceInterval;
    
    // Preload images
    function preloadImages() {
        slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img) {
                img.classList.add('loading');
                const image = new Image();
                image.src = img.src;
                image.onload = () => {
                    img.classList.remove('loading');
                };
                image.onerror = () => {
                    img.classList.remove('loading');
                    console.error('Failed to load image:', img.src);
                };
            }
        });
    }
    
    // Function to update the carousel state
    function updateCarousel() {
        const scrollPosition = slides[currentSlide].offsetLeft;
        carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Event listeners for navigation buttons
    prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateCarousel();
        resetAutoAdvance();
    });
    
    nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slideCount;
        updateCarousel();
        resetAutoAdvance();
    });
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
            resetAutoAdvance();
        });
    });
    
    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left
                currentSlide = (currentSlide + 1) % slideCount;
            } else {
                // Swipe right
                currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            }
            updateCarousel();
            resetAutoAdvance();
        }
    }
    
    // Auto-advance functionality
    function startAutoAdvance() {
        autoAdvanceInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slideCount;
            updateCarousel();
        }, 5000);
    }
    
    function resetAutoAdvance() {
        clearInterval(autoAdvanceInterval);
        startAutoAdvance();
    }
    
    // Initialize carousel
    preloadImages();
    updateCarousel();
    startAutoAdvance();
});
