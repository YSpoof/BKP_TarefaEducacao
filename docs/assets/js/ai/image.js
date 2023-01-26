const api = "https://imageai.lzart.com.br/";
const form = document.forms.generator;
const submitBtn = form.elements["submitBtn"];
let oldBlob;
let token;

function onTurnstileReady(newToken) {
  token = newToken;
  submitBtn.disabled = false;
  submitBtn.innerHTML = "Gerar imagem";
}

function onTurnstileFailed() {
  document.getElementById("turnstileContainer").style.display = "block";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!token) return alert("Por favor, aguarde o carregamento do CAPTCHA");

  // remove old image element
  const oldImg = document.getElementById("generated-image");
  if (oldImg) oldImg.remove();

  // remove old download button
  const oldDownloadBtn = document.getElementById("download-btn");
  if (oldDownloadBtn) oldDownloadBtn.remove();

  // remove old blob
  if (oldBlob) URL.revokeObjectURL(oldBlob);

  submitBtn.disabled = true;
  submitBtn.innerHTML =
    "<img loading='lazy' width='25px' src='/assets/images/icons/spinner.svg' class='will-spin'>";

  await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: form.Prompt.value, token }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`API responded with status code ${res.status}`);
      }
      return res.blob();
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      oldBlob = url;
      const imgContainer = document.getElementById("img-container");

      const img = document.createElement("img");

      img.src = url;
      img.style.width = "100%";
      img.id = "generated-image";
      imgContainer.appendChild(img);

      const downloadBtn = document.createElement("a");
      downloadBtn.href = url;
      downloadBtn.download = "Imagem da IA.png";
      downloadBtn.innerHTML = "Baixar imagem";
      downloadBtn.classList.add("btn", "btn-primary", "mt-2");
      downloadBtn.id = "download-btn";
      imgContainer.appendChild(downloadBtn);

      turnstile.reset();
    })
    .catch((e) => {
      alert("Oops, o seu token expirou, tente novamente.");
      turnstile.reset();
    });
});
