// Parallax Effect
document.addEventListener('DOMContentLoaded', function() {
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

    window.addEventListener('scroll', updateParallax);
    window.addEventListener('resize', updateParallax);
    updateParallax();
}); 