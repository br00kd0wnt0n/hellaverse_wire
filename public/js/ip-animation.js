document.addEventListener('DOMContentLoaded', function() {
    const scrollSection = document.querySelector('.dual-intro-section');
    const ipModules = document.querySelector('.ip-modules');
    let hasMerged = false;
    
    // Debug element existence
    console.log('IP Animation elements found:', {
        scrollSection: !!scrollSection,
        ipModules: !!ipModules
    });
    
    function handleScroll() {
        if (!ipModules || !scrollSection) return;
        
        const rect = ipModules.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementCenter = rect.top + (rect.height / 2);
        const screenCenter = windowHeight / 2;
        
        // Calculate how close the element is to the center of the screen
        const distanceFromCenter = Math.abs(elementCenter - screenCenter);
        const threshold = windowHeight * 0.2; // 20% of viewport height
        
        // Once merged, stay merged
        if (hasMerged) {
            scrollSection.classList.add('scrolled');
            return;
        }
        
        if (distanceFromCenter < threshold) {
            scrollSection.classList.add('scrolled');
            hasMerged = true;
        } else {
            scrollSection.classList.remove('scrolled');
        }
    }
    
    // Add scroll event listener with throttling
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (ipModules && scrollSection) handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial check
    if (ipModules && scrollSection) handleScroll();
}); 