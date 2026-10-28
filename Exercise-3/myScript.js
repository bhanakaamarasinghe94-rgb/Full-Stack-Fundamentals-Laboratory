let currentHour = new Date().getHours();
let greeting;

if (currentHour < 12) {
    greeting = "Good Morning!";
} else if (currentHour < 15) {
    greeting = "Good Afternoon!";
} else {
    greeting = "Good Evening!";
}

document.getElementById("greeting").textContent = greeting;
