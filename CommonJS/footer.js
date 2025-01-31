function initializeFooterFunctionality() {
    // Get the Show More button and content
    const footerFullBtn = document.querySelector('.footer-full-btn');
    const footerFullContent = document.querySelector('.footer-full-content');
    
    if (footerFullBtn && footerFullContent) {
        footerFullBtn.addEventListener('click', function() {
            // Toggle the content visibility
            footerFullContent.classList.toggle('active');
            
            // Update button text and icon
            const icon = this.querySelector('i');
            if (footerFullContent.classList.contains('active')) {
                this.innerHTML = 'Show Less <i class="las la-arrow-up"></i>';
            } else {
                this.innerHTML = 'Show More <i class="las la-arrow-down"></i>';
            }
        });
    }
}

async function includeFooterComponent(filepath, targetId) {
    try {
        const response = await fetch(filepath);
        const text = await response.text();
        
        // Insert the content
        document.getElementById(targetId).innerHTML = text;
        
        // Initialize footer functionality if this is the footer component
        if (targetId === 'footer-container') {
            initializeFooterFunctionality();
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

async function includeHeaderComponent(filepath, targetId) {
    try {
        const response = await fetch(filepath);
        const text = await response.text();
        
        // Insert the content
        document.getElementById(targetId).innerHTML = text;
        
        // Initialize footer functionality if this is the footer component
        if (targetId === 'header-container') {
            initializeHeaderFunctionality();
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}
