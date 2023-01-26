async function handleSearch(query) {
  // Fetch the JSON data from the server
  const response = await fetch("/search.json");
  const data = await response.json();
  const postArray = data.sort((a, b) => {
    return a.title.localeCompare(b.title);
  })

  // Filter the data based on the input value
  const filteredData = postArray.filter((item) => {
    const title = item.title.toLowerCase();
    const description = item.desc.toLowerCase();
    const category = item.category.toLowerCase();

    return (
      title.includes(query) ||
      category.includes(query) ||
      description.includes(query)
    );
  });

  postMessage(filteredData);
}

addEventListener("message", async (e) => {
  const query = e.data.toLowerCase();
  handleSearch(query);
});
