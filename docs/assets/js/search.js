const loadSearch = () => {
  if (location.pathname != "/search/") return;

  const searchWorker = new Worker("/assets/js/workers/search-worker.js");

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  const debouncedSearch = debounce((value) => {
    // Clear the results container
    resultsContainer.innerHTML = "";

    if (value.length < 2) return;

    // Filter the data based on the input value
    searchWorker.postMessage(value);
  }, 300);

  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    debouncedSearch(value);
  });
  searchWorker.onmessage = (e) => {
    // Create an element for each filtered item and append it to the results container
    const filteredData = e.data;
    if (filteredData.length === 0) {
      resultsContainer.innerHTML = `
        <h1 class="text-xl font-bold">OOps, nenhum resultado encontrado!</h1>
      `;
    }

    filteredData.forEach((item) => {
      const postContainer = document.createElement("div");
      postContainer.classList.add(
        "rounded-xl",
        "text-inherit",
        "p-0",
        "flex",
        "items-center",
        "post-grid-item",
        "bg-white",
        "dark:bg-stone-800"
      );
      postContainer.innerHTML = `
      <a href="${item.url}" class="h-full max-w-full">
        <div class="${item.classes}">
          <div>
              <img loading="lazy" class="rounded-t-xl" width="1280" height="720" src="${item.img}" alt="${item.title}">
          </div>
      <div class="p-4">
          <h2 class="font-bold text-xl mb-2 text-balance">
              ${item.title}
          </h2>
          <hr class="my-4 mx-0 border-t opacity-25 border-slate-700 dark:border-slate-500">
          <h3 class="font-normal text-lg leading-6 mt-4 text-inherit text-balance">${item.desc}</h3>
      </div>
    </a>
    `;
      resultsContainer.appendChild(postContainer);
    });
    upgradeImages();
  };
};

export { loadSearch };
