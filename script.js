const hour = document.querySelector('#hourSelect');
const minute = document.querySelector('#minuteSelect');
const AmPm = document.querySelector('#ampmSelect');
const setAlarmBtn = document.querySelector('#setAlarmButton');
const content = document.querySelector('#content');
const ringTone = new Audio('files/ringtone.mp3');
const resumeBtn = document.querySelector('#resumeAlarmButton');
const welcomeBackScreen = document.querySelector('#welcomeBackScreen');
const alarmTimeIndicator = document.querySelector('#alarmTimeIndicator');
const currentTime = document.querySelector('#currentTimeDisplay');

// Check if user has exited webpage
if (!localStorage.getItem('userExited')) {
    localStorage.setItem('userExited', 'false');
} else {
    // Check if user has returned to webpage and had previously set an alarm then show him resume button
    if (localStorage.getItem('userExited') === 'true' && localStorage.getItem('isAlarmSet') === 'true') {
        welcomeBackScreen.classList.remove('d-none');
    }
}

// Play ringtone continuously on resume
if (!localStorage.getItem('wantToPlay')) {
    localStorage.setItem('wantToPlay', 'no');
}

// Hide Alarm indicator if the alarm is not set
if (localStorage.getItem('alarmTime') === '00:00:AM') {
    alarmTimeIndicator.classList.add('d-none');
}

// Add class to content
if (!localStorage.getItem('contentClass')) {
    localStorage.setItem('contentClass', 'content flex');
    content.className = localStorage.getItem('contentClass');
} else {
    content.className = localStorage.getItem('contentClass');
}

// Set button text
if (!localStorage.getItem('btnText')) {
    localStorage.setItem('btnText', 'Set Alarm');
    setAlarmBtn.textContent = localStorage.getItem('btnText');
} else {
    setAlarmBtn.textContent = localStorage.getItem('btnText');
}

// Set default isAlarm
if (!localStorage.getItem('isAlarmSet')) {
    localStorage.setItem('isAlarmSet', 'false');
}

// Set default alarm time
if (!localStorage.getItem('alarmTime')) {
    localStorage.setItem('alarmTime', '00:00:PM');
}

// Set hour values
for (let i = 12; i > 0; i--) {
    i = i < 10 ? '0' + i : i;
    const option = `<option value="${i}">${i}</option>`;
    hour.firstElementChild.insertAdjacentHTML('afterend', option);
}

// Set Minute values
for (let i = 59; i >= 0; i--) {
    i = i < 10 ? '0' + i : i;
    const option = `<option value="${i}">${i}</option>`;
    minute.firstElementChild.insertAdjacentHTML('afterend', option);
}

// Set AM/PM values
for (let i = 2; i > 0; i--) {
    const am_pm = i === 1 ? 'AM' : 'PM';
    const option = `<option value="${am_pm}">${am_pm}</option>`;
    AmPm.firstElementChild.insertAdjacentHTML('afterend', option);
}

// Play Alarm function
const playAlarm = () => {
    if (localStorage.getItem('userExited') === 'xxx' || localStorage.getItem('wantToPlay') === 'yes') {
        ringTone.play();
    }
    ringTone.loop = true;
};

setInterval(() => {
    const date = new Date();
    let h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    let ampm = 'AM';

    // 12 Hour Format
    if (h > 11) {
        h = h - 12;
        ampm = 'PM';
    }

    // If hour value is 0 then set it to 12
    h = h === 0 ? (h = 12) : h;

    // Adding 0 before h, m, s
    h = h < 10 ? '0' + h : h;
    const formattedM = m < 10 ? '0' + m : m;
    const formattedS = s < 10 ? '0' + s : s;

    // Update time every second
    currentTime.textContent = `${h}:${formattedM}:${formattedS} ${ampm}`;

    // Play ringtone if alarm time matches with current time
    if (localStorage.getItem('alarmTime') === `${h}:${formattedM}:${ampm}` || localStorage.getItem('wantToPlay') === 'yes') {
        playAlarm();
    }
}, 1000);

// Set alarm
const setAlarm = () => {
    // Clear alarm
    if (localStorage.getItem('isAlarmSet') === 'true') {
        // Reset Alarm time
        localStorage.setItem('alarmTime', '00:00:AM');
        ringTone.pause();

        // Enable selection of time
        localStorage.setItem('contentClass', 'content flex');
        content.className = localStorage.getItem('contentClass');

        // Change button text to "Set alarm"
        localStorage.setItem('btnText', 'Set Alarm');
        setAlarmBtn.textContent = localStorage.getItem('btnText');

        // Hide resume button
        resumeBtn.hidden = true;

        // Reset alarm indicator
        alarmTimeIndicator.textContent = 'Alarm Time set to: ';
        alarmTimeIndicator.classList.add('d-none');

        // Set want to play to no to stop alarm
        localStorage.setItem('wantToPlay', 'no');

        // Return
        return localStorage.setItem('isAlarmSet', 'false');
    }

    // Getting alarm time from the user
    const time = `${hour.value}:${minute.value}:${AmPm.value}`;
    if (time.includes('Hour') || time.includes('Minute') || time.includes('AM/PM')) {
        alert('Please select a valid time');
        return;
    }

    // Set alarm to true
    localStorage.setItem('isAlarmSet', 'true');

    // Set alarm time
    localStorage.setItem('alarmTime', time);

    // Disable selection of time when alarm is set
    localStorage.setItem('contentClass', 'content flex disable');
    content.className = localStorage.getItem('contentClass');

    // Set button text to "Clear Alarm";
    localStorage.setItem('btnText', 'Clear Alarm');
    setAlarmBtn.textContent = localStorage.getItem('btnText');

    // Set Alarm Time indicator
    alarmTimeIndicator.textContent = 'Alarm Time set to: ' + localStorage.getItem('alarmTime');
    alarmTimeIndicator.classList.remove('d-none');

    // Set user exited to false to avoid DOM exception
    localStorage.setItem('userExited', 'xxx');
};

// Hide Welcome Screen
const hideWelcomeScreen = () => {
    // Hide Welcome Screen
    welcomeBackScreen.classList.add('d-none');

    // Set alarm time indicator
    alarmTimeIndicator.textContent = 'Alarm Time set to: ' + localStorage.getItem('alarmTime');

    // Set userExited to xxx to avoid DomException
    localStorage.setItem('userExited', 'xxx');

    // Set want to play to play the ringtone even if the time has expired
    localStorage.setItem('wantToPlay', 'yes');
};

// Event Listeners
setAlarmBtn.addEventListener('click', setAlarm);
resumeBtn.addEventListener('click', hideWelcomeScreen);

// Check if the user has exited the page or refreshed
const beforeUnloadListener = (event) => {
    localStorage.setItem('userExited', 'true');
};
window.addEventListener('beforeunload', beforeUnloadListener);
