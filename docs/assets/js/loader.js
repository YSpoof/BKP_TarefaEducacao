const createLoader = () => {
  let root = document.getElementsByTagName("html")[0];
  let timer = setTimeout(() => {
    configs.debug && console.log("⏳ Creating loader...");
    root.style.overflow = "hidden";
    loaderContainer.style.cursor = "wait";
    loaderContainer.classList.add("open");
    loaderContainer.classList.remove("close");
  }, 200);
  window.scrollTo(0, 0);
  return timer;
};

const removeLoader = (timer) => {
  let root = document.getElementsByTagName("html")[0];
  clearTimeout(timer);
  try {
    root.style.overflow = "auto";
    loaderContainer.style.cursor = "auto";
    loaderContainer.classList.add("close");
    loaderContainer.classList.remove("open");
  } catch (e) {
    console.error(`The loader got the error: ${e}`);
  }
};

export { createLoader, removeLoader };
