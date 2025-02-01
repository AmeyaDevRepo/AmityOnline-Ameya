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


/**
 * Owl Carousel v2.3.4
 * Copyright 2013-2018 David Deutsch
 * Licensed under: SEE LICENSE IN https://github.com/OwlCarousel2/OwlCarousel2/blob/master/LICENSE
 */
/**
 * Owl carousel
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 * @todo Lazy Load Icon
 * @todo prevent animationend bubling
 * @todo itemsScaleUp
 * @todo Test Zepto
 * @todo stagePadding calculate wrong active classes
 */
; (function ($, window, document, undefined) {

	/**
	 * Creates a carousel.
	 * @class The Owl Carousel.
	 * @public
	 * @param {HTMLElement|jQuery} element - The element to create the carousel for.
	 * @param {Object} [options] - The options
	 */
	function Owl(element, options) {

		/**
		 * Current settings for the carousel.
		 * @public
		 */
		this.settings = null;

		/**
		 * Current options set by the caller including defaults.
		 * @public
		 */
		this.options = $.extend({}, Owl.Defaults, options);

		/**
		 * Plugin element.
		 * @public
		 */
		this.$element = $(element);

		/**
		 * Proxied event handlers.
		 * @protected
		 */
		this._handlers = {};

		/**
		 * References to the running plugins of this carousel.
		 * @protected
		 */
		this._plugins = {};

		/**
		 * Currently suppressed events to prevent them from being retriggered.
		 * @protected
		 */
		this._supress = {};

		/**
		 * Absolute current position.
		 * @protected
		 */
		this._current = null;

		/**
		 * Animation speed in milliseconds.
		 * @protected
		 */
		this._speed = null;

		/**
		 * Coordinates of all items in pixel.
		 * @todo The name of this member is missleading.
		 * @protected
		 */
		this._coordinates = [];

		/**
		 * Current breakpoint.
		 * @todo Real media queries would be nice.
		 * @protected
		 */
		this._breakpoint = null;

		/**
		 * Current width of the plugin element.
		 */
		this._width = null;

		/**
		 * All real items.
		 * @protected
		 */
		this._items = [];

		/**
		 * All cloned items.
		 * @protected
		 */
		this._clones = [];

		/**
		 * Merge values of all items.
		 * @todo Maybe this could be part of a plugin.
		 * @protected
		 */
		this._mergers = [];

		/**
		 * Widths of all items.
		 */
		this._widths = [];

		/**
		 * Invalidated parts within the update process.
		 * @protected
		 */
		this._invalidated = {};

		/**
		 * Ordered list of workers for the update process.
		 * @protected
		 */
		this._pipe = [];

		/**
		 * Current state information for the drag operation.
		 * @todo #261
		 * @protected
		 */
		this._drag = {
			time: null,
			target: null,
			pointer: null,
			stage: {
				start: null,
				current: null
			},
			direction: null
		};

		/**
		 * Current state information and their tags.
		 * @type {Object}
		 * @protected
		 */
		this._states = {
			current: {},
			tags: {
				'initializing': ['busy'],
				'animating': ['busy'],
				'dragging': ['interacting']
			}
		};

		$.each(['onResize', 'onThrottledResize'], $.proxy(function (i, handler) {
			this._handlers[handler] = $.proxy(this[handler], this);
		}, this));

		$.each(Owl.Plugins, $.proxy(function (key, plugin) {
			this._plugins[key.charAt(0).toLowerCase() + key.slice(1)]
				= new plugin(this);
		}, this));

		$.each(Owl.Workers, $.proxy(function (priority, worker) {
			this._pipe.push({
				'filter': worker.filter,
				'run': $.proxy(worker.run, this)
			});
		}, this));

		this.setup();
		this.initialize();
	}

	/**
	 * Default options for the carousel.
	 * @public
	 */
	Owl.Defaults = {
		items: 3,
		loop: false,
		center: false,
		rewind: false,
		checkVisibility: true,

		mouseDrag: true,
		touchDrag: true,
		pullDrag: true,
		freeDrag: false,

		margin: 0,
		stagePadding: 0,

		merge: false,
		mergeFit: true,
		autoWidth: false,

		startPosition: 0,
		rtl: false,

		smartSpeed: 250,
		fluidSpeed: false,
		dragEndSpeed: false,

		responsive: {},
		responsiveRefreshRate: 200,
		responsiveBaseElement: window,

		fallbackEasing: 'swing',
		slideTransition: '',

		info: false,

		nestedItemSelector: false,
		itemElement: 'div',
		stageElement: 'div',

		refreshClass: 'owl-refresh',
		loadedClass: 'owl-loaded',
		loadingClass: 'owl-loading',
		rtlClass: 'owl-rtl',
		responsiveClass: 'owl-responsive',
		dragClass: 'owl-drag',
		itemClass: 'owl-item',
		stageClass: 'owl-stage',
		stageOuterClass: 'owl-stage-outer',
		grabClass: 'owl-grab'
	};

	/**
	 * Enumeration for width.
	 * @public
	 * @readonly
	 * @enum {String}
	 */
	Owl.Width = {
		Default: 'default',
		Inner: 'inner',
		Outer: 'outer'
	};

	/**
	 * Enumeration for types.
	 * @public
	 * @readonly
	 * @enum {String}
	 */
	Owl.Type = {
		Event: 'event',
		State: 'state'
	};

	/**
	 * Contains all registered plugins.
	 * @public
	 */
	Owl.Plugins = {};

	/**
	 * List of workers involved in the update process.
	 */
	Owl.Workers = [{
		filter: ['width', 'settings'],
		run: function () {
			this._width = this.$element.width();
		}
	}, {
		filter: ['width', 'items', 'settings'],
		run: function (cache) {
			cache.current = this._items && this._items[this.relative(this._current)];
		}
	}, {
		filter: ['items', 'settings'],
		run: function () {
			this.$stage.children('.cloned').remove();
		}
	}, {
		filter: ['width', 'items', 'settings'],
		run: function (cache) {
			let margin = this.settings.margin || '',
				grid = !this.settings.autoWidth,
				rtl = this.settings.rtl,
				css = {
					'width': 'auto',
					'margin-left': rtl ? margin : '',
					'margin-right': rtl ? '' : margin
				};

			!grid && this.$stage.children().css(css);

			cache.css = css;
		}
	}, {
		filter: ['width', 'items', 'settings'],
		run: function (cache) {
			let width = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
				merge = null,
				iterator = this._items.length,
				grid = !this.settings.autoWidth,
				widths = [];

			cache.items = {
				merge: false,
				width: width
			};

			while (iterator--) {
				merge = this._mergers[iterator];
				merge = this.settings.mergeFit && Math.min(merge, this.settings.items) || merge;

				cache.items.merge = merge > 1 || cache.items.merge;

				widths[iterator] = !grid ? this._items[iterator].width() : width * merge;
			}

			this._widths = widths;
		}
	}, {
		filter: ['items', 'settings'],
		run: function () {
			let clones = [],
				items = this._items,
				settings = this.settings,
				// TODO: Should be computed from number of min width items in stage
				view = Math.max(settings.items * 2, 4),
				size = Math.ceil(items.length / 2) * 2,
				repeat = settings.loop && items.length ? settings.rewind ? view : Math.max(view, size) : 0,
				append = '',
				prepend = '';

			repeat /= 2;

			while (repeat > 0) {
				// Switch to only using appended clones
				clones.push(this.normalize(clones.length / 2, true));
				append = append + items[clones[clones.length - 1]][0].outerHTML;
				clones.push(this.normalize(items.length - 1 - (clones.length - 1) / 2, true));
				prepend = items[clones[clones.length - 1]][0].outerHTML + prepend;
				repeat -= 1;
			}

			this._clones = clones;

			$(append).addClass('cloned').appendTo(this.$stage);
			$(prepend).addClass('cloned').prependTo(this.$stage);
		}
	}, {
		filter: ['width', 'items', 'settings'],
		run: function () {
			let rtl = this.settings.rtl ? 1 : -1,
				size = this._clones.length + this._items.length,
				iterator = -1,
				previous = 0,
				current = 0,
				coordinates = [];

			while (++iterator < size) {
				previous = coordinates[iterator - 1] || 0;
				current = this._widths[this.relative(iterator)] + this.settings.margin;
				coordinates.push(previous + current * rtl);
			}

			this._coordinates = coordinates;
		}
	}, {
		filter: ['width', 'items', 'settings'],
		run: function () {
			let padding = this.settings.stagePadding,
				coordinates = this._coordinates,
				css = {
					'width': Math.ceil(Math.abs(coordinates[coordinates.length - 1])) + padding * 2,
					'padding-left': padding || '',
					'padding-right': padding || ''
				};

			this.$stage.css(css);
		}
	}, {
		filter: ['width', 'items', 'settings'],
		run: function (cache) {
			let iterator = this._coordinates.length,
				grid = !this.settings.autoWidth,
				items = this.$stage.children();

			if (grid && cache.items.merge) {
				while (iterator--) {
					cache.css.width = this._widths[this.relative(iterator)];
					items.eq(iterator).css(cache.css);
				}
			} else if (grid) {
				cache.css.width = cache.items.width;
				items.css(cache.css);
			}
		}
	}, {
		filter: ['items'],
		run: function () {
			this._coordinates.length < 1 && this.$stage.removeAttr('style');
		}
	}, {
		filter: ['width', 'items', 'settings'],
		run: function (cache) {
			cache.current = cache.current ? this.$stage.children().index(cache.current) : 0;
			cache.current = Math.max(this.minimum(), Math.min(this.maximum(), cache.current));
			this.reset(cache.current);
		}
	}, {
		filter: ['position'],
		run: function () {
			this.animate(this.coordinates(this._current));
		}
	}, {
		filter: ['width', 'position', 'items', 'settings'],
		run: function () {
			let rtl = this.settings.rtl ? 1 : -1,
				padding = this.settings.stagePadding * 2,
				begin = this.coordinates(this.current()) + padding,
				end = begin + this.width() * rtl,
				inner, outer, matches = [], i, n;

			for (i = 0, n = this._coordinates.length; i < n; i++) {
				inner = this._coordinates[i - 1] || 0;
				outer = Math.abs(this._coordinates[i]) + padding * rtl;

				if ((this.op(inner, '<=', begin) && (this.op(inner, '>', end)))
					|| (this.op(outer, '<', begin) && this.op(outer, '>', end))) {
					matches.push(i);
				}
			}

			this.$stage.children('.active').removeClass('active');
			this.$stage.children(':eq(' + matches.join('), :eq(') + ')').addClass('active');

			this.$stage.children('.center').removeClass('center');
			if (this.settings.center) {
				this.$stage.children().eq(this.current()).addClass('center');
			}
		}
	}];

	/**
	 * Create the stage DOM element
	 */
	Owl.prototype.initializeStage = function () {
		this.$stage = this.$element.find('.' + this.settings.stageClass);

		// if the stage is already in the DOM, grab it and skip stage initialization
		if (this.$stage.length) {
			return;
		}

		this.$element.addClass(this.options.loadingClass);

		// create stage
		this.$stage = $('<' + this.settings.stageElement + '>', {
			"class": this.settings.stageClass
		}).wrap($('<div/>', {
			"class": this.settings.stageOuterClass
		}));

		// append stage
		this.$element.append(this.$stage.parent());
	};

	/**
	 * Create item DOM elements
	 */
	Owl.prototype.initializeItems = function () {
		let $items = this.$element.find('.owl-item');

		// if the items are already in the DOM, grab them and skip item initialization
		if ($items.length) {
			this._items = $items.get().map(function (item) {
				return $(item);
			});

			this._mergers = this._items.map(function () {
				return 1;
			});

			this.refresh();

			return;
		}

		// append content
		this.replace(this.$element.children().not(this.$stage.parent()));

		// check visibility
		if (this.isVisible()) {
			// update view
			this.refresh();
		} else {
			// invalidate width
			this.invalidate('width');
		}

		this.$element
			.removeClass(this.options.loadingClass)
			.addClass(this.options.loadedClass);
	};

	/**
	 * Initializes the carousel.
	 * @protected
	 */
	Owl.prototype.initialize = function () {
		this.enter('initializing');
		this.trigger('initialize');

		this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl);

		if (this.settings.autoWidth && !this.is('pre-loading')) {
			let imgs, nestedSelector, width;
			imgs = this.$element.find('img');
			nestedSelector = this.settings.nestedItemSelector ? '.' + this.settings.nestedItemSelector : undefined;
			width = this.$element.children(nestedSelector).width();

			if (imgs.length && width <= 0) {
				this.preloadAutoWidthImages(imgs);
			}
		}

		this.initializeStage();
		this.initializeItems();

		// register event handlers
		this.registerEventHandlers();

		this.leave('initializing');
		this.trigger('initialized');
	};

	/**
	 * @returns {Boolean} visibility of $element
	 *                    if you know the carousel will always be visible you can set `checkVisibility` to `false` to
	 *                    prevent the expensive browser layout forced reflow the $element.is(':visible') does
	 */
	Owl.prototype.isVisible = function () {
		return this.settings.checkVisibility
			? this.$element.is(':visible')
			: true;
	};

	/**
	 * Setups the current settings.
	 * @todo Remove responsive classes. Why should adaptive designs be brought into IE8?
	 * @todo Support for media queries by using `matchMedia` would be nice.
	 * @public
	 */
	Owl.prototype.setup = function () {
		let viewport = this.viewport(),
			overwrites = this.options.responsive,
			match = -1,
			settings = null;

		if (!overwrites) {
			settings = $.extend({}, this.options);
		} else {
			$.each(overwrites, function (breakpoint) {
				if (breakpoint <= viewport && breakpoint > match) {
					match = Number(breakpoint);
				}
			});

			settings = $.extend({}, this.options, overwrites[match]);
			if (typeof settings.stagePadding === 'function') {
				settings.stagePadding = settings.stagePadding();
			}
			delete settings.responsive;

			// responsive class
			if (settings.responsiveClass) {
				this.$element.attr('class',
					this.$element.attr('class').replace(new RegExp('(' + this.options.responsiveClass + '-)\\S+\\s', 'g'), '$1' + match)
				);
			}
		}

		this.trigger('change', { property: { name: 'settings', value: settings } });
		this._breakpoint = match;
		this.settings = settings;
		this.invalidate('settings');
		this.trigger('changed', { property: { name: 'settings', value: this.settings } });
	};

	/**
	 * Updates option logic if necessery.
	 * @protected
	 */
	Owl.prototype.optionsLogic = function () {
		if (this.settings.autoWidth) {
			this.settings.stagePadding = false;
			this.settings.merge = false;
		}
	};

	/**
	 * Prepares an item before add.
	 * @todo Rename event parameter `content` to `item`.
	 * @protected
	 * @returns {jQuery|HTMLElement} - The item container.
	 */
	Owl.prototype.prepare = function (item) {
		let event = this.trigger('prepare', { content: item });

		if (!event.data) {
			event.data = $('<' + this.settings.itemElement + '/>')
				.addClass(this.options.itemClass).append(item)
		}

		this.trigger('prepared', { content: event.data });

		return event.data;
	};

	/**
	 * Updates the view.
	 * @public
	 */
	Owl.prototype.update = function () {
		let i = 0,
			n = this._pipe.length,
			filter = $.proxy(function (p) { return this[p] }, this._invalidated),
			cache = {};

		while (i < n) {
			if (this._invalidated.all || $.grep(this._pipe[i].filter, filter).length > 0) {
				this._pipe[i].run(cache);
			}
			i++;
		}

		this._invalidated = {};

		!this.is('valid') && this.enter('valid');
	};

	/**
	 * Gets the width of the view.
	 * @public
	 * @param {Owl.Width} [dimension=Owl.Width.Default] - The dimension to return.
	 * @returns {Number} - The width of the view in pixel.
	 */
	Owl.prototype.width = function (dimension) {
		dimension = dimension || Owl.Width.Default;
		switch (dimension) {
			case Owl.Width.Inner:
			case Owl.Width.Outer:
				return this._width;
			default:
				return this._width - this.settings.stagePadding * 2 + this.settings.margin;
		}
	};

	/**
	 * Refreshes the carousel primarily for adaptive purposes.
	 * @public
	 */
	Owl.prototype.refresh = function () {
		this.enter('refreshing');
		this.trigger('refresh');

		this.setup();

		this.optionsLogic();

		this.$element.addClass(this.options.refreshClass);

		this.update();

		this.$element.removeClass(this.options.refreshClass);

		this.leave('refreshing');
		this.trigger('refreshed');
	};

	/**
	 * Checks window `resize` event.
	 * @protected
	 */
	Owl.prototype.onThrottledResize = function () {
		window.clearTimeout(this.resizeTimer);
		this.resizeTimer = window.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate);
	};

	/**
	 * Checks window `resize` event.
	 * @protected
	 */
	Owl.prototype.onResize = function () {
		if (!this._items.length) {
			return false;
		}

		if (this._width === this.$element.width()) {
			return false;
		}

		if (!this.isVisible()) {
			return false;
		}

		this.enter('resizing');

		if (this.trigger('resize').isDefaultPrevented()) {
			this.leave('resizing');
			return false;
		}

		this.invalidate('width');

		this.refresh();

		this.leave('resizing');
		this.trigger('resized');
	};

	/**
	 * Registers event handlers.
	 * @todo Check `msPointerEnabled`
	 * @todo #261
	 * @protected
	 */
	Owl.prototype.registerEventHandlers = function () {
		if ($.support.transition) {
			this.$stage.on($.support.transition.end + '.owl.core', $.proxy(this.onTransitionEnd, this));
		}

		if (this.settings.responsive !== false) {
			this.on(window, 'resize', this._handlers.onThrottledResize);
		}

		if (this.settings.mouseDrag) {
			this.$element.addClass(this.options.dragClass);
			this.$stage.on('mousedown.owl.core', $.proxy(this.onDragStart, this));
			this.$stage.on('dragstart.owl.core selectstart.owl.core', function () { return false });
		}

		if (this.settings.touchDrag) {
			this.$stage.on('touchstart.owl.core', $.proxy(this.onDragStart, this));
			this.$stage.on('touchcancel.owl.core', $.proxy(this.onDragEnd, this));
		}
	};

	/**
	 * Handles `touchstart` and `mousedown` events.
	 * @todo Horizontal swipe threshold as option
	 * @todo #261
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.onDragStart = function (event) {
		let stage = null;

		if (event.which === 3) {
			return;
		}

		if ($.support.transform) {
			stage = this.$stage.css('transform').replace(/.*\(|\)| /g, '').split(',');
			stage = {
				x: stage[stage.length === 16 ? 12 : 4],
				y: stage[stage.length === 16 ? 13 : 5]
			};
		} else {
			stage = this.$stage.position();
			stage = {
				x: this.settings.rtl ?
					stage.left + this.$stage.width() - this.width() + this.settings.margin :
					stage.left,
				y: stage.top
			};
		}

		if (this.is('animating')) {
			$.support.transform ? this.animate(stage.x) : this.$stage.stop()
			this.invalidate('position');
		}

		this.$element.toggleClass(this.options.grabClass, event.type === 'mousedown');

		this.speed(0);

		this._drag.time = new Date().getTime();
		this._drag.target = $(event.target);
		this._drag.stage.start = stage;
		this._drag.stage.current = stage;
		this._drag.pointer = this.pointer(event);

		$(document).on('mouseup.owl.core touchend.owl.core', $.proxy(this.onDragEnd, this));

		$(document).one('mousemove.owl.core touchmove.owl.core', $.proxy(function (event) {
			let delta = this.difference(this._drag.pointer, this.pointer(event));

			$(document).on('mousemove.owl.core touchmove.owl.core', $.proxy(this.onDragMove, this));

			if (Math.abs(delta.x) < Math.abs(delta.y) && this.is('valid')) {
				return;
			}

			event.preventDefault();

			this.enter('dragging');
			this.trigger('drag');
		}, this));
	};

	/**
	 * Handles the `touchmove` and `mousemove` events.
	 * @todo #261
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.onDragMove = function (event) {
		let minimum = null,
			maximum = null,
			pull = null,
			delta = this.difference(this._drag.pointer, this.pointer(event)),
			stage = this.difference(this._drag.stage.start, delta);

		if (!this.is('dragging')) {
			return;
		}

		event.preventDefault();

		if (this.settings.loop) {
			minimum = this.coordinates(this.minimum());
			maximum = this.coordinates(this.maximum() + 1) - minimum;
			stage.x = (((stage.x - minimum) % maximum + maximum) % maximum) + minimum;
		} else {
			minimum = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum());
			maximum = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum());
			pull = this.settings.pullDrag ? -1 * delta.x / 5 : 0;
			stage.x = Math.max(Math.min(stage.x, minimum + pull), maximum + pull);
		}

		this._drag.stage.current = stage;

		this.animate(stage.x);
	};

	/**
	 * Handles the `touchend` and `mouseup` events.
	 * @todo #261
	 * @todo Threshold for click event
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.onDragEnd = function (event) {
		let delta = this.difference(this._drag.pointer, this.pointer(event)),
			stage = this._drag.stage.current,
			direction = delta.x > 0 ^ this.settings.rtl ? 'left' : 'right';

		$(document).off('.owl.core');

		this.$element.removeClass(this.options.grabClass);

		if (delta.x !== 0 && this.is('dragging') || !this.is('valid')) {
			this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed);
			this.current(this.closest(stage.x, delta.x !== 0 ? direction : this._drag.direction));
			this.invalidate('position');
			this.update();

			this._drag.direction = direction;

			if (Math.abs(delta.x) > 3 || new Date().getTime() - this._drag.time > 300) {
				this._drag.target.one('click.owl.core', function () { return false; });
			}
		}

		if (!this.is('dragging')) {
			return;
		}

		this.leave('dragging');
		this.trigger('dragged');
	};

	/**
	 * Gets absolute position of the closest item for a coordinate.
	 * @todo Setting `freeDrag` makes `closest` not reusable. See #165.
	 * @protected
	 * @param {Number} coordinate - The coordinate in pixel.
	 * @param {String} direction - The direction to check for the closest item. Ether `left` or `right`.
	 * @return {Number} - The absolute position of the closest item.
	 */
	Owl.prototype.closest = function (coordinate, direction) {
		let position = -1,
			pull = 30,
			width = this.width(),
			coordinates = this.coordinates();

		if (!this.settings.freeDrag) {
			// check closest item
			$.each(coordinates, $.proxy(function (index, value) {
				// on a left pull, check on current index
				if (direction === 'left' && coordinate > value - pull && coordinate < value + pull) {
					position = index;
					// on a right pull, check on previous index
					// to do so, subtract width from value and set position = index + 1
				} else if (direction === 'right' && coordinate > value - width - pull && coordinate < value - width + pull) {
					position = index + 1;
				} else if (this.op(coordinate, '<', value)
					&& this.op(coordinate, '>', coordinates[index + 1] !== undefined ? coordinates[index + 1] : value - width)) {
					position = direction === 'left' ? index + 1 : index;
				}
				return position === -1;
			}, this));
		}

		if (!this.settings.loop) {
			// non loop boundries
			if (this.op(coordinate, '>', coordinates[this.minimum()])) {
				position = coordinate = this.minimum();
			} else if (this.op(coordinate, '<', coordinates[this.maximum()])) {
				position = coordinate = this.maximum();
			}
		}

		return position;
	};

	/**
	 * Animates the stage.
	 * @todo #270
	 * @public
	 * @param {Number} coordinate - The coordinate in pixels.
	 */
	Owl.prototype.animate = function (coordinate) {
		let animate = this.speed() > 0;

		this.is('animating') && this.onTransitionEnd();

		if (animate) {
			this.enter('animating');
			this.trigger('translate');
		}

		if ($.support.transform3d && $.support.transition) {
			this.$stage.css({
				transform: 'translate3d(' + coordinate + 'px,0px,0px)',
				transition: (this.speed() / 1000) + 's' + (
					this.settings.slideTransition ? ' ' + this.settings.slideTransition : ''
				)
			});
		} else if (animate) {
			this.$stage.animate({
				left: coordinate + 'px'
			}, this.speed(), this.settings.fallbackEasing, $.proxy(this.onTransitionEnd, this));
		} else {
			this.$stage.css({
				left: coordinate + 'px'
			});
		}
	};

	/**
	 * Checks whether the carousel is in a specific state or not.
	 * @param {String} state - The state to check.
	 * @returns {Boolean} - The flag which indicates if the carousel is busy.
	 */
	Owl.prototype.is = function (state) {
		return this._states.current[state] && this._states.current[state] > 0;
	};

	/**
	 * Sets the absolute position of the current item.
	 * @public
	 * @param {Number} [position] - The new absolute position or nothing to leave it unchanged.
	 * @returns {Number} - The absolute position of the current item.
	 */
	Owl.prototype.current = function (position) {
		if (position === undefined) {
			return this._current;
		}

		if (this._items.length === 0) {
			return undefined;
		}

		position = this.normalize(position);

		if (this._current !== position) {
			let event = this.trigger('change', { property: { name: 'position', value: position } });

			if (event.data !== undefined) {
				position = this.normalize(event.data);
			}

			this._current = position;

			this.invalidate('position');

			this.trigger('changed', { property: { name: 'position', value: this._current } });
		}

		return this._current;
	};

	/**
	 * Invalidates the given part of the update routine.
	 * @param {String} [part] - The part to invalidate.
	 * @returns {Array.<String>} - The invalidated parts.
	 */
	Owl.prototype.invalidate = function (part) {
		if ($.type(part) === 'string') {
			this._invalidated[part] = true;
			this.is('valid') && this.leave('valid');
		}
		return $.map(this._invalidated, function (v, i) { return i });
	};

	/**
	 * Resets the absolute position of the current item.
	 * @public
	 * @param {Number} position - The absolute position of the new item.
	 */
	Owl.prototype.reset = function (position) {
		position = this.normalize(position);

		if (position === undefined) {
			return;
		}

		this._speed = 0;
		this._current = position;

		this.suppress(['translate', 'translated']);

		this.animate(this.coordinates(position));

		this.release(['translate', 'translated']);
	};

	/**
	 * Normalizes an absolute or a relative position of an item.
	 * @public
	 * @param {Number} position - The absolute or relative position to normalize.
	 * @param {Boolean} [relative=false] - Whether the given position is relative or not.
	 * @returns {Number} - The normalized position.
	 */
	Owl.prototype.normalize = function (position, relative) {
		let n = this._items.length,
			m = relative ? 0 : this._clones.length;

		if (!this.isNumeric(position) || n < 1) {
			position = undefined;
		} else if (position < 0 || position >= n + m) {
			position = ((position - m / 2) % n + n) % n + m / 2;
		}

		return position;
	};

	/**
	 * Converts an absolute position of an item into a relative one.
	 * @public
	 * @param {Number} position - The absolute position to convert.
	 * @returns {Number} - The converted position.
	 */
	Owl.prototype.relative = function (position) {
		position -= this._clones.length / 2;
		return this.normalize(position, true);
	};

	/**
	 * Gets the maximum position for the current item.
	 * @public
	 * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
	 * @returns {Number}
	 */
	Owl.prototype.maximum = function (relative) {
		let settings = this.settings,
			maximum = this._coordinates.length,
			iterator,
			reciprocalItemsWidth,
			elementWidth;

		if (settings.loop) {
			maximum = this._clones.length / 2 + this._items.length - 1;
		} else if (settings.autoWidth || settings.merge) {
			iterator = this._items.length;
			if (iterator) {
				reciprocalItemsWidth = this._items[--iterator].width();
				elementWidth = this.$element.width();
				while (iterator--) {
					reciprocalItemsWidth += this._items[iterator].width() + this.settings.margin;
					if (reciprocalItemsWidth > elementWidth) {
						break;
					}
				}
			}
			maximum = iterator + 1;
		} else if (settings.center) {
			maximum = this._items.length - 1;
		} else {
			maximum = this._items.length - settings.items;
		}

		if (relative) {
			maximum -= this._clones.length / 2;
		}

		return Math.max(maximum, 0);
	};

	/**
	 * Gets the minimum position for the current item.
	 * @public
	 * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
	 * @returns {Number}
	 */
	Owl.prototype.minimum = function (relative) {
		return relative ? 0 : this._clones.length / 2;
	};

	/**
	 * Gets an item at the specified relative position.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
	 */
	Owl.prototype.items = function (position) {
		if (position === undefined) {
			return this._items.slice();
		}

		position = this.normalize(position, true);
		return this._items[position];
	};

	/**
	 * Gets an item at the specified relative position.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
	 */
	Owl.prototype.mergers = function (position) {
		if (position === undefined) {
			return this._mergers.slice();
		}

		position = this.normalize(position, true);
		return this._mergers[position];
	};

	/**
	 * Gets the absolute positions of clones for an item.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @returns {Array.<Number>} - The absolute positions of clones for the item or all if no position was given.
	 */
	Owl.prototype.clones = function (position) {
		let odd = this._clones.length / 2,
			even = odd + this._items.length,
			map = function (index) { return index % 2 === 0 ? even + index / 2 : odd - (index + 1) / 2 };

		if (position === undefined) {
			return $.map(this._clones, function (v, i) { return map(i) });
		}

		return $.map(this._clones, function (v, i) { return v === position ? map(i) : null });
	};

	/**
	 * Sets the current animation speed.
	 * @public
	 * @param {Number} [speed] - The animation speed in milliseconds or nothing to leave it unchanged.
	 * @returns {Number} - The current animation speed in milliseconds.
	 */
	Owl.prototype.speed = function (speed) {
		if (speed !== undefined) {
			this._speed = speed;
		}

		return this._speed;
	};

	/**
	 * Gets the coordinate of an item.
	 * @todo The name of this method is missleanding.
	 * @public
	 * @param {Number} position - The absolute position of the item within `minimum()` and `maximum()`.
	 * @returns {Number|Array.<Number>} - The coordinate of the item in pixel or all coordinates.
	 */
	Owl.prototype.coordinates = function (position) {
		let multiplier = 1,
			newPosition = position - 1,
			coordinate;

		if (position === undefined) {
			return $.map(this._coordinates, $.proxy(function (coordinate, index) {
				return this.coordinates(index);
			}, this));
		}

		if (this.settings.center) {
			if (this.settings.rtl) {
				multiplier = -1;
				newPosition = position + 1;
			}

			coordinate = this._coordinates[position];
			coordinate += (this.width() - coordinate + (this._coordinates[newPosition] || 0)) / 2 * multiplier;
		} else {
			coordinate = this._coordinates[newPosition] || 0;
		}

		coordinate = Math.ceil(coordinate);

		return coordinate;
	};

	/**
	 * Calculates the speed for a translation.
	 * @protected
	 * @param {Number} from - The absolute position of the start item.
	 * @param {Number} to - The absolute position of the target item.
	 * @param {Number} [factor=undefined] - The time factor in milliseconds.
	 * @returns {Number} - The time in milliseconds for the translation.
	 */
	Owl.prototype.duration = function (from, to, factor) {
		if (factor === 0) {
			return 0;
		}

		return Math.min(Math.max(Math.abs(to - from), 1), 6) * Math.abs((factor || this.settings.smartSpeed));
	};

	/**
	 * Slides to the specified item.
	 * @public
	 * @param {Number} position - The position of the item.
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
	Owl.prototype.to = function (position, speed) {
		let current = this.current(),
			revert = null,
			distance = position - this.relative(current),
			direction = (distance > 0) - (distance < 0),
			items = this._items.length,
			minimum = this.minimum(),
			maximum = this.maximum();

		if (this.settings.loop) {
			if (!this.settings.rewind && Math.abs(distance) > items / 2) {
				distance += direction * -1 * items;
			}

			position = current + distance;
			revert = ((position - minimum) % items + items) % items + minimum;

			if (revert !== position && revert - distance <= maximum && revert - distance > 0) {
				current = revert - distance;
				position = revert;
				this.reset(current);
			}
		} else if (this.settings.rewind) {
			maximum += 1;
			position = (position % maximum + maximum) % maximum;
		} else {
			position = Math.max(minimum, Math.min(maximum, position));
		}

		this.speed(this.duration(current, position, speed));
		this.current(position);

		if (this.isVisible()) {
			this.update();
		}
	};

	/**
	 * Slides to the next item.
	 * @public
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
	Owl.prototype.next = function (speed) {
		speed = speed || false;
		this.to(this.relative(this.current()) + 1, speed);
	};

	/**
	 * Slides to the previous item.
	 * @public
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
	Owl.prototype.prev = function (speed) {
		speed = speed || false;
		this.to(this.relative(this.current()) - 1, speed);
	};

	/**
	 * Handles the end of an animation.
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.onTransitionEnd = function (event) {

		// if css2 animation then event object is undefined
		if (event !== undefined) {
			event.stopPropagation();

			// Catch only owl-stage transitionEnd event
			if ((event.target || event.srcElement || event.originalTarget) !== this.$stage.get(0)) {
				return false;
			}
		}

		this.leave('animating');
		this.trigger('translated');
	};

	/**
	 * Gets viewport width.
	 * @protected
	 * @return {Number} - The width in pixel.
	 */
	Owl.prototype.viewport = function () {
		let width;
		if (this.options.responsiveBaseElement !== window) {
			width = $(this.options.responsiveBaseElement).width();
		} else if (window.innerWidth) {
			width = window.innerWidth;
		} else if (document.documentElement && document.documentElement.clientWidth) {
			width = document.documentElement.clientWidth;
		} else {
			console.warn('Can not detect viewport width.');
		}
		return width;
	};

	/**
	 * Replaces the current content.
	 * @public
	 * @param {HTMLElement|jQuery|String} content - The new content.
	 */
	Owl.prototype.replace = function (content) {
		this.$stage.empty();
		this._items = [];

		if (content) {
			content = (content instanceof jQuery) ? content : $(content);
		}

		if (this.settings.nestedItemSelector) {
			content = content.find('.' + this.settings.nestedItemSelector);
		}

		content.filter(function () {
			return this.nodeType === 1;
		}).each($.proxy(function (index, item) {
			item = this.prepare(item);
			this.$stage.append(item);
			this._items.push(item);
			this._mergers.push(item.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1);
		}, this));

		this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0);

		this.invalidate('items');
	};

	/**
	 * Adds an item.
	 * @todo Use `item` instead of `content` for the event arguments.
	 * @public
	 * @param {HTMLElement|jQuery|String} content - The item content to add.
	 * @param {Number} [position] - The relative position at which to insert the item otherwise the item will be added to the end.
	 */
	Owl.prototype.add = function (content, position) {
		let current = this.relative(this._current);

		position = position === undefined ? this._items.length : this.normalize(position, true);
		content = content instanceof jQuery ? content : $(content);

		this.trigger('add', { content: content, position: position });

		content = this.prepare(content);

		if (this._items.length === 0 || position === this._items.length) {
			this._items.length === 0 && this.$stage.append(content);
			this._items.length !== 0 && this._items[position - 1].after(content);
			this._items.push(content);
			this._mergers.push(content.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1);
		} else {
			this._items[position].before(content);
			this._items.splice(position, 0, content);
			this._mergers.splice(position, 0, content.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1);
		}

		this._items[current] && this.reset(this._items[current].index());

		this.invalidate('items');

		this.trigger('added', { content: content, position: position });
	};

	/**
	 * Removes an item by its position.
	 * @todo Use `item` instead of `content` for the event arguments.
	 * @public
	 * @param {Number} position - The relative position of the item to remove.
	 */
	Owl.prototype.remove = function (position) {
		position = this.normalize(position, true);

		if (position === undefined) {
			return;
		}

		this.trigger('remove', { content: this._items[position], position: position });

		this._items[position].remove();
		this._items.splice(position, 1);
		this._mergers.splice(position, 1);

		this.invalidate('items');

		this.trigger('removed', { content: null, position: position });
	};

	/**
	 * Preloads images with auto width.
	 * @todo Replace by a more generic approach
	 * @protected
	 */
	Owl.prototype.preloadAutoWidthImages = function (images) {
		images.each($.proxy(function (i, element) {
			this.enter('pre-loading');
			element = $(element);
			$(new Image()).one('load', $.proxy(function (e) {
				element.attr('src', e.target.src);
				element.css('opacity', 1);
				this.leave('pre-loading');
				!this.is('pre-loading') && !this.is('initializing') && this.refresh();
			}, this)).attr('src', element.attr('src') || element.attr('data-src') || element.attr('data-src-retina'));
		}, this));
	};

	/**
	 * Destroys the carousel.
	 * @public
	 */
	Owl.prototype.destroy = function () {

		this.$element.off('.owl.core');
		this.$stage.off('.owl.core');
		$(document).off('.owl.core');

		if (this.settings.responsive !== false) {
			window.clearTimeout(this.resizeTimer);
			this.off(window, 'resize', this._handlers.onThrottledResize);
		}

		for (let i in this._plugins) {
			this._plugins[i].destroy();
		}

		this.$stage.children('.cloned').remove();

		this.$stage.unwrap();
		this.$stage.children().contents().unwrap();
		this.$stage.children().unwrap();
		this.$stage.remove();
		this.$element
			.removeClass(this.options.refreshClass)
			.removeClass(this.options.loadingClass)
			.removeClass(this.options.loadedClass)
			.removeClass(this.options.rtlClass)
			.removeClass(this.options.dragClass)
			.removeClass(this.options.grabClass)
			.attr('class', this.$element.attr('class').replace(new RegExp(this.options.responsiveClass + '-\\S+\\s', 'g'), ''))
			.removeData('owl.carousel');
	};

	/**
	 * Operators to calculate right-to-left and left-to-right.
	 * @protected
	 * @param {Number} [a] - The left side operand.
	 * @param {String} [o] - The operator.
	 * @param {Number} [b] - The right side operand.
	 */
	Owl.prototype.op = function (a, o, b) {
		let rtl = this.settings.rtl;
		switch (o) {
			case '<':
				return rtl ? a > b : a < b;
			case '>':
				return rtl ? a < b : a > b;
			case '>=':
				return rtl ? a <= b : a >= b;
			case '<=':
				return rtl ? a >= b : a <= b;
			default:
				break;
		}
	};

	/**
	 * Attaches to an internal event.
	 * @protected
	 * @param {HTMLElement} element - The event source.
	 * @param {String} event - The event name.
	 * @param {Function} listener - The event handler to attach.
	 * @param {Boolean} capture - Wether the event should be handled at the capturing phase or not.
	 */
	Owl.prototype.on = function (element, event, listener, capture) {
		if (element.addEventListener) {
			element.addEventListener(event, listener, capture);
		} else if (element.attachEvent) {
			element.attachEvent('on' + event, listener);
		}
	};

	/**
	 * Detaches from an internal event.
	 * @protected
	 * @param {HTMLElement} element - The event source.
	 * @param {String} event - The event name.
	 * @param {Function} listener - The attached event handler to detach.
	 * @param {Boolean} capture - Wether the attached event handler was registered as a capturing listener or not.
	 */
	Owl.prototype.off = function (element, event, listener, capture) {
		if (element.removeEventListener) {
			element.removeEventListener(event, listener, capture);
		} else if (element.detachEvent) {
			element.detachEvent('on' + event, listener);
		}
	};

	/**
	 * Triggers a public event.
	 * @todo Remove `status`, `relatedTarget` should be used instead.
	 * @protected
	 * @param {String} name - The event name.
	 * @param {*} [data=null] - The event data.
	 * @param {String} [namespace=carousel] - The event namespace.
	 * @param {String} [state] - The state which is associated with the event.
	 * @param {Boolean} [enter=false] - Indicates if the call enters the specified state or not.
	 * @returns {Event} - The event arguments.
	 */
	Owl.prototype.trigger = function (name, data, namespace, state, enter) {
		let status = {
			item: { count: this._items.length, index: this.current() }
		}, handler = $.camelCase(
			$.grep(['on', name, namespace], function (v) { return v })
				.join('-').toLowerCase()
		), event = $.Event(
			[name, 'owl', namespace || 'carousel'].join('.').toLowerCase(),
			$.extend({ relatedTarget: this }, status, data)
		);

		if (!this._supress[name]) {
			$.each(this._plugins, function (name, plugin) {
				if (plugin.onTrigger) {
					plugin.onTrigger(event);
				}
			});

			this.register({ type: Owl.Type.Event, name: name });
			this.$element.trigger(event);

			if (this.settings && typeof this.settings[handler] === 'function') {
				this.settings[handler].call(this, event);
			}
		}

		return event;
	};

	/**
	 * Enters a state.
	 * @param name - The state name.
	 */
	Owl.prototype.enter = function (name) {
		$.each([name].concat(this._states.tags[name] || []), $.proxy(function (i, name) {
			if (this._states.current[name] === undefined) {
				this._states.current[name] = 0;
			}

			this._states.current[name]++;
		}, this));
	};

	/**
	 * Leaves a state.
	 * @param name - The state name.
	 */
	Owl.prototype.leave = function (name) {
		$.each([name].concat(this._states.tags[name] || []), $.proxy(function (i, name) {
			this._states.current[name]--;
		}, this));
	};

	/**
	 * Registers an event or state.
	 * @public
	 * @param {Object} object - The event or state to register.
	 */
	Owl.prototype.register = function (object) {
		if (object.type === Owl.Type.Event) {
			if (!$.event.special[object.name]) {
				$.event.special[object.name] = {};
			}

			if (!$.event.special[object.name].owl) {
				let _default = $.event.special[object.name]._default;
				$.event.special[object.name]._default = function (e) {
					if (_default && _default.apply && (!e.namespace || e.namespace.indexOf('owl') === -1)) {
						return _default.apply(this, arguments);
					}
					return e.namespace && e.namespace.indexOf('owl') > -1;
				};
				$.event.special[object.name].owl = true;
			}
		} else if (object.type === Owl.Type.State) {
			if (!this._states.tags[object.name]) {
				this._states.tags[object.name] = object.tags;
			} else {
				this._states.tags[object.name] = this._states.tags[object.name].concat(object.tags);
			}

			this._states.tags[object.name] = $.grep(this._states.tags[object.name], $.proxy(function (tag, i) {
				return $.inArray(tag, this._states.tags[object.name]) === i;
			}, this));
		}
	};

	/**
	 * Suppresses events.
	 * @protected
	 * @param {Array.<String>} events - The events to suppress.
	 */
	Owl.prototype.suppress = function (events) {
		$.each(events, $.proxy(function (index, event) {
			this._supress[event] = true;
		}, this));
	};

	/**
	 * Releases suppressed events.
	 * @protected
	 * @param {Array.<String>} events - The events to release.
	 */
	Owl.prototype.release = function (events) {
		$.each(events, $.proxy(function (index, event) {
			delete this._supress[event];
		}, this));
	};

	/**
	 * Gets unified pointer coordinates from event.
	 * @todo #261
	 * @protected
	 * @param {Event} - The `mousedown` or `touchstart` event.
	 * @returns {Object} - Contains `x` and `y` coordinates of current pointer position.
	 */
	Owl.prototype.pointer = function (event) {
		let result = { x: null, y: null };

		event = event.originalEvent || event || window.event;

		event = event.touches && event.touches.length ?
			event.touches[0] : event.changedTouches && event.changedTouches.length ?
				event.changedTouches[0] : event;

		if (event.pageX) {
			result.x = event.pageX;
			result.y = event.pageY;
		} else {
			result.x = event.clientX;
			result.y = event.clientY;
		}

		return result;
	};

	/**
	 * Determines if the input is a Number or something that can be coerced to a Number
	 * @protected
	 * @param {Number|String|Object|Array|Boolean|RegExp|Function|Symbol} - The input to be tested
	 * @returns {Boolean} - An indication if the input is a Number or can be coerced to a Number
	 */
	Owl.prototype.isNumeric = function (number) {
		return !isNaN(parseFloat(number));
	};

	/**
	 * Gets the difference of two vectors.
	 * @todo #261
	 * @protected
	 * @param {Object} - The first vector.
	 * @param {Object} - The second vector.
	 * @returns {Object} - The difference.
	 */
	Owl.prototype.difference = function (first, second) {
		return {
			x: first.x - second.x,
			y: first.y - second.y
		};
	};

	/**
	 * The jQuery Plugin for the Owl Carousel
	 * @todo Navigation plugin `next` and `prev`
	 * @public
	 */
	$.fn.owlCarousel = function (option) {
		let args = Array.prototype.slice.call(arguments, 1);

		return this.each(function () {
			let $this = $(this),
				data = $this.data('owl.carousel');

			if (!data) {
				data = new Owl(this, typeof option == 'object' && option);
				$this.data('owl.carousel', data);

				$.each([
					'next', 'prev', 'to', 'destroy', 'refresh', 'replace', 'add', 'remove'
				], function (i, event) {
					data.register({ type: Owl.Type.Event, name: event });
					data.$element.on(event + '.owl.carousel.core', $.proxy(function (e) {
						if (e.namespace && e.relatedTarget !== this) {
							this.suppress([event]);
							data[event].apply(this, [].slice.call(arguments, 1));
							this.release([event]);
						}
					}, data));
				});
			}

			if (typeof option == 'string' && option.charAt(0) !== '_') {
				data[option].apply(data, args);
			}
		});
	};

	/**
	 * The constructor for the jQuery Plugin
	 * @public
	 */
	$.fn.owlCarousel.Constructor = Owl;

})(window.Zepto || window.jQuery, window, document);

