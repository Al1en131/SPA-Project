import "../styles/styles.css";

import App from "./pages/app";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("Service Worker registered:", reg);

        if ("PushManager" in window) {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              reg.pushManager
                .subscribe({
                  userVisibleOnly: true,
                  applicationServerKey:
                    "BD_bF-KraJi7-WVrHZqzQdo5WiRHVPARci6K_RU9ooBTfyVrioqmVlc4EgRP8i7NI4G-bFfOEbx48Tn2kiE6kOk",
                })
                .then((subscription) => {
                  console.log("Push Subscription:", subscription);
                })
                .catch((err) =>
                  console.error("Push Subscription failed:", err)
                );
            }
          });
        }
      })
      .catch((err) =>
        console.error("Service Worker registration failed:", err)
      );
  });
}
