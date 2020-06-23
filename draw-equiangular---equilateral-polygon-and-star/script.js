!(function () {
  const DEFAULT_DIM = 5;
  const DEFAULT_DEP = 50;

  const polygons = document.querySelectorAll(".lya-nth-polygon.lya-polygon");
  const stars = document.querySelectorAll(".lya-nth-polygon.lya-star");
  polygons.forEach((polygon) => {
    const dim =
      polygon.dataset.dim && polygon.dataset.dim > 2
        ? polygon.dataset.dim
        : DEFAULT_DIM;
    polygon.style.clipPath = getPath(clipPolygonStr(dim));
  });

  stars.forEach((star) => {
    const dim =
      star.dataset.dim && star.dataset.dim > 2 ? star.dataset.dim : DEFAULT_DIM;
    const dep =
      star.dataset.dep && star.dataset.dep > 0 ? star.dataset.dep : DEFAULT_DEP;
    const inners = clipStarStr(dim, dep);
    const points = clipPolygonStr(dim).map((p, i) => `${p}, ${inners[i]}`);
    star.style.clipPath = getPath(points);
  });

  function clipPolygonStr(n) {
    const rad = (2 * Math.PI) / n;
    const ori_xy = {
      x: 0,
      y: -50,
    };
    return Array.apply(null, { length: n }).map((it, i) => {
      const new_xy = convertXY(newRotateXY(ori_xy, rad * i));
      return `${new_xy.x}% ${new_xy.y}%`;
    });
  }

  function clipStarStr(n, d) {
    const rad = (2 * Math.PI) / n;
    const ori_xy = {
      x: 0,
      y: -d / 2,
    };
    return Array.apply(null, { length: n }).map((it, i) => {
      const new_xy = convertXY(newRotateXY(ori_xy, rad * i + rad / 2));
      return `${new_xy.x}% ${new_xy.y}%`;
    });
  }

  function getPath(points) {
    return `polygon(${points.join(", ")})`;
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
