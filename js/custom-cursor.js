(() => {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const initialiseCustomCursor = () => {
    if (document.querySelector(".custom-cursor")) return;

    document.body.insertAdjacentHTML(
      "afterbegin",
      '<div class="custom-cursor" aria-hidden="true"></div>'
    );

    const cursor = document.querySelector(".custom-cursor");
    const clickableSelector = [
      "a[href]",
      "button",
      "input:not([type='hidden'])",
      "select",
      "textarea",
      "summary",
      "[role='button']",
      "[onclick]",
    ].join(",");

    document.documentElement.classList.add("has-custom-cursor");

    const updateCursor = (event) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.classList.add("is-visible");
      cursor.classList.toggle(
        "is-clickable",
        event.target instanceof Element && Boolean(event.target.closest(clickableSelector))
      );
    };

    document.addEventListener("pointermove", updateCursor);
    document.addEventListener("pointerover", updateCursor);
    document.documentElement.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-visible");
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseCustomCursor, { once: true });
  } else {
    initialiseCustomCursor();
  }
})();