/**
 * AutoRefresh Plugin
 * @version 2.3.4
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {

	/**
	 * Creates the auto refresh plugin.
	 * @class The Auto Refresh Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	let AutoRefresh = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Refresh interval.
		 * @protected
		 * @type {number}
		 */
		this._interval = null;

		/**
		 * Whether the element is currently visible or not.
		 * @protected
		 * @type {Boolean}
		 */
		this._visible = null;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.autoRefresh) {
					this.watch();
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, AutoRefresh.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);
	};

	/**
	 * Default options.
	 * @public
	 */
	AutoRefresh.Defaults = {
		autoRefresh: true,
		autoRefreshInterval: 500
	};

	/**
	 * Watches the element.
	 */
	AutoRefresh.prototype.watch = function () {
		if (this._interval) {
			return;
		}

		this._visible = this._core.isVisible();
		this._interval = window.setInterval($.proxy(this.refresh, this), this._core.settings.autoRefreshInterval);
	};

	/**
	 * Refreshes the element.
	 */
	AutoRefresh.prototype.refresh = function () {
		if (this._core.isVisible() === this._visible) {
			return;
		}

		this._visible = !this._visible;

		this._core.$element.toggleClass('owl-hidden', !this._visible);

		this._visible && (this._core.invalidate('width') && this._core.refresh());
	};

	/**
	 * Destroys the plugin.
	 */
	AutoRefresh.prototype.destroy = function () {
		let handler, property;

		window.clearInterval(this._interval);

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.AutoRefresh = AutoRefresh;

})(window.Zepto || window.jQuery, window, document);

