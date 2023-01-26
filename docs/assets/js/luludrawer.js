/**
 * Sets the properties of the lulu image element.
 *
 * @param {string} [title=""] - The title attribute for the lulu image.
 * @param {string} [alt=""] - The alt attribute for the lulu image.
 * @param {string} [mood="neutral"] - The mood of the lulu image.
 * @param {number} [width=0] - The width of the lulu image.
 */
function luluDrawer(title = "", alt = "", mood = "neutral", width = 0) {
  const lulu = document.getElementById("lulu");

  switch (mood) {
    case "angry":
      lulu.src = `/assets/images/luluzinha/${mood}.svg`;
      break;
    case "happy":
      lulu.src = `/assets/images/luluzinha/${mood}.svg`;
      break;
    case "hello":
      lulu.src = `/assets/images/luluzinha/${mood}.svg`;
      break;
    case "neutral":
      lulu.src = `/assets/images/luluzinha/${mood}.svg`;
      break;
    case "sad":
      lulu.src = `/assets/images/luluzinha/${mood}.svg`;
      break;
    case "thinking":
      lulu.src = `/assets/images/luluzinha/${mood}.svg`;
      break;
    default:
      lulu.src = `/assets/images/luluzinha/neutral.svg`;
  }

  lulu.title = title;
  lulu.alt = alt;
  lulu.src = `/assets/images/luluzinha/${mood}.svg`;
  if (!width) lulu.width = width;
}
