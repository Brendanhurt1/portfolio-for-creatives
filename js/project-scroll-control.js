(() => {
  // Prevent the legacy per-page scrollbar scripts from attaching their own handlers.
  document.documentElement.dataset.projectScrollControl = "enhanced";

  const initialise = () => {
    const track = document.querySelector(".scroll-track");
    const indicator = document.querySelector(".scroll-indicator");
    const navigation = document.querySelector(".site-navigation");

    if (!track || !indicator) return;

    const syncNavigationClearance = () => {
      if (!navigation) return;
      document.documentElement.style.setProperty(
        "--project-navigation-height",
        `${Math.ceil(navigation.getBoundingClientRect().height)}px`
      );
    };

    syncNavigationClearance();
    window.addEventListener("resize", syncNavigationClearance);
    if (window.ResizeObserver && navigation) {
      new ResizeObserver(syncNavigationClearance).observe(navigation);
    }

    let isDragging = false;

    const clamp = (value, minimum, maximum) =>
      Math.min(Math.max(value, minimum), maximum);

    const scrollableHeight = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const indicatorRange = () => {
      const inset = parseFloat(window.getComputedStyle(track).paddingTop) || 0;
      const availableHeight = Math.max(
        0,
        track.clientHeight - indicator.offsetHeight - inset * 2
      );

      return { inset, availableHeight };
    };

    const syncIndicatorToPage = () => {
      if (isDragging) return;

      const { inset, availableHeight } = indicatorRange();
      const progress = scrollableHeight() ? window.scrollY / scrollableHeight() : 0;
      indicator.style.top = `${inset + progress * availableHeight}px`;
    };

    const scrollPageToPointer = (clientY) => {
      const trackBounds = track.getBoundingClientRect();
      const { inset, availableHeight } = indicatorRange();
      const handleCentre = clientY - trackBounds.top;
      const top = clamp(
        handleCentre - indicator.offsetHeight / 2,
        inset,
        inset + availableHeight
      );
      const progress = availableHeight ? (top - inset) / availableHeight : 0;

      indicator.style.top = `${top}px`;
      window.scrollTo({ top: progress * scrollableHeight(), behavior: "auto" });
    };

    const startDrag = (event) => {
      if (event.button !== undefined && event.button !== 0) return;

      isDragging = true;
      indicator.classList.add("is-dragging");
      indicator.setPointerCapture?.(event.pointerId);
      scrollPageToPointer(event.clientY);
      event.preventDefault();
    };

    const drag = (event) => {
      if (!isDragging) return;
      scrollPageToPointer(event.clientY);
      event.preventDefault();
    };

    const endDrag = (event) => {
      if (!isDragging) return;
      isDragging = false;
      indicator.classList.remove("is-dragging");
      indicator.releasePointerCapture?.(event.pointerId);
      syncIndicatorToPage();
    };

    indicator.addEventListener("pointerdown", startDrag);
    track.addEventListener("pointerdown", startDrag);
    indicator.addEventListener("pointermove", drag);
    indicator.addEventListener("pointerup", endDrag);
    indicator.addEventListener("pointercancel", endDrag);
    window.addEventListener("scroll", syncIndicatorToPage, { passive: true });
    window.addEventListener("resize", syncIndicatorToPage);

    syncIndicatorToPage();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