/**
 * Lazy Plugin
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {

	/**
	 * Creates the lazy plugin.
	 * @class The Lazy Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	let Lazy = function (carousel) {

		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Already loaded items.
		 * @protected
		 * @type {Array.<jQuery>}
		 */
		this._loaded = [];

		/**
		 * Event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel change.owl.carousel resized.owl.carousel': $.proxy(function (e) {
				if (!e.namespace) {
					return;
				}

				if (!this._core.settings || !this._core.settings.lazyLoad) {
					return;
				}

				if ((e.property && e.property.name == 'position') || e.type == 'initialized') {
					let settings = this._core.settings,
						n = (settings.center && Math.ceil(settings.items / 2) || settings.items),
						i = ((settings.center && n * -1) || 0),
						position = (e.property && e.property.value !== undefined ? e.property.value : this._core.current()) + i,
						clones = this._core.clones().length,
						load = $.proxy(function (i, v) { this.load(v) }, this);
					//TODO: Need documentation for this new option
					if (settings.lazyLoadEager > 0) {
						n += settings.lazyLoadEager;
						// If the carousel is looping also preload images that are to the "left"
						if (settings.loop) {
							position -= settings.lazyLoadEager;
							n++;
						}
					}

					while (i++ < n) {
						this.load(clones / 2 + this._core.relative(position));
						clones && $.each(this._core.clones(this._core.relative(position)), load);
						position++;
					}
				}
			}, this)
		};

		// set the default options
		this._core.options = $.extend({}, Lazy.Defaults, this._core.options);

		// register event handler
		this._core.$element.on(this._handlers);
	};

	/**
	 * Default options.
	 * @public
	 */
	Lazy.Defaults = {
		lazyLoad: false,
		lazyLoadEager: 0
	};

	/**
	 * Loads all resources of an item at the specified position.
	 * @param {Number} position - The absolute position of the item.
	 * @protected
	 */
	Lazy.prototype.load = function (position) {
		let $item = this._core.$stage.children().eq(position),
			$elements = $item && $item.find('.owl-lazy');

		if (!$elements || $.inArray($item.get(0), this._loaded) > -1) {
			return;
		}

		$elements.each($.proxy(function (index, element) {
			let $element = $(element), image,
				url = (window.devicePixelRatio > 1 && $element.attr('data-src-retina')) || $element.attr('data-src') || $element.attr('data-srcset');

			this._core.trigger('load', { element: $element, url: url }, 'lazy');

			if ($element.is('img')) {
				$element.one('load.owl.lazy', $.proxy(function () {
					$element.css('opacity', 1);
					this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
				}, this)).attr('src', url);
			} else if ($element.is('source')) {
				$element.one('load.owl.lazy', $.proxy(function () {
					this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
				}, this)).attr('srcset', url);
			} else {
				image = new Image();
				image.onload = $.proxy(function () {
					$element.css({
						'background-image': 'url("' + url + '")',
						'opacity': '1'
					});
					this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
				}, this);
				image.src = url;
			}
		}, this));

		this._loaded.push($item.get(0));
	};

	/**
	 * Destroys the plugin.
	 * @public
	 */
	Lazy.prototype.destroy = function () {
		let handler, property;

		for (handler in this.handlers) {
			this._core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Lazy = Lazy;

})(window.Zepto || window.jQuery, window, document);

/**
 * AutoHeight Plugin
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {

	/**
	 * Creates the auto height plugin.
	 * @class The Auto Height Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	let AutoHeight = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		this._previousHeight = null;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel refreshed.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.autoHeight) {
					this.update();
				}
			}, this),
			'changed.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.autoHeight && e.property.name === 'position') {
					this.update();
				}
			}, this),
			'loaded.owl.lazy': $.proxy(function (e) {
				if (e.namespace && this._core.settings.autoHeight
					&& e.element.closest('.' + this._core.settings.itemClass).index() === this._core.current()) {
					this.update();
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, AutoHeight.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);
		this._intervalId = null;
		let refThis = this;

		// These changes have been taken from a PR by gavrochelegnou proposed in #1575
		// and have been made compatible with the latest jQuery version
		$(window).on('load', function () {
			if (refThis._core.settings.autoHeight) {
				refThis.update();
			}
		});

		// Autoresize the height of the carousel when window is resized
		// When carousel has images, the height is dependent on the width
		// and should also change on resize
		$(window).resize(function () {
			if (refThis._core.settings.autoHeight) {
				if (refThis._intervalId != null) {
					clearTimeout(refThis._intervalId);
				}

				refThis._intervalId = setTimeout(function () {
					refThis.update();
				}, 250);
			}
		});

	};

	/**
	 * Default options.
	 * @public
	 */
	AutoHeight.Defaults = {
		autoHeight: false,
		autoHeightClass: 'owl-height'
	};

	/**
	 * Updates the view.
	 */
	AutoHeight.prototype.update = function () {
		let start = this._core._current,
			end = start + this._core.settings.items,
			lazyLoadEnabled = this._core.settings.lazyLoad,
			visible = this._core.$stage.children().toArray().slice(start, end),
			heights = [],
			maxheight = 0;

		$.each(visible, function (index, item) {
			heights.push($(item).height());
		});

		maxheight = Math.max.apply(null, heights);

		if (maxheight <= 1 && lazyLoadEnabled && this._previousHeight) {
			maxheight = this._previousHeight;
		}

		this._previousHeight = maxheight;

		this._core.$stage.parent()
			.height(maxheight)
			.addClass(this._core.settings.autoHeightClass);
	};

	AutoHeight.prototype.destroy = function () {
		let handler, property;

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] !== 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.AutoHeight = AutoHeight;

})(window.Zepto || window.jQuery, window, document);

/**
 * Video Plugin
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {

	/**
	 * Creates the video plugin.
	 * @class The Video Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	let Video = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Cache all video URLs.
		 * @protected
		 * @type {Object}
		 */
		this._videos = {};

		/**
		 * Current playing item.
		 * @protected
		 * @type {jQuery}
		 */
		this._playing = null;

		/**
		 * All event handlers.
		 * @todo The cloned content removale is too late
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function (e) {
				if (e.namespace) {
					this._core.register({ type: 'state', name: 'playing', tags: ['interacting'] });
				}
			}, this),
			'resize.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.video && this.isInFullScreen()) {
					e.preventDefault();
				}
			}, this),
			'refreshed.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.is('resizing')) {
					this._core.$stage.find('.cloned .owl-video-frame').remove();
				}
			}, this),
			'changed.owl.carousel': $.proxy(function (e) {
				if (e.namespace && e.property.name === 'position' && this._playing) {
					this.stop();
				}
			}, this),
			'prepared.owl.carousel': $.proxy(function (e) {
				if (!e.namespace) {
					return;
				}

				let $element = $(e.content).find('.owl-video');

				if ($element.length) {
					$element.css('display', 'none');
					this.fetch($element, $(e.content));
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Video.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);

		this._core.$element.on('click.owl.video', '.owl-video-play-icon', $.proxy(function (e) {
			this.play(e);
		}, this));
	};

	/**
	 * Default options.
	 * @public
	 */
	Video.Defaults = {
		video: false,
		videoHeight: false,
		videoWidth: false
	};

	/**
	 * Gets the video ID and the type (YouTube/Vimeo/vzaar only).
	 * @protected
	 * @param {jQuery} target - The target containing the video data.
	 * @param {jQuery} item - The item containing the video.
	 */
	Video.prototype.fetch = function (target, item) {
		let type = (function () {
			if (target.attr('data-vimeo-id')) {
				return 'vimeo';
			} else if (target.attr('data-vzaar-id')) {
				return 'vzaar'
			} else {
				return 'youtube';
			}
		})(),
			id = target.attr('data-vimeo-id') || target.attr('data-youtube-id') || target.attr('data-vzaar-id'),
			width = target.attr('data-width') || this._core.settings.videoWidth,
			height = target.attr('data-height') || this._core.settings.videoHeight,
			url = target.attr('href');

		if (url) {

			/*
					Parses the id's out of the following urls (and probably more):
					https://www.youtube.com/watch?v=:id
					https://youtu.be/:id
					https://vimeo.com/:id
					https://vimeo.com/channels/:channel/:id
					https://vimeo.com/groups/:group/videos/:id
					https://app.vzaar.com/videos/:id

					Visual example: https://regexper.com/#(http%3A%7Chttps%3A%7C)%5C%2F%5C%2F(player.%7Cwww.%7Capp.)%3F(vimeo%5C.com%7Cyoutu(be%5C.com%7C%5C.be%7Cbe%5C.googleapis%5C.com)%7Cvzaar%5C.com)%5C%2F(video%5C%2F%7Cvideos%5C%2F%7Cembed%5C%2F%7Cchannels%5C%2F.%2B%5C%2F%7Cgroups%5C%2F.%2B%5C%2F%7Cwatch%5C%3Fv%3D%7Cv%5C%2F)%3F(%5BA-Za-z0-9._%25-%5D*)(%5C%26%5CS%2B)%3F
			*/

			id = url.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

			if (id[3].indexOf('youtu') > -1) {
				type = 'youtube';
			} else if (id[3].indexOf('vimeo') > -1) {
				type = 'vimeo';
			} else if (id[3].indexOf('vzaar') > -1) {
				type = 'vzaar';
			} else {
				throw new Error('Video URL not supported.');
			}
			id = id[6];
		} else {
			throw new Error('Missing video URL.');
		}

		this._videos[url] = {
			type: type,
			id: id,
			width: width,
			height: height
		};

		item.attr('data-video', url);

		this.thumbnail(target, this._videos[url]);
	};

	/**
	 * Creates video thumbnail.
	 * @protected
	 * @param {jQuery} target - The target containing the video data.
	 * @param {Object} info - The video info object.
	 * @see `fetch`
	 */
	Video.prototype.thumbnail = function (target, video) {
		let tnLink,
			icon,
			path,
			dimensions = video.width && video.height ? 'width:' + video.width + 'px;height:' + video.height + 'px;' : '',
			customTn = target.find('img'),
			srcType = 'src',
			lazyClass = '',
			settings = this._core.settings,
			create = function (path) {
				icon = '<div class="owl-video-play-icon"></div>';

				if (settings.lazyLoad) {
					tnLink = $('<div/>', {
						"class": 'owl-video-tn ' + lazyClass,
						"srcType": path
					});
				} else {
					tnLink = $('<div/>', {
						"class": "owl-video-tn",
						"style": 'opacity:1;background-image:url(' + path + ')'
					});
				}
				target.after(tnLink);
				target.after(icon);
			};

		// wrap video content into owl-video-wrapper div
		target.wrap($('<div/>', {
			"class": "owl-video-wrapper",
			"style": dimensions
		}));

		if (this._core.settings.lazyLoad) {
			srcType = 'data-src';
			lazyClass = 'owl-lazy';
		}

		// custom thumbnail
		if (customTn.length) {
			create(customTn.attr(srcType));
			customTn.remove();
			return false;
		}

		if (video.type === 'youtube') {
			path = "//img.youtube.com/vi/" + video.id + "/hqdefault.jpg";
			create(path);
		} else if (video.type === 'vimeo') {
			$.ajax({
				type: 'GET',
				url: '//vimeo.com/api/v2/video/' + video.id + '.json',
				jsonp: 'callback',
				dataType: 'jsonp',
				success: function (data) {
					path = data[0].thumbnail_large;
					create(path);
				}
			});
		} else if (video.type === 'vzaar') {
			$.ajax({
				type: 'GET',
				url: '//vzaar.com/api/videos/' + video.id + '.json',
				jsonp: 'callback',
				dataType: 'jsonp',
				success: function (data) {
					path = data.framegrab_url;
					create(path);
				}
			});
		}
	};

	/**
	 * Stops the current video.
	 * @public
	 */
	Video.prototype.stop = function () {
		this._core.trigger('stop', null, 'video');
		this._playing.find('.owl-video-frame').remove();
		this._playing.removeClass('owl-video-playing');
		this._playing = null;
		this._core.leave('playing');
		this._core.trigger('stopped', null, 'video');
	};

	/**
	 * Starts the current video.
	 * @public
	 * @param {Event} event - The event arguments.
	 */
	Video.prototype.play = function (event) {
		let target = $(event.target),
			item = target.closest('.' + this._core.settings.itemClass),
			video = this._videos[item.attr('data-video')],
			width = video.width || '100%',
			height = video.height || this._core.$stage.height(),
			html,
			iframe;

		if (this._playing) {
			return;
		}

		this._core.enter('playing');
		this._core.trigger('play', null, 'video');

		item = this._core.items(this._core.relative(item.index()));

		this._core.reset(item.index());

		html = $('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>');
		html.attr('height', height);
		html.attr('width', width);
		if (video.type === 'youtube') {
			html.attr('src', '//www.youtube.com/embed/' + video.id + '?autoplay=1&rel=0&v=' + video.id);
		} else if (video.type === 'vimeo') {
			html.attr('src', '//player.vimeo.com/video/' + video.id + '?autoplay=1');
		} else if (video.type === 'vzaar') {
			html.attr('src', '//view.vzaar.com/' + video.id + '/player?autoplay=true');
		}

		iframe = $(html).wrap('<div class="owl-video-frame" />').insertAfter(item.find('.owl-video'));

		this._playing = item.addClass('owl-video-playing');
	};

	/**
	 * Checks whether an video is currently in full screen mode or not.
	 * @todo Bad style because looks like a readonly method but changes members.
	 * @protected
	 * @returns {Boolean}
	 */
	Video.prototype.isInFullScreen = function () {
		let element = document.fullscreenElement || document.mozFullScreenElement ||
			document.webkitFullscreenElement;

		return element && $(element).parent().hasClass('owl-video-frame');
	};

	/**
	 * Destroys the plugin.
	 */
	Video.prototype.destroy = function () {
		let handler, property;

		this._core.$element.off('click.owl.video');

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Video = Video;

})(window.Zepto || window.jQuery, window, document);

/**
 * Animate Plugin
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {

	/**
	 * Creates the animate plugin.
	 * @class The Navigation Plugin
	 * @param {Owl} scope - The Owl Carousel
	 */
	let Animate = function (scope) {
		this.core = scope;
		this.core.options = $.extend({}, Animate.Defaults, this.core.options);
		this.swapping = true;
		this.previous = undefined;
		this.next = undefined;

		this.handlers = {
			'change.owl.carousel': $.proxy(function (e) {
				if (e.namespace && e.property.name == 'position') {
					this.previous = this.core.current();
					this.next = e.property.value;
				}
			}, this),
			'drag.owl.carousel dragged.owl.carousel translated.owl.carousel': $.proxy(function (e) {
				if (e.namespace) {
					this.swapping = e.type == 'translated';
				}
			}, this),
			'translate.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn)) {
					this.swap();
				}
			}, this)
		};

		this.core.$element.on(this.handlers);
	};

	/**
	 * Default options.
	 * @public
	 */
	Animate.Defaults = {
		animateOut: false,
		animateIn: false
	};

	/**
	 * Toggles the animation classes whenever an translations starts.
	 * @protected
	 * @returns {Boolean|undefined}
	 */
	Animate.prototype.swap = function () {

		if (this.core.settings.items !== 1) {
			return;
		}

		if (!$.support.animation || !$.support.transition) {
			return;
		}

		this.core.speed(0);

		let left,
			clear = $.proxy(this.clear, this),
			previous = this.core.$stage.children().eq(this.previous),
			next = this.core.$stage.children().eq(this.next),
			incoming = this.core.settings.animateIn,
			outgoing = this.core.settings.animateOut;

		if (this.core.current() === this.previous) {
			return;
		}

		if (outgoing) {
			left = this.core.coordinates(this.previous) - this.core.coordinates(this.next);
			previous.one($.support.animation.end, clear)
				.css({ 'left': left + 'px' })
				.addClass('animated owl-animated-out')
				.addClass(outgoing);
		}

		if (incoming) {
			next.one($.support.animation.end, clear)
				.addClass('animated owl-animated-in')
				.addClass(incoming);
		}
	};

	Animate.prototype.clear = function (e) {
		$(e.target).css({ 'left': '' })
			.removeClass('animated owl-animated-out owl-animated-in')
			.removeClass(this.core.settings.animateIn)
			.removeClass(this.core.settings.animateOut);
		this.core.onTransitionEnd();
	};

	/**
	 * Destroys the plugin.
	 * @public
	 */
	Animate.prototype.destroy = function () {
		let handler, property;

		for (handler in this.handlers) {
			this.core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Animate = Animate;

})(window.Zepto || window.jQuery, window, document);

/**
 * Autoplay Plugin
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author Artus Kolanowski
 * @author David Deutsch
 * @author Tom De Caluwé
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {

	/**
	 * Creates the autoplay plugin.
	 * @class The Autoplay Plugin
	 * @param {Owl} scope - The Owl Carousel
	 */
	let Autoplay = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * The autoplay timeout id.
		 * @type {Number}
		 */
		this._call = null;

		/**
		 * Depending on the state of the plugin, this letiable contains either
		 * the start time of the timer or the current timer value if it's
		 * paused. Since we start in a paused state we initialize the timer
		 * value.
		 * @type {Number}
		 */
		this._time = 0;

		/**
		 * Stores the timeout currently used.
		 * @type {Number}
		 */
		this._timeout = 0;

		/**
		 * Indicates whenever the autoplay is paused.
		 * @type {Boolean}
		 */
		this._paused = true;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'changed.owl.carousel': $.proxy(function (e) {
				if (e.namespace && e.property.name === 'settings') {
					if (this._core.settings.autoplay) {
						this.play();
					} else {
						this.stop();
					}
				} else if (e.namespace && e.property.name === 'position' && this._paused) {
					// Reset the timer. This code is triggered when the position
					// of the carousel was changed through user interaction.
					this._time = 0;
				}
			}, this),
			'initialized.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.autoplay) {
					this.play();
				}
			}, this),
			'play.owl.autoplay': $.proxy(function (e, t, s) {
				if (e.namespace) {
					this.play(t, s);
				}
			}, this),
			'stop.owl.autoplay': $.proxy(function (e) {
				if (e.namespace) {
					this.stop();
				}
			}, this),
			'mouseover.owl.autoplay': $.proxy(function () {
				if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
					this.pause();
				}
			}, this),
			'mouseleave.owl.autoplay': $.proxy(function () {
				if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
					this.play();
				}
			}, this),
			'touchstart.owl.core': $.proxy(function () {
				if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
					this.pause();
				}
			}, this),
			'touchend.owl.core': $.proxy(function () {
				if (this._core.settings.autoplayHoverPause) {
					this.play();
				}
			}, this)
		};

		// register event handlers
		this._core.$element.on(this._handlers);

		// set default options
		this._core.options = $.extend({}, Autoplay.Defaults, this._core.options);
	};

	/**
	 * Default options.
	 * @public
	 */
	Autoplay.Defaults = {
		autoplay: false,
		autoplayTimeout: 5000,
		autoplayHoverPause: false,
		autoplaySpeed: false
	};

	/**
	 * Transition to the next slide and set a timeout for the next transition.
	 * @private
	 * @param {Number} [speed] - The animation speed for the animations.
	 */
	Autoplay.prototype._next = function (speed) {
		this._call = window.setTimeout(
			$.proxy(this._next, this, speed),
			this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read()
		);

		if (this._core.is('interacting') || document.hidden) {
			return;
		}
		this._core.next(speed || this._core.settings.autoplaySpeed);
	}

	/**
	 * Reads the current timer value when the timer is playing.
	 * @public
	 */
	Autoplay.prototype.read = function () {
		return new Date().getTime() - this._time;
	};

	/**
	 * Starts the autoplay.
	 * @public
	 * @param {Number} [timeout] - The interval before the next animation starts.
	 * @param {Number} [speed] - The animation speed for the animations.
	 */
	Autoplay.prototype.play = function (timeout, speed) {
		let elapsed;

		if (!this._core.is('rotating')) {
			this._core.enter('rotating');
		}

		timeout = timeout || this._core.settings.autoplayTimeout;

		// Calculate the elapsed time since the last transition. If the carousel
		// wasn't playing this calculation will yield zero.
		elapsed = Math.min(this._time % (this._timeout || timeout), timeout);

		if (this._paused) {
			// Start the clock.
			this._time = this.read();
			this._paused = false;
		} else {
			// Clear the active timeout to allow replacement.
			window.clearTimeout(this._call);
		}

		// Adjust the origin of the timer to match the new timeout value.
		this._time += this.read() % timeout - elapsed;

		this._timeout = timeout;
		this._call = window.setTimeout($.proxy(this._next, this, speed), timeout - elapsed);
	};

	/**
	 * Stops the autoplay.
	 * @public
	 */
	Autoplay.prototype.stop = function () {
		if (this._core.is('rotating')) {
			// Reset the clock.
			this._time = 0;
			this._paused = true;

			window.clearTimeout(this._call);
			this._core.leave('rotating');
		}
	};

	/**
	 * Pauses the autoplay.
	 * @public
	 */
	Autoplay.prototype.pause = function () {
		if (this._core.is('rotating') && !this._paused) {
			// Pause the clock.
			this._time = this.read();
			this._paused = true;

			window.clearTimeout(this._call);
		}
	};

	/**
	 * Destroys the plugin.
	 */
	Autoplay.prototype.destroy = function () {
		let handler, property;

		this.stop();

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.autoplay = Autoplay;

})(window.Zepto || window.jQuery, window, document);

