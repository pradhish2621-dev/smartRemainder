// ========================================
// SMART REMINDER SERVICE WORKER
// ========================================

self.addEventListener(
    "install",
    function () {

        self.skipWaiting();

    }
);


self.addEventListener(
    "activate",
    function (event) {

        event.waitUntil(
            self.clients.claim()
        );

    }
);


// ========================================
// RECEIVE PUSH
// ========================================

self.addEventListener(
    "push",
    function (event) {

        let data = {

            title: "SmartReminder",

            body: "You have a reminder.",

            reminderId: null

        };


        if (event.data) {

            try {

                data =
                    event.data.json();

            } catch (error) {

                data.body =
                    event.data.text();
            }
        }


        const options = {

            body: data.body,

            icon: "/icon.png",

            badge: "/icon.png",

            vibrate: [
                200,
                100,
                200,
                100,
                300
            ],

            requireInteraction: true,

            data: {

                reminderId:
                    data.reminderId
            },

            actions: [

                {
                    action: "open",

                    title: "Open"
                },

                {
                    action: "done",

                    title: "✓ Done"
                }

            ]

        };


        event.waitUntil(

            self.registration.showNotification(
                data.title,
                options
            )

        );

    }
);


// ========================================
// NOTIFICATION CLICK
// ========================================

self.addEventListener(
    "notificationclick",
    function (event) {

        event.notification.close();


        event.waitUntil(

            clients.matchAll({
                type: "window",
                includeUncontrolled: true
            }).then(
                function (clientList) {

                    for (
                        const client
                        of clientList
                    ) {

                        if (
                            "focus"
                            in client
                        ) {

                            return client.focus();

                        }

                    }


                    if (
                        clients.openWindow
                    ) {

                        return clients.openWindow(
                            "/"
                        );

                    }

                }
            )

        );

    }
);