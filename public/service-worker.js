// public/service-worker.js

self.addEventListener("push", (event) => {
  console.log("pushing");
  event.waitUntil(
    (async () => {
      let data = {};
      try {
        data = event.data?.json();
      } catch (e) {
        const text = await event.data?.text(); // ⬅️ 여긴 반드시 await 필요
        data = { title: "푸시 메시지", body: text || "내용 없음" };
      }

      const title = data.title || "새 알림";
      const options = {
        body: data.body || "메시지를 확인하세요.",
        // icon: "/icon.png",
        data: {
          url: data.url || "/",
        },
      };

      console.log("showNotification 호출 전", title, options);
      self.registration.showNotification(title, options);
      console.log("showNotification 호출 후");
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