/**
 * Navigation Plugin
 * @version 2.3.4
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {
	'use strict';

	/**
	 * Creates the navigation plugin.
	 * @class The Navigation Plugin
	 * @param {Owl} carousel - The Owl Carousel.
	 */
	let Navigation = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Indicates whether the plugin is initialized or not.
		 * @protected
		 * @type {Boolean}
		 */
		this._initialized = false;

		/**
		 * The current paging indexes.
		 * @protected
		 * @type {Array}
		 */
		this._pages = [];

		/**
		 * All DOM elements of the user interface.
		 * @protected
		 * @type {Object}
		 */
		this._controls = {};

		/**
		 * Markup for an indicator.
		 * @protected
		 * @type {Array.<String>}
		 */
		this._templates = [];

		/**
		 * The carousel element.
		 * @type {jQuery}
		 */
		this.$element = this._core.$element;

		/**
		 * Overridden methods of the carousel.
		 * @protected
		 * @type {Object}
		 */
		this._overrides = {
			next: this._core.next,
			prev: this._core.prev,
			to: this._core.to
		};

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'prepared.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.dotsData) {
					this._templates.push('<div class="' + this._core.settings.dotClass + '">' +
						$(e.content).find('[data-dot]').addBack('[data-dot]').attr('data-dot') + '</div>');
				}
			}, this),
			'added.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.dotsData) {
					this._templates.splice(e.position, 0, this._templates.pop());
				}
			}, this),
			'remove.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.dotsData) {
					this._templates.splice(e.position, 1);
				}
			}, this),
			'changed.owl.carousel': $.proxy(function (e) {
				if (e.namespace && e.property.name == 'position') {
					this.draw();
				}
			}, this),
			'initialized.owl.carousel': $.proxy(function (e) {
				if (e.namespace && !this._initialized) {
					this._core.trigger('initialize', null, 'navigation');
					this.initialize();
					this.update();
					this.draw();
					this._initialized = true;
					this._core.trigger('initialized', null, 'navigation');
				}
			}, this),
			'refreshed.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._initialized) {
					this._core.trigger('refresh', null, 'navigation');
					this.update();
					this.draw();
					this._core.trigger('refreshed', null, 'navigation');
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Navigation.Defaults, this._core.options);

		// register event handlers
		this.$element.on(this._handlers);
	};

	/**
	 * Default options.
	 * @public
	 * @todo Rename `slideBy` to `navBy`
	 */
	Navigation.Defaults = {
		nav: false,
		navText: [
			'<span aria-label="' + 'Previous' + '">&#x2039;</span>',
			'<span aria-label="' + 'Next' + '">&#x203a;</span>'
		],
		navSpeed: false,
		navElement: 'button type="button" role="presentation"',
		navContainer: false,
		navContainerClass: 'owl-nav',
		navClass: [
			'owl-prev',
			'owl-next'
		],
		slideBy: 1,
		dotClass: 'owl-dot',
		dotsClass: 'owl-dots',
		dots: true,
		dotsEach: false,
		dotsData: false,
		dotsSpeed: false,
		dotsContainer: false
	};

	/**
	 * Initializes the layout of the plugin and extends the carousel.
	 * @protected
	 */
	Navigation.prototype.initialize = function () {
		let override,
			settings = this._core.settings;

		// create DOM structure for relative navigation
		this._controls.$relative = (settings.navContainer ? $(settings.navContainer)
			: $('<div>').addClass(settings.navContainerClass).appendTo(this.$element)).addClass('disabled');

		this._controls.$previous = $('<' + settings.navElement + '>')
			.addClass(settings.navClass[0])
			.html(settings.navText[0])
			.prependTo(this._controls.$relative)
			.on('click', $.proxy(function (e) {
				this.prev(settings.navSpeed);
			}, this));
		this._controls.$next = $('<' + settings.navElement + '>')
			.addClass(settings.navClass[1])
			.html(settings.navText[1])
			.appendTo(this._controls.$relative)
			.on('click', $.proxy(function (e) {
				this.next(settings.navSpeed);
			}, this));

		// create DOM structure for absolute navigation
		if (!settings.dotsData) {
			this._templates = [$('<button role="button">')
				.addClass(settings.dotClass)
				.append($('<span>'))
				.prop('outerHTML')];
		}

		this._controls.$absolute = (settings.dotsContainer ? $(settings.dotsContainer)
			: $('<div>').addClass(settings.dotsClass).appendTo(this.$element)).addClass('disabled');

		this._controls.$absolute.on('click', 'button', $.proxy(function (e) {
			let index = $(e.target).parent().is(this._controls.$absolute)
				? $(e.target).index() : $(e.target).parent().index();

			e.preventDefault();

			this.to(index, settings.dotsSpeed);
		}, this));

		/*$el.on('focusin', function() {
			$(document).off(".carousel");

			$(document).on('keydown.carousel', function(e) {
				if(e.keyCode == 37) {
					$el.trigger('prev.owl')
				}
				if(e.keyCode == 39) {
					$el.trigger('next.owl')
				}
			});
		});*/

		// override public methods of the carousel
		for (override in this._overrides) {
			this._core[override] = $.proxy(this[override], this);
		}
	};

	/**
	 * Destroys the plugin.
	 * @protected
	 */
	Navigation.prototype.destroy = function () {
		let handler, control, property, override, settings;
		settings = this._core.settings;

		for (handler in this._handlers) {
			this.$element.off(handler, this._handlers[handler]);
		}
		for (control in this._controls) {
			if (control === '$relative' && settings.navContainer) {
				this._controls[control].html('');
			} else {
				this._controls[control].remove();
			}
		}
		for (override in this.overides) {
			this._core[override] = this._overrides[override];
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	/**
	 * Updates the internal state.
	 * @protected
	 */
	Navigation.prototype.update = function () {
		let i, j, k,
			lower = this._core.clones().length / 2,
			upper = lower + this._core.items().length,
			maximum = this._core.maximum(true),
			settings = this._core.settings,
			size = settings.center || settings.autoWidth || settings.dotsData
				? 1 : settings.dotsEach || settings.items;

		if (settings.slideBy !== 'page') {
			settings.slideBy = Math.min(settings.slideBy, settings.items);
		}

		if (settings.dots || settings.slideBy == 'page') {
			this._pages = [];

			for (i = lower, j = 0, k = 0; i < upper; i++) {
				if (j >= size || j === 0) {
					this._pages.push({
						start: Math.min(maximum, i - lower),
						end: i - lower + size - 1
					});
					if (Math.min(maximum, i - lower) === maximum) {
						break;
					}
					j = 0, ++k;
				}
				j += this._core.mergers(this._core.relative(i));
			}
		}
	};

	/**
	 * Draws the user interface.
	 * @todo The option `dotsData` wont work.
	 * @protected
	 */
	Navigation.prototype.draw = function () {
		let difference,
			settings = this._core.settings,
			disabled = this._core.items().length <= settings.items,
			index = this._core.relative(this._core.current()),
			loop = settings.loop || settings.rewind;

		this._controls.$relative.toggleClass('disabled', !settings.nav || disabled);

		if (settings.nav) {
			this._controls.$previous.toggleClass('disabled', !loop && index <= this._core.minimum(true));
			this._controls.$next.toggleClass('disabled', !loop && index >= this._core.maximum(true));
		}

		this._controls.$absolute.toggleClass('disabled', !settings.dots || disabled);

		if (settings.dots) {
			difference = this._pages.length - this._controls.$absolute.children().length;

			if (settings.dotsData && difference !== 0) {
				this._controls.$absolute.html(this._templates.join(''));
			} else if (difference > 0) {
				this._controls.$absolute.append(new Array(difference + 1).join(this._templates[0]));
			} else if (difference < 0) {
				this._controls.$absolute.children().slice(difference).remove();
			}

			this._controls.$absolute.find('.active').removeClass('active');
			this._controls.$absolute.children().eq($.inArray(this.current(), this._pages)).addClass('active');
		}
	};

	/**
	 * Extends event data.
	 * @protected
	 * @param {Event} event - The event object which gets thrown.
	 */
	Navigation.prototype.onTrigger = function (event) {
		let settings = this._core.settings;

		event.page = {
			index: $.inArray(this.current(), this._pages),
			count: this._pages.length,
			size: settings && (settings.center || settings.autoWidth || settings.dotsData
				? 1 : settings.dotsEach || settings.items)
		};
	};

	/**
	 * Gets the current page position of the carousel.
	 * @protected
	 * @returns {Number}
	 */
	Navigation.prototype.current = function () {
		let current = this._core.relative(this._core.current());
		return $.grep(this._pages, $.proxy(function (page, index) {
			return page.start <= current && page.end >= current;
		}, this)).pop();
	};

	/**
	 * Gets the current succesor/predecessor position.
	 * @protected
	 * @returns {Number}
	 */
	Navigation.prototype.getPosition = function (successor) {
		let position, length,
			settings = this._core.settings;

		if (settings.slideBy == 'page') {
			position = $.inArray(this.current(), this._pages);
			length = this._pages.length;
			successor ? ++position : --position;
			position = this._pages[((position % length) + length) % length].start;
		} else {
			position = this._core.relative(this._core.current());
			length = this._core.items().length;
			successor ? position += settings.slideBy : position -= settings.slideBy;
		}

		return position;
	};

	/**
	 * Slides to the next item or page.
	 * @public
	 * @param {Number} [speed=false] - The time in milliseconds for the transition.
	 */
	Navigation.prototype.next = function (speed) {
		$.proxy(this._overrides.to, this._core)(this.getPosition(true), speed);
	};

	/**
	 * Slides to the previous item or page.
	 * @public
	 * @param {Number} [speed=false] - The time in milliseconds for the transition.
	 */
	Navigation.prototype.prev = function (speed) {
		$.proxy(this._overrides.to, this._core)(this.getPosition(false), speed);
	};

	/**
	 * Slides to the specified item or page.
	 * @public
	 * @param {Number} position - The position of the item or page.
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 * @param {Boolean} [standard=false] - Whether to use the standard behaviour or not.
	 */
	Navigation.prototype.to = function (position, speed, standard) {
		let length;

		if (!standard && this._pages.length) {
			length = this._pages.length;
			$.proxy(this._overrides.to, this._core)(this._pages[((position % length) + length) % length].start, speed);
		} else {
			$.proxy(this._overrides.to, this._core)(position, speed);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Navigation = Navigation;

})(window.Zepto || window.jQuery, window, document);

/**
 * Hash Plugin
 * @version 2.3.4
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {
	'use strict';

	/**
	 * Creates the hash plugin.
	 * @class The Hash Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	let Hash = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Hash index for the items.
		 * @protected
		 * @type {Object}
		 */
		this._hashes = {};

		/**
		 * The carousel element.
		 * @type {jQuery}
		 */
		this.$element = this._core.$element;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.startPosition === 'URLHash') {
					$(window).trigger('hashchange.owl.navigation');
				}
			}, this),
			'prepared.owl.carousel': $.proxy(function (e) {
				if (e.namespace) {
					let hash = $(e.content).find('[data-hash]').addBack('[data-hash]').attr('data-hash');

					if (!hash) {
						return;
					}

					this._hashes[hash] = e.content;
				}
			}, this),
			'changed.owl.carousel': $.proxy(function (e) {
				if (e.namespace && e.property.name === 'position') {
					let current = this._core.items(this._core.relative(this._core.current())),
						hash = $.map(this._hashes, function (item, hash) {
							return item === current ? hash : null;
						}).join();

					if (!hash || window.location.hash.slice(1) === hash) {
						return;
					}

					window.location.hash = hash;
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Hash.Defaults, this._core.options);

		// register the event handlers
		this.$element.on(this._handlers);

		// register event listener for hash navigation
		$(window).on('hashchange.owl.navigation', $.proxy(function (e) {
			let hash = window.location.hash.substring(1),
				items = this._core.$stage.children(),
				position = this._hashes[hash] && items.index(this._hashes[hash]);

			if (position === undefined || position === this._core.current()) {
				return;
			}

			this._core.to(this._core.relative(position), false, true);
		}, this));
	};

	/**
	 * Default options.
	 * @public
	 */
	Hash.Defaults = {
		URLhashListener: false
	};

	/**
	 * Destroys the plugin.
	 * @public
	 */
	Hash.prototype.destroy = function () {
		let handler, property;

		$(window).off('hashchange.owl.navigation');

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Hash = Hash;

})(window.Zepto || window.jQuery, window, document);

