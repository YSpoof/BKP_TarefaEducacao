// export configs globally
let defaultConfigs = {
    name: "",
    email: "",
    darkTheme: false,
    animatedBG: true,
  },
  configStorage = localStorage.configs;

const configs = configStorage ? JSON.parse(configStorage) : defaultConfigs;
