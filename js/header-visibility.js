(() => {
  const initialise = () => {
    const navigation = document.querySelector(".site-navigation");
    if (!navigation) return;

    const directionThreshold = 8;
    let lastScrollY = Math.max(0, window.scrollY);
    let isTicking = false;

    const updateNavigation = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      const scrollDistance = currentScrollY - lastScrollY;
      const revealZone = navigation.offsetHeight;

      if (currentScrollY <= revealZone) {
        navigation.classList.remove("is-scroll-hidden");
      } else if (scrollDistance > directionThreshold) {
        navigation.classList.add("is-scroll-hidden");
        lastScrollY = currentScrollY;
      } else if (scrollDistance < -directionThreshold) {
        navigation.classList.remove("is-scroll-hidden");
        lastScrollY = currentScrollY;
      }

      isTicking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (isTicking) return;
        isTicking = true;
        window.requestAnimationFrame(updateNavigation);
      },
      { passive: true }
    );

    navigation.addEventListener("focusin", () => {
      navigation.classList.remove("is-scroll-hidden");
    });

    window.addEventListener("pageshow", () => {
      lastScrollY = Math.max(0, window.scrollY);
      updateNavigation();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
