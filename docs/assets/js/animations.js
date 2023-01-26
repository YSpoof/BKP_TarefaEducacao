var cards = document.querySelectorAll(".catpostblock"),
  cantAnimate = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

var observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("animated", entry.isIntersecting);
      if (entry.isIntersecting) observer.unobserve(entry.target);
    });
  },
  { rootMargin: "70px" }
);

cards.forEach((card) => {
  observer.observe(card);
});

var toAnimate = document.querySelectorAll(".will-animate");

var animObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("animated", entry.isIntersecting);
      if (entry.isIntersecting) observer.unobserve(entry.target);
    });
  },
  { rootMargin: "20px" }
);

toAnimate.forEach((item) => {
  observer.observe(item);
});

function recallAnimation() {
  toAnimate.forEach((item) => {
    observer.observe(item);
  });
}
