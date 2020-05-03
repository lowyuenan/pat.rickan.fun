var wrapper = document.querySelector(".wrapper");
var photo = document.querySelector(".photo-wrapper-2");
var separator = document.querySelector(".separator");
var wrapper_width = wrapper.clientWidth;

wrapper.addEventListener("mousemove", function (e) {
  var bound = e.target.getBoundingClientRect();
  var x = e.clientX - bound.left;
  var width = (x / wrapper_width) * 100;
  photo.style.clipPath =
    "polygon(0 0, " + width + "% 0, " + width + "% 100%, 0 100%)";

  separator.style.left = (x / wrapper_width) * 100 + "%";
});
