const cardLoader = () => {
  try {
    const cards = document.querySelectorAll(".postLink");

    if (document.querySelector(".featured-image")) {
      document.querySelector(".featured-image").style.viewTransitionName =
        "none";
    }

    if (document.querySelector(".article-post")) {
      document.querySelector(
        ".article-post>p:nth-child(1)"
      ).style.viewTransitionName = "none";
    }

    cards.forEach((card) => {
      card.addEventListener("click", (_e) => {
        const cardImage = card.querySelector(".featured-image");
        const cardText = card.querySelector(".card-text");

        cardImage.style.viewTransitionName = "postThumb";
        cardText.style.viewTransitionName = "postParagraph";
      });
    });
  } catch (_e) {
    return;
  }
};

const fixMainPage = () => {
  if (location.pathname != "/") {
    siteContent.classList.remove("firstpage");
  } else {
    siteContent.classList.add("firstpage");
  }
};

window.upgradeImages = () => {
  const images = document.querySelectorAll("img");

  const filteredImages = Array.from(images).filter((image) =>
    image.src.includes("-low.webp")
  );

  filteredImages.forEach((image) => {
    image.src = image.src.replace("-low.webp", ".webp");
  });
};

window.notify = async (message) => {
  switch (Notification.permission) {
    case "default":
      await Notification.requestPermission();
      break;
    case "denied":
      alert(
        "As notificações estão bloqueadas, verifique as configurações do seu navegador."
      );
      alert(message);
      break;
    default:
      break;
  }
  if (!swRegistration) {
    alert(message);
    return;
  }
  swRegistration.showNotification("Tarefa Educação", {
    tag: "main",
    body: message,
    icon: "/assets/images/pwa/512.png",
  });
};

window.copyPixKey = () => {
  navigator.clipboard.writeText("8ee5ac5e-2733-467b-8763-678e133ab8db");
  alert("Chave PIX copiada.");
};

export { cardLoader, fixMainPage };
