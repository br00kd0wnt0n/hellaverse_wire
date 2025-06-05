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
        const dualContainerTop = dualContainer.offsetTop;
        if (scrollTop + windowHeight > dualContainerTop + 100) {
            dualContainer.classList.add('visible');
        }
        
        // Collision sequence
        const collisionSection = document.querySelector('.collision-section');
        const collisionTop = collisionSection.offsetTop;
        const collisionHeight = collisionSection.offsetHeight;
        const collisionProgress = Math.max(0, Math.min(1, (scrollTop + windowHeight - collisionTop) / collisionHeight));
        
        const collisionTitle = document.querySelector('.collision-title');
        const floatingHazbin = document.querySelector('.floating-hazbin');
        const floatingHelluva = document.querySelector('.floating-helluva');
        const combinedHero = document.querySelector('.combined-hero');
        const continueSection = document.querySelector('.continue-section');
        
        if (collisionProgress > 0.1) {
            collisionTitle.classList.add('visible');
        }
        
        if (collisionProgress > 0.2) {
            floatingHazbin.classList.add('animate-in');
            floatingHelluva.classList.add('animate-in');
        }
        
        if (collisionProgress > 0.5) {
            floatingHazbin.classList.add('merge');
            floatingHelluva.classList.add('merge');
        }
        
        if (collisionProgress > 0.7) {
            combinedHero.classList.add('reveal');
        }
        
        if (collisionProgress > 0.8) {
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
        handleScrollAnimations();
    });

    // Initial call
    handleScrollAnimations();

    // Responsive scroll adjustments
    window.addEventListener('resize', handleScrollAnimations);

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
    
    // Initialize scroll position
    handleScroll();
}); 