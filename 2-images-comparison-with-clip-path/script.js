!(function () {
  const CIRCLE_CLIP_SIZE = 20;

  const ELLIPSE_CLIP_SIZE_X = 20;
  const ELLIPSE_CLIP_SIZE_Y = 15;

  const RECT_CLIP_SIZE_X = 10;
  const RECT_CLIP_SIZE_Y = 50;

  const SQUARE_CLIP_SIZE = 20;

  const POLYGON_CLIP_SIZE = 25;

  const STAR_CLIP_SIZE = 25;
  const STAR_INNER_CLIP_SIZE = 15;

  const lya_wrappers = document.querySelectorAll(".lya-image-compare-wrapper");
  lya_wrappers.forEach((wrapper) => {
    if (!wrapper) {
      return;
    }

    const cliped_image = wrapper.querySelector(".cliped-image");
    const event_overlay = wrapper.querySelector(".event-overlay");
    let clipMove;

    switch (true) {
      case wrapper.classList.contains("ellipse"):
        clipMove = clipEllipse(
          cliped_image,
          wrapper.dataset.sizeX ?? ELLIPSE_CLIP_SIZE_X,
          wrapper.dataset.sizeY ?? ELLIPSE_CLIP_SIZE_Y
        );
        break;
      case wrapper.classList.contains("square"):
        clipMove = clipSquare(
          cliped_image,
          wrapper.dataset.size ?? SQUARE_CLIP_SIZE
        );
        break;
      case wrapper.classList.contains("rect"):
        clipMove = clipRect(
          cliped_image,
          wrapper.dataset.sizeX ?? RECT_CLIP_SIZE_X,
          wrapper.dataset.sizeY ?? RECT_CLIP_SIZE_Y
        );
        break;
      case wrapper.classList.contains("polygon"):
        clipMove = clipPolygon(
          cliped_image,
          wrapper.dataset.size ?? POLYGON_CLIP_SIZE,
          wrapper.dataset.nth
        );
        break;
      case wrapper.classList.contains("star"):
        clipMove = clipStar(
          cliped_image,
          wrapper.dataset.size ?? STAR_CLIP_SIZE,
          wrapper.dataset.innerSize ?? STAR_INNER_CLIP_SIZE,
          wrapper.dataset.nth
        );
        break;
      case wrapper.classList.contains("cirlce"):
      default:
        clipMove = clipCircle(
          cliped_image,
          wrapper.dataset.size ?? CIRCLE_CLIP_SIZE
        );
        break;
    }

    event_overlay.addEventListener("mouseenter", (e) => {
      event_overlay.addEventListener("mousemove", clipMove);
    });

    event_overlay.addEventListener("mouseleave", (e) => {
      cliped_image.style.clipPath = clipCircleStr(0, 0, 0);
      event_overlay.removeEventListener("mousemove", clipMove);
    });

    event_overlay.addEventListener(
      "touchstart",
      (e) => {
        event_overlay.addEventListener("touchmove", clipMove, {
          passive: true,
        });
      },
      { passive: true }
    );

    event_overlay.addEventListener("touchend", (e) => {
      cliped_image.style.clipPath = clipCircleStr(0, 0, 0);
      event_overlay.removeEventListener("touchmove", clipMove);
    });
  });

  function clipCircle(cliped_image, clip_size) {
    return (e) => {
      const pos = getEventPos(cliped_image, e);
      cliped_image.style.clipPath = clipCircleStr(clip_size, pos.x, pos.y);
    };
  }

  function clipCircleStr(size, x, y) {
    return `circle(${size}% at ${x}% ${y}%)`;
  }

  function clipEllipse(cliped_image, clip_size_x, clip_size_y) {
    return (e) => {
      const pos = getEventPos(cliped_image, e);
      cliped_image.style.clipPath = clipEllipseStr(
        clip_size_x,
        clip_size_y,
        pos.x,
        pos.y
      );
    };
  }

  function clipEllipseStr(size_x, size_y, x, y) {
    return `ellipse(${size_x}% ${size_y}% at ${x}% ${y}%)`;
  }

  function clipRect(cliped_image, clip_size_x, clip_size_y) {
    return (e) => {
      const pos = getEventPos(cliped_image, e);
      cliped_image.style.clipPath = clipRectStr(
        clip_size_x,
        clip_size_y,
        pos.x,
        pos.y
      );
    };
  }

  function clipRectStr(size_x, size_y, x, y) {
    const h_x = size_x / 2;
    const h_y = size_y / 2;
    return `polygon(${x - h_x}% ${y - h_y}%, ${x + h_x}% ${y - h_y}%, ${
      x + h_x
    }% ${y + h_y}%, ${x - h_x}% ${y + h_y}%)`;
  }

  function clipSquare(cliped_image, clip_size) {
    return (e) => {
      const pos = getEventPos(cliped_image, e);
      cliped_image.style.clipPath = clipSquareStr(
        clip_size,
        pos.x,
        pos.y,
        pos.w,
        pos.h
      );
    };
  }

  function clipSquareStr(size, x, y, w, h) {
    const s = (size / 200) * w;
    const h_x = (s / w) * 100;
    const h_y = (s / h) * 100;
    return `polygon(${x - h_x}% ${y - h_y}%, ${x + h_x}% ${y - h_y}%, ${
      x + h_x
    }% ${y + h_y}%, ${x - h_x}% ${y + h_y}%)`;
  }

  function clipPolygon(cliped_image, clip_size, nth) {
    const n = nth && nth > 2 ? nth : 4;
    return (e) => {
      const pos = getEventPos(cliped_image, e);
      cliped_image.style.clipPath = clipPolygonStr(
        clip_size,
        pos.x,
        pos.y,
        pos.w,
        pos.h,
        n
      );
    };
  }

  function clipPolygonStr(size, x, y, w, h, n) {
    const s = (size / 200) * w;
    const rad = (2 * Math.PI) / n;
    const ori_xy = {
      x: 0,
      y: -s,
    };
    const points = Array.apply(null, { length: n })
      .map((it, i) => {
        const xy = newRotateXY(ori_xy, rad * i);
        const new_xy = {
          x: (xy.x / w) * 100 + x,
          y: (xy.y / h) * 100 + y,
        };
        return `${new_xy.x}% ${new_xy.y}%`;
      })
      .join(", ");

    return `polygon(${points})`;
  }

  function clipStar(cliped_image, clip_size, clip_size_inner, nth) {
    const n = nth && nth > 2 ? nth : 4;
    return (e) => {
      const pos = getEventPos(cliped_image, e);
      cliped_image.style.clipPath = clipStarStr(
        clip_size,
        clip_size_inner,
        pos.x,
        pos.y,
        pos.w,
        pos.h,
        n
      );
    };
  }

  function clipStarStr(size, size_inner, x, y, w, h, n) {
    const s = (size / 200) * w;
    const si = (size_inner / 200) * w;
    const rad = (2 * Math.PI) / n;

    const ori_inner_xy = {
      x: 0,
      y: -si,
    };

    const inner_points = Array.apply(null, { length: n }).map((it, i) => {
      const xy = newRotateXY(ori_inner_xy, rad * i + rad / 2);
      const new_xy = {
        x: (xy.x / w) * 100 + x,
        y: (xy.y / h) * 100 + y,
      };
      return `${new_xy.x}% ${new_xy.y}%`;
    });

    const ori_xy = {
      x: 0,
      y: -s,
    };
    const points = Array.apply(null, { length: n })
      .map((it, i) => {
        const xy = newRotateXY(ori_xy, rad * i);
        const new_xy = {
          x: (xy.x / w) * 100 + x,
          y: (xy.y / h) * 100 + y,
        };
        return `${new_xy.x}% ${new_xy.y}%`;
      })
      .map((p, i) => {
        return `${p}, ${inner_points[i]}`;
      })
      .join(", ");

    return `polygon(${points})`;
  }

  function getEventPos(cliped_image, e) {
    const rect = cliped_image.getBoundingClientRect();
    const w = cliped_image.clientWidth;
    const h = cliped_image.clientHeight;
    const clientX = e.clientX ?? e.changedTouches[0].clientX;
    const clientY = e.clientY ?? e.changedTouches[0].clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const pos_x = (x / w) * 100;
    const pos_y = (y / h) * 100;
    return {
      x: pos_x,
      y: pos_y,
      w: w,
      h: h,
    };
  }

  function newRotateXY(xy, rad) {
    const x = xy.x;
    const y = xy.y;
    return {
      x: x * Math.cos(rad) - y * Math.sin(rad),
      y: x * Math.sin(rad) + y * Math.cos(rad),
    };
  }
})();
