// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
    apiKey: "AIzaSyDTtpqlik7SC2doz1muQ1YOSpeUVWdew8Y",
    authDomain: "stock-notifications-d33ca.firebaseapp.com",
    projectId: "stock-notifications-d33ca",
    storageBucket: "stock-notifications-d33ca.firebasestorage.app",
    messagingSenderId: "193921225231",
    appId: "1:193921225231:web:652490c42e693641aa097a",
    measurementId: "G-4LZ6KLWLH6"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log("Received background message ", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});