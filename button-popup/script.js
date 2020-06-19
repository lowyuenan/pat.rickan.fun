!(function () {
  const RAD_CIRCLE = Math.PI * 2;
  const RAD_HALF_CIRCLE = Math.PI;
  const RAD_QUATER_CIRCLE = Math.PI / 2;
  const MINOR_DIS = 5;

  const wrappers = document.querySelectorAll(".lya-social-button");

  wrappers.forEach((wrapper) => {
    if (!wrapper) {
      return;
    }

    const active_btn = wrapper.querySelector(".share");

    active_btn.addEventListener("click", activeButton(wrapper));
  });

  function activeButton(wrapper) {
    const btn_wrappers = wrapper.querySelectorAll(".buttons");
    let interval_rads = [];
    let ori_xy;
    let curr_wrapper_size = 0;

    btn_wrappers.forEach((btn_wrapper) => {
      let interval_rad;
      let min_wrapper_size;
      let diameter;

      const btns = btn_wrapper.querySelectorAll("li");
      const total_btn = btns.length;
      if (!btns[0]) {
        interval_rads.push(0);
        return;
      }
      const btn_size = btns[0].clientWidth;

      switch (true) {
        case wrapper.classList.contains("lya-top-left"):
          interval_rad =
            total_btn === 1
              ? RAD_QUATER_CIRCLE
              : RAD_QUATER_CIRCLE / (total_btn - 1);
          diameter =
            (2 * (btn_size + MINOR_DIS)) / (2 * Math.sin(interval_rad / 2));
          ori_xy = {
            x: 50,
            y: 0,
          };
          break;
        case wrapper.classList.contains("lya-top-right"):
          interval_rad =
            total_btn === 1
              ? RAD_QUATER_CIRCLE
              : RAD_QUATER_CIRCLE / (total_btn - 1);
          diameter =
            (2 * (btn_size + MINOR_DIS)) / (2 * Math.sin(interval_rad / 2));
          ori_xy = {
            x: 0,
            y: 50,
          };
          break;
        case wrapper.classList.contains("lya-bottom-left"):
          interval_rad =
            total_btn === 1
              ? RAD_QUATER_CIRCLE
              : RAD_QUATER_CIRCLE / (total_btn - 1);
          diameter =
            (2 * (btn_size + MINOR_DIS)) / (2 * Math.sin(interval_rad / 2));
          ori_xy = {
            x: 0,
            y: -50,
          };
          break;
        case wrapper.classList.contains("lya-bottom-right"):
          interval_rad =
            total_btn === 1
              ? RAD_QUATER_CIRCLE
              : RAD_QUATER_CIRCLE / (total_btn - 1);
          diameter =
            (2 * (btn_size + MINOR_DIS)) / (2 * Math.sin(interval_rad / 2));
          ori_xy = {
            x: -50,
            y: 0,
          };
          break;
        case wrapper.classList.contains("lya-top"):
          interval_rad =
            total_btn === 1
              ? RAD_HALF_CIRCLE
              : RAD_HALF_CIRCLE / (total_btn - 1);
          diameter =
            (2 * (btn_size + MINOR_DIS)) / (2 * Math.sin(interval_rad / 2));
          ori_xy = {
            x: 50,
            y: 0,
          };
          break;
        case wrapper.classList.contains("lya-right"):
          interval_rad =
            total_btn === 1
              ? RAD_HALF_CIRCLE
              : RAD_HALF_CIRCLE / (total_btn - 1);
          diameter =
            (2 * (btn_size + MINOR_DIS)) / (2 * Math.sin(interval_rad / 2));
          ori_xy = {
            x: 0,
            y: 50,
          };
          break;
        case wrapper.classList.contains("lya-bottom"):
          interval_rad =
            total_btn === 1
              ? RAD_HALF_CIRCLE
              : RAD_HALF_CIRCLE / (total_btn - 1);
          diameter =
            (2 * (btn_size + MINOR_DIS)) / (2 * Math.sin(interval_rad / 2));
          ori_xy = {
            x: -50,
            y: 0,
          };
          break;
        case wrapper.classList.contains("lya-left"):
          interval_rad =
            total_btn === 1
              ? RAD_HALF_CIRCLE
              : RAD_HALF_CIRCLE / (total_btn - 1);
          diameter =
            (2 * (btn_size + MINOR_DIS)) / (2 * Math.sin(interval_rad / 2));
          ori_xy = {
            x: 0,
            y: -50,
          };
          break;
        case wrapper.classList.contains("lya-center"):
        default:
          interval_rad = RAD_CIRCLE / total_btn;
          diameter =
            (2 * (btn_size + MINOR_DIS)) / (2 * Math.sin(interval_rad / 2));
          ori_xy = {
            x: 50,
            y: 0,
          };
          break;
      }

      const curr_min = curr_wrapper_size + 2 * (btn_size + MINOR_DIS);
      min_wrapper_size = diameter > curr_min ? diameter : curr_min;

      interval_rads.push(interval_rad);

      btn_wrapper.style.minWidth = `${min_wrapper_size}px`;
      btn_wrapper.style.minHeight = `${min_wrapper_size}px`;
      curr_wrapper_size = min_wrapper_size;
    });

    let is_active = false;
    return (e) => {
      is_active
        ? close(btn_wrappers)
        : pop(btn_wrappers, interval_rads, ori_xy);
      is_active = !is_active;
    };
  }

  function pop(btn_wrappers, interval_rads, xy) {
    btn_wrappers.forEach((btn_wrapper, j) => {
      const btns = btn_wrapper.querySelectorAll("li");
      btns.forEach((btn, i) => {
        const new_xy = convertXY(newRotateXY(xy, interval_rads[j] * i));
        btn.style.left = `${new_xy.x}%`;
        btn.style.top = `${new_xy.y}%`;
        btn.classList.add("pop");
      });
    });
  }

  function close(btn_wrappers) {
    btn_wrappers.forEach((btn_wrapper, j) => {
      const btns = btn_wrapper.querySelectorAll("li");
      btns.forEach((btn, i) => {
        btn.style.left = "50%";
        btn.style.top = "50%";
        btn.classList.remove("pop");
      });
    });
  }

  function newRotateXY(xy, rad) {
    const x = xy.x;
    const y = xy.y;
    return {
      x: x * Math.cos(rad) - y * Math.sin(rad),
      y: x * Math.sin(rad) + y * Math.cos(rad),
    };
  }

  function convertXY(xy) {
    return {
      x: xy.x + 50,
      y: xy.y + 50,
    };
  }
})();
