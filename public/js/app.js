const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".mobile-navlinks");
const menuClose = document.querySelector(".close");

menuToggle.addEventListener("click", () => {
  navigation.classList.add("active");
});

menuClose.addEventListener("click", () => {
  navigation.classList.remove("active");
});
