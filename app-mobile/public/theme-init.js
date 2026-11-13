// Apply the saved appearance before first paint, so there is no flash.
try {
  var th = localStorage.getItem("theme");
  if (th === "light" || th === "dark") document.documentElement.dataset.theme = th;
} catch (e) {}
