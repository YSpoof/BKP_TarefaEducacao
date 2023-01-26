const msg1 = document.getElementById("msg1");
const msg2 = document.getElementById("msg2");
const pbar = document.getElementById("pbar");

console.log("Creating the Update Cookie...");
createCookie("shouldUpdate", "n", 7);
console.log("Update Cookie created!");

console.log("Deleting the cache...");
caches.delete("cache");
console.log("Cache delete done!");

function updateSVC() {
  console.log("Unregistering Service Worker...");
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log("Service Worker unregister done!");
    }
  });
  cacheWebSite();
}

function updateLuLu() {
  console.log("Updating Luluzinha's mood...");
  luluDrawer("A LuLu está feliz!", "Luluzinha feliz", "happy", 150);
  console.log("Luluzinha's mood updated!");
  msg1.innerHTML = "Atualização Concluída!";
  msg2.innerHTML = "Retornando você para home...";
  pbar.style.display = "none";

  console.log("Preparing to go back...");
  setTimeout(function () {
    location.replace("/");
  }, 2000);
}
function updateHang() {
  console.error("The update has failed!");
  luluDrawer("A LuLu está triste!", "Luluzinha triste", "sad", 150);
  msg1.innerHTML = "Erro na atualização";
  msg2.innerHTML =
    "Parece que houve algum problema na atualização, retornando para home...";
  pbar.style.display = "none";
  console.warn("Deleting the bad cache...");
  caches.delete("cache").then(() => {
    setTimeout(function () {
      location.replace("/");
    }, 2000);
  });
}
addEventListener("DOMContentLoaded", () => {
  updateSVC();
  setTimeout(updateHang, 57000);
});
