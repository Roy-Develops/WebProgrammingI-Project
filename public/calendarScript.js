document.addEventListener("DOMContentLoaded", function () {
  const calendarElement = document.getElementById("calendar");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Add weekday headers
  weekdays.forEach((day) => {
    const dayElement = document.createElement("div");
    dayElement.textContent = day;
    dayElement.classList.add("day", "weekday");
    calendarElement.appendChild(dayElement);
  });

  // Fill in the blanks for the first week
  for (let i = 0; i < firstDayOfMonth; i++) {
    const blankElement = document.createElement("div");
    blankElement.classList.add("day");
    calendarElement.appendChild(blankElement);
  }

  // Fill in the actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");
    dayElement.textContent = day;
    dayElement.classList.add("day");
    dayElement.onclick = function () {
      this.classList.toggle("reserved");
    };
    calendarElement.appendChild(dayElement);
  }
});
document.getElementById("reservationForm").onsubmit = function (event) {
  event.preventDefault();

  const reservedDates = Array.from(
    document.querySelectorAll(".day.reserved")
  ).map((element) => element.textContent);
  document.getElementById("reservedDates").value =
    JSON.stringify(reservedDates);

  fetch("/reserve-dates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reservedDates: reservedDates }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Success:", data))
    .catch((error) => console.error("Error:", error));
};
