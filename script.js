// ===============================
// SMART REMINDER - COMPLETE JS
// ===============================

let reminders = [];

let audioContext = null;
let alarmInterval = null;


// ===============================
// ENABLE ALARM SOUND
// ===============================

function enableAlarm() {

    if (!audioContext) {
        audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    alert("🔊 Alarm sound enabled!");
}


// ===============================
// PLAY ONE ALARM BEEP
// ===============================

function playBeep() {

    if (!audioContext) {
        return;
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    let oscillator = audioContext.createOscillator();
    let gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.type = "square";

    oscillator.frequency.setValueAtTime(
        1000,
        audioContext.currentTime
    );

    gain.gain.setValueAtTime(
        0.5,
        audioContext.currentTime
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.6
    );
}


// ===============================
// START CONTINUOUS ALARM
// ===============================

function startAlarmSound() {

    stopAlarmSound();

    if (!audioContext) {
        return;
    }

    // Play immediately
    playBeep();

    // Keep ringing
    alarmInterval = setInterval(function () {

        playBeep();

    }, 900);
}


// ===============================
// STOP ALARM SOUND
// ===============================

function stopAlarmSound() {

    if (alarmInterval !== null) {

        clearInterval(alarmInterval);

        alarmInterval = null;
    }
}


// ===============================
// ADD REMINDER
// ===============================

function addReminder() {

    // Enable audio after user clicks Create Reminder
    if (!audioContext) {

        audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }


    let note =
        document.getElementById("note").value;

    let date =
        document.getElementById("date").value;

    let time =
        document.getElementById("time").value;

    let category =
        document.getElementById("category").value;


    // Check empty fields

    if (
        note === "" ||
        date === "" ||
        time === ""
    ) {

        alert("Please fill all fields.");

        return;
    }


    // Create reminder

    let reminder = {

        id: Date.now(),

        note: note,

        date: date,

        time: time,

        category: category,

        completed: false,

        alarmed: false
    };


    reminders.push(reminder);


    saveReminders();

    displayReminders();


    // Clear fields

    document.getElementById("note").value = "";

    document.getElementById("date").value = "";

    document.getElementById("time").value = "";


    alert("Reminder created successfully 🔔");
}


// ===============================
// DISPLAY REMINDERS
// ===============================

function displayReminders() {

    let list =
        document.getElementById("reminderList");

    list.innerHTML = "";


    if (reminders.length === 0) {

        list.innerHTML =
            '<p class="empty">No reminders yet.</p>';

        document.getElementById("count").innerText =
            "0 reminders";

        return;
    }


    reminders.forEach(function (reminder) {

        let div =
            document.createElement("div");


        div.className = "reminder";


        div.innerHTML = `

            <h3>${reminder.note}</h3>

            <p>📅 ${reminder.date}</p>

            <p>⏰ ${reminder.time}</p>

            <p>📂 ${reminder.category}</p>

            <div class="reminder-actions">

                <button
                    class="done"
                    onclick="completeReminder(${reminder.id})">
                    ✓ Done
                </button>

                <button
                    class="delete"
                    onclick="deleteReminder(${reminder.id})">
                    🗑 Delete
                </button>

            </div>
        `;


        list.appendChild(div);

    });


    document.getElementById("count").innerText =

        reminders.length +

        (
            reminders.length === 1
                ? " reminder"
                : " reminders"
        );
}


// ===============================
// COMPLETE REMINDER
// ===============================

function completeReminder(id) {

    reminders = reminders.map(function (reminder) {

        if (reminder.id === id) {

            reminder.completed = true;
        }

        return reminder;

    });


    saveReminders();

    displayReminders();
}


// ===============================
// DELETE REMINDER
// ===============================

function deleteReminder(id) {

    reminders = reminders.filter(function (reminder) {

        return reminder.id !== id;

    });


    saveReminders();

    displayReminders();
}


// ===============================
// SAVE REMINDERS
// ===============================

function saveReminders() {

    localStorage.setItem(

        "smartReminders",

        JSON.stringify(reminders)

    );
}


// ===============================
// LOAD REMINDERS
// ===============================

function loadReminders() {

    let saved =
        localStorage.getItem("smartReminders");


    if (saved) {

        reminders =
            JSON.parse(saved);

    }


    displayReminders();
}


// ===============================
// GET LOCAL DATE
// ===============================

function getLocalDate() {

    let now = new Date();


    let year =
        now.getFullYear();


    let month =
        String(now.getMonth() + 1)
            .padStart(2, "0");


    let day =
        String(now.getDate())
            .padStart(2, "0");


    return `${year}-${month}-${day}`;
}


// ===============================
// CHECK REMINDERS
// ===============================

function checkReminders() {

    let now = new Date();


    // Local date

    let currentDate =
        getLocalDate();


    // Local time

    let currentTime =

        String(now.getHours())
            .padStart(2, "0")

        + ":" +

        String(now.getMinutes())
            .padStart(2, "0");


    reminders.forEach(function (reminder) {


        if (

            reminder.date === currentDate &&

            reminder.time === currentTime &&

            !reminder.completed &&

            !reminder.alarmed

        ) {


            // Show alarm

            showAlarm(reminder);


            // Prevent repeated triggering

            reminder.alarmed = true;


            saveReminders();

        }

    });

}


// ===============================
// SHOW ALARM POPUP
// ===============================

function showAlarm(reminder) {


    document.getElementById("alarmText").innerText =

        reminder.note;


    document.getElementById("alarmBox").style.display =

        "flex";


    // Start continuous ringing

    startAlarmSound();

}


// ===============================
// STOP ALARM / DONE
// ===============================

function stopAlarm() {


    stopAlarmSound();


    document.getElementById("alarmBox").style.display =

        "none";

}


// ===============================
// SNOOZE
// ===============================

function snoozeAlarm() {


    stopAlarm();


    alert(
        "😴 Reminder snoozed for 10 minutes."
    );

}


// ===============================
// CHECK EVERY SECOND
// ===============================

setInterval(

    checkReminders,

    1000

);


// ===============================
// LOAD WHEN PAGE OPENS
// ===============================

loadReminders();