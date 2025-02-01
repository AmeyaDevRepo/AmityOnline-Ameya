// KEY SPECIALIZATION JS


document.addEventListener('DOMContentLoaded', () => {
	const carouselContainers = document.querySelectorAll('.iso-carousel');
	carouselContainers.forEach(container => {
		new IsoCarousel(container);
	});
});

class IsoCarousel {
	constructor(container) {
		this.container = container;
		this.wrapper = container.querySelector('.iso-swiper-wrapper');
		this.wrapper = container.querySelector('.iso-swiper-wrapper-2');
		this.slides = Array.from(container.querySelectorAll('.iso-swiper-slide'));
		this.pagination = container.querySelector('.iso-swiper-pagination');

		// Generate a unique ID for this carousel instance
		this.id = 'carousel-' + Math.random().toString(36).substr(2, 9);
		this.container.setAttribute('data-carousel-id', this.id);

		this.currentIndex = 0;
		this.slideCount = this.slides.length;
		this.isAnimating = false;
		this.isMobile = window.innerWidth <= 768;

		this.init();
	}

	init() {
		// Create pagination bullets
		this.createPagination();

		// Initial positioning
		this.updateSlidePositions();

		// Set up autoplay
		this.startAutoplay();

		// Add event listeners
		this.addEventListeners();

		// Add resize handler
		window.addEventListener('resize', () => {
			this.isMobile = window.innerWidth <= 768;
			this.updateSlidePositions();
		});
	}

	//Slide positioning Updates
	updateSlidePositions() {
		const slideWidth = this.isMobile ? this.container.offsetWidth : 280;
		const slideSpacing = this.isMobile ? 0 : 20;
		this.wrapper.style.transform = `translateX(-${this.currentIndex * (slideWidth + slideSpacing)}px)`;
	}

	//Pagination Controls
	createPagination() {
		this.bullets = [];
		this.pagination.innerHTML = ''; // Clear existing bullets

		for (let i = 0; i < this.slideCount; i++) {
			const bullet = document.createElement('div');
			bullet.className = `iso-pagination-bullet${i === 0 ? ' iso-pagination-bullet-active' : ''}`;
			bullet.setAttribute('data-carousel-id', this.id);
			bullet.addEventListener('click', () => this.goToSlide(i));
			this.pagination.appendChild(bullet);
			this.bullets.push(bullet);
		}
	}

	addEventListeners() {
		let startX = 0;
		let currentX = 0;

		const touchStart = (e) => {
			this.stopAutoplay();
			startX = e.touches ? e.touches[0].clientX : e.clientX;
			currentX = startX;
			this.wrapper.style.transition = 'none';
		};

		//Touch Moves
		const touchMove = (e) => {
			if (this.isAnimating) return;
			currentX = e.touches ? e.touches[0].clientX : e.clientX;
			const diff = currentX - startX;
			const slideWidth = this.isMobile ? this.container.offsetWidth : 280;
			const slideSpacing = this.isMobile ? 0 : 20;
			const transform = -(this.currentIndex * (slideWidth + slideSpacing)) + diff;
			this.wrapper.style.transform = `translateX(${transform}px)`;
		};

		const touchEnd = () => {
			const diff = currentX - startX;
			if (Math.abs(diff) > 50) {
				if (diff > 0) this.prev();
				else this.next();
			} else {
				this.goToSlide(this.currentIndex);
			}
			this.startAutoplay();
		};

		// Touch events
		this.wrapper.addEventListener('touchstart', touchStart);
		this.wrapper.addEventListener('touchmove', touchMove);
		this.wrapper.addEventListener('touchend', touchEnd);

		// Mouse events
		this.wrapper.addEventListener('mousedown', (e) => {
			e.preventDefault();
			touchStart(e);

			const mouseMoveHandler = (e) => {
				touchMove(e);
			};

			const mouseUpHandler = () => {
				touchEnd();
				document.removeEventListener('mousemove', mouseMoveHandler);
				document.removeEventListener('mouseup', mouseUpHandler);
			};

			document.addEventListener('mousemove', mouseMoveHandler);
			document.addEventListener('mouseup', mouseUpHandler);
		});

		// Mouse enter/leave for autoplay
		this.wrapper.addEventListener('mouseenter', () => this.stopAutoplay());
		this.wrapper.addEventListener('mouseleave', () => this.startAutoplay());
	}

