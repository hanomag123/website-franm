document.addEventListener("DOMContentLoaded", () => {
  const xl = matchMedia("(max-width: 1024px)");

  class Menu {
    constructor(menuElement, buttonElement) {
      this.menu =
        typeof menuElement === "string"
          ? document.querySelector(menuElement)
          : menuElement;
      this.button =
        typeof buttonElement === "string"
          ? document.querySelector(buttonElement)
          : buttonElement;
      this.overlay = document.createElement("div");
      this.overlay.hidden = true;
      this._init();
    }

    _init() {
      document.body.appendChild(this.overlay);
      this.overlay.classList.add("overlay");

      this.overlay.addEventListener("click", this.toggleMenu.bind(this));
      this.button.addEventListener("click", this.toggleMenu.bind(this));
    }

    toggleMenu() {
      this.menu.classList.toggle("menu--open");
      this.button.classList.toggle("menu-button--active");
      this.overlay.hidden = !this.overlay.hidden;

      if (this.isMenuOpen()) {
        this.disableScroll();
      } else {
        this.enableScroll();
      }
    }

    closeMenu() {
      this.menu.classList.remove("header__nav--active");
      this.button.classList.remove("header__menu-button--active");
      this.overlay.hidden = true;

      this.enableScroll();
    }

    isMenuOpen() {
      return this.menu.classList.contains("menu--open");
    }

    disableScroll() {
      // Get the current page scroll position;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

      document.documentElement.classList.add("menu-opened");

      // if any scroll is attempted, set this to the previous value;
      window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop);
      };
    }

    enableScroll() {
      window.onscroll = function () {};
      document.documentElement.classList.remove("menu-opened");
    }
  }

  const menu = document.querySelector(".menu");
  const menuButton = document.querySelector(".menu-button");

  if (menu && menuButton) {
    new Menu(menu, menuButton);
  }

  const header = document.querySelector("header");

  let handler;

  function scrollAdd() {
    /* ... */
    handler = throttle(function (event) {
      scrollHeader();
    }, 500);
    document.addEventListener("scroll", handler, false);
  }

  function scrollRemove() {
    /* ... */
    document.removeEventListener("scroll", handler, false);
  }

  if (xl.matches) {
    scrollAdd();
    document.removeEventListener("scroll", scrollHeader);
  } else {
    document.addEventListener("scroll", scrollHeader);
    scrollRemove();
  }

  xl.addEventListener("change", () => {
    if (xl.matches) {
      document.removeEventListener("scroll", scrollHeader);
      scrollAdd();
    } else {
      document.addEventListener("scroll", scrollHeader);
      scrollRemove();
    }
  });

  function disableScroll() {
    // Get the current page scroll position;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    document.documentElement.style.setProperty("scroll-behavior", "auto");

    // if any scroll is attempted, set this to the previous value;
    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  function enableScroll() {
    document.documentElement.style.setProperty("scroll-behavior", null);
    window.onscroll = function () {};
  }

  var prevScrollpos =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop;
  function scrollHeader() {
    var currentScrollPos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    if (currentScrollPos < 0) {
      currentScrollPos = 0;
      prevScrollpos = 0;
    }
    if (prevScrollpos < 0) {
      prevScrollpos = 0;
      currentScrollPos = 0;
    }
    const num = xl.matches ? 150 : 150;
    const num2 = xl.matches ? 400 : 250;
    if (currentScrollPos > num2) {
      header.classList.add('header--active2')
    } else {
      header.classList.remove('header--active2')
    }
    if (currentScrollPos > num) {
      header.classList.add("header--active");
    } else {
      header.classList.remove("header--active");
    }
    if (prevScrollpos >= currentScrollPos) {
      header.classList.remove("out");
      header.classList.add('up')
    } else {
      header.classList.add("out");
      header.classList.remove('up')
    }
    prevScrollpos = currentScrollPos;
  }

  function initHeader() {
    var currentScrollPos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    const num = xl.matches ? 150 : 150;
    if (currentScrollPos > num) {
      header.classList.add("header--active");
    } else {
      header.classList.remove("header--active");
    }
  }

  initHeader();

  function throttle(func, ms) {
    let isThrottled = false,
      savedArgs,
      savedThis;

    function wrapper() {
      if (isThrottled) {
        // (2);
        savedArgs = arguments;
        savedThis = this;
        return;
      }

      func.apply(this, arguments); // (1);

      isThrottled = true;

      setTimeout(function () {
        isThrottled = false; // (3);
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }

    return wrapper;
  }

  function addMask() {
    [].forEach.call(
      document.querySelectorAll('input[type="tel"]'),
      function (input) {
        let keyCode;
        function mask(event) {
          event.keyCode && (keyCode = event.keyCode);
          let pos = this.selectionStart;
          if (pos < 3) event.preventDefault();
          let matrix = "+7 (___) ___-__-__",
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, ""),
            new_value = matrix.replace(/[_\d]/g, function (a) {
              return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
            });
          i = new_value.indexOf("_");
          if (i != -1) {
            i < 5 && (i = 3);
            new_value = new_value.slice(0, i);
          }
          let reg = matrix
            .substr(0, this.value.length)
            .replace(/_+/g, function (a) {
              return "\\d{1," + a.length + "}";
            })
            .replace(/[+()]/g, "\\$&");
          reg = new RegExp("^" + reg + "$");
          if (
            !reg.test(this.value) ||
            this.value.length < 5 ||
            (keyCode > 47 && keyCode < 58)
          )
            this.value = new_value;
          if (event.type == "blur" && this.value.length < 5) {
            this.value = "";
            this.classList.remove("havetext");
          }
        }

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false);
        input.value
          ? input.classList.add("havetext")
          : input.classList.remove("havetext");
      },
    );
  }
  addMask();

  const swipers = document.querySelectorAll(".good-swiper");
  if (swipers.length) {
    swipers.forEach((swiper) => {
      const pagination = swiper.querySelector(".swiper-pagination");

      new Swiper(swiper, {
        slidesPerView: "auto",
        grabCursor: true,
        pagination: {
          el: pagination,
          clickable: true,
        },
      });
    });
  }

  const reviewspopup = document.getElementById("reviews-popup");
  if (reviewspopup) {
    const closebtn = reviewspopup.querySelector(".reviews-close");

    if (closebtn) {
      closebtn.addEventListener("click", function () {
        reviewspopup.classList.remove("opened");
        document.documentElement.classList.remove("disable-scroll");
      });
    }
    reviewspopup.addEventListener("click", function (event) {
      if (event.target.classList.contains("reviews-overlay")) {
        reviewspopup.classList.remove("opened");
        document.documentElement.classList.remove("disable-scroll");
      }
    });
  }
  class ReviewsShowMore extends window.HTMLElement {
    connectedCallback() {
      this.popup = this.nextElementSibling.classList.contains("reviews-overlay")
        ? this.nextElementSibling
        : null;
      this.content = this.parentElement;

      this.init();
    }
    init() {
      if (this.classList.contains("inited")) {
        return;
      }
      this.inner = reviewspopup.querySelector(".reviews-inner");

      this.addEventListener("click", function () {
        this.classList.toggle("active");

        if (xl.matches && reviewspopup) {
          if (this?.content && this?.inner) {
            this.inner.innerHTML = this.content.innerHTML;
            const showmore = this.inner.querySelector("reviews-showmore");
            if (showmore) {
              showmore.remove();
            }
          }
          reviewspopup.classList.add("opened");
          document.documentElement.classList.add("disable-scroll");
        }
      });

      this.classList.add("inited");
    }
  }
  if (!customElements.get("reviews-showmore")) {
    window.customElements.define("reviews-showmore", ReviewsShowMore);
  }

  const reviews = document.querySelectorAll(".reviews-swiper");
  if (reviews.length) {
    reviews.forEach((swiper) => {
      const slides = swiper.querySelectorAll(".swiper-slide");
      const pagination = swiper.querySelector(".swiper-pagination");

      new Swiper(swiper, {
        slidesPerView: "auto",
        grabCursor: true,
        loop: slides?.length > 3,
        pagination: {
          el: pagination,
          clickable: true,
        },
        on: {
          beforeTransitionStart: () => {
            const showmore = swiper.querySelectorAll(".reviews-showmore");
            if (showmore.length) {
              showmore.forEach((el) => {
                el.classList.remove("active");
              });
            }
          },
        },
      });
    });
  }

  // Полный вариант с установкой cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
  }

  const cookieShown = getCookie("cookie_shown");

  if (cookieShown !== "true") {
    const cookieItem = document.querySelector("[data-cookies]");
    if (cookieItem) {
      setTimeout(() => {
        cookieItem.classList.add("_active");

        const acceptBtn = cookieItem.querySelector("[data-cookies-accept]");
        if (acceptBtn) {
          acceptBtn.addEventListener("click", () => {
            setCookie("cookie_shown", "true", 365);
            cookieItem.classList.remove("_active");
          });
        }
      }, 100);
    }
  }

  const modals = document.querySelectorAll(".modal");

  if (modals.length) {
    modals.forEach((el) => {
      el.openModal = function () {
        document.documentElement.classList.add("modal-opened");
        el.classList.add("open");
      };
      el.closeModal = function () {
        document.documentElement.classList.remove("modal-opened");
        el.classList.remove("open");
      };
      el.addEventListener("click", function (event) {
        if (event.target.classList.contains("modal")) {
          el.closeModal();
        }
      });
    });
  }

  const closebtns = document.querySelectorAll("[data-close-modal]");
  if (closebtns.length) {
    closebtns.forEach((el) => {
      el.addEventListener("click", function () {
        const modal = this.closest(".modal");
        if (modal && "closeModal" in modal) {
          modal.closeModal();
        }
      });
    });
  }

  document.addEventListener("click", (event) => {
    const closest = event.target.closest("[data-modal]");
    if (closest) {
      const modal = document.getElementById(closest.dataset.modal);
      if (modal) {
        modal.openModal();
      }
    }
  });
});
