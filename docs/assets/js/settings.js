// export configs globally
const defaultConfigs = {
  name: "",
  email: "",
  forceDarkTheme: false,
  viewTransitions: true,
};

async function settingsLoader() {
  try {
    window.configs = localStorage.configs
      ? JSON.parse(localStorage.configs)
      : defaultConfigs;

    if (location.pathname == "/settings/") {
      // Handle reset button
      window.resetConfigs = () => {
        if (confirm("Tem certeza que deseja redefinir as configurações?")) {
          saveButton.disabled = true;
          resetBtn.innerHTML =
            "<img loading='lazy' width='25px' src='/assets/images/icons/spinner.svg' class='will-spin'>";
          resetBtn.disabled = true;

          localStorage.removeItem("configs");
          caches.delete("cache").then(() => {
            // timeout 1second and reload page
            setTimeout(() => {
              alert("Configurações redefinidas com sucesso!");
              location.reload();
            }, 250);
          });
        } else {
          return;
        }
      };

      // Handle save button
      settingsForm.addEventListener("submit", (e) => {
        resetBtn.disabled = true;
        saveButton.innerHTML =
          "<img loading='lazy' width='25px' src='/assets/images/icons/spinner.svg' class='will-spin'>";
        saveButton.disabled = true;

        e.preventDefault();

        // create the data object
        let newConfigs = {};
        newConfigs.name = nameInput.value;
        newConfigs.email = emailInput.value;
        newConfigs.forceDarkTheme = darkToggle.checked;
        newConfigs.viewTransitions = viewTransitionToggle.checked;

        // json stringfy newConfigs object to localStorage
        localStorage.configs = JSON.stringify(newConfigs);

        // timeout 1second and reload page
        setTimeout(() => {
          alert("Configurações salvas com sucesso!");
          location.reload();
        }, 250);
      });

      // set the values to the inputs
      nameInput.value = configs.name;
      emailInput.value = configs.email;
      darkToggle.checked = configs.forceDarkTheme;
      viewTransitionToggle.checked = configs.viewTransitions;
    }

    // Handle dark mode

    let root = document.getElementsByTagName("html")[0];
    if (
      configs.forceDarkTheme ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      root.classList.add("dark-mode");
    } else {
      root.classList.remove("dark-mode");
    }
    localStorage.configs = JSON.stringify(configs);
  } catch (error) {
    console.error(error);
  }
}

window.handleDebugging = () => {
  if (configs.debug) {
    alert("Disabling debugging");
    configs.debug = false;
    localStorage.configs = JSON.stringify(configs);
    return;
  }
  alert("Enabling debugging");
  configs.debug = true;
  localStorage.configs = JSON.stringify(configs);
  location.reload();
};

export { settingsLoader };
