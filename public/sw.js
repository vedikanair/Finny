self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));

self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "Finny";
  const options = {
    body: data.body || "You haven't logged today's expenses yet.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: "daily-reminder",
    renotify: true,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