/**
 * Support Plugin
 *
 * @version 2.3.4
 * @author Vivid Planet Software GmbH
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {

	let style = $('<support>').get(0).style,
		prefixes = 'Webkit Moz O ms'.split(' '),
		events = {
			transition: {
				end: {
					WebkitTransition: 'webkitTransitionEnd',
					MozTransition: 'transitionend',
					OTransition: 'oTransitionEnd',
					transition: 'transitionend'
				}
			},
			animation: {
				end: {
					WebkitAnimation: 'webkitAnimationEnd',
					MozAnimation: 'animationend',
					OAnimation: 'oAnimationEnd',
					animation: 'animationend'
				}
			}
		},
		tests = {
			csstransforms: function () {
				return !!test('transform');
			},
			csstransforms3d: function () {
				return !!test('perspective');
			},
			csstransitions: function () {
				return !!test('transition');
			},
			cssanimations: function () {
				return !!test('animation');
			}
		};

	function test(property, prefixed) {
		let result = false,
			upper = property.charAt(0).toUpperCase() + property.slice(1);

		$.each((property + ' ' + prefixes.join(upper + ' ') + upper).split(' '), function (i, property) {
			if (style[property] !== undefined) {
				result = prefixed ? property : true;
				return false;
			}
		});

		return result;
	}

	function prefixed(property) {
		return test(property, true);
	}

	if (tests.csstransitions()) {
		/* jshint -W053 */
		$.support.transition = new String(prefixed('transition'))
		$.support.transition.end = events.transition.end[$.support.transition];
	}

	if (tests.cssanimations()) {
		/* jshint -W053 */
		$.support.animation = new String(prefixed('animation'))
		$.support.animation.end = events.animation.end[$.support.animation];
	}

	if (tests.csstransforms()) {
		/* jshint -W053 */
		$.support.transform = new String(prefixed('transform'));
		$.support.transform3d = tests.csstransforms3d();
	}

})(window.Zepto || window.jQuery, window, document);


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
		
		#Carousel .swiper-slide {
		  width: 100% !important;
		}
	  }
	`;
	document.head.appendChild(style);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeSwiper);
} else {
	initializeSwiper();
}


//Industries Carousel
const initializeIndustriesCarousel = () => {
	const swiperElement = document.querySelector('.SectionCard_root__vJRVT .swiper');
	if (!swiperElement) return;

	const slideCount = swiperElement.querySelectorAll('.swiper-slide').length;

	const industriesSwiper = new Swiper('.SectionCard_root__vJRVT .swiper', {
		init: false,
		slidesPerView: 'auto',
		spaceBetween: 80, // Significantly increased gap between cards
		loop: true,
		loopedSlides: slideCount,
		preventInteractionOnTransition: true,

		pagination: {
			el: '.SectionCard_root__vJRVT .swiper-pagination',
			clickable: true,
			bulletClass: 'swiper-pagination-bullet',
			bulletActiveClass: 'swiper-pagination-bullet-active'
		},

		breakpoints: {
			320: {
				slidesPerView: 1,
				spaceBetween: 80,
				centeredSlides: true
			},
			768: {
				slidesPerView: Math.min(slideCount, 4), // Show 4 cards on larger screens
				spaceBetween: 80,
				centeredSlides: false
			},
			1024: {
				slidesPerView: Math.min(slideCount, 4),
				spaceBetween: 80,
				centeredSlides: false
			}
		},

		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
			enabled: true
		},

		effect: 'slide',
		speed: 800,

		observer: true,
		observeParents: true,
		watchOverflow: true,
		watchSlidesProgress: true,

		on: {
			init: function () {
				// Set smaller card width
				swiperElement.querySelectorAll('.swiper-slide').forEach(slide => {
					slide.style.visibility = 'visible';
					slide.style.opacity = '1';
					slide.style.width = '250px !important'; // Decreased card width to match the image
				});

				// Adjust the card container width
				swiperElement.querySelectorAll('.AdvantageCard_AdvantageCard__container__bvEfL').forEach(card => {
					card.style.maxWidth = '250px';
				});
			},

			slideChange: function () {
				const paginationEl = document.querySelector('.SectionCard_root__vJRVT .swiper-pagination');
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

	industriesSwiper.init();

	// Update on window resize
	window.addEventListener('resize', () => {
		industriesSwiper.update();
	});
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeIndustriesCarousel);
} else {
	initializeIndustriesCarousel();
}


// OWL Carousel ends


//Full Window scroll Controls
$(window).scroll(function () { 100 <= $(window).scrollTop() ? $("header").addClass("header-scroll") : $("header").removeClass("header-scroll") });
$(window).scroll(function () { 250 <= $(window).scrollTop() ? $(".mob-enroll").addClass("active") : $(".mob-enroll").removeClass("active") })


//Announcement Banner
let count = -1;
function AddRedClass() {
	let boxes = $('.annoucement-inner');
	let boxLength = boxes.length - 1;
	//Check if the actual item isn't more than the length then add 1 otherway restart to 0
	count < boxLength ? count++ : count = 0;
	//Remove the class and add it to the new target
	boxes.removeClass('flip').eq(count).addClass('flip');
}
setInterval(AddRedClass, 2500);



$('.header-search-icon').click(function () {
	$('#search-input').toggleClass('active');
});
$('.emi-btn').click(function () {
	$('.emi-popup').toggleClass('active');
});

$('.emi-popup-close').click(function () {
	$('.emi-popup').toggleClass('active');
	$('.emi-detail-block').removeClass('active');
	$('.emi-form').removeClass('close');
});
$('.emi-popup-bg').click(function () {
	$('.emi-popup').toggleClass('active');
	$('.emi-detail-block').removeClass('active');
	$('.emi-form').removeClass('close');
});
$('.emi-submit-btn').click(function () {
	$('.emi-detail-block').toggleClass('active');
	$('.emi-form').toggleClass('close');
});
$('.sticky-apply').click(function () {
	$('.popup-form').toggleClass('active');
});
$('.mob-enroll-btn').click(function () {
	$('.popup-form').toggleClass('active');
});
$('.popup-form-bg').click(function () {
	$('.popup-form').toggleClass('active');
});
$('.popup-form-close').click(function () {
	$('.popup-form').toggleClass('active');
});
$('.footer-full-btn').click(function () {
	$('.footer-full-btn').toggleClass('active');
	$('.footer-full-content').toggleClass('active');
});
$('.eligible-btn').click(function () {
	$('.eligible-popup').toggleClass('active');
});
$('.eligible-popup-close').click(function () {
	$('.eligible-popup').toggleClass('active');
	$('.eligible-detail-block').removeClass('active');
	$('.eligible-form').removeClass('close');
});
$('.eligible-popup-bg').click(function () {
	$('.eligible-popup').toggleClass('active');
	$('.eligible-detail-block').removeClass('active');
	$('.eligible-form').removeClass('close');
});
$('.eligible-submit-btn').click(function () {
	$('.eligible-detail-block').toggleClass('active');
	$('.eligible-form').toggleClass('close');
});


//Testimonial PlayButton

$(document).ready(function () {
	$(".testimonial-play-btn").on("click", function () {
		let $this = $(this);
		let $content = $this.next("div.testimonial-vdo");
		$('.testimonial-vdo').removeClass('active');
		$('.testimonial-vdo').children('video').trigger('pause');

		$content.addClass("active");
		$content.children('video').trigger('play');
	});
});



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


// Percentage Bar


let CircularBar = document.querySelector(".circular-bar");
let PercentValue = document.querySelector(".percent");

let InitialValue = 0;
let finaleValue = 92;
let speed = 10;




$(".open_popup").click(function () {
	$(this).parent(".mentor-btn").children(".popup_body").addClass("popup_body_show");
});
$(".popup_close").click(function () {
	$(".popup_body").removeClass("popup_body_show");
});
$(".popup_back").click(function () {
	$(".popup_body").removeClass("popup_body_show");
});


// Get elements


// Get references to elements
const searchIcon = document.querySelector('.header-search-icon');
const menuToggleButton = document.getElementById('menuToggleButton');
const hamburgerImage = document.getElementById('hamburgerImage');
const closeIcon = document.getElementById('closeIcon');
const mobileContainer = document.getElementById('mobileContainer');

// Toggle menu visibility and icons
menuToggleButton.addEventListener('click', () => {
    const isHamburgerVisible = hamburgerImage.style.display !== 'none';
 
    if (isHamburgerVisible) {
        // Hide the hamburger image, show the cross icon, and display the mobile container
        hamburgerImage.style.display = 'none';
        closeIcon.style.display = 'block';
        mobileContainer.style.display = 'block';
    } else {
        // Show the hamburger image, hide the cross icon, and hide the mobile container
        hamburgerImage.style.display = 'block';
        closeIcon.style.display = 'none';
        mobileContainer.style.display = 'none';
    }
});
// Function to check if the device is mobile
function isMobile() {
	return window.innerWidth <= 1024;  // Adjust this value based on your mobile breakpoint
}

// Toggle the mobile menu visibility when the search icon is clicked (only on mobile)
searchIcon.addEventListener('click', function () {
	if (isMobile()) {
		// Toggle visibility of mobile menu
		if (mobileContainer.style.display === 'block') {
			mobileContainer.style.display = 'none';  // Hide the menu
			hamburgerImage.style.display = 'block';  // Show hamburger
			closeIcon.style.display = 'none';  // Hide close icon
		} else {
			mobileContainer.style.display = 'block';  // Show the menu
			hamburgerImage.style.display = 'none';  // Hide hamburger
			closeIcon.style.display = 'block';  // Show close icon
		}
	}
});




// Bootstrap.min.js (Below code contains core functionality of bootstrap like cards, modals etc.)

/*!
  * Bootstrap v4.3.1 (https://getbootstrap.com/)
  * Copyright 2011-2019 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
!function (t, e) { "object" == typeof exports && "undefined" != typeof module ? e(exports, require("jquery"), require("popper.js")) : "function" == typeof define && define.amd ? define(["exports", "jquery", "popper.js"], e) : e((t = t || self).bootstrap = {}, t.jQuery, t.Popper) }(this, function (t, g, u) { "use strict"; function i(t, e) { for (let n = 0; n < e.length; n++) { let i = e[n]; i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i) } } function s(t, e, n) { return e && i(t.prototype, e), n && i(t, n), t } function l(o) { for (let t = 1; t < arguments.length; t++) { let r = null != arguments[t] ? arguments[t] : {}, e = Object.keys(r); "function" == typeof Object.getOwnPropertySymbols && (e = e.concat(Object.getOwnPropertySymbols(r).filter(function (t) { return Object.getOwnPropertyDescriptor(r, t).enumerable }))), e.forEach(function (t) { let e, n, i; e = o, i = r[n = t], n in e ? Object.defineProperty(e, n, { value: i, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = i }) } return o } g = g && g.hasOwnProperty("default") ? g.default : g, u = u && u.hasOwnProperty("default") ? u.default : u; let e = "transitionend"; function n(t) { let e = this, n = !1; return g(this).one(_.TRANSITION_END, function () { n = !0 }), setTimeout(function () { n || _.triggerTransitionEnd(e) }, t), this } let _ = { TRANSITION_END: "bsTransitionEnd", getUID: function (t) { for (; t += ~~(1e6 * Math.random()), document.getElementById(t);); return t }, getSelectorFromElement: function (t) { let e = t.getAttribute("data-target"); if (!e || "#" === e) { let n = t.getAttribute("href"); e = n && "#" !== n ? n.trim() : "" } try { return document.querySelector(e) ? e : null } catch (t) { return null } }, getTransitionDurationFromElement: function (t) { if (!t) return 0; let e = g(t).css("transition-duration"), n = g(t).css("transition-delay"), i = parseFloat(e), o = parseFloat(n); return i || o ? (e = e.split(",")[0], n = n.split(",")[0], 1e3 * (parseFloat(e) + parseFloat(n))) : 0 }, reflow: function (t) { return t.offsetHeight }, triggerTransitionEnd: function (t) { g(t).trigger(e) }, supportsTransitionEnd: function () { return Boolean(e) }, isElement: function (t) { return (t[0] || t).nodeType }, typeCheckConfig: function (t, e, n) { for (let i in n) if (Object.prototype.hasOwnProperty.call(n, i)) { let o = n[i], r = e[i], s = r && _.isElement(r) ? "element" : (a = r, {}.toString.call(a).match(/\s([a-z]+)/i)[1].toLowerCase()); if (!new RegExp(o).test(s)) throw new Error(t.toUpperCase() + ': Option "' + i + '" provided type "' + s + '" but expected type "' + o + '".') } let a }, findShadowRoot: function (t) { if (!document.documentElement.attachShadow) return null; if ("function" != typeof t.getRootNode) return t instanceof ShadowRoot ? t : t.parentNode ? _.findShadowRoot(t.parentNode) : null; let e = t.getRootNode(); return e instanceof ShadowRoot ? e : null } }; g.fn.emulateTransitionEnd = n, g.event.special[_.TRANSITION_END] = { bindType: e, delegateType: e, handle: function (t) { if (g(t.target).is(this)) return t.handleObj.handler.apply(this, arguments) } }; let o = "alert", r = "bs.alert", a = "." + r, c = g.fn[o], h = { CLOSE: "close" + a, CLOSED: "closed" + a, CLICK_DATA_API: "click" + a + ".data-api" }, f = "alert", d = "fade", m = "show", p = function () { function i(t) { this._element = t } let t = i.prototype; return t.close = function (t) { let e = this._element; t && (e = this._getRootElement(t)), this._triggerCloseEvent(e).isDefaultPrevented() || this._removeElement(e) }, t.dispose = function () { g.removeData(this._element, r), this._element = null }, t._getRootElement = function (t) { let e = _.getSelectorFromElement(t), n = !1; return e && (n = document.querySelector(e)), n || (n = g(t).closest("." + f)[0]), n }, t._triggerCloseEvent = function (t) { let e = g.Event(h.CLOSE); return g(t).trigger(e), e }, t._removeElement = function (e) { let n = this; if (g(e).removeClass(m), g(e).hasClass(d)) { let t = _.getTransitionDurationFromElement(e); g(e).one(_.TRANSITION_END, function (t) { return n._destroyElement(e, t) }).emulateTransitionEnd(t) } else this._destroyElement(e) }, t._destroyElement = function (t) { g(t).detach().trigger(h.CLOSED).remove() }, i._jQueryInterface = function (n) { return this.each(function () { let t = g(this), e = t.data(r); e || (e = new i(this), t.data(r, e)), "close" === n && e[n](this) }) }, i._handleDismiss = function (e) { return function (t) { t && t.preventDefault(), e.close(this) } }, s(i, null, [{ key: "VERSION", get: function () { return "4.3.1" } }]), i }(); g(document).on(h.CLICK_DATA_API, '[data-dismiss="alert"]', p._handleDismiss(new p)), g.fn[o] = p._jQueryInterface, g.fn[o].Constructor = p, g.fn[o].noConflict = function () { return g.fn[o] = c, p._jQueryInterface }; let v = "button", y = "bs.button", E = "." + y, C = ".data-api", T = g.fn[v], S = "active", b = "btn", I = "focus", D = '[data-toggle^="button"]', w = '[data-toggle="buttons"]', A = 'input:not([type="hidden"])', N = ".active", O = ".btn", k = { CLICK_DATA_API: "click" + E + C, FOCUS_BLUR_DATA_API: "focus" + E + C + " blur" + E + C }, P = function () { function n(t) { this._element = t } let t = n.prototype; return t.toggle = function () { let t = !0, e = !0, n = g(this._element).closest(w)[0]; if (n) { let i = this._element.querySelector(A); if (i) { if ("radio" === i.type) if (i.checked && this._element.classList.contains(S)) t = !1; else { let o = n.querySelector(N); o && g(o).removeClass(S) } if (t) { if (i.hasAttribute("disabled") || n.hasAttribute("disabled") || i.classList.contains("disabled") || n.classList.contains("disabled")) return; i.checked = !this._element.classList.contains(S), g(i).trigger("change") } i.focus(), e = !1 } } e && this._element.setAttribute("aria-pressed", !this._element.classList.contains(S)), t && g(this._element).toggleClass(S) }, t.dispose = function () { g.removeData(this._element, y), this._element = null }, n._jQueryInterface = function (e) { return this.each(function () { let t = g(this).data(y); t || (t = new n(this), g(this).data(y, t)), "toggle" === e && t[e]() }) }, s(n, null, [{ key: "VERSION", get: function () { return "4.3.1" } }]), n }(); g(document).on(k.CLICK_DATA_API, D, function (t) { t.preventDefault(); let e = t.target; g(e).hasClass(b) || (e = g(e).closest(O)), P._jQueryInterface.call(g(e), "toggle") }).on(k.FOCUS_BLUR_DATA_API, D, function (t) { let e = g(t.target).closest(O)[0]; g(e).toggleClass(I, /^focus(in)?$/.test(t.type)) }), g.fn[v] = P._jQueryInterface, g.fn[v].Constructor = P, g.fn[v].noConflict = function () { return g.fn[v] = T, P._jQueryInterface }; let L = "carousel", j = "bs.carousel", H = "." + j, R = ".data-api", x = g.fn[L], F = { interval: 5e3, keyboard: !0, slide: !1, pause: "hover", wrap: !0, touch: !0 }, U = { interval: "(number|boolean)", keyboard: "boolean", slide: "(boolean|string)", pause: "(string|boolean)", wrap: "boolean", touch: "boolean" }, W = "next", q = "prev", M = "left", K = "right", Q = { SLIDE: "slide" + H, SLID: "slid" + H, KEYDOWN: "keydown" + H, MOUSEENTER: "mouseenter" + H, MOUSELEAVE: "mouseleave" + H, TOUCHSTART: "touchstart" + H, TOUCHMOVE: "touchmove" + H, TOUCHEND: "touchend" + H, POINTERDOWN: "pointerdown" + H, POINTERUP: "pointerup" + H, DRAG_START: "dragstart" + H, LOAD_DATA_API: "load" + H + R, CLICK_DATA_API: "click" + H + R }, B = "carousel", V = "active", Y = "slide", z = "carousel-item-right", X = "carousel-item-left", $ = "carousel-item-next", G = "carousel-item-prev", J = "pointer-event", Z = ".active", tt = ".active.carousel-item", et = ".carousel-item", nt = ".carousel-item img", it = ".carousel-item-next, .carousel-item-prev", ot = ".carousel-indicators", rt = "[data-slide], [data-slide-to]", st = '[data-ride="carousel"]', at = { TOUCH: "touch", PEN: "pen" }, lt = function () { function r(t, e) { this._items = null, this._interval = null, this._activeElement = null, this._isPaused = !1, this._isSliding = !1, this.touchTimeout = null, this.touchStartX = 0, this.touchDeltaX = 0, this._config = this._getConfig(e), this._element = t, this._indicatorsElement = this._element.querySelector(ot), this._touchSupported = "ontouchstart" in document.documentElement || 0 < navigator.maxTouchPoints, this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent), this._addEventListeners() } let t = r.prototype; return t.next = function () { this._isSliding || this._slide(W) }, t.nextWhenVisible = function () { !document.hidden && g(this._element).is(":visible") && "hidden" !== g(this._element).css("visibility") && this.next() }, t.prev = function () { this._isSliding || this._slide(q) }, t.pause = function (t) { t || (this._isPaused = !0), this._element.querySelector(it) && (_.triggerTransitionEnd(this._element), this.cycle(!0)), clearInterval(this._interval), this._interval = null }, t.cycle = function (t) { t || (this._isPaused = !1), this._interval && (clearInterval(this._interval), this._interval = null), this._config.interval && !this._isPaused && (this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval)) }, t.to = function (t) { let e = this; this._activeElement = this._element.querySelector(tt); let n = this._getItemIndex(this._activeElement); if (!(t > this._items.length - 1 || t < 0)) if (this._isSliding) g(this._element).one(Q.SLID, function () { return e.to(t) }); else { if (n === t) return this.pause(), void this.cycle(); let i = n < t ? W : q; this._slide(i, this._items[t]) } }, t.dispose = function () { g(this._element).off(H), g.removeData(this._element, j), this._items = null, this._config = null, this._element = null, this._interval = null, this._isPaused = null, this._isSliding = null, this._activeElement = null, this._indicatorsElement = null }, t._getConfig = function (t) { return t = l({}, F, t), _.typeCheckConfig(L, t, U), t }, t._handleSwipe = function () { let t = Math.abs(this.touchDeltaX); if (!(t <= 40)) { let e = t / this.touchDeltaX; 0 < e && this.prev(), e < 0 && this.next() } }, t._addEventListeners = function () { let e = this; this._config.keyboard && g(this._element).on(Q.KEYDOWN, function (t) { return e._keydown(t) }), "hover" === this._config.pause && g(this._element).on(Q.MOUSEENTER, function (t) { return e.pause(t) }).on(Q.MOUSELEAVE, function (t) { return e.cycle(t) }), this._config.touch && this._addTouchEventListeners() }, t._addTouchEventListeners = function () { let n = this; if (this._touchSupported) { let e = function (t) { n._pointerEvent && at[t.originalEvent.pointerType.toUpperCase()] ? n.touchStartX = t.originalEvent.clientX : n._pointerEvent || (n.touchStartX = t.originalEvent.touches[0].clientX) }, i = function (t) { n._pointerEvent && at[t.originalEvent.pointerType.toUpperCase()] && (n.touchDeltaX = t.originalEvent.clientX - n.touchStartX), n._handleSwipe(), "hover" === n._config.pause && (n.pause(), n.touchTimeout && clearTimeout(n.touchTimeout), n.touchTimeout = setTimeout(function (t) { return n.cycle(t) }, 500 + n._config.interval)) }; g(this._element.querySelectorAll(nt)).on(Q.DRAG_START, function (t) { return t.preventDefault() }), this._pointerEvent ? (g(this._element).on(Q.POINTERDOWN, function (t) { return e(t) }), g(this._element).on(Q.POINTERUP, function (t) { return i(t) }), this._element.classList.add(J)) : (g(this._element).on(Q.TOUCHSTART, function (t) { return e(t) }), g(this._element).on(Q.TOUCHMOVE, function (t) { let e; (e = t).originalEvent.touches && 1 < e.originalEvent.touches.length ? n.touchDeltaX = 0 : n.touchDeltaX = e.originalEvent.touches[0].clientX - n.touchStartX }), g(this._element).on(Q.TOUCHEND, function (t) { return i(t) })) } }, t._keydown = function (t) { if (!/input|textarea/i.test(t.target.tagName)) switch (t.which) { case 37: t.preventDefault(), this.prev(); break; case 39: t.preventDefault(), this.next() } }, t._getItemIndex = function (t) { return this._items = t && t.parentNode ? [].slice.call(t.parentNode.querySelectorAll(et)) : [], this._items.indexOf(t) }, t._getItemByDirection = function (t, e) { let n = t === W, i = t === q, o = this._getItemIndex(e), r = this._items.length - 1; if ((i && 0 === o || n && o === r) && !this._config.wrap) return e; let s = (o + (t === q ? -1 : 1)) % this._items.length; return -1 === s ? this._items[this._items.length - 1] : this._items[s] }, t._triggerSlideEvent = function (t, e) { let n = this._getItemIndex(t), i = this._getItemIndex(this._element.querySelector(tt)), o = g.Event(Q.SLIDE, { relatedTarget: t, direction: e, from: i, to: n }); return g(this._element).trigger(o), o }, t._setActiveIndicatorElement = function (t) { if (this._indicatorsElement) { let e = [].slice.call(this._indicatorsElement.querySelectorAll(Z)); g(e).removeClass(V); let n = this._indicatorsElement.children[this._getItemIndex(t)]; n && g(n).addClass(V) } }, t._slide = function (t, e) { let n, i, o, r = this, s = this._element.querySelector(tt), a = this._getItemIndex(s), l = e || s && this._getItemByDirection(t, s), c = this._getItemIndex(l), h = Boolean(this._interval); if (o = t === W ? (n = X, i = $, M) : (n = z, i = G, K), l && g(l).hasClass(V)) this._isSliding = !1; else if (!this._triggerSlideEvent(l, o).isDefaultPrevented() && s && l) { this._isSliding = !0, h && this.pause(), this._setActiveIndicatorElement(l); let u = g.Event(Q.SLID, { relatedTarget: l, direction: o, from: a, to: c }); if (g(this._element).hasClass(Y)) { g(l).addClass(i), _.reflow(l), g(s).addClass(n), g(l).addClass(n); let f = parseInt(l.getAttribute("data-interval"), 10); this._config.interval = f ? (this._config.defaultInterval = this._config.defaultInterval || this._config.interval, f) : this._config.defaultInterval || this._config.interval; let d = _.getTransitionDurationFromElement(s); g(s).one(_.TRANSITION_END, function () { g(l).removeClass(n + " " + i).addClass(V), g(s).removeClass(V + " " + i + " " + n), r._isSliding = !1, setTimeout(function () { return g(r._element).trigger(u) }, 0) }).emulateTransitionEnd(d) } else g(s).removeClass(V), g(l).addClass(V), this._isSliding = !1, g(this._element).trigger(u); h && this.cycle() } }, r._jQueryInterface = function (i) { return this.each(function () { let t = g(this).data(j), e = l({}, F, g(this).data()); "object" == typeof i && (e = l({}, e, i)); let n = "string" == typeof i ? i : e.slide; if (t || (t = new r(this, e), g(this).data(j, t)), "number" == typeof i) t.to(i); else if ("string" == typeof n) { if ("undefined" == typeof t[n]) throw new TypeError('No method named "' + n + '"'); t[n]() } else e.interval && e.ride && (t.pause(), t.cycle()) }) }, r._dataApiClickHandler = function (t) { let e = _.getSelectorFromElement(this); if (e) { let n = g(e)[0]; if (n && g(n).hasClass(B)) { let i = l({}, g(n).data(), g(this).data()), o = this.getAttribute("data-slide-to"); o && (i.interval = !1), r._jQueryInterface.call(g(n), i), o && g(n).data(j).to(o), t.preventDefault() } } }, s(r, null, [{ key: "VERSION", get: function () { return "4.3.1" } }, { key: "Default", get: function () { return F } }]), r }(); g(document).on(Q.CLICK_DATA_API, rt, lt._dataApiClickHandler), g(window).on(Q.LOAD_DATA_API, function () { for (let t = [].slice.call(document.querySelectorAll(st)), e = 0, n = t.length; e < n; e++) { let i = g(t[e]); lt._jQueryInterface.call(i, i.data()) } }), g.fn[L] = lt._jQueryInterface, g.fn[L].Constructor = lt, g.fn[L].noConflict = function () { return g.fn[L] = x, lt._jQueryInterface }; let ct = "collapse", ht = "bs.collapse", ut = "." + ht, ft = g.fn[ct], dt = { toggle: !0, parent: "" }, gt = { toggle: "boolean", parent: "(string|element)" }, _t = { SHOW: "show" + ut, SHOWN: "shown" + ut, HIDE: "hide" + ut, HIDDEN: "hidden" + ut, CLICK_DATA_API: "click" + ut + ".data-api" }, mt = "show", pt = "collapse", vt = "collapsing", yt = "collapsed", Et = "width", Ct = "height", Tt = ".show, .collapsing", St = '[data-toggle="collapse"]', bt = function () { function a(e, t) { this._isTransitioning = !1, this._element = e, this._config = this._getConfig(t), this._triggerArray = [].slice.call(document.querySelectorAll('[data-toggle="collapse"][href="#' + e.id + '"],[data-toggle="collapse"][data-target="#' + e.id + '"]')); for (let n = [].slice.call(document.querySelectorAll(St)), i = 0, o = n.length; i < o; i++) { let r = n[i], s = _.getSelectorFromElement(r), a = [].slice.call(document.querySelectorAll(s)).filter(function (t) { return t === e }); null !== s && 0 < a.length && (this._selector = s, this._triggerArray.push(r)) } this._parent = this._config.parent ? this._getParent() : null, this._config.parent || this._addAriaAndCollapsedClass(this._element, this._triggerArray), this._config.toggle && this.toggle() } let t = a.prototype; return t.toggle = function () { g(this._element).hasClass(mt) ? this.hide() : this.show() }, t.show = function () { let t, e, n = this; if (!this._isTransitioning && !g(this._element).hasClass(mt) && (this._parent && 0 === (t = [].slice.call(this._parent.querySelectorAll(Tt)).filter(function (t) { return "string" == typeof n._config.parent ? t.getAttribute("data-parent") === n._config.parent : t.classList.contains(pt) })).length && (t = null), !(t && (e = g(t).not(this._selector).data(ht)) && e._isTransitioning))) { let i = g.Event(_t.SHOW); if (g(this._element).trigger(i), !i.isDefaultPrevented()) { t && (a._jQueryInterface.call(g(t).not(this._selector), "hide"), e || g(t).data(ht, null)); let o = this._getDimension(); g(this._element).removeClass(pt).addClass(vt), this._element.style[o] = 0, this._triggerArray.length && g(this._triggerArray).removeClass(yt).attr("aria-expanded", !0), this.setTransitioning(!0); let r = "scroll" + (o[0].toUpperCase() + o.slice(1)), s = _.getTransitionDurationFromElement(this._element); g(this._element).one(_.TRANSITION_END, function () { g(n._element).removeClass(vt).addClass(pt).addClass(mt), n._element.style[o] = "", n.setTransitioning(!1), g(n._element).trigger(_t.SHOWN) }).emulateTransitionEnd(s), this._element.style[o] = this._element[r] + "px" } } }, t.hide = function () { let t = this; if (!this._isTransitioning && g(this._element).hasClass(mt)) { let e = g.Event(_t.HIDE); if (g(this._element).trigger(e), !e.isDefaultPrevented()) { let n = this._getDimension(); this._element.style[n] = this._element.getBoundingClientRect()[n] + "px", _.reflow(this._element), g(this._element).addClass(vt).removeClass(pt).removeClass(mt); let i = this._triggerArray.length; if (0 < i) for (let o = 0; o < i; o++) { let r = this._triggerArray[o], s = _.getSelectorFromElement(r); if (null !== s) g([].slice.call(document.querySelectorAll(s))).hasClass(mt) || g(r).addClass(yt).attr("aria-expanded", !1) } this.setTransitioning(!0); this._element.style[n] = ""; let a = _.getTransitionDurationFromElement(this._element); g(this._element).one(_.TRANSITION_END, function () { t.setTransitioning(!1), g(t._element).removeClass(vt).addClass(pt).trigger(_t.HIDDEN) }).emulateTransitionEnd(a) } } }, t.setTransitioning = function (t) { this._isTransitioning = t }, t.dispose = function () { g.removeData(this._element, ht), this._config = null, this._parent = null, this._element = null, this._triggerArray = null, this._isTransitioning = null }, t._getConfig = function (t) { return (t = l({}, dt, t)).toggle = Boolean(t.toggle), _.typeCheckConfig(ct, t, gt), t }, t._getDimension = function () { return g(this._element).hasClass(Et) ? Et : Ct }, t._getParent = function () { let t, n = this; _.isElement(this._config.parent) ? (t = this._config.parent, "undefined" != typeof this._config.parent.jquery && (t = this._config.parent[0])) : t = document.querySelector(this._config.parent); let e = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]', i = [].slice.call(t.querySelectorAll(e)); return g(i).each(function (t, e) { n._addAriaAndCollapsedClass(a._getTargetFromElement(e), [e]) }), t }, t._addAriaAndCollapsedClass = function (t, e) { let n = g(t).hasClass(mt); e.length && g(e).toggleClass(yt, !n).attr("aria-expanded", n) }, a._getTargetFromElement = function (t) { let e = _.getSelectorFromElement(t); return e ? document.querySelector(e) : null }, a._jQueryInterface = function (i) { return this.each(function () { let t = g(this), e = t.data(ht), n = l({}, dt, t.data(), "object" == typeof i && i ? i : {}); if (!e && n.toggle && /show|hide/.test(i) && (n.toggle = !1), e || (e = new a(this, n), t.data(ht, e)), "string" == typeof i) { if ("undefined" == typeof e[i]) throw new TypeError('No method named "' + i + '"'); e[i]() } }) }, s(a, null, [{ key: "VERSION", get: function () { return "4.3.1" } }, { key: "Default", get: function () { return dt } }]), a }(); g(document).on(_t.CLICK_DATA_API, St, function (t) { "A" === t.currentTarget.tagName && t.preventDefault(); let n = g(this), e = _.getSelectorFromElement(this), i = [].slice.call(document.querySelectorAll(e)); g(i).each(function () { let t = g(this), e = t.data(ht) ? "toggle" : n.data(); bt._jQueryInterface.call(t, e) }) }), g.fn[ct] = bt._jQueryInterface, g.fn[ct].Constructor = bt, g.fn[ct].noConflict = function () { return g.fn[ct] = ft, bt._jQueryInterface }; let It = "dropdown", Dt = "bs.dropdown", wt = "." + Dt, At = ".data-api", Nt = g.fn[It], Ot = new RegExp("38|40|27"), kt = { HIDE: "hide" + wt, HIDDEN: "hidden" + wt, SHOW: "show" + wt, SHOWN: "shown" + wt, CLICK: "click" + wt, CLICK_DATA_API: "click" + wt + At, KEYDOWN_DATA_API: "keydown" + wt + At, KEYUP_DATA_API: "keyup" + wt + At }, Pt = "disabled", Lt = "show", jt = "dropup", Ht = "dropright", Rt = "dropleft", xt = "dropdown-menu-right", Ft = "position-static", Ut = '[data-toggle="dropdown"]', Wt = ".dropdown form", qt = ".dropdown-menu", Mt = ".navbar-nav", Kt = ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)", Qt = "top-start", Bt = "top-end", Vt = "bottom-start", Yt = "bottom-end", zt = "right-start", Xt = "left-start", $t = { offset: 0, flip: !0, boundary: "scrollParent", reference: "toggle", display: "dynamic" }, Gt = { offset: "(number|string|function)", flip: "boolean", boundary: "(string|element)", reference: "(string|element)", display: "string" }, Jt = function () { function c(t, e) { this._element = t, this._popper = null, this._config = this._getConfig(e), this._menu = this._getMenuElement(), this._inNavbar = this._detectNavbar(), this._addEventListeners() } let t = c.prototype; return t.toggle = function () { if (!this._element.disabled && !g(this._element).hasClass(Pt)) { let t = c._getParentFromElement(this._element), e = g(this._menu).hasClass(Lt); if (c._clearMenus(), !e) { let n = { relatedTarget: this._element }, i = g.Event(kt.SHOW, n); if (g(t).trigger(i), !i.isDefaultPrevented()) { if (!this._inNavbar) { if ("undefined" == typeof u) throw new TypeError("Bootstrap's dropdowns require Popper.js (https://popper.js.org/)"); let o = this._element; "parent" === this._config.reference ? o = t : _.isElement(this._config.reference) && (o = this._config.reference, "undefined" != typeof this._config.reference.jquery && (o = this._config.reference[0])), "scrollParent" !== this._config.boundary && g(t).addClass(Ft), this._popper = new u(o, this._menu, this._getPopperConfig()) } "ontouchstart" in document.documentElement && 0 === g(t).closest(Mt).length && g(document.body).children().on("mouseover", null, g.noop), this._element.focus(), this._element.setAttribute("aria-expanded", !0), g(this._menu).toggleClass(Lt), g(t).toggleClass(Lt).trigger(g.Event(kt.SHOWN, n)) } } } }, t.show = function () { if (!(this._element.disabled || g(this._element).hasClass(Pt) || g(this._menu).hasClass(Lt))) { let t = { relatedTarget: this._element }, e = g.Event(kt.SHOW, t), n = c._getParentFromElement(this._element); g(n).trigger(e), e.isDefaultPrevented() || (g(this._menu).toggleClass(Lt), g(n).toggleClass(Lt).trigger(g.Event(kt.SHOWN, t))) } }, t.hide = function () { if (!this._element.disabled && !g(this._element).hasClass(Pt) && g(this._menu).hasClass(Lt)) { let t = { relatedTarget: this._element }, e = g.Event(kt.HIDE, t), n = c._getParentFromElement(this._element); g(n).trigger(e), e.isDefaultPrevented() || (g(this._menu).toggleClass(Lt), g(n).toggleClass(Lt).trigger(g.Event(kt.HIDDEN, t))) } }, t.dispose = function () { g.removeData(this._element, Dt), g(this._element).off(wt), this._element = null, (this._menu = null) !== this._popper && (this._popper.destroy(), this._popper = null) }, t.update = function () { this._inNavbar = this._detectNavbar(), null !== this._popper && this._popper.scheduleUpdate() }, t._addEventListeners = function () { let e = this; g(this._element).on(kt.CLICK, function (t) { t.preventDefault(), t.stopPropagation(), e.toggle() }) }, t._getConfig = function (t) { return t = l({}, this.constructor.Default, g(this._element).data(), t), _.typeCheckConfig(It, t, this.constructor.DefaultType), t }, t._getMenuElement = function () { if (!this._menu) { let t = c._getParentFromElement(this._element); t && (this._menu = t.querySelector(qt)) } return this._menu }, t._getPlacement = function () { let t = g(this._element.parentNode), e = Vt; return t.hasClass(jt) ? (e = Qt, g(this._menu).hasClass(xt) && (e = Bt)) : t.hasClass(Ht) ? e = zt : t.hasClass(Rt) ? e = Xt : g(this._menu).hasClass(xt) && (e = Yt), e }, t._detectNavbar = function () { return 0 < g(this._element).closest(".navbar").length }, t._getOffset = function () { let e = this, t = {}; return "function" == typeof this._config.offset ? t.fn = function (t) { return t.offsets = l({}, t.offsets, e._config.offset(t.offsets, e._element) || {}), t } : t.offset = this._config.offset, t }, t._getPopperConfig = function () { let t = { placement: this._getPlacement(), modifiers: { offset: this._getOffset(), flip: { enabled: this._config.flip }, preventOverflow: { boundariesElement: this._config.boundary } } }; return "static" === this._config.display && (t.modifiers.applyStyle = { enabled: !1 }), t }, c._jQueryInterface = function (e) { return this.each(function () { let t = g(this).data(Dt); if (t || (t = new c(this, "object" == typeof e ? e : null), g(this).data(Dt, t)), "string" == typeof e) { if ("undefined" == typeof t[e]) throw new TypeError('No method named "' + e + '"'); t[e]() } }) }, c._clearMenus = function (t) { if (!t || 3 !== t.which && ("keyup" !== t.type || 9 === t.which)) for (let e = [].slice.call(document.querySelectorAll(Ut)), n = 0, i = e.length; n < i; n++) { let o = c._getParentFromElement(e[n]), r = g(e[n]).data(Dt), s = { relatedTarget: e[n] }; if (t && "click" === t.type && (s.clickEvent = t), r) { let a = r._menu; if (g(o).hasClass(Lt) && !(t && ("click" === t.type && /input|textarea/i.test(t.target.tagName) || "keyup" === t.type && 9 === t.which) && g.contains(o, t.target))) { let l = g.Event(kt.HIDE, s); g(o).trigger(l), l.isDefaultPrevented() || ("ontouchstart" in document.documentElement && g(document.body).children().off("mouseover", null, g.noop), e[n].setAttribute("aria-expanded", "false"), g(a).removeClass(Lt), g(o).removeClass(Lt).trigger(g.Event(kt.HIDDEN, s))) } } } }, c._getParentFromElement = function (t) { let e, n = _.getSelectorFromElement(t); return n && (e = document.querySelector(n)), e || t.parentNode }, c._dataApiKeydownHandler = function (t) { if ((/input|textarea/i.test(t.target.tagName) ? !(32 === t.which || 27 !== t.which && (40 !== t.which && 38 !== t.which || g(t.target).closest(qt).length)) : Ot.test(t.which)) && (t.preventDefault(), t.stopPropagation(), !this.disabled && !g(this).hasClass(Pt))) { let e = c._getParentFromElement(this), n = g(e).hasClass(Lt); if (n && (!n || 27 !== t.which && 32 !== t.which)) { let i = [].slice.call(e.querySelectorAll(Kt)); if (0 !== i.length) { let o = i.indexOf(t.target); 38 === t.which && 0 < o && o--, 40 === t.which && o < i.length - 1 && o++, o < 0 && (o = 0), i[o].focus() } } else { if (27 === t.which) { let r = e.querySelector(Ut); g(r).trigger("focus") } g(this).trigger("click") } } }, s(c, null, [{ key: "VERSION", get: function () { return "4.3.1" } }, { key: "Default", get: function () { return $t } }, { key: "DefaultType", get: function () { return Gt } }]), c }(); g(document).on(kt.KEYDOWN_DATA_API, Ut, Jt._dataApiKeydownHandler).on(kt.KEYDOWN_DATA_API, qt, Jt._dataApiKeydownHandler).on(kt.CLICK_DATA_API + " " + kt.KEYUP_DATA_API, Jt._clearMenus).on(kt.CLICK_DATA_API, Ut, function (t) { t.preventDefault(), t.stopPropagation(), Jt._jQueryInterface.call(g(this), "toggle") }).on(kt.CLICK_DATA_API, Wt, function (t) { t.stopPropagation() }), g.fn[It] = Jt._jQueryInterface, g.fn[It].Constructor = Jt, g.fn[It].noConflict = function () { return g.fn[It] = Nt, Jt._jQueryInterface }; let Zt = "modal", te = "bs.modal", ee = "." + te, ne = g.fn[Zt], ie = { backdrop: !0, keyboard: !0, focus: !0, show: !0 }, oe = { backdrop: "(boolean|string)", keyboard: "boolean", focus: "boolean", show: "boolean" }, re = { HIDE: "hide" + ee, HIDDEN: "hidden" + ee, SHOW: "show" + ee, SHOWN: "shown" + ee, FOCUSIN: "focusin" + ee, RESIZE: "resize" + ee, CLICK_DISMISS: "click.dismiss" + ee, KEYDOWN_DISMISS: "keydown.dismiss" + ee, MOUSEUP_DISMISS: "mouseup.dismiss" + ee, MOUSEDOWN_DISMISS: "mousedown.dismiss" + ee, CLICK_DATA_API: "click" + ee + ".data-api" }, se = "modal-dialog-scrollable", ae = "modal-scrollbar-measure", le = "modal-backdrop", ce = "modal-open", he = "fade", ue = "show", fe = ".modal-dialog", de = ".modal-body", ge = '[data-toggle="modal"]', _e = '[data-dismiss="modal"]', me = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top", pe = ".sticky-top", ve = function () { function o(t, e) { this._config = this._getConfig(e), this._element = t, this._dialog = t.querySelector(fe), this._backdrop = null, this._isShown = !1, this._isBodyOverflowing = !1, this._ignoreBackdropClick = !1, this._isTransitioning = !1, this._scrollbarWidth = 0 } let t = o.prototype; return t.toggle = function (t) { return this._isShown ? this.hide() : this.show(t) }, t.show = function (t) { let e = this; if (!this._isShown && !this._isTransitioning) { g(this._element).hasClass(he) && (this._isTransitioning = !0); let n = g.Event(re.SHOW, { relatedTarget: t }); g(this._element).trigger(n), this._isShown || n.isDefaultPrevented() || (this._isShown = !0, this._checkScrollbar(), this._setScrollbar(), this._adjustDialog(), this._setEscapeEvent(), this._setResizeEvent(), g(this._element).on(re.CLICK_DISMISS, _e, function (t) { return e.hide(t) }), g(this._dialog).on(re.MOUSEDOWN_DISMISS, function () { g(e._element).one(re.MOUSEUP_DISMISS, function (t) { g(t.target).is(e._element) && (e._ignoreBackdropClick = !0) }) }), this._showBackdrop(function () { return e._showElement(t) })) } }, t.hide = function (t) { let e = this; if (t && t.preventDefault(), this._isShown && !this._isTransitioning) { let n = g.Event(re.HIDE); if (g(this._element).trigger(n), this._isShown && !n.isDefaultPrevented()) { this._isShown = !1; let i = g(this._element).hasClass(he); if (i && (this._isTransitioning = !0), this._setEscapeEvent(), this._setResizeEvent(), g(document).off(re.FOCUSIN), g(this._element).removeClass(ue), g(this._element).off(re.CLICK_DISMISS), g(this._dialog).off(re.MOUSEDOWN_DISMISS), i) { let o = _.getTransitionDurationFromElement(this._element); g(this._element).one(_.TRANSITION_END, function (t) { return e._hideModal(t) }).emulateTransitionEnd(o) } else this._hideModal() } } }, t.dispose = function () { [window, this._element, this._dialog].forEach(function (t) { return g(t).off(ee) }), g(document).off(re.FOCUSIN), g.removeData(this._element, te), this._config = null, this._element = null, this._dialog = null, this._backdrop = null, this._isShown = null, this._isBodyOverflowing = null, this._ignoreBackdropClick = null, this._isTransitioning = null, this._scrollbarWidth = null }, t.handleUpdate = function () { this._adjustDialog() }, t._getConfig = function (t) { return t = l({}, ie, t), _.typeCheckConfig(Zt, t, oe), t }, t._showElement = function (t) { let e = this, n = g(this._element).hasClass(he); this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.appendChild(this._element), this._element.style.display = "block", this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", !0), g(this._dialog).hasClass(se) ? this._dialog.querySelector(de).scrollTop = 0 : this._element.scrollTop = 0, n && _.reflow(this._element), g(this._element).addClass(ue), this._config.focus && this._enforceFocus(); let i = g.Event(re.SHOWN, { relatedTarget: t }), o = function () { e._config.focus && e._element.focus(), e._isTransitioning = !1, g(e._element).trigger(i) }; if (n) { let r = _.getTransitionDurationFromElement(this._dialog); g(this._dialog).one(_.TRANSITION_END, o).emulateTransitionEnd(r) } else o() }, t._enforceFocus = function () { let e = this; g(document).off(re.FOCUSIN).on(re.FOCUSIN, function (t) { document !== t.target && e._element !== t.target && 0 === g(e._element).has(t.target).length && e._element.focus() }) }, t._setEscapeEvent = function () { let e = this; this._isShown && this._config.keyboard ? g(this._element).on(re.KEYDOWN_DISMISS, function (t) { 27 === t.which && (t.preventDefault(), e.hide()) }) : this._isShown || g(this._element).off(re.KEYDOWN_DISMISS) }, t._setResizeEvent = function () { let e = this; this._isShown ? g(window).on(re.RESIZE, function (t) { return e.handleUpdate(t) }) : g(window).off(re.RESIZE) }, t._hideModal = function () { let t = this; this._element.style.display = "none", this._element.setAttribute("aria-hidden", !0), this._element.removeAttribute("aria-modal"), this._isTransitioning = !1, this._showBackdrop(function () { g(document.body).removeClass(ce), t._resetAdjustments(), t._resetScrollbar(), g(t._element).trigger(re.HIDDEN) }) }, t._removeBackdrop = function () { this._backdrop && (g(this._backdrop).remove(), this._backdrop = null) }, t._showBackdrop = function (t) { let e = this, n = g(this._element).hasClass(he) ? he : ""; if (this._isShown && this._config.backdrop) { if (this._backdrop = document.createElement("div"), this._backdrop.className = le, n && this._backdrop.classList.add(n), g(this._backdrop).appendTo(document.body), g(this._element).on(re.CLICK_DISMISS, function (t) { e._ignoreBackdropClick ? e._ignoreBackdropClick = !1 : t.target === t.currentTarget && ("static" === e._config.backdrop ? e._element.focus() : e.hide()) }), n && _.reflow(this._backdrop), g(this._backdrop).addClass(ue), !t) return; if (!n) return void t(); let i = _.getTransitionDurationFromElement(this._backdrop); g(this._backdrop).one(_.TRANSITION_END, t).emulateTransitionEnd(i) } else if (!this._isShown && this._backdrop) { g(this._backdrop).removeClass(ue); let o = function () { e._removeBackdrop(), t && t() }; if (g(this._element).hasClass(he)) { let r = _.getTransitionDurationFromElement(this._backdrop); g(this._backdrop).one(_.TRANSITION_END, o).emulateTransitionEnd(r) } else o() } else t && t() }, t._adjustDialog = function () { let t = this._element.scrollHeight > document.documentElement.clientHeight; !this._isBodyOverflowing && t && (this._element.style.paddingLeft = this._scrollbarWidth + "px"), this._isBodyOverflowing && !t && (this._element.style.paddingRight = this._scrollbarWidth + "px") }, t._resetAdjustments = function () { this._element.style.paddingLeft = "", this._element.style.paddingRight = "" }, t._checkScrollbar = function () { let t = document.body.getBoundingClientRect(); this._isBodyOverflowing = t.left + t.right < window.innerWidth, this._scrollbarWidth = this._getScrollbarWidth() }, t._setScrollbar = function () { let o = this; if (this._isBodyOverflowing) { let t = [].slice.call(document.querySelectorAll(me)), e = [].slice.call(document.querySelectorAll(pe)); g(t).each(function (t, e) { let n = e.style.paddingRight, i = g(e).css("padding-right"); g(e).data("padding-right", n).css("padding-right", parseFloat(i) + o._scrollbarWidth + "px") }), g(e).each(function (t, e) { let n = e.style.marginRight, i = g(e).css("margin-right"); g(e).data("margin-right", n).css("margin-right", parseFloat(i) - o._scrollbarWidth + "px") }); let n = document.body.style.paddingRight, i = g(document.body).css("padding-right"); g(document.body).data("padding-right", n).css("padding-right", parseFloat(i) + this._scrollbarWidth + "px") } g(document.body).addClass(ce) }, t._resetScrollbar = function () { let t = [].slice.call(document.querySelectorAll(me)); g(t).each(function (t, e) { let n = g(e).data("padding-right"); g(e).removeData("padding-right"), e.style.paddingRight = n || "" }); let e = [].slice.call(document.querySelectorAll("" + pe)); g(e).each(function (t, e) { let n = g(e).data("margin-right"); "undefined" != typeof n && g(e).css("margin-right", n).removeData("margin-right") }); let n = g(document.body).data("padding-right"); g(document.body).removeData("padding-right"), document.body.style.paddingRight = n || "" }, t._getScrollbarWidth = function () { let t = document.createElement("div"); t.className = ae, document.body.appendChild(t); let e = t.getBoundingClientRect().width - t.clientWidth; return document.body.removeChild(t), e }, o._jQueryInterface = function (n, i) { return this.each(function () { let t = g(this).data(te), e = l({}, ie, g(this).data(), "object" == typeof n && n ? n : {}); if (t || (t = new o(this, e), g(this).data(te, t)), "string" == typeof n) { if ("undefined" == typeof t[n]) throw new TypeError('No method named "' + n + '"'); t[n](i) } else e.show && t.show(i) }) }, s(o, null, [{ key: "VERSION", get: function () { return "4.3.1" } }, { key: "Default", get: function () { return ie } }]), o }(); g(document).on(re.CLICK_DATA_API, ge, function (t) { let e, n = this, i = _.getSelectorFromElement(this); i && (e = document.querySelector(i)); let o = g(e).data(te) ? "toggle" : l({}, g(e).data(), g(this).data()); "A" !== this.tagName && "AREA" !== this.tagName || t.preventDefault(); let r = g(e).one(re.SHOW, function (t) { t.isDefaultPrevented() || r.one(re.HIDDEN, function () { g(n).is(":visible") && n.focus() }) }); ve._jQueryInterface.call(g(e), o, this) }), g.fn[Zt] = ve._jQueryInterface, g.fn[Zt].Constructor = ve, g.fn[Zt].noConflict = function () { return g.fn[Zt] = ne, ve._jQueryInterface }; let ye = ["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"], Ee = { "*": ["class", "dir", "id", "lang", "role", /^aria-[\w-]*$/i], a: ["target", "href", "title", "rel"], area: [], b: [], br: [], col: [], code: [], div: [], em: [], hr: [], h1: [], h2: [], h3: [], h4: [], h5: [], h6: [], i: [], img: ["src", "alt", "title", "width", "height"], li: [], ol: [], p: [], pre: [], s: [], small: [], span: [], sub: [], sup: [], strong: [], u: [], ul: [] }, Ce = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi, Te = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i; function Se(t, s, e) { if (0 === t.length) return t; if (e && "function" == typeof e) return e(t); for (let n = (new window.DOMParser).parseFromString(t, "text/html"), a = Object.keys(s), l = [].slice.call(n.body.querySelectorAll("*")), i = function (t, e) { let n = l[t], i = n.nodeName.toLowerCase(); if (-1 === a.indexOf(n.nodeName.toLowerCase())) return n.parentNode.removeChild(n), "continue"; let o = [].slice.call(n.attributes), r = [].concat(s["*"] || [], s[i] || []); o.forEach(function (t) { (function (t, e) { let n = t.nodeName.toLowerCase(); if (-1 !== e.indexOf(n)) return -1 === ye.indexOf(n) || Boolean(t.nodeValue.match(Ce) || t.nodeValue.match(Te)); for (let i = e.filter(function (t) { return t instanceof RegExp }), o = 0, r = i.length; o < r; o++)if (n.match(i[o])) return !0; return !1 })(t, r) || n.removeAttribute(t.nodeName) }) }, o = 0, r = l.length; o < r; o++)i(o); return n.body.innerHTML } let be = "tooltip", Ie = "bs.tooltip", De = "." + Ie, we = g.fn[be], Ae = "bs-tooltip", Ne = new RegExp("(^|\\s)" + Ae + "\\S+", "g"), Oe = ["sanitize", "whiteList", "sanitizeFn"], ke = { animation: "boolean", template: "string", title: "(string|element|function)", trigger: "string", delay: "(number|object)", html: "boolean", selector: "(string|boolean)", placement: "(string|function)", offset: "(number|string|function)", container: "(string|element|boolean)", fallbackPlacement: "(string|array)", boundary: "(string|element)", sanitize: "boolean", sanitizeFn: "(null|function)", whiteList: "object" }, Pe = { AUTO: "auto", TOP: "top", RIGHT: "right", BOTTOM: "bottom", LEFT: "left" }, Le = { animation: !0, template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>', trigger: "hover focus", title: "", delay: 0, html: !1, selector: !1, placement: "top", offset: 0, container: !1, fallbackPlacement: "flip", boundary: "scrollParent", sanitize: !0, sanitizeFn: null, whiteList: Ee }, je = "show", He = "out", Re = { HIDE: "hide" + De, HIDDEN: "hidden" + De, SHOW: "show" + De, SHOWN: "shown" + De, INSERTED: "inserted" + De, CLICK: "click" + De, FOCUSIN: "focusin" + De, FOCUSOUT: "focusout" + De, MOUSEENTER: "mouseenter" + De, MOUSELEAVE: "mouseleave" + De }, xe = "fade", Fe = "show", Ue = ".tooltip-inner", We = ".arrow", qe = "hover", Me = "focus", Ke = "click", Qe = "manual", Be = function () { function i(t, e) { if ("undefined" == typeof u) throw new TypeError("Bootstrap's tooltips require Popper.js (https://popper.js.org/)"); this._isEnabled = !0, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, this._popper = null, this.element = t, this.config = this._getConfig(e), this.tip = null, this._setListeners() } let t = i.prototype; return t.enable = function () { this._isEnabled = !0 }, t.disable = function () { this._isEnabled = !1 }, t.toggleEnabled = function () { this._isEnabled = !this._isEnabled }, t.toggle = function (t) { if (this._isEnabled) if (t) { let e = this.constructor.DATA_KEY, n = g(t.currentTarget).data(e); n || (n = new this.constructor(t.currentTarget, this._getDelegateConfig()), g(t.currentTarget).data(e, n)), n._activeTrigger.click = !n._activeTrigger.click, n._isWithActiveTrigger() ? n._enter(null, n) : n._leave(null, n) } else { if (g(this.getTipElement()).hasClass(Fe)) return void this._leave(null, this); this._enter(null, this) } }, t.dispose = function () { clearTimeout(this._timeout), g.removeData(this.element, this.constructor.DATA_KEY), g(this.element).off(this.constructor.EVENT_KEY), g(this.element).closest(".modal").off("hide.bs.modal"), this.tip && g(this.tip).remove(), this._isEnabled = null, this._timeout = null, this._hoverState = null, (this._activeTrigger = null) !== this._popper && this._popper.destroy(), this._popper = null, this.element = null, this.config = null, this.tip = null }, t.show = function () { let e = this; if ("none" === g(this.element).css("display")) throw new Error("Please use show on visible elements"); let t = g.Event(this.constructor.Event.SHOW); if (this.isWithContent() && this._isEnabled) { g(this.element).trigger(t); let n = _.findShadowRoot(this.element), i = g.contains(null !== n ? n : this.element.ownerDocument.documentElement, this.element); if (t.isDefaultPrevented() || !i) return; let o = this.getTipElement(), r = _.getUID(this.constructor.NAME); o.setAttribute("id", r), this.element.setAttribute("aria-describedby", r), this.setContent(), this.config.animation && g(o).addClass(xe); let s = "function" == typeof this.config.placement ? this.config.placement.call(this, o, this.element) : this.config.placement, a = this._getAttachment(s); this.addAttachmentClass(a); let l = this._getContainer(); g(o).data(this.constructor.DATA_KEY, this), g.contains(this.element.ownerDocument.documentElement, this.tip) || g(o).appendTo(l), g(this.element).trigger(this.constructor.Event.INSERTED), this._popper = new u(this.element, o, { placement: a, modifiers: { offset: this._getOffset(), flip: { behavior: this.config.fallbackPlacement }, arrow: { element: We }, preventOverflow: { boundariesElement: this.config.boundary } }, onCreate: function (t) { t.originalPlacement !== t.placement && e._handlePopperPlacementChange(t) }, onUpdate: function (t) { return e._handlePopperPlacementChange(t) } }), g(o).addClass(Fe), "ontouchstart" in document.documentElement && g(document.body).children().on("mouseover", null, g.noop); let c = function () { e.config.animation && e._fixTransition(); let t = e._hoverState; e._hoverState = null, g(e.element).trigger(e.constructor.Event.SHOWN), t === He && e._leave(null, e) }; if (g(this.tip).hasClass(xe)) { let h = _.getTransitionDurationFromElement(this.tip); g(this.tip).one(_.TRANSITION_END, c).emulateTransitionEnd(h) } else c() } }, t.hide = function (t) { let e = this, n = this.getTipElement(), i = g.Event(this.constructor.Event.HIDE), o = function () { e._hoverState !== je && n.parentNode && n.parentNode.removeChild(n), e._cleanTipClass(), e.element.removeAttribute("aria-describedby"), g(e.element).trigger(e.constructor.Event.HIDDEN), null !== e._popper && e._popper.destroy(), t && t() }; if (g(this.element).trigger(i), !i.isDefaultPrevented()) { if (g(n).removeClass(Fe), "ontouchstart" in document.documentElement && g(document.body).children().off("mouseover", null, g.noop), this._activeTrigger[Ke] = !1, this._activeTrigger[Me] = !1, this._activeTrigger[qe] = !1, g(this.tip).hasClass(xe)) { let r = _.getTransitionDurationFromElement(n); g(n).one(_.TRANSITION_END, o).emulateTransitionEnd(r) } else o(); this._hoverState = "" } }, t.update = function () { null !== this._popper && this._popper.scheduleUpdate() }, t.isWithContent = function () { return Boolean(this.getTitle()) }, t.addAttachmentClass = function (t) { g(this.getTipElement()).addClass(Ae + "-" + t) }, t.getTipElement = function () { return this.tip = this.tip || g(this.config.template)[0], this.tip }, t.setContent = function () { let t = this.getTipElement(); this.setElementContent(g(t.querySelectorAll(Ue)), this.getTitle()), g(t).removeClass(xe + " " + Fe) }, t.setElementContent = function (t, e) { "object" != typeof e || !e.nodeType && !e.jquery ? this.config.html ? (this.config.sanitize && (e = Se(e, this.config.whiteList, this.config.sanitizeFn)), t.html(e)) : t.text(e) : this.config.html ? g(e).parent().is(t) || t.empty().append(e) : t.text(g(e).text()) }, t.getTitle = function () { let t = this.element.getAttribute("data-original-title"); return t || (t = "function" == typeof this.config.title ? this.config.title.call(this.element) : this.config.title), t }, t._getOffset = function () { let e = this, t = {}; return "function" == typeof this.config.offset ? t.fn = function (t) { return t.offsets = l({}, t.offsets, e.config.offset(t.offsets, e.element) || {}), t } : t.offset = this.config.offset, t }, t._getContainer = function () { return !1 === this.config.container ? document.body : _.isElement(this.config.container) ? g(this.config.container) : g(document).find(this.config.container) }, t._getAttachment = function (t) { return Pe[t.toUpperCase()] }, t._setListeners = function () { let i = this; this.config.trigger.split(" ").forEach(function (t) { if ("click" === t) g(i.element).on(i.constructor.Event.CLICK, i.config.selector, function (t) { return i.toggle(t) }); else if (t !== Qe) { let e = t === qe ? i.constructor.Event.MOUSEENTER : i.constructor.Event.FOCUSIN, n = t === qe ? i.constructor.Event.MOUSELEAVE : i.constructor.Event.FOCUSOUT; g(i.element).on(e, i.config.selector, function (t) { return i._enter(t) }).on(n, i.config.selector, function (t) { return i._leave(t) }) } }), g(this.element).closest(".modal").on("hide.bs.modal", function () { i.element && i.hide() }), this.config.selector ? this.config = l({}, this.config, { trigger: "manual", selector: "" }) : this._fixTitle() }, t._fixTitle = function () { let t = typeof this.element.getAttribute("data-original-title"); (this.element.getAttribute("title") || "string" !== t) && (this.element.setAttribute("data-original-title", this.element.getAttribute("title") || ""), this.element.setAttribute("title", "")) }, t._enter = function (t, e) { let n = this.constructor.DATA_KEY; (e = e || g(t.currentTarget).data(n)) || (e = new this.constructor(t.currentTarget, this._getDelegateConfig()), g(t.currentTarget).data(n, e)), t && (e._activeTrigger["focusin" === t.type ? Me : qe] = !0), g(e.getTipElement()).hasClass(Fe) || e._hoverState === je ? e._hoverState = je : (clearTimeout(e._timeout), e._hoverState = je, e.config.delay && e.config.delay.show ? e._timeout = setTimeout(function () { e._hoverState === je && e.show() }, e.config.delay.show) : e.show()) }, t._leave = function (t, e) { let n = this.constructor.DATA_KEY; (e = e || g(t.currentTarget).data(n)) || (e = new this.constructor(t.currentTarget, this._getDelegateConfig()), g(t.currentTarget).data(n, e)), t && (e._activeTrigger["focusout" === t.type ? Me : qe] = !1), e._isWithActiveTrigger() || (clearTimeout(e._timeout), e._hoverState = He, e.config.delay && e.config.delay.hide ? e._timeout = setTimeout(function () { e._hoverState === He && e.hide() }, e.config.delay.hide) : e.hide()) }, t._isWithActiveTrigger = function () { for (let t in this._activeTrigger) if (this._activeTrigger[t]) return !0; return !1 }, t._getConfig = function (t) { let e = g(this.element).data(); return Object.keys(e).forEach(function (t) { -1 !== Oe.indexOf(t) && delete e[t] }), "number" == typeof (t = l({}, this.constructor.Default, e, "object" == typeof t && t ? t : {})).delay && (t.delay = { show: t.delay, hide: t.delay }), "number" == typeof t.title && (t.title = t.title.toString()), "number" == typeof t.content && (t.content = t.content.toString()), _.typeCheckConfig(be, t, this.constructor.DefaultType), t.sanitize && (t.template = Se(t.template, t.whiteList, t.sanitizeFn)), t }, t._getDelegateConfig = function () { let t = {}; if (this.config) for (let e in this.config) this.constructor.Default[e] !== this.config[e] && (t[e] = this.config[e]); return t }, t._cleanTipClass = function () { let t = g(this.getTipElement()), e = t.attr("class").match(Ne); null !== e && e.length && t.removeClass(e.join("")) }, t._handlePopperPlacementChange = function (t) { let e = t.instance; this.tip = e.popper, this._cleanTipClass(), this.addAttachmentClass(this._getAttachment(t.placement)) }, t._fixTransition = function () { let t = this.getTipElement(), e = this.config.animation; null === t.getAttribute("x-placement") && (g(t).removeClass(xe), this.config.animation = !1, this.hide(), this.show(), this.config.animation = e) }, i._jQueryInterface = function (n) { return this.each(function () { let t = g(this).data(Ie), e = "object" == typeof n && n; if ((t || !/dispose|hide/.test(n)) && (t || (t = new i(this, e), g(this).data(Ie, t)), "string" == typeof n)) { if ("undefined" == typeof t[n]) throw new TypeError('No method named "' + n + '"'); t[n]() } }) }, s(i, null, [{ key: "VERSION", get: function () { return "4.3.1" } }, { key: "Default", get: function () { return Le } }, { key: "NAME", get: function () { return be } }, { key: "DATA_KEY", get: function () { return Ie } }, { key: "Event", get: function () { return Re } }, { key: "EVENT_KEY", get: function () { return De } }, { key: "DefaultType", get: function () { return ke } }]), i }(); g.fn[be] = Be._jQueryInterface, g.fn[be].Constructor = Be, g.fn[be].noConflict = function () { return g.fn[be] = we, Be._jQueryInterface }; let Ve = "popover", Ye = "bs.popover", ze = "." + Ye, Xe = g.fn[Ve], $e = "bs-popover", Ge = new RegExp("(^|\\s)" + $e + "\\S+", "g"), Je = l({}, Be.Default, { placement: "right", trigger: "click", content: "", template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>' }), Ze = l({}, Be.DefaultType, { content: "(string|element|function)" }), tn = "fade", en = "show", nn = ".popover-header", on = ".popover-body", rn = { HIDE: "hide" + ze, HIDDEN: "hidden" + ze, SHOW: "show" + ze, SHOWN: "shown" + ze, INSERTED: "inserted" + ze, CLICK: "click" + ze, FOCUSIN: "focusin" + ze, FOCUSOUT: "focusout" + ze, MOUSEENTER: "mouseenter" + ze, MOUSELEAVE: "mouseleave" + ze }, sn = function (t) { let e, n; function i() { return t.apply(this, arguments) || this } n = t, (e = i).prototype = Object.create(n.prototype), (e.prototype.constructor = e).__proto__ = n; let o = i.prototype; return o.isWithContent = function () { return this.getTitle() || this._getContent() }, o.addAttachmentClass = function (t) { g(this.getTipElement()).addClass($e + "-" + t) }, o.getTipElement = function () { return this.tip = this.tip || g(this.config.template)[0], this.tip }, o.setContent = function () { let t = g(this.getTipElement()); this.setElementContent(t.find(nn), this.getTitle()); let e = this._getContent(); "function" == typeof e && (e = e.call(this.element)), this.setElementContent(t.find(on), e), t.removeClass(tn + " " + en) }, o._getContent = function () { return this.element.getAttribute("data-content") || this.config.content }, o._cleanTipClass = function () { let t = g(this.getTipElement()), e = t.attr("class").match(Ge); null !== e && 0 < e.length && t.removeClass(e.join("")) }, i._jQueryInterface = function (n) { return this.each(function () { let t = g(this).data(Ye), e = "object" == typeof n ? n : null; if ((t || !/dispose|hide/.test(n)) && (t || (t = new i(this, e), g(this).data(Ye, t)), "string" == typeof n)) { if ("undefined" == typeof t[n]) throw new TypeError('No method named "' + n + '"'); t[n]() } }) }, s(i, null, [{ key: "VERSION", get: function () { return "4.3.1" } }, { key: "Default", get: function () { return Je } }, { key: "NAME", get: function () { return Ve } }, { key: "DATA_KEY", get: function () { return Ye } }, { key: "Event", get: function () { return rn } }, { key: "EVENT_KEY", get: function () { return ze } }, { key: "DefaultType", get: function () { return Ze } }]), i }(Be); g.fn[Ve] = sn._jQueryInterface, g.fn[Ve].Constructor = sn, g.fn[Ve].noConflict = function () { return g.fn[Ve] = Xe, sn._jQueryInterface }; let an = "scrollspy", ln = "bs.scrollspy", cn = "." + ln, hn = g.fn[an], un = { offset: 10, method: "auto", target: "" }, fn = { offset: "number", method: "string", target: "(string|element)" }, dn = { ACTIVATE: "activate" + cn, SCROLL: "scroll" + cn, LOAD_DATA_API: "load" + cn + ".data-api" }, gn = "dropdown-item", _n = "active", mn = '[data-spy="scroll"]', pn = ".nav, .list-group", vn = ".nav-link", yn = ".nav-item", En = ".list-group-item", Cn = ".dropdown", Tn = ".dropdown-item", Sn = ".dropdown-toggle", bn = "offset", In = "position", Dn = function () { function n(t, e) { let n = this; this._element = t, this._scrollElement = "BODY" === t.tagName ? window : t, this._config = this._getConfig(e), this._selector = this._config.target + " " + vn + "," + this._config.target + " " + En + "," + this._config.target + " " + Tn, this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, g(this._scrollElement).on(dn.SCROLL, function (t) { return n._process(t) }), this.refresh(), this._process() } let t = n.prototype; return t.refresh = function () { let e = this, t = this._scrollElement === this._scrollElement.window ? bn : In, o = "auto" === this._config.method ? t : this._config.method, r = o === In ? this._getScrollTop() : 0; this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight(), [].slice.call(document.querySelectorAll(this._selector)).map(function (t) { let e, n = _.getSelectorFromElement(t); if (n && (e = document.querySelector(n)), e) { let i = e.getBoundingClientRect(); if (i.width || i.height) return [g(e)[o]().top + r, n] } return null }).filter(function (t) { return t }).sort(function (t, e) { return t[0] - e[0] }).forEach(function (t) { e._offsets.push(t[0]), e._targets.push(t[1]) }) }, t.dispose = function () { g.removeData(this._element, ln), g(this._scrollElement).off(cn), this._element = null, this._scrollElement = null, this._config = null, this._selector = null, this._offsets = null, this._targets = null, this._activeTarget = null, this._scrollHeight = null }, t._getConfig = function (t) { if ("string" != typeof (t = l({}, un, "object" == typeof t && t ? t : {})).target) { let e = g(t.target).attr("id"); e || (e = _.getUID(an), g(t.target).attr("id", e)), t.target = "#" + e } return _.typeCheckConfig(an, t, fn), t }, t._getScrollTop = function () { return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop }, t._getScrollHeight = function () { return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) }, t._getOffsetHeight = function () { return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height }, t._process = function () { let t = this._getScrollTop() + this._config.offset, e = this._getScrollHeight(), n = this._config.offset + e - this._getOffsetHeight(); if (this._scrollHeight !== e && this.refresh(), n <= t) { let i = this._targets[this._targets.length - 1]; this._activeTarget !== i && this._activate(i) } else { if (this._activeTarget && t < this._offsets[0] && 0 < this._offsets[0]) return this._activeTarget = null, void this._clear(); for (let o = this._offsets.length; o--;) { this._activeTarget !== this._targets[o] && t >= this._offsets[o] && ("undefined" == typeof this._offsets[o + 1] || t < this._offsets[o + 1]) && this._activate(this._targets[o]) } } }, t._activate = function (e) { this._activeTarget = e, this._clear(); let t = this._selector.split(",").map(function (t) { return t + '[data-target="' + e + '"],' + t + '[href="' + e + '"]' }), n = g([].slice.call(document.querySelectorAll(t.join(",")))); n.hasClass(gn) ? (n.closest(Cn).find(Sn).addClass(_n), n.addClass(_n)) : (n.addClass(_n), n.parents(pn).prev(vn + ", " + En).addClass(_n), n.parents(pn).prev(yn).children(vn).addClass(_n)), g(this._scrollElement).trigger(dn.ACTIVATE, { relatedTarget: e }) }, t._clear = function () { [].slice.call(document.querySelectorAll(this._selector)).filter(function (t) { return t.classList.contains(_n) }).forEach(function (t) { return t.classList.remove(_n) }) }, n._jQueryInterface = function (e) { return this.each(function () { let t = g(this).data(ln); if (t || (t = new n(this, "object" == typeof e && e), g(this).data(ln, t)), "string" == typeof e) { if ("undefined" == typeof t[e]) throw new TypeError('No method named "' + e + '"'); t[e]() } }) }, s(n, null, [{ key: "VERSION", get: function () { return "4.3.1" } }, { key: "Default", get: function () { return un } }]), n }(); g(window).on(dn.LOAD_DATA_API, function () { for (let t = [].slice.call(document.querySelectorAll(mn)), e = t.length; e--;) { let n = g(t[e]); Dn._jQueryInterface.call(n, n.data()) } }), g.fn[an] = Dn._jQueryInterface, g.fn[an].Constructor = Dn, g.fn[an].noConflict = function () { return g.fn[an] = hn, Dn._jQueryInterface }; let wn = "bs.tab", An = "." + wn, Nn = g.fn.tab, On = { HIDE: "hide" + An, HIDDEN: "hidden" + An, SHOW: "show" + An, SHOWN: "shown" + An, CLICK_DATA_API: "click" + An + ".data-api" }, kn = "dropdown-menu", Pn = "active", Ln = "disabled", jn = "fade", Hn = "show", Rn = ".dropdown", xn = ".nav, .list-group", Fn = ".active", Un = "> li > .active", Wn = '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]', qn = ".dropdown-toggle", Mn = "> .dropdown-menu .active", Kn = function () { function i(t) { this._element = t } let t = i.prototype; return t.show = function () { let n = this; if (!(this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && g(this._element).hasClass(Pn) || g(this._element).hasClass(Ln))) { let t, i, e = g(this._element).closest(xn)[0], o = _.getSelectorFromElement(this._element); if (e) { let r = "UL" === e.nodeName || "OL" === e.nodeName ? Un : Fn; i = (i = g.makeArray(g(e).find(r)))[i.length - 1] } let s = g.Event(On.HIDE, { relatedTarget: this._element }), a = g.Event(On.SHOW, { relatedTarget: i }); if (i && g(i).trigger(s), g(this._element).trigger(a), !a.isDefaultPrevented() && !s.isDefaultPrevented()) { o && (t = document.querySelector(o)), this._activate(this._element, e); let l = function () { let t = g.Event(On.HIDDEN, { relatedTarget: n._element }), e = g.Event(On.SHOWN, { relatedTarget: i }); g(i).trigger(t), g(n._element).trigger(e) }; t ? this._activate(t, t.parentNode, l) : l() } } }, t.dispose = function () { g.removeData(this._element, wn), this._element = null }, t._activate = function (t, e, n) { let i = this, o = (!e || "UL" !== e.nodeName && "OL" !== e.nodeName ? g(e).children(Fn) : g(e).find(Un))[0], r = n && o && g(o).hasClass(jn), s = function () { return i._transitionComplete(t, o, n) }; if (o && r) { let a = _.getTransitionDurationFromElement(o); g(o).removeClass(Hn).one(_.TRANSITION_END, s).emulateTransitionEnd(a) } else s() }, t._transitionComplete = function (t, e, n) { if (e) { g(e).removeClass(Pn); let i = g(e.parentNode).find(Mn)[0]; i && g(i).removeClass(Pn), "tab" === e.getAttribute("role") && e.setAttribute("aria-selected", !1) } if (g(t).addClass(Pn), "tab" === t.getAttribute("role") && t.setAttribute("aria-selected", !0), _.reflow(t), t.classList.contains(jn) && t.classList.add(Hn), t.parentNode && g(t.parentNode).hasClass(kn)) { let o = g(t).closest(Rn)[0]; if (o) { let r = [].slice.call(o.querySelectorAll(qn)); g(r).addClass(Pn) } t.setAttribute("aria-expanded", !0) } n && n() }, i._jQueryInterface = function (n) { return this.each(function () { let t = g(this), e = t.data(wn); if (e || (e = new i(this), t.data(wn, e)), "string" == typeof n) { if ("undefined" == typeof e[n]) throw new TypeError('No method named "' + n + '"'); e[n]() } }) }, s(i, null, [{ key: "VERSION", get: function () { return "4.3.1" } }]), i }(); g(document).on(On.CLICK_DATA_API, Wn, function (t) { t.preventDefault(), Kn._jQueryInterface.call(g(this), "show") }), g.fn.tab = Kn._jQueryInterface, g.fn.tab.Constructor = Kn, g.fn.tab.noConflict = function () { return g.fn.tab = Nn, Kn._jQueryInterface }; let Qn = "toast", Bn = "bs.toast", Vn = "." + Bn, Yn = g.fn[Qn], zn = { CLICK_DISMISS: "click.dismiss" + Vn, HIDE: "hide" + Vn, HIDDEN: "hidden" + Vn, SHOW: "show" + Vn, SHOWN: "shown" + Vn }, Xn = "fade", $n = "hide", Gn = "show", Jn = "showing", Zn = { animation: "boolean", autohide: "boolean", delay: "number" }, ti = { animation: !0, autohide: !0, delay: 500 }, ei = '[data-dismiss="toast"]', ni = function () { function i(t, e) { this._element = t, this._config = this._getConfig(e), this._timeout = null, this._setListeners() } let t = i.prototype; return t.show = function () { let t = this; g(this._element).trigger(zn.SHOW), this._config.animation && this._element.classList.add(Xn); let e = function () { t._element.classList.remove(Jn), t._element.classList.add(Gn), g(t._element).trigger(zn.SHOWN), t._config.autohide && t.hide() }; if (this._element.classList.remove($n), this._element.classList.add(Jn), this._config.animation) { let n = _.getTransitionDurationFromElement(this._element); g(this._element).one(_.TRANSITION_END, e).emulateTransitionEnd(n) } else e() }, t.hide = function (t) { let e = this; this._element.classList.contains(Gn) && (g(this._element).trigger(zn.HIDE), t ? this._close() : this._timeout = setTimeout(function () { e._close() }, this._config.delay)) }, t.dispose = function () { clearTimeout(this._timeout), this._timeout = null, this._element.classList.contains(Gn) && this._element.classList.remove(Gn), g(this._element).off(zn.CLICK_DISMISS), g.removeData(this._element, Bn), this._element = null, this._config = null }, t._getConfig = function (t) { return t = l({}, ti, g(this._element).data(), "object" == typeof t && t ? t : {}), _.typeCheckConfig(Qn, t, this.constructor.DefaultType), t }, t._setListeners = function () { let t = this; g(this._element).on(zn.CLICK_DISMISS, ei, function () { return t.hide(!0) }) }, t._close = function () { let t = this, e = function () { t._element.classList.add($n), g(t._element).trigger(zn.HIDDEN) }; if (this._element.classList.remove(Gn), this._config.animation) { let n = _.getTransitionDurationFromElement(this._element); g(this._element).one(_.TRANSITION_END, e).emulateTransitionEnd(n) } else e() }, i._jQueryInterface = function (n) { return this.each(function () { let t = g(this), e = t.data(Bn); if (e || (e = new i(this, "object" == typeof n && n), t.data(Bn, e)), "string" == typeof n) { if ("undefined" == typeof e[n]) throw new TypeError('No method named "' + n + '"'); e[n](this) } }) }, s(i, null, [{ key: "VERSION", get: function () { return "4.3.1" } }, { key: "DefaultType", get: function () { return Zn } }, { key: "Default", get: function () { return ti } }]), i }(); g.fn[Qn] = ni._jQueryInterface, g.fn[Qn].Constructor = ni, g.fn[Qn].noConflict = function () { return g.fn[Qn] = Yn, ni._jQueryInterface }, function () { if ("undefined" == typeof g) throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript."); let t = g.fn.jquery.split(" ")[0].split("."); if (t[0] < 2 && t[1] < 9 || 1 === t[0] && 9 === t[1] && t[2] < 1 || 4 <= t[0]) throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0") }(), t.Util = _, t.Alert = p, t.Button = P, t.Carousel = lt, t.Collapse = bt, t.Dropdown = Jt, t.Modal = ve, t.Popover = sn, t.Scrollspy = Dn, t.Tab = Kn, t.Toast = ni, t.Tooltip = Be, Object.defineProperty(t, "__esModule", { value: !0 }) });
//# sourceMappingURL=bootstrap.min.js.map

// Bootstrap END





// Modals JS 

document.addEventListener("DOMContentLoaded", () => {
	// Call Modal Elements
	const callModal = document.getElementById("call_modal");
	const callButton = document.getElementById("call-us-button");
	const callCloseButton = document.querySelector("#call_modal .Modal_close__C0ggP");

	// Login Modal Elements
	let studentLoginlet = true;
	const loginModal = document.getElementById("_modal");
	const loginButton = document.getElementById("login-button");
	const loginCloseButton = document.querySelector("#_modal .Modal_close__C0ggP");
	const loginButtonMobile = document.getElementById("login-button-mobile");
	const loginModalMobile = document.getElementById("_modal");

	// Apply Modal Elements
	const applyModal = document.getElementById("Apply_modal");
	const applyButton = document.getElementById("apply-now-btn");
	const applyCloseButton = document.querySelector("#Apply_modal .Modal_close__C0ggP");

	// Apply Modal Elements Mobille
	const applyButtonMobile = document.getElementById("apply-now-btn-mobile");
	const applyModalMobile = document.getElementById("Apply_modal");

	// Program Modal Elements
	const programModal = document.getElementById("program_modal");
	const programButton = document.getElementById("program_button");
	const programCloseButton = document.querySelector("#program_modal .Modal_close__C0ggP");

	const stickyApplyButton = document.querySelector('.sticky-apply-btn');
	// const applyModal = document.getElementById('Apply_modal');
	const closeModalButton = document.querySelector('.Modal_close__C0ggP');

	stickyApplyButton.addEventListener('click', function () {
		applyModal.style.display = 'block';  // Show the modal 
	});

	// Close the modal when the close button is clicked
	closeModalButton.addEventListener('click', function () {
		applyModal.style.display = 'none';  // Hide the modal
	});

	window.addEventListener('click', function (event) {
		if (event.target === applyModal) {
			applyModal.style.display = 'none';
		}
	});

	const secApplyButton = document.querySelector('.sec-apply');
	const enrollNowBtn = document.querySelector('.enroll-now-btn');
	// const applyModal = document.getElementById('Apply_modal');
	// const closeModalButton = document.querySelector('.Modal_close__C0ggP');

	secApplyButton.addEventListener('click', function (event) {
		event.preventDefault(); // Prevent the default behavior (e.g., navigating to another page)
		applyModal.style.display = 'block';  // Show the modal
	});

	// Close the modal when the close button is clicked
	closeModalButton.addEventListener('click', function () {
		applyModal.style.display = 'none';  // Hide the modal
	});

	enrollNowBtn.addEventListener('click', function (event) {
		event.preventDefault(); // Prevent the default behavior (e.g., navigating to another page)
		applyModal.style.display = 'block';  // Show the modal
	});

	document.getElementById('loginwithotp').addEventListener('click', (e) => {
		if (studentLoginlet) {
			document.getElementById('phoneinputfield').style.display = 'block';
			document.getElementById('emailinputfield').style.display = 'none';
			document.getElementById('phoneinputfieldapplicant').style.display = 'none';
			document.getElementById('loginwithemail').checked = false;
			document.getElementById('loginwithotp').checked = true;
		} else {
			document.getElementById('phoneinputfieldapplicant').style.display = 'block';
			document.getElementById('emailinputfield').style.display = 'none';
			document.getElementById('phoneinputfield').style.display = 'none';
			document.getElementById('loginwithemail').checked = false;
			document.getElementById('loginwithotp').checked = true;
		}
	});

	document.getElementById('loginwithemail').addEventListener('click', (e) => {
		if (studentLoginlet) {
			document.getElementById('emailinputfield').style.display = 'block';
			document.getElementById('forgotPasswordBtn').style.display = 'block';
			document.getElementById('phoneinputfield').style.display = 'none';
			document.getElementById('phoneinputfieldapplicant').style.display = 'none';
			document.getElementById('loginwithotp').checked = false;
			document.getElementById('loginwithemail').checked = true;
		} else {
			document.getElementById('emailinputfield').style.display = 'block';
			document.getElementById('forgotPasswordBtn').style.display = 'none';
			document.getElementById('phoneinputfield').style.display = 'none';
			document.getElementById('phoneinputfieldapplicant').style.display = 'none';
			document.getElementById('loginwithotp').checked = false;
			document.getElementById('loginwithemail').checked = true;

		}
	})



	document.getElementById('studentlogin').addEventListener('click', (e) => {
		e.preventDefault();
		document.getElementById('applicantlogin').style = `
       background: #fff;
