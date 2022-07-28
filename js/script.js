'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
	e.preventDefault();
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
};

const closeModal = function () {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

overlay.addEventListener('click', closeModal);
btnCloseModal.addEventListener('click', closeModal);



// btn scrolling
btnScrollTo.addEventListener('click', function (e) {
	const s1coords = section1.getBoundingClientRect();
	// Scrolling
	// window.scrollTo(s1coords.left, needed + s1coords.top);
	// window.scrollTo({
	// 	left: window.pageXOffset + s1coords.left,
	// 	top: window.pageYOffset + s1coords.top,
	// 	behavior: "smooth",
	// });
	section1.scrollIntoView({ behavior: 'smooth' })
})

navLinks.addEventListener('click', function (e) {
	e.preventDefault();
	if (e.target.closest('.nav__link')) {
		const id = e.target.getAttribute('href');
		// if (id !== '#') {
		// 	document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
		// }
		id !== '#' && document.querySelector(id).scrollIntoView({ behavior: 'smooth' });

	}
})

// Tabbed components
tabsContainer.addEventListener('click', function (e) {
	const clicked = e.target.closest('.operations__tab');
	if (!clicked) return;

	tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

	tabsContent.forEach(c => c.classList.remove('operations__content--active'));

	clicked.classList.add('operations__tab--active');

	document.querySelector(`.operations__content--${clicked.dataset.tab}`)
		.classList.add('operations__content--active');
})


// Passing "arguments" into handler function
const handleHover = function (e, opacity) {
	if (e.target.classList.contains('nav__link')) {
		const link = e.target;
		const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
		const logo = e.target.closest('.nav').querySelector('img');

		siblings.forEach(s => {
			if (s !== link) {
				s.style.opacity = this;
			}
		})
		logo.style.opacity = this;
	}
}

// nav.addEventListener('mouseover', function (e) {
// 	handleHover(e, 0.5);
// })
// nav.addEventListener('mouseout', function (e) {
// 	handleHover(e, 1);
// })
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));


// scrolling (adding sticky to nav)
/*

const initial = section1.getBoundingClientRect();
window.addEventListener('scroll', function (e) {
	if (window.scrollY > initial.top) {
		nav.classList.add('sticky');
	} else nav.classList.remove('sticky');
})

const obsOptions = {
	root: null,
	threshold: [0, 0.2],
}

const obsCallback = function (entries, observer) {
	entries.forEach(e => console.log(e));
}


const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/

const header = document.querySelector('.header');

const obsHeader = function (entries) {
	const [entry] = entries;
	!entry.isIntersecting ? nav.classList.add('sticky') : nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(obsHeader, { root: null, threshold: [0], rootMargin: `-${nav.getBoundingClientRect().height}px`, });
headerObserver.observe(header);



// Reveal sections
// const allSections = document.querySelectorAll('.section');
// const revealSection = function (entries, observer) {
// 	const [entry] = entries;
// 	// entry.isIntersecting ? entry.target.classList.remove('section--hidden') : null;
// 	if (!entry.isIntersecting) return;
// 	entry.target.classList.remove('section--hidden');
// 	observer.unobserve(entry.target);
// }
// const sectionObserver = new IntersectionObserver(revealSection, { root: null, threshold: 0 });
// allSections.forEach(section => {
// 	section.classList.add('section--hidden');
// 	sectionObserver.observe(section);
// });


// img lazy
const allImg = document.querySelectorAll('img[data-src]');

const imgHandling = function (entries, observer) {
	const [entry] = entries;
	if (!entry.isIntersecting) return;

	// Replace the "src" attribute with "data-src";
	entry.target.src = entry.target.dataset.src;
	entry.target.addEventListener('load', function (e) {
		this.classList.remove('lazy-img');
	});
	observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(imgHandling, { root: null, threshold: 0, rootMargin: '-150px', });
allImg.forEach(img => imgObserver.observe(img));

// slider
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const arrLeft = document.querySelector('.slider__btn--left');
const arrRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

slides.forEach((slide, index) => {
	slide.style.transform = `translateX(${100 * index}%)`;
});
// 0%, 100%, 200%;

const createDots = function () {
	let htmlElem = '';
	slides.forEach(function (_, i) {
		htmlElem += `<button class="dots__dot" data-slide="${i}"></button>`;
	})
	dotContainer.insertAdjacentHTML('beforeend', htmlElem);
}
createDots();

let currentSlide = 0;
const maxSlide = slides.length - 1;

const goToSlide = function (s) {
	slides.forEach((slide, index) => {
		dotContainer.children[index].classList.remove('dots__dot--active');
		slide.style.transform = `translateX(${100 * (index - s)}%)`;
		dotContainer.children[index].textContent = index
	});
	const actual = document.querySelector(`[data-slide="${s}"]`);
	actual.textContent = s;
	actual.classList.add('dots__dot--active');
}
goToSlide(0);

const nextSlide = function () {
	if (currentSlide === maxSlide) {
		currentSlide = 0;
	} else {
		currentSlide++;
	}
	goToSlide(currentSlide);
}

const prevSlide = function () {
	if (currentSlide === 0) {
		currentSlide = maxSlide;
	} else {
		currentSlide--;
	}
	goToSlide(currentSlide);
}

arrRight.addEventListener('click', nextSlide);
arrLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
	// if (e.key === 'ArrowLeft') prevSlide();
	// else if (e.key === 'ArrowRight') nextSlide();
	e.key === 'ArrowLeft' && prevSlide();
	e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
	if (e.target.classList.contains('dots__dot')) {
		const { slide } = e.target.dataset;
		goToSlide(slide);
	}
})


const burger = document.querySelector('.burger');
const list = document.querySelector('.nav__links');
const body = document.body;


burger.addEventListener('click', function (e) {
	this.classList.toggle('burger-active');
	list.classList.toggle('list-active');
	body.classList.toggle('hidden-body');
})