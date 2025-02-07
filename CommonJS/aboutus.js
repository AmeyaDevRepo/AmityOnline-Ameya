document.addEventListener('DOMContentLoaded', function () {
  // Initialize Swiper
  const swiper = new Swiper('.swiper', {
      // Optional parameters
      loop: true, // Enable looping
      slidesPerView: 3, // Number of slides per view
      spaceBetween: 30, // Space between slides
      centeredSlides: true, // Center the active slide
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
              spaceBetween: 30,
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