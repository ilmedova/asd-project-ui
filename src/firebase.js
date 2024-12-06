import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDTtpqlik7SC2doz1muQ1YOSpeUVWdew8Y",
    authDomain: "stock-notifications-d33ca.firebaseapp.com",
    projectId: "stock-notifications-d33ca",
    storageBucket: "stock-notifications-d33ca.firebasestorage.app",
    messagingSenderId: "193921225231",
    appId: "1:193921225231:web:652490c42e693641aa097a",
    measurementId: "G-4LZ6KLWLH6"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const fetchFirebaseToken = async () => {
    try {
        const token = await getToken(messaging, { vapidKey: "BPex-skuSPtTxDGPQXchQ85c60-abIOKXh2C_8LWcLfyMLXXltIfyE-EAybOitDyUYGHnJ0aPOfsicHKLWfysD8" });
        return token;
    } catch (error) {
        console.error("Error fetching Firebase token:", error);
        return null;
    }
};

export default app;