color: #1a325d`;

		document.getElementById('studentlogin').style = `
         color: #fff;
border-color: #1a325d;
background: #1a325d;`;
		studentLoginlet = true;
		handleEmailForm()
		handlePhoneForm()


	});

	document.getElementById('applicantlogin').addEventListener('click', (e) => {
		e.preventDefault();
		document.getElementById('applicantlogin').style = `
         color: #fff !important;
border-color: #1a325d !important;
background: #1a325d !important;`;
		document.getElementById('studentlogin').style = `
background: #fff;
color: #1a325d`;

		studentLoginlet = false;
		handleEmailForm()
		handlePhoneForm()

	});

	document.getElementById('forgotPasswordBtn').addEventListener('click', (e) => {
		e.preventDefault();
		document.getElementById('loginForm').style.display = 'none';
		document.getElementById('forgotPasswordForm').style.display = 'block';

	});
	document.getElementById('backToLoginBtn').addEventListener('click', (e) => {
		e.preventDefault();
		document.getElementById('forgotPasswordForm').style.display = 'none';
		document.getElementById('loginForm').style.display = 'block';

	});
	// Optionally, close the modal if clicked outside the modal content
	window.addEventListener('click', function (event) {
		if (event.target === applyModal) {
			applyModal.style.display = 'none';
		}
	});

	document.getElementById('nationalcodeselect').addEventListener('click', (e) => {
		e.preventDefault();
	
		document.getElementById('nationalcodeselect').style = `
			all: unset;
			border: 1px solid var(--P-Blue, #1a325d);
			background: var(--P-Blue, #1a325d);
			padding: .2rem 1.5rem;
			color: #fff;
			border-radius: .2rem;
			cursor: pointer;
			text-transform: uppercase;
			font-weight: 500;`;
	
		document.getElementById('internationcodeselect').style = `
			all: unset;
			border: 1px solid var(--P-Blue, #1a325d);
			color: var(--P-Blue, #1a325d);
			padding: .2rem 1.5rem;
			background: #fff;
			border-radius: .2rem;
			cursor: pointer;
			text-transform: uppercase;
			font-weight: 500;`;
	
		const option = document.getElementById('defalutoption');
		option.innerText = "+91";
	});
	
	// Add event listener for the international button
	document.getElementById('internationcodeselect').addEventListener('click', (e) => {
		e.preventDefault();
	
		document.getElementById('internationcodeselect').style = `
			all: unset;
			border: 1px solid var(--P-Blue, #1a325d);
			background: var(--P-Blue, #1a325d);
			padding: .2rem 1.5rem;
			color: #fff;
			border-radius: .2rem;
			cursor: pointer;
			text-transform: uppercase;
			font-weight: 500;`;
	
		document.getElementById('nationalcodeselect').style = `
			all: unset;
			border: 1px solid var(--P-Blue, #1a325d);
			color: var(--P-Blue, #1a325d);
			padding: .2rem 1.5rem;
			background: #fff;
			border-radius: .2rem;
			cursor: pointer;
			text-transform: uppercase;
			font-weight: 500;`;
	
		const option = document.getElementById('defalutoption');
		option.innerText = 'Code';
	});
	




	// Call Modal Handlers
	if (callButton && callModal) {
		callButton.addEventListener("click", (e) => {
			e.preventDefault();
			callModal.style.display = "grid";
		});
	}

	if (callCloseButton && callModal) {
		callCloseButton.addEventListener("click", (e) => {
			e.preventDefault();
			callModal.style.display = "none";
		});
	}

	// Login Modal Handlers
	if (loginButton && loginModal) {
		loginButton.addEventListener("click", (e) => {
			e.preventDefault();
			loginModal.style.display = "grid";
		});
	}

	if (loginCloseButton && loginModal) {
		loginCloseButton.addEventListener("click", (e) => {
			e.preventDefault();
			loginModal.style.display = "none";
		});
	}

	// Apply Modal Handlers
	if (applyButton && applyModal) {
		applyButton.addEventListener("click", (e) => {
			e.preventDefault();
			applyModal.style.display = "grid";
		});
	}
	// Apply Modal Handlers for Mobile
	if (applyButtonMobile && applyModalMobile) {
		applyButtonMobile.addEventListener("click", (e) => {
			e.preventDefault();
			applyModalMobile.style.display = "grid";
		});
	}
	if (loginButtonMobile && loginModalMobile) {
		loginButtonMobile.addEventListener("click", (e) => {
			e.preventDefault();
			loginModalMobile.style.display = "grid";
		});
	}

	if (applyCloseButton && applyModal) {
		applyCloseButton.addEventListener("click", (e) => {
			e.preventDefault();
			applyModal.style.display = "none";
		});
	}
	// Close Modal for Mobile
	if (applyCloseButtonMobile && applyModalMobile) {
		applyCloseButtonMobile.addEventListener("click", (e) => {
			e.preventDefault();
			applyModalMobile.style.display = "none";
		});
	}
	if (loginCloseButtonMobile && loginModalMobile) {
		loginCloseButtonMobile.addEventListener("click", (e) => {
			e.preventDefault();
			loginModalMobile.style.display = "none";
		});
	}


	// Download Modal Handlers
	if (programButton && programModal) {
		programButton.addEventListener("click", (e) => {
			e.preventDefault();
			programModal.style.display = "grid";
		});
	}

	if (programCloseButton && programModal) {
		programCloseButton.addEventListener("click", (e) => {
			e.preventDefault();
			programModal.style.display = "none";
		});
	}

	// Global click handler for closing modals when clicking outside
	window.addEventListener("click", (e) => {
		if (e.target === callModal) {
			callModal.style.display = "none";
		}
		if (e.target === loginModal) {
			loginModal.style.display = "none";
		}
		if (e.target === applyModal) {
			applyModal.style.display = "none";
		}

		if (e.target === programModal) {
			programModal.style.display = "none";
		}
	});
	window.addEventListener("click", (e) => {
		if (e.target === applyModal) {
			applyModal.style.display = "none";
		}
		if (e.target === applyModalMobile) {
			applyModalMobile.style.display = "none";
		}
		if (e.target === loginModal) {
			loginModal.style.display = "none";
		}
		if (e.target === loginModalMobile) {
			loginModalMobile.style.display = "none";
		}
	});



});

