let loginAttempts = 0;

// Show notification
function showNotification(message, isError = false) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.remove("hidden");
  if (isError) {
    notification.classList.add("error");
  } else {
    notification.classList.remove("error");
  }

  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3000); // Hide after 3 seconds
}

// Check if current time is within allowed login window (6:00 AM to 9:00 PM)
function withinAllowedTime() {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  start.setHours(6, 0, 0); // 6:00 AM
  end.setHours(9, 30, 0); // 9:30 am

  return now >= start && now <= end;
}

// Check if two dates are on the same day
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Save login data to localStorage and update chat log
function saveLogin(name, photoData) {
  const currentTime = new Date();
  const log = { name, time: currentTime.toLocaleString(), photo: photoData };

  let logs = JSON.parse(localStorage.getItem("loginData")) || [];
  const nameLoggedToday = logs.some(
    (log) => log.name === name && isSameDay(new Date(log.time), currentTime)
  );

  if (!nameLoggedToday) {
    logs.push(log);
    localStorage.setItem("loginData", JSON.stringify(logs));
    updateChatLog(name, currentTime, photoData); // Pass photoData to updateChatLog
    showNotification("You have successfully logged in!");
  } else {
    showNotification(`${name} has already logged in today.`, true);
  }
}

// Update chat log table with new login entry
function updateChatLog(name, currentTime, photoData) {
  const chatLogTable = document
    .getElementById("chatLogTable")
    .getElementsByTagName("tbody")[0];
  const row = chatLogTable.insertRow();
  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  const cell3 = row.insertCell(2);
  const cell4 = row.insertCell(3); // Add a cell for photoData
  cell1.textContent = name;
  cell2.textContent = currentTime.toLocaleDateString();
  cell3.textContent = currentTime.toLocaleTimeString();

  // Create an image element to display in the cell
  const image = new Image();
  image.src = photoData;
  image.style.maxWidth = "100px"; // Adjust max width as needed
  cell4.appendChild(image);
}

// Get list of valid users
function getAllUsers() {
  return [
    { name: "Alice", password: "123" },
    { name: "Bob", password: "123" },
    { name: "Charlie", password: "123" },
    { name: "Emmanuel", password: "123" },
    // Add more users as needed
  ];
}

// Handle user login attempt
function handleLogin() {
  const nameInput = document.getElementById("name");
  const passwordInput = document.getElementById("password");
  const name = nameInput.value.trim();
  const password = passwordInput.value.trim();

  // Validate inputs
  if (!name || !password) {
    showNotification("Please enter your name and password", true);
    return;
  }

  const validUsers = getAllUsers();
  const user = validUsers.find(
    (user) => user.name === name && user.password === password
  );

  if (!user) {
    loginAttempts++;
    if (loginAttempts >= 3) {
      showNotification("You have exceeded the maximum login attempts.", true);
      return;
    }
    showNotification("Invalid name or password. Please try again.", true);
    return;
  }

  if (withinAllowedTime()) {
    const logs = JSON.parse(localStorage.getItem("loginData")) || [];
    const nameLoggedToday = logs.some(
      (log) => log.name === name && isSameDay(new Date(log.time), new Date())
    );

    if (!nameLoggedToday) {
      capturePhoto((photoData) => {
        saveLogin(name, photoData);
        showNotification("Your photo has been captured!");
        nameInput.value = "";
        passwordInput.value = "";
        loginAttempts = 0; // Reset login attempts on successful login
      });
    } else {
      showNotification("You have already logged in today.", true);
    }
  } else {
    showNotification(
      "Login is only allowed between 6:00 AM and 9:00 PM.",
      true
    );
  }
}

// Capture photo from webcam
function capturePhoto(callback) {
  const video = document.getElementById("video");
  const canvas = document.createElement("canvas"); // Create a canvas element
  canvas.width = video.videoWidth; // Set canvas dimensions to match video
  canvas.height = video.videoHeight;
  const context = canvas.getContext("2d");

  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const photoData = canvas.toDataURL("image/jpeg", 0.5); // Changed to JPEG and reduced quality (adjust as needed)
  callback(photoData);
}

// Clear chat log table
function clearChat() {
  const chatLogTable = document
    .getElementById("chatLogTable")
    .getElementsByTagName("tbody")[0];
  chatLogTable.innerHTML = "";
}

// Clear all stored login data
function clearLog() {
  localStorage.removeItem("loginData");
  clearChat();
  showNotification("Log has been cleared.");
}

// Download log as a file
function downloadLog() {
  const logs = JSON.parse(localStorage.getItem("loginData")) || [];
  if (logs.length === 0) {
    showNotification("No logs available to download.", true);
    return;
  }

  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(
    logs.map((log) => ({
      Name: log.name,
      Date: new Date(log.time).toLocaleDateString(),
      Time: new Date(log.time).toLocaleTimeString(),
      Photo: log.photo, // Include photoData here
    }))
  );

  // Create a workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Log");

  // Create an Excel file and download it
  const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelFile], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "login_log.xlsx";
  a.click();
  URL.revokeObjectURL(url);
  showNotification("Log has been downloaded.");
}

// Initialize the page
window.onload = () => {
  // Load existing logs into chat log table
  const logs = JSON.parse(localStorage.getItem("loginData")) || [];
  logs.forEach((log) => {
    updateChatLog(log.name, new Date(log.time), log.photo);
  });

  // Initialize webcam
  const video = document.getElementById("video");
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      console.error("Error accessing the webcam: " + err);
      showNotification("Error accessing the webcam.", true);
    });

  // Add event listener for Clear Log button
  document.getElementById("clearLogButton").addEventListener("click", clearLog);

  // Add event listener for Download Log button
  document
    .getElementById("downloadButton")
    .addEventListener("click", downloadLog);

  // Add event listener for Login button
  document.getElementById("loginButton").addEventListener("click", handleLogin);
};

if (module.hot) {
  module.hot.accept();
}
