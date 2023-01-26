// export configs globally
const defaultConfigs = {
  name: "",
  email: "",
  forceDarkTheme: false,
  viewTransitions: true,
};

async function settingsLoader() {
  try {
    window.canAnimate = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    window.configs = localStorage.configs
      ? JSON.parse(localStorage.configs)
      : defaultConfigs;

    if (location.pathname == "/settings/") {
      // Handle reset button
      window.resetConfigs = (_e) => {
        if (confirm("Tem certeza que deseja redefinir as configurações?")) {
          saveButton.disabled = true;
          resetBtn.innerHTML =
            "<img loading='lazy' width='25px' src='/assets/images/icons/spinner.svg' class='animate-spin'>";
          resetBtn.disabled = true;

          localStorage.removeItem("configs");
          caches.delete("cache").then(() => {
            // timeout 1second and reload page
            setTimeout(() => {
              notify("Configurações redefinidas com sucesso!");
              location.reload();
            }, 250);
          });
        } else {
          return;
        }
      };

      // Remove any existing event listeners
      settingsForm.removeEventListener("submit", handleFormSubmit);

      // Handle save button
      settingsForm.addEventListener("submit", handleFormSubmit);

      // set the values to the inputs
      nameInput.value = configs.name;
      emailInput.value = configs.email;
      darkToggle.checked = configs.forceDarkTheme;
      viewTransitionToggle.checked = configs.viewTransitions;
    }

    // Handle dark mode

    configs.forceDarkTheme || matchMedia("(prefers-color-scheme: dark)").matches
      ? root.classList.add("dark")
      : root.classList.remove("dark");

    localStorage.configs = JSON.stringify(configs);
  } catch (error) {
    console.error(error);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  resetBtn.disabled = true;
  saveButton.innerHTML =
    "<img loading='lazy' width='25px' src='/assets/images/icons/spinner.svg' class='animate-spin'>";
  saveButton.disabled = true;

  // create the data object
  let newConfigs = {
    name: nameInput.value,
    email: emailInput.value,
    forceDarkTheme: darkToggle.checked,
    viewTransitions: viewTransitionToggle.checked,
  };

  // json stringfy newConfigs object to localStorage
  localStorage.configs = JSON.stringify(newConfigs);

  setTimeout(async () => {
    await notify("Configurações salvas com sucesso!");

    // if search params return=true then go back to previous page
    if (new URLSearchParams(location.search).get("return") == "true") {
      history.back();
      return;
    }
    location.reload();
  }, 300);
}

window.handleDebugging = () => {
  if (configs.debug) {
    notify("Disabling debugging");
    configs.debug = false;
    localStorage.configs = JSON.stringify(configs);
    return;
  }
  notify("Enabling debugging");
  configs.debug = true;
  localStorage.configs = JSON.stringify(configs);
  window.navigation
    ? navigation.navigate("/", { info: { forced: true } })
    : location.reload(true);
};

export { settingsLoader };