	goToSlide(index, animate = true) {
		if (this.isAnimating || index < 0 || index >= this.slideCount) return;

		this.isAnimating = true;
		this.currentIndex = index;

		// Update pagination
		this.bullets.forEach((bullet, i) => {
			bullet.classList.toggle('iso-pagination-bullet-active', i === index);
		});

		// Calculate slide width based on viewport
		const slideWidth = this.isMobile ? this.container.offsetWidth : 280;
		const slideSpacing = this.isMobile ? 0 : 20;

		// Move wrapper
		const transform = -(index * (slideWidth + slideSpacing));
		this.wrapper.style.transition = animate ? 'transform 0.3s ease-out' : 'none';
		this.wrapper.style.transform = `translateX(${transform}px)`;

		setTimeout(() => {
			this.isAnimating = false;
		}, 300);
	}

	//Slide Buttons

	next() {
		if (this.currentIndex < this.slideCount - 1) {
			this.goToSlide(this.currentIndex + 1);
		}
	}

	prev() {
		if (this.currentIndex > 0) {
			this.goToSlide(this.currentIndex - 1);
		}
	}

	//AutoPlay in Carousal

	startAutoplay() {
		this.stopAutoplay();
		this.autoplayInterval = setInterval(() => {
			if (this.currentIndex < this.slideCount - 1) {
				this.next();
			} else {
				this.goToSlide(0);
			}
		}, 5000);
	}

	stopAutoplay() {
		if (this.autoplayInterval) {
			clearInterval(this.autoplayInterval);
			this.autoplayInterval = null;
		}
	}
}


// Swiper
const initializeSwiper = () => {
	const swiperElement = document.querySelector('#Carousel .swiper');
	if (!swiperElement) return;

	const slideCount = swiperElement.querySelectorAll('.swiper-slide').length;

	// Always enable loop for better user experience
	const shouldLoop = true;

	const specializationSwiper = new Swiper('#Carousel .swiper', {
		init: false,
		slidesPerView: 'auto',
		spaceBetween: 20,
		loop: shouldLoop,
		loopedSlides: slideCount,
		preventInteractionOnTransition: true,

		pagination: {
			el: '#Carousel .swiper-pagination',
			clickable: true,
			bulletClass: 'swiper-pagination-bullet',
			bulletActiveClass: 'swiper-pagination-bullet-active',
			renderBullet: function (index, className) {
				return `<span class="${className}"></span>`;
			},
			// Disable dynamic bullets to show all pagination bullets
			dynamicBullets: false
		},

		breakpoints: {
			320: {
				slidesPerView: 1,
				spaceBetween: 20,
				centeredSlides: true
			},
			768: {
				slidesPerView: Math.min(slideCount, 2),
				spaceBetween: 20,
				centeredSlides: false
			},
			1024: {
				slidesPerView: Math.min(slideCount, 2),
				spaceBetween: 20,
				centeredSlides: false
			}
		},

		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
			enabled: true,
			waitForTransition: true
		},

		effect: 'slide',
		speed: 800,

		navigation: {
			nextEl: '#Carousel .swiper-button-next',
			prevEl: '#Carousel .swiper-button-prev',
		},

		observer: true,
		observeParents: true,
		watchOverflow: true,
		watchSlidesProgress: true,

		on: {
			init: function () {
				// Force pagination visibility
				const paginationEl = document.querySelector('#Carousel .swiper-pagination');
				if (paginationEl) {
					paginationEl.style.display = 'block';

					// Create pagination bullets based on actual slide count
					paginationEl.innerHTML = '';
					for (let i = 0; i < slideCount; i++) {
						const bullet = document.createElement('span');
						bullet.className = `swiper-pagination-bullet${i === 0 ? ' swiper-pagination-bullet-active' : ''}`;
						bullet.addEventListener('click', () => {
							this.slideToLoop(i);
						});
						paginationEl.appendChild(bullet);
					}
				}

				// Make slides visible
				swiperElement.querySelectorAll('.swiper-slide').forEach(slide => {
					slide.style.visibility = 'visible';
					slide.style.opacity = '1';
				});
			},

			slideChange: function () {
				// Update pagination bullets on slide change
				const paginationEl = document.querySelector('#Carousel .swiper-pagination');
				if (paginationEl) {
					const bullets = paginationEl.querySelectorAll('.swiper-pagination-bullet');
					const realIndex = this.realIndex;

					bullets.forEach((bullet, index) => {
						bullet.classList.toggle('swiper-pagination-bullet-active', index === realIndex);
					});
				}
			}
		}
	});

	specializationSwiper.init();

	// Update Swiper on window resize
	window.addEventListener('resize', () => {
		specializationSwiper.update();
	});

	// Update styles
	const style = document.createElement('style');
	style.textContent = `
	  #Carousel .swiper {
		padding: 0;
		position: relative;
		margin-bottom: 40px;
	  }
  
	  #Carousel .swiper-wrapper {
		display: flex;
		align-items: center;
	  }
	  #Carousel .swiper-wrapper-2 {
		display: flex;
		align-items: center;
	  }
  
	  #Carousel .swiper-slide {
		visibility: visible !important;
		opacity: 1 !important;
		width: 280px !important;
	  }
  
	  #Carousel .swiper-pagination {
		display: block !important;
		position: absolute;
		bottom: -30px;
		left: 0;
		right: 0;
		text-align: center;
		z-index: 10;
		opacity: 1;
		visibility: visible;
	  }
  
	  #Carousel .swiper-pagination-bullet {
		width: 10px;
		height: 10px;
		background: #D4D4D4;
		opacity: 1;
		margin: 0 5px;
		cursor: pointer;
		display: inline-block;
		border-radius: 50%;
		transition: background-color 0.3s ease;
	  }
  
	  #Carousel .swiper-pagination-bullet-active {
		background: #0066CC;
	  }
  
	  @media (max-width: 767px) {
		#Carousel .swiper-wrapper {
		  justify-content: flex-start;
		}
		#Carousel .swiper-wrapper-2 {
		  justify-content: flex-start;
		}
		
		#Carousel .swiper-slide {
		  width: 100% !important;
		}
	  }
	`;
	document.head.appendChild(style);
};


