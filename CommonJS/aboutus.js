document.addEventListener('DOMContentLoaded', function () {
    // Initialize Swiper for leadership section
    const swiper = new Swiper('.swiper', {
      loop: false, // Disable looping
      slidesPerView: 3, // Show 3 slides on desktop
      spaceBetween: 50, // Adjust space between slides as needed
      centeredSlides: false, // Ensure slides start from the left
      pagination: {
        el: '.swiper-pagination', // Pagination container
        clickable: true, // Make pagination bullets clickable
      },
      breakpoints: {
        // Responsive breakpoints
        320: {
          slidesPerView: 1, // 1 slide on small screens
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2, // 2 slides on medium screens
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3, // 3 slides on large screens
          spaceBetween: 50,
        },
      },
    });
  });

document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.styles_root__AtyNv');

  cards.forEach(card => {
      card.addEventListener('mouseenter', function () {
          const subtitleContainer = this.querySelector('.styles_subtitleContainer__6KF5r');
          subtitleContainer.style.maxHeight = '500px'; // Adjust based on content
          subtitleContainer.style.transform = 'translateY(0)';
          subtitleContainer.style.opacity = '1';
      });

      card.addEventListener('mouseleave', function () {
          const subtitleContainer = this.querySelector('.styles_subtitleContainer__6KF5r');
          subtitleContainer.style.maxHeight = '0';
          subtitleContainer.style.transform = 'translateY(-100%)';
          subtitleContainer.style.opacity = '0';
      });
  });
});




document.addEventListener('DOMContentLoaded', function () {
    // Initialize Swiper
    const swiper = new Swiper('.swiper7', {
        loop: false, // No looping
        slidesPerView: 4, // Show 4 slides on desktop
        spaceBetween: 20, // Reduce space between slides
        centeredSlides: false, // Ensure slides start from the left
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 10,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 4, 
                spaceBetween: 20,
                pagination: false, // Disable pagination on desktop
                allowTouchMove: false, // Disable swipe on desktop
            },
        },
    });
});

  
  document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.styles_root__AtyNv');
  
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            const subtitleContainer = this.querySelector('.styles_subtitleContainer__6KF5r');
            subtitleContainer.style.maxHeight = '500px'; // Adjust based on content
            subtitleContainer.style.transform = 'translateY(0)';
            subtitleContainer.style.opacity = '1';
        });
  
        card.addEventListener('mouseleave', function () {
            const subtitleContainer = this.querySelector('.styles_subtitleContainer__6KF5r');
            subtitleContainer.style.maxHeight = '0';
            subtitleContainer.style.transform = 'translateY(-100%)';
            subtitleContainer.style.opacity = '0';
        });
    });
  });
  
