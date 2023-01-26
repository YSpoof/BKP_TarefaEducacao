if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js", { scope: "/" })
      .then(() => console.log("Service Worker registered successfully."))
      .catch((e) => {
        console.log("Service Worker registration failed: ", e);
      });
  });
}
