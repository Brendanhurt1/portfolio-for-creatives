(() => {
  const initialiseAmbientRibbons = () => {
    if (document.querySelector(".ps3-ribbon-background")) return;

    document.body.insertAdjacentHTML(
      "afterbegin",
      `<svg class="ps3-ribbon-background" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true">
        <g class="ps3-ribbon-broad-waves" fill="none" stroke="#ffefe1">
          <path class="ps3-ribbon-wave ps3-ribbon-wave--wide" data-wave="0" opacity="0.045" stroke-width="44" />
          <path class="ps3-ribbon-wave ps3-ribbon-wave--wide" data-wave="1" opacity="0.028" stroke-width="68" />
        </g>
        <g class="ps3-ribbon-waves" fill="none" stroke="#ffefe1">
          <path class="ps3-ribbon-wave" data-wave="0" opacity="0.20" stroke-width="2.4" />
          <path class="ps3-ribbon-wave" data-wave="1" opacity="0.14" stroke-width="1.8" />
          <path class="ps3-ribbon-wave" data-wave="2" opacity="0.09" stroke-width="1.3" />
          <path class="ps3-ribbon-wave" data-wave="3" opacity="0.04" stroke-width="1" />
          <path class="ps3-ribbon-wave" data-wave="4" opacity="0.07" stroke-width="3.6" />
        </g>
        <g class="ps3-ribbon-particles"></g>
      </svg>`
    );

    const backdrop = document.querySelector(".ps3-ribbon-background");
    const waves = Array.from(backdrop.querySelectorAll(".ps3-ribbon-wave"));
    const particleLayer = backdrop.querySelector(".ps3-ribbon-particles");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const svgNamespace = "http://www.w3.org/2000/svg";
    const waveSettings = [
      { baseline: 372, amplitude: 42, secondaryAmplitude: 16, speed: 0.00011, phase: 0.8 },
      { baseline: 438, amplitude: 34, secondaryAmplitude: 18, speed: 0.00009, phase: 3.1 },
      { baseline: 382, amplitude: 76, secondaryAmplitude: 28, speed: 0.00033, phase: 0.2 },
      { baseline: 430, amplitude: 58, secondaryAmplitude: 24, speed: 0.00026, phase: 1.8 },
      { baseline: 345, amplitude: 44, secondaryAmplitude: 20, speed: 0.00021, phase: 3.4 },
      { baseline: 474, amplitude: 92, secondaryAmplitude: 18, speed: 0.00017, phase: 4.9 },
      { baseline: 404, amplitude: 68, secondaryAmplitude: 35, speed: 0.00029, phase: 2.6 },
    ];

    const particles = Array.from({ length: 46 }, (_, index) => {
      const particle = document.createElementNS(svgNamespace, "circle");
      const seed = (index * 67.31) % 1;
      const particleData = {
        element: particle,
        x: seed * 1200,
        y: ((index * 41.73) % 1) * 800,
        speed: 0.00006 + ((index * 7.19) % 1) * 0.00009,
        drift: 7 + ((index * 19.83) % 1) * 18,
        phase: index * 0.73,
      };

      particle.setAttribute("r", `${0.75 + ((index * 13.17) % 1) * 1.65}`);
      particle.setAttribute("fill", "#ffefe1");
      particle.setAttribute("opacity", `${0.05 + ((index * 11.3) % 1) * 0.15}`);
      particleLayer.append(particle);
      return particleData;
    });

    const waveY = (x, time, setting) =>
      setting.baseline +
      Math.sin(x * 0.007 + time * setting.speed + setting.phase) * setting.amplitude +
      Math.cos(x * 0.014 - time * setting.speed * 0.72 + setting.phase) *
        setting.secondaryAmplitude;

    const drawWave = (path, setting, time) => {
      const points = [-140, 160, 460, 760, 1060, 1340].map((x) => [x, waveY(x, time, setting)]);
      let pathData = `M ${points[0][0]} ${points[0][1]}`;

      for (let index = 0; index < points.length - 1; index += 1) {
        const [x0, y0] = points[index];
        const [x1, y1] = points[index + 1];
        const distance = x1 - x0;
        pathData += ` C ${x0 + distance * 0.34} ${y0} ${x1 - distance * 0.34} ${y1} ${x1} ${y1}`;
      }

      path.setAttribute("d", pathData);
    };

    const render = (time) => {
      waves.forEach((wave, index) => drawWave(wave, waveSettings[index], time));
      particles.forEach((particle) => {
        const drift = time * particle.speed;
        const x = (particle.x + drift * 140) % 1240 - 20;
        const y = particle.y + Math.sin(drift + particle.phase) * particle.drift;
        particle.element.setAttribute("cx", `${x}`);
        particle.element.setAttribute("cy", `${y}`);
      });
    };

    let animationFrame;
    const animate = (time) => {
      render(time);
      animationFrame = window.requestAnimationFrame(animate);
    };

    render(0);
    if (!reducedMotion.matches) animationFrame = window.requestAnimationFrame(animate);
    reducedMotion.addEventListener?.("change", (event) => {
      window.cancelAnimationFrame(animationFrame);
      if (event.matches) render(0);
      else animationFrame = window.requestAnimationFrame(animate);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseAmbientRibbons, { once: true });
  } else {
    initialiseAmbientRibbons();
  }
})();
