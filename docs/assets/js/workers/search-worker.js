async function handleSearch(query) {
  // Fetch the JSON data from the server
  const response = await fetch("/search.json");
  const data = await response.json();

  // Filter the data based on the input value
  const filteredData = data.filter((item) => {
    let title = item.title.toLowerCase();
    let description = item.desc.toLowerCase();
    let category = item.category.toLowerCase();

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