document.addEventListener("DOMContentLoaded", () => {
	// Download Modal Elements
	const downloadModal = document.getElementById("download_modal");
	const downloadButton = document.getElementById("download_brochure_button");
	const downloadCloseButton = document.querySelector("#download_modal .Modal_close__C0ggP");

	const downloadModalMobile = document.getElementById("download_modal");
	const downloadButtonMobile = document.getElementById("download_brochure_button_mobile");



	// Open the download modal
	if (downloadButton && downloadModal) {
		downloadButton.addEventListener("click", (e) => {
			e.preventDefault();
			downloadModal.style.display = "grid"; // Show the modal
		});
	}
	if (downloadButtonMobile && downloadModalMobile) {
		downloadButtonMobile.addEventListener("click", (e) => {
			e.preventDefault();
			downloadModalMobile.style.display = "grid";
		});
	}
	// Close the download modal
	if (downloadCloseButton && downloadModal) {
		downloadCloseButton.addEventListener("click", (e) => {
			e.preventDefault();
			downloadModal.style.display = "none"; // Hide the modal
		});
	}
	const DownloadCloseButtonMobile = document.querySelector("#Apply_modal .Modal_close__C0ggP");
	if (downloadCloseButtonMobile && downloadModalMobile) {
		downloadCloseButtonMobile.addEventListener("click", (e) => {
			e.preventDefault();
			downloadModalMobile.style.display = "none"; // Close the modal
		});
	}
	// Close the modal if clicked outside the modal content
	window.addEventListener("click", (e) => {
		if (e.target === downloadModal) {
			downloadModal.style.display = "none";
		}
	});
});



