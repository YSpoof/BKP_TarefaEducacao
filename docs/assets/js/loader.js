const createLoader = () => {
  let root = document.getElementsByTagName("html")[0];
  let timer = setTimeout(() => {
    configs.debug && console.log("⏳ Creating loader...");
    root.style.overflow = "hidden";
    loaderContainer.style.cursor = "wait";
    loaderContainer.classList.remove("invisible");
  }, 300);
  return timer;
};

const removeLoader = (timer) => {
  let root = document.getElementsByTagName("html")[0];
  clearTimeout(timer);
  try {
    root.style.overflow = "auto";
    loaderContainer.style.cursor = "auto";
    loaderContainer.classList.add("invisible");
    window.scrollTo(0, 0);

  } catch (e) {
    console.error(`The loader got the error: ${e}`);
  }
};

export { createLoader, removeLoader };
