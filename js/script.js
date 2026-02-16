// window.addEventListener('load', function () {
//   const userAgent = window.navigator.userAgent.toLowerCase();
//   const isAppleDevice = /macintosh|macintel|macppc|mac68k|iphone|ipad|ipod/.test(userAgent);

//   if (isAppleDevice) {
//       document.body.classList.add('is-apple-device');
//   }
// });

window.addEventListener("load", function () {
  const linkElement = document.querySelector(
    'link[rel="stylesheet"][href*="style.css"]'
  );
  if (linkElement) {
    const newHref = `${
      linkElement.getAttribute("href").split("?")[0]
    }?v=${new Date().getTime()}`;
    linkElement.setAttribute("href", newHref);
  }
});

// Sticky Header
const header = document.querySelector(".header_wrapper");
const content = header.nextElementSibling; // Выбираем следующий элемент после header_wrapper
let scrollOffset = 50;

function stickyHeader() {
  let scrollPosition = window.scrollY || document.documentElement.scrollTop;

  if (scrollPosition > scrollOffset) {
    header.classList.add("sticky_header");
    content.style.marginTop = `${header.offsetHeight}px`; // Добавляем отступ равный высоте шапки
  } else {
    header.classList.remove("sticky_header");
    content.style.marginTop = "0"; // Сбрасываем отступ
  }
}

// Проверка текущей прокрутки страницы
function checkScrollOnLoad() {
  stickyHeader();
}

// Добавляем слушатели событий
window.addEventListener("scroll", stickyHeader);
window.addEventListener("load", checkScrollOnLoad); // При загрузке страницы

// Блок аккордеон "РАЗВЕРНУТЬ/СКРЫТЬ"
document.querySelectorAll(".btn_accordion").forEach((button) => {
  const { defaultText, alternateText } = button.dataset;

  if (!defaultText || !alternateText) {
    console.warn("Missing data attributes on button:", button);
    return; // Прерываем, если атрибутов нет
  }

  button.addEventListener("click", () => {
    const accordion = button.closest(".cases_left_accordion");
    if (accordion) {
      const isActive = accordion.classList.toggle("active");
      button.textContent = isActive ? alternateText : defaultText;
    }
  });
});

// КНОПКА В ШАПКЕ БУРГЕР
// Добавляем обработчик клика к документу
document.addEventListener("click", function (event) {
  const bodyFixed = document.querySelector("body");
  const headerWrapper = document.querySelector(".header_inner");
  const navbarToggle = headerWrapper
    ? headerWrapper.querySelector(".mobile_button")
    : null;
  const navigationWrapper = document.querySelector(".navigation_header");
  const menu = navigationWrapper
    ? navigationWrapper.querySelector(".navigation_inner")
    : null;

  if (navbarToggle && menu) {
    if (navbarToggle.contains(event.target)) {
      bodyFixed.classList.toggle("fixed");
      navbarToggle.classList.toggle("active");
      navigationWrapper.classList.toggle("active");
      menu.classList.toggle("active");
    } else {
      bodyFixed.classList.remove("fixed");
      navbarToggle.classList.remove("active");
      navigationWrapper.classList.remove("active");
      menu.classList.remove("active");
    }
  }
});

// СКРИПТ СЕЛЕКТА ДЛЯ ВЫБОРА В ФОРМЕ
document.querySelectorAll(".select_menu").forEach((menu) => {
  menu.addEventListener("click", function () {
    this.parentElement.classList.toggle("open");
    this.nextElementSibling.classList.toggle("open"); // Добавляем/удаляем класс для .select_menu_options
  });
});

// Выбор элемента
document.querySelectorAll(".select_item").forEach((option) => {
  option.addEventListener("click", function () {
    const wrapper = this.closest(".select_menu_wrapper");

    // Записываем выбранное значение в видимую часть меню
    wrapper.querySelector(".menu_selected").textContent = this.textContent;

    // Записываем значение в скрытый input для отправки формы
    document.getElementById("selected-value").value =
      this.getAttribute("data-value");

    // Убираем класс open
    wrapper.classList.remove("open");
    this.closest(".select_menu_options").classList.remove("open");

    // Скрываем все блоки для ввода, удаляя класс "hidden"
    document.querySelector(".form_show_telegram").classList.add("hidden");
    document.querySelector(".form_show_whatsapp").classList.add("hidden");

    // Показываем соответствующий блок на основании выбранного мессенджера, убирая класс "hidden"
    if (this.getAttribute("data-value") === "telegram") {
      document.querySelector(".form_show_telegram").classList.remove("hidden");
    } else if (this.getAttribute("data-value") === "whatsapp") {
      document.querySelector(".form_show_whatsapp").classList.remove("hidden");
    }
  });
});