//Scroll Functionality
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





//   NAV JS

// Sticky Plugin v1.0.4 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 02/14/2011
// Date: 07/20/2015
// Website: http://stickyjs.com/
// Description: Makes an element on the page stick on the screen as you scroll
//              It will only set the 'top' and 'position' of your element, you
//              might need to adjust the width in some cases.



(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
	let slice = Array.prototype.slice; // save ref to original slice()
	let splice = Array.prototype.splice; // save ref to original slice()

	let defaults = {
		topSpacing: 0,
		bottomSpacing: 0,
		className: 'is-sticky',
		wrapperClassName: 'sticky-wrapper',
		center: false,
		getWidthFrom: '',
		widthFromWrapper: true, // works only when .getWidthFrom is empty
		responsiveWidth: false,
		zIndex: 'inherit'
	},
		$window = $(window),
		$document = $(document),
		sticked = [],
		windowHeight = $window.height(),
		scroller = function () {
			let scrollTop = $window.scrollTop(),
				documentHeight = $document.height(),
				dwh = documentHeight - windowHeight,
				extra = (scrollTop > dwh) ? dwh - scrollTop : 0;

			for (let i = 0, l = sticked.length; i < l; i++) {
				let s = sticked[i],
					elementTop = s.stickyWrapper.offset().top,
					etse = elementTop - s.topSpacing - extra;

				//update height in case of dynamic content
				s.stickyWrapper.css('height', s.stickyElement.outerHeight());

				if (scrollTop <= etse) {
					if (s.currentTop !== null) {
						s.stickyElement
							.css({
								'width': '',
								'position': '',
								'top': '',
								'z-index': ''
							});
						s.stickyElement.parent().removeClass(s.className);
						s.stickyElement.trigger('sticky-end', [s]);
						s.currentTop = null;
					}
				}
				else {
					let newTop = documentHeight - s.stickyElement.outerHeight()
						- s.topSpacing - s.bottomSpacing - scrollTop - extra;
					if (newTop < 0) {
						newTop = newTop + s.topSpacing;
					} else {
						newTop = s.topSpacing;
					}
					if (s.currentTop !== newTop) {
						let newWidth;
						if (s.getWidthFrom) {
							padding = s.stickyElement.innerWidth() - s.stickyElement.width();
							newWidth = $(s.getWidthFrom).width() - padding || null;
						} else if (s.widthFromWrapper) {
							newWidth = s.stickyWrapper.width();
						}
						if (newWidth == null) {
							newWidth = s.stickyElement.width();
						}
						s.stickyElement
							.css('width', newWidth)
							.css('position', 'fixed')
							.css('top', newTop)
							.css('z-index', s.zIndex);

						s.stickyElement.parent().addClass(s.className);

						if (s.currentTop === null) {
							s.stickyElement.trigger('sticky-start', [s]);
						} else {
							// sticky is started but it have to be repositioned
							s.stickyElement.trigger('sticky-update', [s]);
						}

						if (s.currentTop === s.topSpacing && s.currentTop > newTop || s.currentTop === null && newTop < s.topSpacing) {
							// just reached bottom || just started to stick but bottom is already reached
							s.stickyElement.trigger('sticky-bottom-reached', [s]);
						} else if (s.currentTop !== null && newTop === s.topSpacing && s.currentTop < newTop) {
							// sticky is started && sticked at topSpacing && overflowing from top just finished
							s.stickyElement.trigger('sticky-bottom-unreached', [s]);
						}

						s.currentTop = newTop;
					}

					// Check if sticky has reached end of container and stop sticking
					let stickyWrapperContainer = s.stickyWrapper.parent();
					let unstick = (s.stickyElement.offset().top + s.stickyElement.outerHeight() >= stickyWrapperContainer.offset().top + stickyWrapperContainer.outerHeight()) && (s.stickyElement.offset().top <= s.topSpacing);

					if (unstick) {
						s.stickyElement
							.css('position', 'absolute')
							.css('top', '')
							.css('bottom', 0)
							.css('z-index', '');
					} else {
						s.stickyElement
							.css('position', 'fixed')
							.css('top', newTop)
							.css('bottom', '')
							.css('z-index', s.zIndex);
					}
				}
			}
		},
		resizer = function () {
			windowHeight = $window.height();

			for (let i = 0, l = sticked.length; i < l; i++) {
				let s = sticked[i];
				let newWidth = null;
				if (s.getWidthFrom) {
					if (s.responsiveWidth) {
						newWidth = $(s.getWidthFrom).width();
					}
				} else if (s.widthFromWrapper) {
					newWidth = s.stickyWrapper.width();
				}
				if (newWidth != null) {
					s.stickyElement.css('width', newWidth);
				}
			}
		},
		methods = {
			init: function (options) {
				return this.each(function () {
					let o = $.extend({}, defaults, options);
					let stickyElement = $(this);

					let stickyId = stickyElement.attr('id');
					let wrapperId = stickyId ? stickyId + '-' + defaults.wrapperClassName : defaults.wrapperClassName;
					let wrapper = $('<div></div>')
						.attr('id', wrapperId)
						.addClass(o.wrapperClassName);

					stickyElement.wrapAll(function () {
						if ($(this).parent("#" + wrapperId).length == 0) {
							return wrapper;
						}
					});

					let stickyWrapper = stickyElement.parent();

					if (o.center) {
						stickyWrapper.css({ width: stickyElement.outerWidth(), marginLeft: "auto", marginRight: "auto" });
					}

					if (stickyElement.css("float") === "right") {
						stickyElement.css({ "float": "none" }).parent().css({ "float": "right" });
					}

					o.stickyElement = stickyElement;
					o.stickyWrapper = stickyWrapper;
					o.currentTop = null;

					sticked.push(o);

					methods.setWrapperHeight(this);
					methods.setupChangeListeners(this);
				});
			},

			setWrapperHeight: function (stickyElement) {
				let element = $(stickyElement);
				let stickyWrapper = element.parent();
				if (stickyWrapper) {
					stickyWrapper.css('height', element.outerHeight());
				}
			},

			setupChangeListeners: function (stickyElement) {
				if (window.MutationObserver) {
					let mutationObserver = new window.MutationObserver(function (mutations) {
						if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
							methods.setWrapperHeight(stickyElement);
						}
					});
					mutationObserver.observe(stickyElement, { subtree: true, childList: true });
				} else {
					if (window.addEventListener) {
						stickyElement.addEventListener('DOMNodeInserted', function () {
							methods.setWrapperHeight(stickyElement);
						}, false);
						stickyElement.addEventListener('DOMNodeRemoved', function () {
							methods.setWrapperHeight(stickyElement);
						}, false);
					} else if (window.attachEvent) {
						stickyElement.attachEvent('onDOMNodeInserted', function () {
							methods.setWrapperHeight(stickyElement);
						});
						stickyElement.attachEvent('onDOMNodeRemoved', function () {
							methods.setWrapperHeight(stickyElement);
						});
					}
				}
			},
			update: scroller,
			unstick: function (options) {
				return this.each(function () {
					let that = this;
					let unstickyElement = $(that);

					let removeIdx = -1;
					let i = sticked.length;
					while (i-- > 0) {
						if (sticked[i].stickyElement.get(0) === that) {
							splice.call(sticked, i, 1);
							removeIdx = i;
						}
					}
					if (removeIdx !== -1) {
						unstickyElement.unwrap();
						unstickyElement
							.css({
								'width': '',
								'position': '',
								'top': '',
								'float': '',
								'z-index': ''
							})
							;
					}
				});
			}
		};

	// should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
	if (window.addEventListener) {
		window.addEventListener('scroll', scroller, false);
		window.addEventListener('resize', resizer, false);
	} else if (window.attachEvent) {
		window.attachEvent('onscroll', scroller);
		window.attachEvent('onresize', resizer);
	}

	// Sticky Button(stick)
	$.fn.sticky = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.sticky');
		}
	};

	// Sticky Button(unstick)
	$.fn.unstick = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.unstick.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.sticky');
		}
	};
	$(function () {
		setTimeout(scroller, 0);
	});
}));

//main js

$(function () {

	let siteSticky = function () {
		$(".js-sticky-header").sticky({ topSpacing: 0 });
	};
	siteSticky();

	let siteMenuClone = function () {

		$('.js-clone-nav').each(function () {
			let $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});


		setTimeout(function () {

			let counter = 0;
			$('.site-mobile-menu .has-children').each(function () {
				let $this = $(this);

				$this.prepend('<span class="arrow-collapse collapsed">');

				$this.find('.arrow-collapse').attr({
					'data-toggle': 'collapse',
					'data-target': '#collapseItem' + counter,
				});

				$this.find('> ul').attr({
					'class': 'collapse',
					'id': 'collapseItem' + counter,
				});

				counter++;

			});

		}, 1000);

		$('body').on('click', '.arrow-collapse', function (e) {
			let $this = $(this);
			if ($this.closest('li').find('.collapse').hasClass('show')) {
				$this.removeClass('active');
			} else {
				$this.addClass('active');
			}
			e.preventDefault();

		});

		$(window).resize(function () {
			let $this = $(this),
				w = $this.width();

			if (w > 768) {
				if ($('body').hasClass('offcanvas-menu')) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		})

		$('body').on('click', '.js-menu-toggle', function (e) {
			let $this = $(this);
			e.preventDefault();

			if ($('body').hasClass('offcanvas-menu')) {
				$('body').removeClass('offcanvas-menu');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$this.addClass('active');
			}
		})

		// click outisde offcanvas
		$(document).mouseup(function (e) {
			let container = $(".site-mobile-menu");
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				if ($('body').hasClass('offcanvas-menu')) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		});
	};
	siteMenuClone();

});


// common JS

class Carousel {
	constructor(container) {
		this.container = container;
		this.track = container.querySelector('.carousel-track');
		this.slides = container.querySelectorAll('.carousel-slide');
		this.buttons = container.querySelectorAll('.carousel-button');
		this.dots = container.querySelector('.carousel-dots');
		this.currentIndex = 0;
		this.slidesPerView = this.getSlidesPerView();
		
		this.init();
	}

	init() {
		// Create dots
		this.slides.forEach((_, index) => {
			const dot = document.createElement('div');
			dot.classList.add('carousel-dot');
			if (index === 0) dot.classList.add('active');
			dot.addEventListener('click', () => this.goToSlide(index));
			this.dots.appendChild(dot);
		});

		// Add button listeners
		this.buttons[0].addEventListener('click', () => this.prev());
		this.buttons[1].addEventListener('click', () => this.next());

		// Add resize listener
		window.addEventListener('resize', () => {
			this.slidesPerView = this.getSlidesPerView();
			this.updateCarousel();
		});

		this.updateCarousel();
	}

	getSlidesPerView() {
		if (window.innerWidth >= 1024) return 3;
		if (window.innerWidth >= 768) return 2;
		return 1;
	}

	updateCarousel() {
		const slideWidth = 100 / this.slidesPerView;
		this.slides.forEach(slide => {
			slide.style.flex = `0 0 ${slideWidth}%`;
		});
		this.goToSlide(this.currentIndex);
	}

	goToSlide(index) {
		const maxIndex = this.slides.length - this.slidesPerView;
		this.currentIndex = Math.max(0, Math.min(index, maxIndex));
		const offset = -this.currentIndex * (100 / this.slidesPerView);
		this.track.style.transform = `translateX(${offset}%)`;
		
		// Update dots
		this.dots.querySelectorAll('.carousel-dot').forEach((dot, i) => {
			dot.classList.toggle('active', i === this.currentIndex);
		});
	}

	prev() {
		this.goToSlide(this.currentIndex - 1);
	}

	next() {
		this.goToSlide(this.currentIndex + 1);
	}
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
	const carousel = new Carousel(document.querySelector('.carousel-container'));
});

document.addEventListener('DOMContentLoaded', function() {
    const swiper = new Swiper('.swiper2', {
        // Optional parameters
        slidesPerView: 'auto',
        spaceBetween: 20,
        loop: false,
        
        // Responsive breakpoints
        breakpoints: {
            // when window width is >= 320px
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            // when window width is >= 480px
            480: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // when window width is >= 768px
            768: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            // when window width is >= 1024px
            1024: {
                slidesPerView: 5,
                spaceBetween: 20
            }
        },

        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },

        // Navigation arrows (optional)
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const swiper = new Swiper('.swiper', {
        // Optional parameters
        slidesPerView: 'auto',
        spaceBetween: 20,
        loop: false,
        
        // Responsive breakpoints
        breakpoints: {
            // when window width is >= 320px
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            // when window width is >= 480px
            480: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // when window width is >= 768px
            768: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            // when window width is >= 1024px
            1024: {
                slidesPerView: 4,
                spaceBetween: 20
            }
        },

        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },

        // Navigation arrows (optional)
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });
});


// Get references to DOM elements
const programsMenuItem = document.querySelector('.header_menuItem__2qruK a[href="#"]');
const programsMenu = document.querySelector('.ProgramsMenu_mobile__K4seG');

// Toggle programs menu visibility
programsMenuItem.addEventListener('click', (e) => {
  e.preventDefault();
  const isVisible = programsMenu.style.display === 'block';
  programsMenu.style.display = isVisible ? 'none' : 'block';
});

// Handle back button
const backButton = document.querySelector('.ProgramsMenu_submenuArrow__gnbLw');
backButton.addEventListener('click', () => {
  // Hide current content and show main menu
  document.querySelectorAll('.ProgramsMenu_contentBox__UHi_e').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelector('.ProgramsMenu_sidemenu__frHFk').style.display = 'block';
});

// Handle menu item clicks
document.querySelectorAll('.ProgramsMenu_item__mfuSn').forEach(item => {
  item.addEventListener('click', () => {
    // Hide main menu and show appropriate content
    document.querySelector('.ProgramsMenu_sidemenu__frHFk').style.display = 'none';
    const target = item.querySelector('span').textContent.trim();
    // Add logic to show the correct content box based on the clicked item
  });
});

// Close other menu items when opening programs
const otherMenuItems = document.querySelectorAll('.header_menuItem__2qruK:not(:first-child)');
otherMenuItems.forEach(item => {
  item.addEventListener('click', () => {
    programsMenu.style.display = 'none';
  });
});



