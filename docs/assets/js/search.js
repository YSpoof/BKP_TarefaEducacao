const loadSearch = async () => {
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
    let value = e.target.value.toLowerCase();
    debouncedSearch(value);
  });
  searchWorker.onmessage = (e) => {
    // Create an element for each filtered item and append it to the results container
    const filteredData = e.data;
    if (filteredData.length === 0) {
      resultsContainer.innerHTML = `
        <h1>OOps, nenhum resultado encontrado!</h1>
      `;
    }

    filteredData.forEach((item) => {
      const element = document.createElement("div");
      element.classList.add("blog-grid-item", "will-animate");
      element.innerHTML = `
    <div class="${item.classes}">
      <a href="${item.url}" class="postLink">
          <div class="maxthumb">
              <img loading="lazy" class="featured-image" width="1280px" height="720px" src="${item.img}.webp" style="background-image: url('${item.img}-low.webp'); background-size: cover;" alt="${item.title}">
          </div>
      <div class="card-body">
          <h2 class="card-title">
              <span class="text-dark">${item.title}</span>
          </h2>
          <h3 class="card-text">${item.desc}</h3>
      </div>
      <!-- <div class="card-footer bg-white">
          <div class="wrapfooter"></div>
      </div> -->
    </a>
    `;
      resultsContainer.appendChild(element);
    });
  };
};

export { loadSearch };
