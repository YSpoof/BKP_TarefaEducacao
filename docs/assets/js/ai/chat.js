const form = document.forms["chat-form"];
const resultContainer = document.getElementById("result-container");
const userInput = form.Prompt;
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  submitBtn.disabled = true;

  resultContainer.value = "";

  const url = `https://chatai.lzart.com.br/?prompt=${form.Prompt.value}`;
  const source = new EventSource(url);
  source.onmessage = (e) => {
    if (e.data === "[DONE]") {
      source.close();
      userInput.value = "";
      submitBtn.disabled = false;
      return;
    }
    const data = JSON.parse(e.data);
    resultContainer.value += `${data.response}`;
  };
});
