"use strict"

// Helps to determine on which device our page is open

const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
    }
};

if (isMobile.any()) {
    document.body.classList.add('_touch');
} else {
    document.body.classList.add('_pc');
}

// Burger menu
const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
    iconMenu.addEventListener("click", function(e) {
        document.body.classList.toggle('_lock');
        iconMenu.classList.toggle("_active");
        menuBody.classList.toggle('_active');
    });
}

// Scroll on click

const menuLinks = document.querySelectorAll(".menu__link[data-goto]");
if (menuLinks.length > 0) {
    menuLinks.forEach(menuLink => {
       menuLink.addEventListener("click", onMenuLinkClick);
    });

    function onMenuLinkClick(e) {
        const menuLink = e.target;
        if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
            const gotoBlock = document.querySelector(menuLink.dataset.goto);
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

            if (iconMenu.classList.contains("_active")) {
                document.body.classList.remove("_lock");
                iconMenu.classList.remove('_active');
                menuBody.classList.remove('_active');
            }

            window.scrollTo({
                top: gotoBlockValue,
                behavior: "smooth"
            });
            e.preventDefault();
        }
    }
}

// Slider
var slideIndex = 1;
showSlides(slideIndex);

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("slide");
    var dots = document.getElementsByClassName("dot");

    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace("active","");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className+= " active";
}

// Modal windows

const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');

let unlock = true;

const timeout = 800;

if (popupLinks.length > 0) {
    for (let index = 0; index < popupLinks.length; index++) {
        const popupLink = popupLinks[index];
        popupLink.addEventListener("click", function (e) {
            const popupName = popupLink.getAttribute('href').replace('#', '');
            const currentPopup = document.getElementById(popupName);
            popupOpen(currentPopup);
            e.preventDefault();
        });
    }
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
    for (let index = 0; index < popupCloseIcon.length; index++) {
        const el = popupCloseIcon[index];
        el.addEventListener('click', function (e) {
            popupClose(el.closest('.popup'));
            e.preventDefault();
        });
    }
}

function popupOpen(currentPopup) {
    if (currentPopup && unlock) {
        const popupActive = document.querySelector('.popup.open');
        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }
        currentPopup.classList.add('open');
        currentPopup.addEventListener("click", function (e) {
            if (!e.target.closest('.popup__content') 
                && !e.target.closest('.popup_ingridients__content') 
                && !e.target.closest('.popup__video__content') 
                && !e.target.closest('.popup__map__content') 
                && !e.target.closest('.popup__franchise__content')) {
                    
                popupClose(e.target.closest('.popup'));
            }
        });
    }
}

function popupClose(popupActive, doUnlock = true) {
    if (unlock) {
        popupActive.classList.remove('open');
        if (doUnlock) {
            bodyUnLock();
        }
    }
}

function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

    if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = lockPaddingValue;
        }
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add('_lock-modal');

    unlock = false;
    setTimeout(function() {
        unlock = true;
    }, timeout);
}

function bodyUnLock() {
    setTimeout(function() {
        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = '0px';
            }
        }
        body.style.paddingRight = '0px';
        body.classList.remove('_lock-modal');
    }, timeout);

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

document.addEventListener('keydown', function (e) {
    if (e.which === 27) {
        const popupActive = document.querySelector('.popup.open');
        popupClose(popupActive);
    }
});

