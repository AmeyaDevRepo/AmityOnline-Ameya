
    const swiper = new Swiper('.StudentsCarousel_carousel__XLxe_', {
        // Optional parameters
        slidesPerView: 1,
        spaceBetween: 16,
        loop: true,
        
        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        
        // Auto play if needed
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        
        // Optional Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    });

    // Handle video play buttons
    document.querySelectorAll('[aria-label="play"]').forEach(button => {
        button.addEventListener('click', function() {
            // Add your video play logic here
            console.log('Video play button clicked');
        });
    });

  const swiper2 = new Swiper('.Carousel__newsletter', {
      // Enable loop
      loop: true,
      
      // Responsive breakpoints
      breakpoints: {
          // Mobile (320px and up)
          320: {
              slidesPerView: 2,
              spaceBetween: 10,
              slidesPerGroup: 2
          },
          // Tablet (768px and up)
          768: {
              slidesPerView: 4,
              spaceBetween: 15,
              slidesPerGroup: 2
          },
          // Desktop (1024px and up)
          1024: {
              slidesPerView: 5,
              spaceBetween: 20,
              slidesPerGroup: 2
          }
      },
      
      // Enable pagination
      pagination: {
          el: '.swiper-pagination',
          clickable: true
      },

      // Auto play settings
      autoplay: {
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
      },

      // Accessibility
      a11y: {
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          firstSlideMessage: 'This is the first slide',
          lastSlideMessage: 'This is the last slide'
      },

      // Speed of transition
      speed: 800,

      // Enable grabbing cursor
      grabCursor: true,

      // Smooth transition effect
      effect: 'slide',

      // Enable keyboard navigation
      keyboard: {
          enabled: true,
          onlyInViewport: true
      }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
      swiper2.update();
  });

  // Optional: Add lazy loading for images
  document.addEventListener('DOMContentLoaded', function() {
      const images = document.querySelectorAll('.HiringPartenersCard img');
      images.forEach(img => {
          img.loading = 'lazy';
      });
  });
