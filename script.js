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

    // Image loading handling
    const images = document.querySelectorAll('.carousel-slide img');
    
    images.forEach(img => {
        img.classList.add('loading');
        
        // Create a new image object to preload
        const preloadImage = new Image();
        preloadImage.src = img.src;
        
        preloadImage.onload = function() {
            img.classList.remove('loading');
            img.classList.add('loaded');
        };
        
        preloadImage.onerror = function() {
            console.error('Failed to load image:', img.src);
            img.classList.remove('loading');
            // You can add a fallback image here if needed
        };
    });

    // Carousel functionality
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-nav.prev');
    const nextButton = document.querySelector('.carousel-nav.next');
    const dots = document.querySelectorAll('.carousel-dot');
    
    let currentSlide = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    // Touch events
    slides.forEach((slide, index) => {
        // Touch events
        slide.addEventListener('touchstart', touchStart(index));
        slide.addEventListener('touchmove', touchMove);
        slide.addEventListener('touchend', touchEnd);
        
        // Mouse events
        slide.addEventListener('mousedown', touchStart(index));
        slide.addEventListener('mousemove', touchMove);
        slide.addEventListener('mouseup', touchEnd);
        slide.addEventListener('mouseleave', touchEnd);
    });

    // Prevent context menu
    window.oncontextmenu = function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    };

    function touchStart(index) {
        return function(event) {
            currentSlide = index;
            startPos = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
            isDragging = true;
            animationID = requestAnimationFrame(animation);
            carousel.classList.add('grabbing');
        };
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function touchEnd() {
        cancelAnimationFrame(animationID);
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -100 && currentSlide < slides.length - 1) {
            currentSlide += 1;
        } else if (movedBy > 100 && currentSlide > 0) {
            currentSlide -= 1;
        }

        setPositionByIndex();
        carousel.classList.remove('grabbing');
    }

    function animation() {
        setCarouselPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setPositionByIndex() {
        currentTranslate = currentSlide * -window.innerWidth;
        prevTranslate = currentTranslate;
        setCarouselPosition();
        updateDots();
    }

    function setCarouselPosition() {
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Navigation buttons
    prevButton.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            setPositionByIndex();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            setPositionByIndex();
        }
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            setPositionByIndex();
        });
    });

    // Auto-advance slides
    let slideInterval = setInterval(() => {
        if (!isDragging) {
            currentSlide = (currentSlide + 1) % slides.length;
            setPositionByIndex();
        }
    }, 5000);

    // Pause auto-advance on hover/touch
    carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carousel.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            if (!isDragging) {
                currentSlide = (currentSlide + 1) % slides.length;
                setPositionByIndex();
            }
        }, 5000);
    });

    // Initial setup
    setPositionByIndex();
});
