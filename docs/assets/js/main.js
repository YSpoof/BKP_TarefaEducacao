const cardLoader = async () => {
  try {
    let cards = document.querySelectorAll(".postLink");

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
      card.addEventListener("click", (e) => {
        let cardImage = card.querySelector(".featured-image");
        let cardText = card.querySelector(".card-text");

        cardImage.style.viewTransitionName = "postThumb";
        cardText.style.viewTransitionName = "postParagraph";
      });
    });
  } catch (e) {
    return;
  }
};

const fixMainPage = async () => {
  if (location.pathname != "/") {
    siteContent.classList.remove("firstpage");
  } else {
    siteContent.classList.add("firstpage");
  }
};

window.copyPixKey = () => {
  navigator.clipboard.writeText("8ee5ac5e-2733-467b-8763-678e133ab8db");
  alert("Chave PIX copiada.");
};

export { cardLoader, fixMainPage };