(function () {
    // We are checking support
    if (!Element.prototype.closest) {
        // We implement
        Element.prototype.closest = function (css) {
            var node = this;
            while (node) {
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        };
    }
})();
(function () {
    // We are checking support
    if (!Element.prototype.matches) {
        // We define the properties
        Element.prototype.matches = Element.prototype.matchesSelector ||
           Element.prototype.webkitMatchesSelector ||
           Element.prototype.mozMatchesSelector ||
           Element.prototype.msMatchesSelector;
    }
})();

// Form validation
document.addEventListener("DOMContentLoaded", function () {
    // Form validation on Popup 1
    const form = document.getElementById("form");
    form.addEventListener("submit", formSend);

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form);

        let formData = new FormData(form);

        if (error === 0) {
            form.reset();
            alert(`The form has been sent`);
        } else {
            alert(`Fill in the required fields!`);
        }
    }

    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req');

        for (let index = 0; index < formReq.length; index++) {
            const inputOther = formReq[index];
            formRemoveError(inputOther);

            if (inputOther.value === '') {
                formAddError(inputOther);
                error++;
            }
            
        }
        return error;
    }

    function formAddError(inputOther) {
        inputOther.parentElement.classList.add('_error');
        inputOther.classList.add("_error");
    }

    function formRemoveError(inputOther) {
        inputOther.parentElement.classList.remove('_error');
        inputOther.classList.remove("_error");
    }
    
    // Form validation on Popup 2
    const form2 = document.getElementById("form2");
    form2.addEventListener("submit", formSendForm2);

    async function formSendForm2(e) {
        e.preventDefault();

        let errorForm2 = formValidateForm2(form2);

        let formData = new FormData(form2);

        if (errorForm2 === 0) {
            form2.reset();
            alert(`The form has been sent`);
        } else {
            alert(`Fill in the required fields!`);
        }
    }

    function formValidateForm2(form2) {
        let errorForm2 = 0;
        let formReqForm2 = document.querySelectorAll('._reqForm2');

        for (let index = 0; index < formReqForm2.length; index++) {
            const inputOtherForm2 = formReqForm2[index];
            formRemoveError(inputOtherForm2);

            if (inputOtherForm2.value === '') {
                formAddError(inputOtherForm2);
                errorForm2++;
            }
            
        }
        return errorForm2;
    }

    function formAddError(inputOtherForm2) {
        inputOtherForm2.parentElement.classList.add('_error');
        inputOtherForm2.classList.add("_error");
    }

    function formRemoveError(inputOtherForm2) {
        inputOtherForm2.parentElement.classList.remove('_error');
        inputOtherForm2.classList.remove("_error");
    }

    // Form validation on Popup 3
    const form3 = document.getElementById("form3");
    form3.addEventListener("submit", formSendForm3);

    async function formSendForm3(e) {
        e.preventDefault();

        let errorForm3 = formValidateForm3(form3);

        let formData = new FormData(form3);

        if (errorForm3 === 0) {
            form3.reset();
            alert(`The form has been sent`);
        } else {
            alert(`Fill in the required fields!`);
        }
    }

    function formValidateForm3(form3) {
        let errorForm3 = 0;
        let formReqForm3 = document.querySelectorAll('._reqForm3');

        for (let index = 0; index < formReqForm3.length; index++) {
            const inputOtherForm3 = formReqForm3[index];
            formRemoveError(inputOtherForm3);

            if (inputOtherForm3.value === '') {
                formAddError(inputOtherForm3);
                errorForm3++;
            }
            
        }
        return errorForm3;
    }

    function formAddError(inputOtherForm3) {
        inputOtherForm3.parentElement.classList.add('_error');
        inputOtherForm3.classList.add("_error");
    }

    function formRemoveError(inputOtherForm3) {
        inputOtherForm3.parentElement.classList.remove('_error');
        inputOtherForm3.classList.remove("_error");
    }

    // Form validation on Popup 4
    const form4 = document.getElementById("form4");
    form4.addEventListener("submit", formSendForm4);

    async function formSendForm4(e) {
        e.preventDefault();

        let errorForm4 = formValidateForm4(form4);

        let formData = new FormData(form4);

        if (errorForm4 === 0) {
            form4.reset();
            alert(`The form has been sent`);
        } else {
            alert(`Fill in the required fields!`);
        }
    }

    function formValidateForm4(form4) {
        let errorForm4 = 0;
        let formReqForm4 = document.querySelectorAll('._reqForm4');

        for (let index = 0; index < formReqForm4.length; index++) {
            const inputOtherForm4 = formReqForm4[index];
            formRemoveError(inputOtherForm4);

            if (inputOtherForm4.value === '') {
                formAddError(inputOtherForm4);
                errorForm4++;
            }
            
        }
        return errorForm4;
    }

    function formAddError(inputOtherForm4) {
        inputOtherForm4.parentElement.classList.add('_error');
        inputOtherForm4.classList.add("_error");
    }

    function formRemoveError(inputOtherForm4) {
        inputOtherForm4.parentElement.classList.remove('_error');
        inputOtherForm4.classList.remove("_error");
    }

    // Form validation on Popup 7
    const formFranchise = document.getElementById("formFranchise");
    formFranchise.addEventListener("submit", formSendFranchise);

    async function formSendFranchise(e) {
        e.preventDefault();

        let errorFranchise = formValidateFranchise(formFranchise);

        let formDataFranchise = new FormData(formFranchise);

        if (errorFranchise === 0) {
            formFranchise.reset();
            alert(`The form has been sent`);
        } else {
            alert(`Fill in the required fields!`);
        }
    }

    function formValidateFranchise(formFranchise) {
        let errorFranchise = 0;
        let formReqFranchise = document.querySelectorAll('._reqFranchise');

        for (let index = 0; index < formReqFranchise.length; index++) {
            const inputFranchise = formReqFranchise[index];
            formRemoveErrorFranchise(inputFranchise);

           if (inputFranchise.classList.contains('_email')) {
                if (emailTestFranchise(inputFranchise)) {
                    formAddErrorFranchise(inputFranchise);
                    errorFranchise++;
                }
            } else {
                if (inputFranchise.value === '') {
                    formAddErrorFranchise(inputFranchise);
                    errorFranchise++;
                }
            }
            
        }
        return errorFranchise;
    }

    function formAddErrorFranchise(inputFranchise) {
        inputFranchise.parentElement.classList.add('_error');
        inputFranchise.classList.add("_error");
    }

    function formRemoveErrorFranchise(inputFranchise) {
        inputFranchise.parentElement.classList.remove('_error');
        inputFranchise.classList.remove("_error");
    }
    // Function for test email
    function emailTestFranchise(inputFranchise) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(inputFranchise.value);
    }
});