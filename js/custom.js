function ibg() {
	let ibg = document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if (ibg[i].querySelector('img')) {
			ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
		}
	}
}
ibg();




// Динамический адаптив  -----------------------------------------------------------------------------
function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();

// Динамический адаптив  -----------------------------------------------------------------------------


//Бургер =================================================================================================

const iconMenu = document.querySelector('._menu__icon');
const menuBody = document.querySelector('._menu__body');
const headeShadow = document.querySelector('.header-shadow');

if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		//document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
		let lockPaddingValue = window.innerWidth - document.querySelector('.wraper').offsetWidth + 'px';
		//bodyUnlock();
		if (document.body.classList.contains('_lock')) {
			//alert("Есть");
			document.body.style.paddingRight = '0px';
			document.body.classList.remove('_lock');
		} else {
			//alert("l")
			document.body.style.paddingRight = lockPaddingValue;
			document.body.classList.add('_lock');
		}
	});
	headeShadow.addEventListener("click", function (e) {
		if (document.body.classList.contains('_lock')) {
			document.body.style.paddingRight = '0px';
			document.body.classList.remove('_lock');
			menuBody.classList.remove('_active');
			iconMenu.classList.remove('_active');
			//alert("l");
		}
	});
}


//Переходы по якорным ссылкам =====================
$(".menu a, .scrol-link").click(function () {
	var elementClick = $(this).attr("href");
	var destination = $(elementClick).offset().top - 160;
	$("body,html").animate({ scrollTop: destination }, 1200);
});
//======== Всплывающие окна =========================
$('a[data-popup]').click(function () {
	let namePopup = $(this).attr('href');
	$(namePopup).scrollTop(0);
	if ($('.popup').is(namePopup)) {
		$(namePopup).addClass('show');
		$('body').addClass('lock');
	}
});
$('a[data-popup-id]').click(function () {
	let namePopup = $(this).attr('data-popup-id');
	if ($('.popup').is(namePopup)) {
		$(namePopup).addClass('show');
		$('body').addClass('lock');
	}
});
$('.popup__close').click(function () {
	$('.popup').removeClass('show');
	$('body').removeClass('lock');
});
$(document).mouseup(function (e) {
	let div = $(".popup__body");
	if (!div.is(e.target) && div.has(e.target).length === 0) {
		$('.popup').removeClass('show');
		$('body').removeClass('lock');
	}
});

$('.faq-tab__item').click(function () {
	$('.faq-tab__item').removeClass('active')
	$(this).addClass('active')
});

$('#userPhoto').change(function (event) {
	let files = event.target.files;
	for (let i = 0, f; f = files[i]; i++) {
		let reader = new FileReader();
		reader.onload = (function (theFile) {
			return function (e) {
				let preview = document.querySelector(".file-input__image");
				let span = document.createElement('span');
				span.innerHTML = ['<img src="', e.target.result, '" />'].join('');
				preview.insertBefore(span, null);
			};
		})(f);
		reader.readAsDataURL(f);
	}
})
// Форма =================
$("form").each(function () {
	$(this).validate({
		rules: {
			user_name: {
				required: true,
				minlength: 3
			},
			user_tel: {
				required: true,
			},
		},
		invalidHandler: function (event, validator) {
			var errors = validator.numberOfInvalids();
			if (errors) {
				$(this).find(".invalid-feedback").addClass('show');
			} else {
				$(this).find(".invalid-feedback").removeClass('show');
			}
		},
		submitHandler: function (form) {
			$.ajax({
				type: "POST",
				url: "/php/telegram/send.php",
				type: "POST",
				data: new FormData(form),
				processData: false,
				contentType: false,
				success: function success(respond) {
					$('.popup').removeClass('show');
					$('#successForm').addClass('show');
				}
			});
			return false;
		}
	});
});


const mainSlider = new Swiper(".index-slaider__wrapper", {
	allowTouchMove: false,
	loop: true,
	autoplay: {
		delay: 3000,
		stopOnLastSlide: true,
	},
	keyboard: {
		enabled: true,
		onlyInViewport: false,
	},
});
const feedbacksSwiper = new Swiper("#feedbacksSlider", {
	loop: true,
	spaceBetween: 15,
	slidesPerView: "auto",
	navigation: {
		nextEl: ".feedbacks-button-next",
		prevEl: ".feedbacks-button-prev",
	},
	autoplay: {
		delay: 5000,
	},
	breakpoints: {
		640: {
			spaceBetween: 20,
			slidesPerView: 2,
		},
		1200: {
			spaceBetween: 30,
			slidesPerView: 3,
		},
	}
});
const swiper = new Swiper(".mySwiper", {
	loop: true,
	spaceBetween: 5,
	slidesPerView: 3,
	freeMode: true,
	watchSlidesProgress: true,
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
	breakpoints: {
		640: {
			spaceBetween: 20,
			direction: "vertical",
		},
		1200: {
			direction: "vertical",
			spaceBetween: 30,
		},
	}
});
const swiper2 = new Swiper(".mySwiper2", {
	loop: true,
	spaceBetween: 10,

	thumbs: {
		swiper: swiper,
	},
});
const feedbacksSlider = new Swiper(".feedbackSlider", {
	spaceBetween: 5,
	slidesPerView: 1,
	freeMode: true,
	hashNavigation: {
		watchState: true,
	},
	navigation: {
		nextEl: ".feedbackSlider-next",
		prevEl: ".feedbackSlider-prev",
	},
});
