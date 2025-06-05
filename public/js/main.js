document.addEventListener('DOMContentLoaded', () => {
    const hazbinModule = document.getElementById('hazbin-module');
    const helluvaModule = document.getElementById('helluva-module');
    const ipModules = document.querySelector('.ip-modules');
    
    let modulesSticky = false;
    let modulesMerged = false;
    
    // Scroll progress indicator
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }

    // Function to handle scroll animations
    function handleScroll() {
        if (!ipModules || !hazbinModule || !helluvaModule) return;
        
        const scrollPosition = window.scrollY;
        const modulesOffset = ipModules.offsetTop;
        const mergeThreshold = modulesOffset + 300; // Adjust this value to control when modules merge
        
        // Make modules sticky when scrolling past their position
        if (scrollPosition > modulesOffset && !modulesSticky) {
            hazbinModule.classList.add('sticky');
            helluvaModule.classList.add('sticky');
            modulesSticky = true;
        } else if (scrollPosition <= modulesOffset && modulesSticky) {
            hazbinModule.classList.remove('sticky');
            helluvaModule.classList.remove('sticky');
            modulesSticky = false;
        }
        
        // Merge modules when scrolling further
        if (scrollPosition > mergeThreshold && !modulesMerged) {
            hazbinModule.classList.add('merged');
            helluvaModule.classList.add('merged');
            modulesMerged = true;
        } else if (scrollPosition <= mergeThreshold && modulesMerged) {
            hazbinModule.classList.remove('merged');
            helluvaModule.classList.remove('merged');
            modulesMerged = false;
        }
    }
    
    // Scroll-triggered animations
    function handleScrollAnimations() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Dual intro animation
        const dualContainer = document.querySelector('.dual-container');
        if (dualContainer) {
            const dualContainerTop = dualContainer.offsetTop;
            if (scrollTop + windowHeight > dualContainerTop + 100) {
                dualContainer.classList.add('visible');
            }
        }
        
        // Collision sequence
        const collisionSection = document.querySelector('.collision-section');
        if (!collisionSection) return;
        
        const collisionTop = collisionSection.offsetTop;
        const collisionHeight = collisionSection.offsetHeight;
        const collisionProgress = Math.max(0, Math.min(1, (scrollTop + windowHeight - collisionTop) / collisionHeight));
        
        const collisionTitle = document.querySelector('.collision-title');
        const floatingHazbin = document.querySelector('.floating-hazbin');
        const floatingHelluva = document.querySelector('.floating-helluva');
        const combinedHero = document.querySelector('.combined-hero');
        const continueSection = document.querySelector('.continue-section');
        
        if (collisionProgress > 0.1 && collisionTitle) {
            collisionTitle.classList.add('visible');
        }
        
        if (collisionProgress > 0.2) {
            if (floatingHazbin) floatingHazbin.classList.add('animate-in');
            if (floatingHelluva) floatingHelluva.classList.add('animate-in');
        }
        
        if (collisionProgress > 0.5) {
            if (floatingHazbin) floatingHazbin.classList.add('merge');
            if (floatingHelluva) floatingHelluva.classList.add('merge');
        }
        
        if (collisionProgress > 0.7 && combinedHero) {
            combinedHero.classList.add('reveal');
        }
        
        if (collisionProgress > 0.8 && continueSection) {
            continueSection.classList.add('visible');
        }
    }

    // Scroll to content section
    function scrollToContent() {
        const contentSection = document.querySelector('.content-section');
        contentSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Add click handler to continue button
    const continueBtn = document.querySelector('.continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', scrollToContent);
    }

    // Event listeners
    window.addEventListener('scroll', () => {
        updateScrollProgress();
        if (ipModules) handleScroll();
        handleScrollAnimations();
    });

    // Initial call
    if (ipModules) handleScroll();
    handleScrollAnimations();

    // Responsive scroll adjustments
    window.addEventListener('resize', () => {
        if (ipModules) handleScroll();
        handleScrollAnimations();
    });

    // Add scroll progress styles
    const style = document.createElement('style');
    style.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: #333;
            z-index: 1000;
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Handle watchlist button
    const watchlistButton = document.querySelector('.watchlist-button');
    if (watchlistButton) {
        watchlistButton.addEventListener('click', () => {
            const isAdded = watchlistButton.classList.toggle('added');
            watchlistButton.textContent = isAdded ? 'Added to Watchlist' : 'Add to Watchlist';
            
            // Add animation class
            watchlistButton.classList.add('clicked');
            setTimeout(() => {
                watchlistButton.classList.remove('clicked');
            }, 300);
        });
    }
    
    // Intersection Observer for module merging
    const modulesContainer = document.querySelector('.ip-modules-container');
    if (modulesContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    modulesContainer.classList.add('merging');
                } else {
                    modulesContainer.classList.remove('merging');
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px'
        });
        observer.observe(modulesContainer);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll prompt animation
    const scrollPrompt = document.querySelector('.scroll-prompt');
    if (scrollPrompt) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 100) {
                scrollPrompt.style.opacity = '0';
                scrollPrompt.style.transform = 'translate(-50%, 20px)';
            } else {
                scrollPrompt.style.opacity = '1';
                scrollPrompt.style.transform = 'translate(-50%, 0)';
            }
        });
    }

    // Merchandise Carousel
    const carousel = document.querySelector('.merch-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    const items = document.querySelectorAll('.merch-item');
    
    if (!carousel || !prevBtn || !nextBtn) return;

    const itemWidth = items[0].offsetWidth;
    const gap = 32; // 2rem gap
    const itemsPerView = Math.floor(carousel.offsetWidth / (itemWidth + gap));
    const totalItems = items.length;
    let currentIndex = 0;

    function updateCarousel() {
        const offset = currentIndex * (itemWidth + gap);
        carousel.style.transform = `translateX(-${offset}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === Math.floor(currentIndex / itemsPerView));
        });
    }

    function nextSlide() {
        if (currentIndex < totalItems - itemsPerView) {
            currentIndex++;
            updateCarousel();
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }

    // Event Listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index * itemsPerView;
            updateCarousel();
        });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newItemsPerView = Math.floor(carousel.offsetWidth / (itemWidth + gap));
            if (newItemsPerView !== itemsPerView) {
                currentIndex = Math.min(currentIndex, totalItems - newItemsPerView);
                updateCarousel();
            }
        }, 250);
    });

    // Initialize carousel
    updateCarousel();

    // Force scroll to top on page load
    window.scrollTo(0, 0);

    // Initialize hero section elements
    const heroSection = document.querySelector('.hero-section');
    const heroWelcome = document.querySelector('.hero-welcome');
    const heroDivider = document.querySelector('.hero-divider');
    const heroIpContainer = document.querySelector('.hero-ip-container');
    const heroIpLeft = document.querySelector('.hero-ip-left');
    const heroIpRight = document.querySelector('.hero-ip-right');
    const heroCombined = document.querySelector('.hero-combined');
    
    // Set initial state - only show welcome message
    if (heroSection) {
        heroSection.classList.remove('scroll-unlocked');
    }
    if (heroWelcome) {
        heroWelcome.style.display = 'block';
    }
    if (heroDivider) {
        heroDivider.style.display = 'none';
    }
    if (heroIpContainer) {
        heroIpContainer.style.display = 'none';
    }
    if (heroIpLeft) {
        heroIpLeft.style.display = 'none';
    }
    if (heroIpRight) {
        heroIpRight.style.display = 'none';
    }
    if (heroCombined) {
        heroCombined.style.display = 'none';
    }
}); 