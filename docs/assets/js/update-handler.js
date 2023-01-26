function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function createCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function handleUpdate() {
  if (isbot(navigator.userAgent)) return;

  // If first visit
  if (!localStorage.notFirstVisit) {
    console.log("Creating the Update Cookie...");
    createCookie("shouldUpdate", "n", 7);
    console.log("Update Cookie created!");
    localStorage.notFirstVisit = true;
    if (location.pathname == "/update/") return;
  }

  if (getCookie("shouldUpdate") == "") {
    createCookie("shouldUpdate", "n", 7);
    location.replace("/update/");
  }
}

function cacheWebSite() {
  const urlToRemoveFromCache = [
    "/401.html",
    "/403.html",
    "/404.html",
    "/feed.xml",
    "/fullsite.json",
    "/google25008c19ca68a028.html",
    "/robots.txt",
    "/sitemap.xml",
    "/robots.txt",
    "/update/",
    "/service-worker.js",
  ];

  const extras = [
    "/game/reset.css",
    "/game/font.ttf",
    "/assets/bgvideo.mp4",
    "/assets/bgimg.avif",
  ];

  fetch("/fullsite.json", { cache: "reload" })
    .then((r) => r.json())
    .then(function (data) {
      var siteStuff = new Set(data);
      urlToRemoveFromCache.forEach((e) => siteStuff.delete(e));
      siteStuff = Array.from(siteStuff);

      // add extras to siteStuff array
      extras.forEach((e) => siteStuff.push(e));

      if (location.pathname == "/update/") {
        document.getElementById("pbar").max = siteStuff.length;
      }

      Promise.all(siteStuff.map((u) => fetch(u, { cache: "reload" })))
        .then((responses) => Promise.all(responses.map((res) => res.text())))
        .then((texts) => {
          console.log("Website cached");
          if (location.pathname == "/update/") updateLuLu();
        });
    });
}

var counterValue = 0;

// Handle fetch to fill progressbar
window.fetch = new Proxy(window.fetch, {
  apply(actualFetch, that, args) {
    const result = Reflect.apply(actualFetch, that, args);
    result.then(() => {
      counterValue += 1;
      if (location.pathname == "/update/") {
        document.getElementById("pbar").value = counterValue;
      }
    });
    return result;
  },
});

handleUpdate();
