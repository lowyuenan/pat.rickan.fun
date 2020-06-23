!(function () {
  const DEFAULT_FROM_TO = [
    { dim: 5 },
    { dim: 5 },
    { dim: 11, star: true, dep: 70 },
    { dim: 11, star: true, dep: 70 },
    { dim: 4 },
    { dim: 4 },
    { dim: 16 },
    { dim: 16 },
    { dim: 7, star: true },
    { dim: 7, star: true },
    { dim: 20 },
    { dim: 20 },
    { dim: 5 },
  ];

  const DEFAULT_DEP = 50;

  function init() {
    const polygon = document.querySelectorAll(".lya-polygon-animation");
    const style = document.querySelector(".lya-keyframe");

    const dims = DEFAULT_FROM_TO;
    const maxDim = Math.max.apply(
      null,
      dims.map((it) => (it.star ? it.dim * 2 : it.dim))
    );

    const clipPathStrs = dims
      .map((d) => {
        const points = clipPolygonStr(d.dim);
        if (d.star) {
          const dep = d.dep || DEFAULT_DEP;
          const innerPoints = clipStarStr(d.dim, dep);
          return Array.apply(null, { length: points.length * 2 }).map((p, i) =>
            i % 2 === 0 ? points[i / 2] : innerPoints[(i - 1) / 2]
          );
        }
        return points;
      })
      .map((ps) => insertBlankPoint(ps, maxDim))
      .map(getClip);

    style.innerHTML = getKeyFrame(clipPathStrs);
  }

  init();

  function getKeyFrame(clipPathStrs) {
    const frameDistance = 100 / (clipPathStrs.length - 1);
    const steps = clipPathStrs.map((c, i) => {
      return `${Math.round(frameDistance * i * 100) / 100}% {${c}}`;
    });
    return `@keyframes changePolygonDim {${steps.join(" ")}}`;
  }

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

  function insertBlankPoint(pStrs, maxDim) {
    const length = pStrs.length;
    const distance = maxDim / length;
    const points = Array.apply(null, { length: maxDim }).map(
      (it, i) => pStrs[Math.round(i / distance) % length]
    );
    return points;
  }

  function getClip(points) {
    return `clip-path: polygon(${points.join(", ")})`;
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
