const registerServiceWorker = async () => {
  if (!navigator.serviceWorker) {
    console.log("😭 Service Worker not supported.");
    return;
  }

  // Unregister any serviceWorker

  // console.log("🔥 Unregistering Service Worker...");

  // await navigator.serviceWorker.getRegistrations().then((registrations) => {
  //   for (const registration of registrations) {
  //     registration.unregister();
  //     console.log("👌 Service Worker unregistered.");
  //   }
  // });

  console.log("🔥 Registering Service Worker...");

  await navigator.serviceWorker
    .register("/service-worker.js", { scope: "/" })
    .then(
      (r) => {
        console.log("😄 Service Worker registered: ", r);
        window.swRegistration = r;
      },
      (err) => {
        console.error("😭 Service Worker registration failed: ", err);
      }
    );
};

export default registerServiceWorker;