$('.header-search-icon').click(function () {
	$('#search-input').toggleClass('active');
});


if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeSwiper);
} else {
	initializeSwiper();
}



//JS for holistic services 
$(document).ready(function () {
	$('.accre').owlCarousel({
		margin: 30,
		nav: false,
		loop: false,
		autoplay: false,
		autoplayTimeout: 3000,
		smartSpeed: 1000,
		dots: true,
		navText: ['<i class="las la-angle-left"></i>', '<i class="las la-angle-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 2
			},
			1000: {
				items: 3
			}
		}
	});

	//Advantage Page Carousel
	$('.advantage').owlCarousel({
		margin: 20,
		nav: false,
		loop: false,
		autoplay: false,
		autoplayTimeout: 3000,
		smartSpeed: 1000,
		dots: true,
		navText: ['<i class="las la-angle-left"></i>', '<i class="las la-angle-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 3
			},
			1000: {
				items: 5
			}
		}
	});
	$('.cs-slider').owlCarousel({
		margin: 20,
		nav: false,
		loop: false,
		autoplay: false,
		autoplayTimeout: 3000,
		smartSpeed: 1000,
		dots: true,
		navText: ['<i class="las la-angle-left"></i>', '<i class="las la-angle-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 3
			},
			1000: {
				items: 4
			}
		}
	});

	//Testimonial Slider
	$('.testimonial-slider').owlCarousel({
		margin: 30,
		nav: false,
		loop: false,
		autoplay: false,
		autoplayTimeout: 3000,
		smartSpeed: 1000,
		dots: true,
		navText: ['<i class="las la-angle-left"></i>', '<i class="las la-angle-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 3
			},
			1000: {
				items: 4
			}
		}
	});
	$('.rec-slider').owlCarousel({
		margin: 0,
		nav: true,
		loop: true,
		autoplay: false,
		autoplayTimeout: 4000,
		smartSpeed: 500,
		dots: true,
		navText: ['<i class="las la-angle-left"></i>', '<i class="las la-angle-right"></i>'],
		responsive: {
			0: {
				items: 2
			},
			600: {
				items: 4
			},
			1000: {
				items: 6
			}
		}
	});

	//Mentor Slider
	$('.mentor').owlCarousel({
		margin: 40,
		nav: false,
		loop: true,
		autoplay: false,
		autoplayTimeout: 3000,
		smartSpeed: 1000,
		dots: true,
		navText: ['<i class="las la-angle-left"></i>', '<i class="las la-angle-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 2
			},
			1000: {
				items: 3
			}
		}
	});
	$('.owl-one').owlCarousel({
		margin: 40,
		nav: false,
		loop: false,
		autoplay: false,
		autoplayTimeout: 6000,
		smartSpeed: 1000,
		dots: true,
		navText: ['<i class="las la-angle-left"></i>', '<i class="las la-angle-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 3
			},
			1000: {
				items: 3
			}
		}
	});

	//Student Slider
	$('.student').owlCarousel({
		margin: 40,
		nav: false,
		loop: false,
		autoplay: false,
		autoplayTimeout: 3000,
		smartSpeed: 1000,
		dots: true,
		navText: ['<i class="las la-angle-left"></i>', '<i class="las la-angle-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 1
			},
			1000: {
				items: 1
			}
		}
	});
	$('.owl-two').owlCarousel({
		margin: 30,
		nav: true,
		loop: true,
		autoplay: false,
		autoplayTimeout: 6000,
		smartSpeed: 1000,
		dots: false,
		navText: ['<i class="las la-arrow-left"></i>', '<i class="las la-arrow-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 3
			},
			1000: {
				items: 4
			}
		}
	});
	$('.owl-three').owlCarousel({
		margin: 0,
		nav: true,
		loop: true,
		autoplay: false,
		autoplayTimeout: 6000,
		smartSpeed: 1000,
		dots: false,
		navText: ['<i class="las la-angle-left"></i>', '<i class="las la-angle-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 4
			},
			1000: {
				items: 5
			}
		}
	});


});



