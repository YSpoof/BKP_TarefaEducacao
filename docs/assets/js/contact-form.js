async function loadContactForm() {
  let scriptURL =
    "https://script.google.com/macros/s/AKfycbxB7c4nrFgb_PCmX9rHykY3rTIY2nYpxaCumU-TDgyO4nqY6wyFwn7TlSzsqnUq5qlt/exec";
  if (!location.pathname.includes("/contact/")) return;

  contactForm.elements["name"].value = configs.name ?? "";
  contactForm.elements["email"].value = configs.email ?? "";

  contactForm.addEventListener("submit", (e) => {
    submitBtn.innerHTML =
      "<img loading='lazy' width='25px' src='/assets/images/icons/spinner.svg' class='will-spin'>";
    submitBtn.disabled = true;
    e.preventDefault();
    fetch(scriptURL, {
      method: "POST",
      body: new FormData(contactForm),
    })
      .then((r) => {
        if (r.type == "opaqueredirect") {
          location.replace("/contact-success/");
        }
        if (!r.ok) {
          throw new Error(
            `Erro ao enviar mensagem ${r.status} - ${r.statusText}`
          );
        }
        location.replace("/contact-success/");
      })
      .catch((e) => fmSError(e));
  });

  window.fmSError = (e) => {
    console.log(e);
    let shouldWe = window.confirm(
      "OOps, não foi possível enviar a sua mensagem, vou tentar novamente, OK ?"
    );
    if (shouldWe == true) {
      contactForm.requestSubmit(submitBtn);
      shouldWe = false;
      return;
    }
    submitBtn.innerHTML = "Enviar";
    submitBtn.disabled = false;
  };
}

export { loadContactForm };
