window.getCookie = (cname) => {
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
};

window.createCookie = (cname, cvalue, exdays = 1) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

window.handleUpdate = (type) => {
  if (getCookie("shouldUpdate") != "false" || type == "forced") {
    // Delete the cache
    console.log("Deleting the cache...");
    caches.delete("cache");

    // Start caching process
    console.log("Calling the Update Worker...");

    const worker = new Worker("/assets/js/workers/update-worker.js");

    worker.postMessage("letsUpdate");

    createCookie("shouldUpdate", "false", 7);

    worker.onmessage = (e) => {
      if (e.data == "done") {
        return true;
      }
    };
  }
};