document.addEventListener("click", function (e) {
  const selectWrapper = document.querySelector(".select_menu_wrapper");
  if (!selectWrapper.contains(e.target)) {
    selectWrapper.classList.remove("open");
    document.querySelector(".select_menu_options").classList.remove("open"); // Закрываем список опций
  }
});

// Открытие формы при клике на кнопку
document.querySelectorAll(".open-form-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const formId = this.getAttribute("data-form"); // Получаем ID формы из data-атрибута
    const dialog = document.getElementById(formId); // Находим соответствующий dialog
    dialog.showModal(); // Открываем нужную форму

    // Добавляем класс на body при открытии формы
    document.body.classList.add("dialog-open");

    // Закрытие при клике вне формы
    dialog.addEventListener("click", function (event) {
      // Проверяем, был ли клик сделан именно на dialog (вне формы)
      if (event.target === dialog) {
        dialog.close(); // Закрываем форму, если клик вне
        document.body.classList.remove("dialog-open");
      }
    });
  });
});

// Закрытие формы при клике на кнопку закрытия
document.querySelectorAll(".close_button").forEach((btn) => {
  btn.addEventListener("click", function () {
    const dialog = this.closest("dialog"); // Находим ближайший dialog
    dialog.close(); // Закрываем форму

    // Удаляем класс с body при закрытии формы
    document.body.classList.remove("dialog-open");
  });
});

// заполнение формы
// Находим все кнопки с классом btn_form_submit
document.querySelectorAll(".btn_form_submit").forEach((button) => {
  button.addEventListener("click", function (event) {
    // Находим ближайшую форму с классом form_inner для текущей кнопки
    const form = this.closest(".form_inner");
    if (!form) return; // Если форма не найдена, ничего не делаем

    const inputs = form.querySelectorAll(
      "input[required], textarea[required], select[required]"
    ); // Находим все обязательные поля

    let isFormValid = true; // Флаг для проверки формы

    // Проходим по каждому обязательному полю
    inputs.forEach((input) => {
      const wrapper = input.closest(".form_input_wrapper"); // Находим обертку для поля

      // Удаляем класс error, если был добавлен ранее
      if (wrapper) {
        wrapper.classList.remove("error");
      }

      // Если поле не заполнено
      if (!input.value) {
        isFormValid = false;
        // Добавляем класс error к обертке
        if (wrapper) {
          wrapper.classList.add("error");
        }
      }
    });

    // Если все поля заполнены, форма считается валидной
    if (isFormValid) {
      console.log("Форма успешно заполнена");
    } else {
      console.log("Заполните все обязательные поля");
    }
  });
});

// Обработчик клика на элемент с классом send_resume
document.querySelectorAll(".send_resume").forEach((button) => {
  button.addEventListener("click", function () {
    // Добавляем класс hidden к блоку form_inner
    document.querySelector("#form3 .form_inner").classList.add("hidden");

    // Добавляем класс visible к блоку form_thanks
    document.querySelector("#form3 .form_thanks").classList.add("visible");
  });
});

// LOTTIE АНИМАЦИИ
// Функция для инициализации Lottie-анимации
function initLottieAnimation(container, animationData) {
  return lottie.loadAnimation({
    container: container, // Контейнер для текущей анимации
    renderer: "svg",
    loop: animationData.loop,
    autoplay: animationData.autoplay,
    path: animationData.path,
  });
}

// Массив с данными для каждой анимации
const animations = [
  {
    className: "hero_anim_icon1",
    path: "./animation/star_blue.json",
    loop: true,
    autoplay: true,
  },
  {
    className: "hero_anim_icon2",
    path: "./animation/chat_blue.json",
    loop: true,
    autoplay: true,
  },
  {
    className: "hero_anim_icon3",
    path: "./animation/prilogenie_blue.json",
    loop: true,
    autoplay: true,
  },
  {
    className: "tochki",
    path: "./animation/3_tochki.json",
    loop: true,
    autoplay: true,
  },
];

// Инициализация всех анимаций через один скрипт
animations.forEach((animationData) => {
  // Находим все элементы с заданным классом
  const elements = document.querySelectorAll(`.${animationData.className}`);

  // Для каждого элемента запускаем анимацию
  elements.forEach((container) => {
    initLottieAnimation(container, animationData);
  });
});

// фикс для айфона
function updateVH() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

window.addEventListener("resize", updateVH);
window.addEventListener("orientationchange", updateVH);
updateVH();
