const dialog = document.getElementById("menuDialog");
const menuList = document.getElementById("menuList");
const menuIcon = document.querySelector(".nav-icon");

function menuShow() {
  menuIcon.classList.add("active");
  dialog.addEventListener("click", () => magicClose());
  dialog.inert = true;
  dialog.showModal();
  dialog.inert = false;
  menuList.addEventListener("click", (e) => e.stopPropagation());
}

function magicClose() {
  menuIcon.classList.remove("active");
  if (cantAnimate) {
    dialog.close();
    return;
  } else {
    dialog.classList.add("hide");
    dialog.addEventListener(
      "webkitAnimationEnd",
      function () {
        dialog.classList.remove("hide");
        dialog.close();
        dialog.removeEventListener(
          "webkitAnimationEnd",
          arguments.callee,
          false
        );
      },
      false
    );
  }
}
