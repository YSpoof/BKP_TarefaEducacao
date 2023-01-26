function loadMenu() {
  try {
    // Handle Oppening

    menuButton.addEventListener("click", () => {
      if (canAnimate) {
        menuIcon.style.rotate = "180deg"
        menuIcon.style.scale = "1.4"
      }
      menuDialog.showModal();
    });

    // Handle Closing

    menuDialog.addEventListener("click", ({ target }) => {
      if (
        target.tagName === "A" ||
        target === menuDialog ||
        target.tagName === "H3"
      ) {
        menuDialog.close();
        menuIcon.style.rotate = "0deg"
        menuIcon.style.scale = "1"
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export { loadMenu };
