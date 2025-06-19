import { Box } from "@chakra-ui/react";
import { FaBell, FaBellSlash, FaRegBell } from "react-icons/fa";

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/service-worker.js"
      );
      console.log("✅ Service Worker registered", registration);
      return registration;
    } catch (err) {
      console.error("❌ Service Worker registration failed", err);
    }
  }
  return null;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// src/utils/subscribeToPush.ts
export async function subscribeToPush() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("알림 권한이 필요해요!");
    return;
  }

  const vapidKey = process.env.REACT_APP_VAPID_PUBLIC_KEY!;
  const convertedKey = urlBase64ToUint8Array(vapidKey);

  const registration = await navigator.serviceWorker.ready;
  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: convertedKey,
  };

  const pushSubscription = await registration.pushManager.subscribe(
    subscribeOptions
  );

  const subscriptionJson = pushSubscription.toJSON();

  const body = {
    endpoint: subscriptionJson.endpoint,
    keys_p256dh: subscriptionJson.keys?.p256dh,
    keys_auth: subscriptionJson.keys?.auth,
  };

  console.log("📡 Push Subscription (converted):", JSON.stringify(body));

  // 서버에 POST 요청
  await fetch("https://backend.apot.pro/api/v1/notifications/", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default function NotificationButton() {
  const handleClick = async () => {
    await subscribeToPush();
  };

  return (
    <Box onClick={handleClick}>
      <FaBell size={18} />
    </Box>
  );
}
