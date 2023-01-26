import { loadContactForm } from "./contact-form.js?v=gambiarra";
import { createLoader, removeLoader } from "./loader.js?v=gambiarra";
import { cardLoader, fixMainPage } from "./main.js?v=gambiarra";
import { loadMenu } from "./menu.js?v=gambiarra";
import { loadSearch } from "./search.js?v=gambiarra";
import { settingsLoader } from "./settings.js?v=gambiarra";
import registerServiceWorker from "./sw-register.js?v=gambiarra";

("use strict");

const functionsToLoad = [
  settingsLoader,
  loadMenu,
  cardLoader,
  loadContactForm,
  loadSearch,
  handleUpdate,
];

settingsLoader();

// Register service worker on Router startup
registerServiceWorker();

function loadFunctions() {
  if (functionsToLoad.length === 0) return;
  functionsToLoad.forEach((func) => {
    func();
  });
}

async function drawPage(url) {
  let loaderDisplay = createLoader();

  const response = await fetch(url).catch((error) => {
    alert(`OOps, algo de errado aconteceu: ${error}`);
    console.error("🛑 GambiRouter -> error: ", error);
    removeLoader(loaderDisplay);
    return;
  });

  const html = await response.text();
  const parser = new DOMParser();
  const newDOM = parser.parseFromString(html, "text/html");

  setTimeout(() => {
    removeLoader(loaderDisplay);
  }, 150);

  let oldScripts = Array.from(newDOM.getElementsByTagName("SCRIPT"));
  oldScripts.forEach((script) => {
    script.remove();
  });

  if (!configs.viewTransitions) {
    fixMainPage();

    siteContent.innerHTML = newDOM.getElementById("siteContent").innerHTML;
    document.body.classList = newDOM.body.classList;
    document.title = newDOM.title;
    loadFunctions();
    return;
  }

  document
    .startViewTransition(() => {
      fixMainPage();
      // Render the new page
      // document.body.innerHTML = newDOM.body.innerHTML;
      siteContent.innerHTML = newDOM.getElementById("siteContent").innerHTML;
      document.body.classList = newDOM.body.classList;
      document.title = newDOM.title;
    })
    .finished.then(() => {
      loadFunctions();
    });
}

function shouldNotIntercept(navigationEvent) {
  // This is a PDF file, let the browser handle it.
  if (navigationEvent.destination.url.includes("pdf")) {
    return true;
  }

  // Received request to do normal navigation

  if (navigationEvent.info?.forced) {
    configs.debug &&
      alert(
        `🚨 GambiRouter -> forced navigation: ${navigationEvent.destination.url}`
      );
    return true;
  }

  return (
    !navigationEvent.canIntercept ||
    // If this is just a hashChange,
    // just let the browser handle scrolling to the content.
    navigationEvent.hashChange ||
    // If this is a download,
    // let the browser perform the download.
    navigationEvent.downloadRequest ||
    // If this is a form submission,
    // let that go to the server.
    navigationEvent.formData
  );
}

(() => {
  if (!window.navigation) {
    console.error(
      "💀 GambiRouter -> NOT loaded: navigation api unavailable..."
    );
    loadFunctions();
    return;
  }

  configs.debug && console.log("🧙‍♂️ GambiRouter -> loaded");

  loadFunctions();

  navigation.addEventListener("navigate", (navigateEvent) => {
    // Exit early if this navigation shouldn't be intercepted.
    if (shouldNotIntercept(navigateEvent)) return;

    const url = new URL(navigateEvent.destination.url);

    navigateEvent.intercept({
      async handler() {
        configs.debug &&
          console.log("🛥️ GambiRouter -> navigating to: " + url.pathname);
        await drawPage(url);
      },
    });
  });
})();
