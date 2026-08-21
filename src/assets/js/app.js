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

      // if any scroll is attempted, set this to the previous value;
      window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop);
      };
    }

    enableScroll() {
      window.onscroll = function () {};
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
    const num = xl.matches ? 50 : 100;
    if (currentScrollPos > num) {
      header.classList.add("header--active");
    } else {
      header.classList.remove("header--active");
    }
    if (prevScrollpos >= currentScrollPos) {
      header.classList.remove("out");
    } else {
      header.classList.add("out");
    }
    prevScrollpos = currentScrollPos;
  }

  function initHeader() {
    var currentScrollPos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    const num = xl.matches ? 50 : 150;
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

  class ReviewsShowMore extends window.HTMLElement {
    connectedCallback() {
      this.init();
    }
    init() {
      if (this.classList.contains("inited")) {
        return;
      }

      this.addEventListener("click", function () {
        this.classList.toggle("active");
      });
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
});
