// Apply the saved appearance before first paint, so there is no flash.
try {
  var th = localStorage.getItem("theme");
  if (th === "light" || th === "dark") document.documentElement.dataset.theme = th;
} catch (e) {}

// If the app hasn't started after a while (old browser, blocked script,
// in-app browser), say what to try instead of leaving a blank page.
setTimeout(function () {
  var msg = document.getElementById("splash-msg");
  if (!msg) return;
  var l = (navigator.language || "en").slice(0, 2);
  msg.textContent =
    l === "tr"
      ? "Uygulama açılamadı. Linki Chrome veya Safari'de açmayı dene, tarayıcını güncelle ya da Wi-Fi ile mobil veri arasında geçiş yap."
      : l === "pl"
      ? "Nie udało się uruchomić aplikacji. Otwórz link w Chrome lub Safari, zaktualizuj przeglądarkę albo zmień sieć (Wi-Fi / dane komórkowe)."
      : "The app couldn't start. Try opening the link in Chrome or Safari, update your browser, or switch between Wi-Fi and mobile data.";
  msg.hidden = false;
}, 9000);
