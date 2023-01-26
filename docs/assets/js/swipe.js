let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

let displayMode = "browser";
const mqStandAlone = "(display-mode: standalone)";

function handleGesture(touchstartX, touchstartY, touchendX, touchendY) {
  const delx = touchendX - touchstartX;
  const dely = touchendY - touchstartY;
  if (Math.abs(delx) > Math.abs(dely)) {
    // alert(`DelX: ${delx} ; DelY: ${dely}`)
    if (delx > 180) return "toright";
    else return "toleft";
  } else if (Math.abs(delx) < Math.abs(dely)) {
    if (dely > 180) return "down";
    else return "up";
  } else return "tap";
}

if (navigator.standalone || window.matchMedia(mqStandAlone).matches)
  displayMode = "standalone";

if (displayMode == "standalone") {
  // user is on app, enable gestures
  const gestureZone = document.body;
  gestureZone.addEventListener(
    "touchstart",
    function (event) {
      touchstartX = event.changedTouches[0].screenX;
      touchstartY = event.changedTouches[0].screenY;
    },
    false
  );

  gestureZone.addEventListener(
    "touchend",
    function (event) {
      touchendX = event.changedTouches[0].screenX;
      touchendY = event.changedTouches[0].screenY;
      let handle = handleGesture(
        touchstartX,
        touchstartY,
        touchendX,
        touchendY
      );
      if (handle == "toright") history.back();
      if (handle == "toleft") history.forward();
    },
    false
  );
}
