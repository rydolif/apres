'use strict';

document.addEventListener("DOMContentLoaded", function() {

	//----------------------SLIDER-hero----------------------
		var mySwiper = new Swiper('.about__slider_container', {
			slidesPerView: 1,
			spaceBetween: 15,
			// loop: true,
			// effect: 'fade',
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: '.about__slider_pagination',
				clickable: 'true',
			},
			navigation: {
				nextEl: '.about__slider_next',
				prevEl: '.about__slider_prev',
			},
			breakpoints: {
				480: {
					slidesPerView: 2,
					spaceBetween: 15
				},
				767: {
					slidesPerView: 3,
					spaceBetween: 30
				},
			}
		});

	//------------------------------ACCORDIONS---------------------------
		const accordions = (accordionSelector) => {
			const	accordion = document.querySelectorAll(accordionSelector);

			accordion.forEach(item => {
				const accordionClick = item.querySelector('.accordion__header'),
							accordionContent = item.querySelector('.accordion__content');

				accordionClick.addEventListener('click', (e) => {
					if(!item.classList.contains('accordion--active')) {

						item.classList.add('accordion--active')
						accordionContent.style.height = "auto"
						var height = accordionContent.clientHeight + "px"
						accordionContent.style.height = "0px"

						setTimeout(() => {
							accordionContent.style.height = height
						}, 0)

						} else {
							accordionContent.style.height = "0px"
								item.classList.remove('accordion--active')
					}
				});
			});

		};
		accordions('.accordion');

	//------------------------------ACCORDIONS-HOVER--------------------------
		const aboutList = (aboutListSelector) => {
			const aboutListItem = document.querySelectorAll(aboutListSelector);
			aboutListItem.forEach(item => {
				const aboutListText = item.querySelector('.about__list_text');

				item.addEventListener('mouseenter', (e) => { 
					if(!item.classList.contains('about__list_text')) {
						item.classList.add('about__list_text--active');
						aboutListText.style.height = "auto"
						var height = aboutListText.clientHeight + "px"
						aboutListText.style.height = "0px"
						setTimeout(() => {
							aboutListText.style.height = height
						}, 0)
					}
				});

				item.addEventListener('mouseleave', (e) => {
					item.classList.remove('about__list_item--active');
					aboutListText.style.height = "0px"
				});
			});
		};
		aboutList('.about__list_item');

	//----------------------SCROLL-----------------------
		const scrollTo = (scrollTo) => {
			let list = document.querySelector(scrollTo);
			if (list) {
				list = '.' + list.classList[0]  + ' a[href^="#"';
	
				document.querySelectorAll(list).forEach(link => {
		
					link.addEventListener('click', function(e) {
							e.preventDefault();
							const scrollMenu = document.querySelector(scrollTo);
		
							let href = this.getAttribute('href').substring(1);
		
							const scrollTarget = document.getElementById(href);
		
							// const topOffset = scrollMenu.offsetHeight;
							const topOffset = 70;
							const elementPosition = scrollTarget.getBoundingClientRect().top;
							const offsetPosition = elementPosition - topOffset;
		
							window.scrollBy({
									top: offsetPosition,
									behavior: 'smooth'
							});
		
							
							let button = document.querySelector('.hamburger'),
									nav = document.querySelector('.header__nav'),
									header = document.querySelector('.header');
		
							button.classList.remove('hamburger--active');
							nav.classList.remove('header__nav--active');
							header.classList.remove('header--menu');
					});
				});
			}

		};
		scrollTo('.click');
	
	//----------------------FIXED-HEADER-----------------------
		const headerFixed = (headerFixed, headerActive) => {
			const header =  document.querySelector(headerFixed),
						active = headerActive.replace(/\./, '');
	
			window.addEventListener('scroll', function() {
				const top = pageYOffset;
				
				if (top >= 90) {
					header.classList.add(active);
				} else {
					header.classList.remove(active);
				}
	
			});
	
		};
		headerFixed('.header', '.header--active');
	
	//----------------------HAMBURGER-----------------------
		const hamburger = (hamburgerButton, hamburgerNav, hamburgerHeader) => {
			const button = document.querySelector(hamburgerButton),
						nav = document.querySelector(hamburgerNav),
						header = document.querySelector(hamburgerHeader);
	
			button.addEventListener('click', (e) => {
				button.classList.toggle('hamburger--active');
				nav.classList.toggle('header__nav--active');
				header.classList.toggle('header--menu');
			});
	
		};
		hamburger('.hamburger', '.header__nav', '.header');
		
	//----------------------MODAL-----------------------
		const modals = (modalSelector) => {
			const	modal = document.querySelectorAll(modalSelector);

			if (modal) {
				let i = 1;

				modal.forEach(item => {
					const wrap = item.id;
					const link = document.querySelector('.' + wrap);
					let close = item.querySelector('.close');
					if (link) {
						link.addEventListener('click', (e) => {
							if (e.target) {
								e.preventDefault();
							}
							item.classList.add('active');
						});
					}

					if (close) {
						close.addEventListener('click', () => {
							item.classList.remove('active');
						});
					}

					item.addEventListener('click', (e) => {
						if (e.target === item) {
							item.classList.remove('active');
						}
					});
				});
			}

		};
		modals('.modal');

	//----------------------FORM-----------------------
		const forms = (formsSelector) => {
			const form = document.querySelectorAll(formsSelector);
			let i = 1;

			form.forEach(item => {
				const elem = 'form--' + i++;
				item.classList.add(elem);

				let formId = item.id = (elem);
				let formParent = document.querySelector('#' + formId);

				formParent.addEventListener('submit', formSend);

				async function formSend(e) {
					e.preventDefault();
			
					let error = formValidate(item);
			
					let formData = new FormData(item);

					if (error === 0) {
						item.classList.add('_sending');
						let response = await fetch('sendmail.php', {
							method: 'POST',
							body: formData
						});
			
						if (response.ok) {
							let modalThanks = document.querySelector('#modal--thanks');
							let modalRemove = document.querySelector('.modal.active');
							if (modalRemove) {
								modalRemove.classList.remove('active');
							}
							modalThanks.classList.add('active');
							document.body.classList.add('modal--open');
							item.reset();
							item.classList.remove('_sending');
						} else {
							alert('Ошибка при отправке');
							item.classList.remove('_sending');
						}
			
					}
				}
			
				function formValidate(item) {
					let error = 0;
					let formReq = formParent.querySelectorAll('._req');

					for (let index = 0; index < formReq.length; index++) {
						const input = formReq[index];
						if (input.classList.contains('_email')) {
							if(emailTest(input)) {
								formAddErrorEmail(input);
								error++;
							}
						} else if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
							formAddErrorCheck(input);
							error++;
						} else {
							if (input.value === '') {
								formAddError(input);
								error++;
							}
						}
					}
					return error;
				}

				function formAddError(input) {
					let div = document.createElement('div');
					div.classList.add("form__error");
					div.innerHTML = "Wprowadź dane w polu";

					input.parentElement.append(div);
					input.parentElement.classList.add('_error');
					input.classList.add('_error');
				}
			
				function formAddErrorEmail(input) {
					let div = document.createElement('div');
					div.classList.add("form__error");
					div.innerHTML = "Wprowadź swój email";

					input.parentElement.append(div);
					input.parentElement.classList.add('_error');
					input.classList.add('_error');
				}
			
				function formAddErrorCheck(input) {
					let div = document.createElement('div');
					div.classList.add("form__error");
					div.innerHTML = "Zgoda na przetwarzanie danych osobowych";

					input.parentElement.append(div);
					input.parentElement.classList.add('_error');
					input.classList.add('_error');
				}
			
				function emailTest(input) {
					return !/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/. test(input.value);
				}

			});
		};
		forms('.form');


});
	