async function loadMenu() {
  try {
    let menuIcon = document.querySelector(".nav-icon");

    // Handle Oppening

    menuIcon.addEventListener("click", () => {
      menuIcon.classList.add("active");
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
        menuIcon.classList.remove("active");
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export { loadMenu };
