const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");
const dateTime = document.querySelector(".time");

menuToggle.addEventListener("click", () => {
  navigation.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

function addZero(n) {
  return n < 10 ? `0${n}` : n;
}
function getTime() {
  const time = new Date();
  dateTime.innerHTML = `${addZero(time.getDate())} / ${addZero(
    time.getMonth() + 1
  )} / ${time.getFullYear()}</br>${addZero(time.getHours())}:${addZero(
    time.getMinutes()
  )}:${addZero(time.getSeconds())}`;

  setTimeout(getTime, 1000);
}

getTime();