scrollOffset = 200;

$(window).scroll(function () {
	$('.scroll').each(function () {
		//console.log(this+$(this).position().top);
		if ($(window).scrollTop() + $(window).height() >= $(this).position().top && $(window).scrollTop() < $(this).position().top + $(this).height()) {
			//console.log(this+$(this).position().top);
			//if ($(this).hasClass('wpb_start_animation')){
			if (!$(this).hasClass('scrollin')) {
				$(this).addClass('scrollin');
			}
		}
		else if ($(this).hasClass('scrollin')) {
			//console.log(this+$(this).position().top);
			//if ($(this).hasClass('wpb_start_animation')){
			$(this).removeClass('scrollin');
			//}
		}
	});
});


//Scroll Functionality for the career services hear from our hiring partners section
function enableScroll(elementId) {
	const container = document.getElementById(elementId);
	let isDown = false;
	let startX;
	let scrollLeft;

	container.addEventListener('mousedown', (e) => {
		isDown = true;
		startX = e.pageX - container.offsetLeft;
		scrollLeft = container.scrollLeft;
	});

	container.addEventListener('mouseleave', () => {
		isDown = false;
	});

	container.addEventListener('mouseup', () => {
		isDown = false;
	});

	container.addEventListener('mousemove', (e) => {
		if (!isDown) return;
		e.preventDefault();
		const x = e.pageX - container.offsetLeft;
		const walk = (x - startX);
		container.scrollLeft = scrollLeft - walk;
	});
}

enableScroll('landingPageFacultyList');


document.addEventListener('DOMContentLoaded', function () {
    var swiper = new Swiper('.swiper4', {
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        // 移动端配置
        breakpoints: {
            480: { // 当屏幕宽度小于等于 480px 时
                slidesPerView: 1, // 每页显示 1 个滑块
                spaceBetween: 10, // 滑块间距
            },
            768: { // 当屏幕宽度大于 480px 时
                slidesPerView: 4, // 每页显示 2 个滑块
                spaceBetween: 20, // 滑块间距
            },
        },
    });
});