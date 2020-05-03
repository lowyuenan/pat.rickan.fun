var default_time = 5;
var count_interval;
var timer = document.querySelector(".timer p");
var timer_btn = document.querySelector(".timer-btn");
var time_input = document.querySelector(".time-input");
var reset_btn = document.querySelector(".reset-btn");
var time_up = document.querySelector(".time-up");

time_input.addEventListener("input", function (e) {
  clearInterval(count_interval);
  default_time = parseFloat(e.currentTarget.value) || default_time;
  timer.innerText = default_time.toFixed(3) + "s";
});

timer_btn.addEventListener("click", function (e) {
  clearInterval(count_interval);
  var total = new Date().getTime() + default_time * 1000;
  count_interval = setInterval(function () {
    if ((total - new Date().getTime()) / 1000 < 0) {
      clearInterval(count_interval);
      timer.innerText = "0.000s";
      time_up.classList.add("show");
    } else {
      timer.innerText =
        ((total - new Date().getTime()) / 1000).toFixed(3) + "s";
    }
  });
});

reset_btn.addEventListener("click", function (e) {
  time_up.classList.remove("show");
});
