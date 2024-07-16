let loginAttempts = 0;
let isAdminLoggedIn = false;



document.getElementById("loginButton").addEventListener("click", handleLogin);
document.getElementById("clearLogButton").addEventListener("click", clearLog);
document.getElementById("downloadButton").addEventListener("click", downloadLog);

// Add event listener for Enter key on password input field
document.getElementById("password").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission by default form action
    handleLogin();
  }
});

// Main login handler
async function handleLogin(event) {
  event.preventDefault();

  if (!withinAllowedTime()) {
    showNotification("Login not allowed outside 6:00 AM to 9:00 PM.", true);
    return;
  }

  if (loginAttempts >= 3) {
    showNotification("Too many failed attempts. Please try again later.", true);
    return;
  }

  const passwordInput = document.getElementById("password").value;
  const users = getAllUsers();
  const adminPassword = "Bangel1995121."; // Set your admin password here

  // Check if user is admin
  if (passwordInput === adminPassword) {
    isAdminLoggedIn = true;
    showNotification("Admin login successful.");
  } else {
    const user = users.find((u) => u.password === passwordInput);
    if (user) {
      try {
        const photoData = await capturePhoto();
        saveLogin(user.name, photoData);
      } catch (error) {
        showNotification("Error capturing photo. Please try again.", true);
      }
    } else {
      loginAttempts++;
      showNotification("Invalid password. Please try again.", true);
    }
  }

  document.getElementById("password").value = "";
}

// Clear chat log and localStorage (restricted to admin)
function clearLog() {
  if (isAdminLoggedIn && confirm("Are you sure you want to clear the log?")) {
    localStorage.removeItem("loginData");
    const chatLogTable = document
      .getElementById("chatLogTable")
      .getElementsByTagName("tbody")[0];
    while (chatLogTable.rows.length > 0) {
      chatLogTable.deleteRow(0);
    }
    showNotification("Log cleared successfully.");
  } else {
    showNotification("Admin access required to clear log.", true);
  }
}

// Download the log (restricted to admin)
function downloadLog() {
  if (isAdminLoggedIn) {
    const logs = JSON.parse(localStorage.getItem("loginData")) || [];
    const worksheet = XLSX.utils.json_to_sheet(logs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Log Data");
    XLSX.writeFile(workbook, "log_data.xlsx");
    showNotification("Log downloaded successfully.");
  } else {
    showNotification("Admin access required to download log.", true);
  }
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
    updateChatLog(name, currentTime, photoData);
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
  const cell4 = row.insertCell(3);
  
  cell1.textContent = name;
  cell2.textContent = currentTime.toLocaleDateString();
  cell3.textContent = currentTime.toLocaleTimeString();

  const image = new Image();
  image.src = photoData;
  image.style.maxWidth = "100px";
  cell4.appendChild(image);

  // Check if user is admin
  if (isAdmin(name)) {
    row.classList.add("admin-row"); // Apply admin row styling if needed
  } else {
    // Apply red highlight if login is after 10:00 AM
    if (currentTime.getHours() >= 10) {
      row.classList.add("highlight-red");
    }
  }
}

// Check if the user is an admin (for admin row styling)
function isAdmin(name) {
  const adminUsers = ["Admin"]; // Add admin usernames here
  return adminUsers.includes(name);
}


// Get list of valid users
function getAllUsers() {
  return [
    { name: "Beatrice T. Jlopleh", password: "0040" },
    { name: "Emmanuel S. Hare", password: "0032" },
    { name: "Augustus M. Howard", password: "0388" },
    { name: "Mercy Fallah", password: "0416" },
    { name: "Grace B. Satiah", password: "0431" },
    { name: "Amos Y. Nayon", password: "0334" },
    { name: "Sam W. Howe", password: "0033" },
    { name: "G. Edward Sumo", password: "0383" },
    { name: "Elijah G. Tarr", password: "0401" },
    { name: "Chris J. Wolo", password: "0017" },
    { name: "Cornelius B. Wahmah", password: "0442" },
    { name: "Sekou Soko Sackor", password: "0022" },
    { name: "Watta B. Nyei", password: "0332" },
    { name: "Joseph Morris", password: "0091" },
    { name: "Floyd O. Sayor", password: "0180" },
    { name: "Thomas Tayee Tarl", password: "0378" },
    { name: "Dayton W. Kloh", password: "0054" },
    { name: "Eli Clarke", password: "0392" },
    { name: "Korto K. Yorvos", password: "0382" },
    { name: "Juluis S. O. Fayiah", password: "0118" },
    { name: "Moses Kanneh", password: "0342" },
    { name: "Michael F. Fayiah", password: "0379" },
    { name: "Daniette Chi Chi Klimeh", password: "0145" },
    { name: "George Z. Innis", password: "0301" },
    { name: "Morris G. Wei", password: "0380" },
    { name: "Musulyn L. Kollie", password: "0172" },
    { name: "Eric S. Krayee", password: "0426" },
    { name: "Anthony Sengbe", password: "0060" },
    { name: "Frederick W. Sonpon", password: "0020" },
    { name: "Francis G. Subah", password: "0045" },
    { name: "Mauretta D. Kollie", password: "0413" },
    { name: "Emmanuel Cheeseman", password: "0455" },
    { name: "Jickson G. Freeman", password: "0456" },
    { name: "Joseph V. Raynes", password: "0441" },
    { name: "Alvin T. Jalloh Esq.", password: "0299" },
    { name: "Cephas N. Teewia", password: "0038" },
    { name: "Fofee V.H. Sherif", password: "0347" },
    { name: "Darling Y. F. Wiles", password: "0147" },
    { name: "Amos W.S. Kamara", password: "0302" },
    { name: "Philip McCauley Sumo", password: "0412" },
    { name: "Muana S. Ville", password: "0042" },
    { name: "Fomba A.M. Swaray", password: "0209" },
    { name: "Annie W. Broderick", password: "0365" },
    { name: "Emmanuel K. Kerkula", password: "0039" },
    { name: "Samuel B. Cole", password: "0193" },
    { name: "Precious J. Maurice", password: "0168" },
    { name: "Lawrence G. Sumo", password: "0448" },
    { name: "R. Jawah Gray", password: "0043" },
    { name: "Marlene G. Wogbeh", password: "0046" },
    { name: "Sylvester M. Paye", password: "0064" },
    { name: "Korpo T. Tokpah", password: "0065" },
    { name: "Michael S. Nabieu", password: "0348" },
    { name: "Theresa Saybay", password: "0315" },
    { name: "Syvester N. Sieh", password: "0443" },
    { name: "Johnson Garwon", password: "0389" },
    { name: "Nathan P. Garbie", password: "0130" },
    { name: "Ade N.N. Vannie", password: "0056" },
    { name: "Anthony Glayenenneh", password: "0450" },
    { name: "Emma K. Togba", password: "0152" },
    { name: "Fatu K. Kawala", password: "0098" },
    { name: "Sabastian F. Kolubah", password: "0404" },
    { name: "Pauline G. Korkoyah", password: "0052" },
    { name: "Anthony S. Koisee", password: "0034" },
    { name: "Elizabeth W.N. Kanwee", password: "0051" },
    { name: "D.Darkennah S. Wilson Jr.", password: "0430" },
    { name: "Joyce T. Randall", password: "0403" },
    { name: "Patrick B. Nimely", password: "0055" },
    { name: "Joyce T. Samuel", password: "0318" },
    { name: "Cherry T. Roberts", password: "0432" },
    { name: "Gertrude K. Wilson Sargbeh", password: "0418" },
    { name: "James Dogbey", password: "0179" },
    { name: "Edna G. Freeman", password: "0386" },
    { name: "Frederick Hena", password: "0355" },
    { name: "Vivian N. Kekula", password: "0053" },
    { name: "Joseph H. Kerkulah", password: "0300" },
    { name: "Philimena Bloh Doe", password: "0437" },
    { name: "Crayton M. Kamara", password: "0296" },
    { name: "Maria M. Horace", password: "0070" },
    { name: "Alexander Romeo Kollie", password: "0410" },
    { name: "Kun C. Lewis", password: "0125" },
    { name: "Gasumu T. Fahnbulleh", password: "0108" },
    { name: "Milton T. Ford", password: "0109" },
    { name: "Oretha M. Tipayson", password: "0111" },
    { name: "Benjamin Browne", password: "0115" },
    { name: "Samuel R. Coker", password: "0121" },
    { name: "Kenneth J. Moore, II", password: "0112" },
    { name: "Varnie Fomba", password: "0120" },
    { name: "Othello M. Moluwolo", password: "0116" },
    { name: "Gamilah Tarnue Korvah", password: "0124" },
    { name: "Jackson Nah", password: "0127" },
    { name: "Anthony M. Jasper", password: "0123" },
    { name: "Elijah S. Monger", password: "0126" },
    { name: "Edward Scott", password: "0380" },
    { name: "Amos F. Vakun", password: "0378" },
    { name: "David Tehmeh", password: "0379" },
    { name: "J. Werti Swen", password: "0159" },
    { name: "Prince Y. Alpha", password: "0438" },
    { name: "Augustine K. Gayflor", password: "0106" },
    { name: "J. William Zorr", password: "0398" },
    { name: "Daniel P. M’Bayo", password: "0074" },
    { name: "Foday S. Thomas", password: "0075" },
    { name: "Abraham B. Kiazolu", password: "0076" },
    { name: "Fatu B. Kanneh", password: "0354" },
    { name: "Numehne C. Reeves", password: "0079" },
    { name: "Tee K. Domah", password: "0080" },
    { name: "Malonga Jallah Sorsor", password: "0081" },
    { name: "Daniel Arhie Tompo", password: "0384" },
    { name: "James Z Wehyee", password: "0084" },
    { name: "M. Fodee Kanneh", password: "0086" },
    { name: "Augustine L. Kortu", password: "0087" },
    { name: "Mohammed M. Kamara", password: "0088" },
    { name: "Benjamin S. B. Karmo", password: "0089" },
    { name: "Elton Kpaka", password: "0410" },
    { name: "Fodee Jalloh", password: "0337" },
    { name: "Joseph F. Rogers", password: "0092" },
    { name: "Varney M. Kolleh", password: "0093" },
    { name: "Yaw Jermaine Godfrey", password: "0094" },
    { name: "Nicolas K. Vaye", password: "0393" },
    { name: "Bendu B. Z. Kolenky", password: "0050" },
    { name: "Juluis K. Allison", password: "0312" },
    { name: "Allison Z. Logan", password: "0102" },
    { name: "Zekia D. K. Seisay", password: "0402" },
    { name: "Johnson M. Gbee", password: "0333" },
    { name: "Timothy S. Mulbah", password: "0095" },
    { name: "Angela W. Collins", password: "0451" },
    { name: "Gifty Roberts", password: "0173" },
    { name: "Michael D. Sheriff", password: "0058" },
    { name: "Melvin K. Fula", password: "0417" },
    { name: "Lovette B. Myme", password: "0356" },
    { name: "Kanio B. Fahnbulleh", password: "0359" },
    { name: "Godfrey B. Harris", password: "0424" },
    { name: "Kaiton O. J. Wilson", password: "0422" },
    { name: "Richard O. Kieh", password: "0425" },
    { name: "Peter G. Ballah", password: "0427" },
    { name: "Tibious Willie", password: "0394" },
    { name: "Kaine E. Tayee", password: "0313" },
    { name: "Tewah Gblor", password: "0192" },
    { name: "Ruth B. Sayeh", password: "0381" },
    { name: "Abraham K. Doupu", password: "0423" },
    { name: "Anthony T. Johnson", password: "0385" },
    { name: "Sylvester O. Dahn", password: "0387" },
    { name: "Matthew J. Jallah", password: "0420" },
    { name: "Dennis Kollie", password: "0374" },
    { name: "Jacob B. Guannu", password: "0415" },
    { name: "Prince T. Karbah", password: "0390" },
    { name: "Robert S. Jallah", password: "0062" },
    { name: "Josephus H. Jallah", password: "0063" },
    { name: "James B. Flomo", password: "0453" },
    { name: "Joel M. Jallah", password: "0433" },
    { name: "Rose V. Toe", password: "0059" },
    { name: "Gloria S. Joe", password: "0067" },
    { name: "Williams S. Tarr", password: "0366" },
    { name: "Richard E. Fahnbulleh", password: "0057" },
    { name: "Elijah P. Klalah", password: "0435" },
    { name: "Jacob K. Wariebi", password: "0407" },
    { name: "Stephen K. Ketah", password: "0316" },
    { name: "Simon B. Keita", password: "0440" },
    { name: "Eric S. Leesor", password: "0408" },
    { name: "Alpha J. Karbie", password: "0419" },
    { name: "Jeremiah J. Harris", password: "0449" },
    { name: "Victoria M. Williams", password: "0071" },
    { name: "Jefferson V. Cole", password: "0090" },
    { name: "Oscar M. Hunder", password: "0360" },
    { name: "Alexander K. Vaye", password: "0174" },
    { name: "James G. Tweh", password: "0175" },
    { name: "Samson R. Blapoh", password: "0176" },
    { name: "G. Alvin Weah", password: "0177" },
    { name: "Joseph M. Dunbar", password: "0336" },
    { name: "Jerry K. Fahnbulleh", password: "0338" },
    { name: "Roland S. David", password: "0339" },
    { name: "Roland W. Kpadeh", password: "0341" },
    { name: "Jesse T. Dean", password: "0343" },
    { name: "Matthew F. Ballay", password: "0345" },
    { name: "Bill T. Kanneh", password: "0346" },
    { name: "Fannoh S. Farley", password: "0368" },
    { name: "Vivian S. Deh", password: "0397" },
    { name: "Benjamin J. Sarnor", password: "0367" },
    { name: "Glenna H. Dean", password: "0399" },
    { name: "Steve S. Powo", password: "0400" },
    { name: "Victoria K. Fatu", password: "0406" },
    { name: "Marvin A. Findley", password: "0409" },
    { name: "Alieu Bah", password: "0361" },
    { name: "Marthaline T. Satiah", password: "0362" },
    { name: "David S. Nyanford", password: "0068" },
    { name: "Ernest L. Greene", password: "0357" },
    { name: "Anthony S. Saylee", password: "0364" },
    { name: "Lansanna S. Sackor", password: "0369" },
    { name: "S. Andrew Pennoh", password: "0370" },
    { name: "G. Paul D. Beah", password: "0371" },
    { name: "Caleb C. Jeah", password: "0373" },
    { name: "Emmanuel C. Karmoh", password: "0375" },
    { name: "Elliot O. Sawe", password: "0376" },
    { name: "Paul G. Kamara", password: "0396" },
    { name: "David K. Dweh", password: "0414" },
    { name: "Lewis V.S. Dobson", password: "0314" },
    { name: "Cephas W. Taylor", password: "0411" },
    { name: "Hannah K. Kollie", password: "0452" },
    { name: "George P. Koiboi", password: "0428" },
    { name: "Hassan D. Mohammed", password: "0429" },
    { name: "Abraham M. Kromah", password: "0421" },
    { name: "James O. Fallah", password: "0454" },
    { name: "Maima Harris", password: "0434" },
    { name: "Momoh F. Sheriff", password: "0445" },
    { name: "Bendu B. Kortu", password: "0458" },
    { name: "Ephraim S. Sanoe", password: "0047" },
    { name: "Christopher David", password: "0031" },
    { name: "Maima B. Kamara", password: "0030" },
    { name: "Soko L. Kamara", password: "0018" },
    { name: "Roseline B. Davies", password: "0436" },
    { name: "Varney B. Johnson", password: "0363" },
    { name: "Mouna Bah", password: "0352" },
    { name: "G. Yarmu Wheayou", password: "0447" },
    { name: "Lydia K. Varney", password: "0457" },
    { name: "Isaac Y. Momoh", password: "0446" },
    { name: "Alphonso B. Dennis", password: "0353" },
    { name: "Prince S. Jallah", password: "0427" },
    { name: "Yaw L. Harris", password: "0303" },
    { name: "Samuel P. Manns", password: "0310" },
    { name: "Christine D. Baney", password: "0306" },
    { name: "Grace G. Kartee", password: "0320" },
    { name: "Beatrix S. Doe", password: "0309" },
    { name: "Edward Q. Toe", password: "0358" },
    { name: "Sheku M. Kamara", password: "0027" },
    { name: "Daniel K. D. Lavela", password: "0459" },
    { name: "Anthony B. K. Harris", password: "0198" },
    { name: "J. Paye Kiawu", password: "0216" },
    { name: "Victor M. Gbla", password: "0220" },
    { name: "James P. Farkollie", password: "0183" },
    { name: "Elvis S. Sackor", password: "0222" },
    { name: "Bendu J. Morris", password: "0212" },
    { name: "Morris K. Blay", password: "0221" },
    { name: "Edwin E. Tokpa", password: "0218" },
    { name: "Tom A. Wreh", password: "0219" },
    { name: "T. Alex Nuah", password: "0214" },
    { name: "D. Karfiah K. Taylor", password: "0217" },
    { name: "Charles O. Momo", password: "0213" },
    { name: "J. Joe Karmo", password: "0215" },
    { name: "Ann M. Whe", password: "0211" },
    { name: "Benedict E. Bah", password: "0208" },
    { name: "Daniel Y. Mulbah", password: "0204" },
    { name: "Bai M. Sheriff", password: "0207" },
    { name: "Abraham T. Sherman", password: "0188" },
    { name: "Korlia C. Sherrif", password: "0197" },
    { name: "Lawrence F. Morteh", password: "0190" },
    { name: "Edwin S. Kamara", password: "0191" },
    { name: "Aarion C. Sayon", password: "0189" },
    { name: "James P. Seke", password: "0202" },
    { name: "Paulinus M. Tuah", password: "0201" },
    { name: "Trokon P. Giddings", password: "0206" },
    { name: "George B. Laye", password: "0203" },
    { name: "J. Lionel S. Kortimai", password: "0205" },
    { name: "Elizabeth E. David", password: "0182" },
    { name: "Prince A. Nyemah", password: "0200" },
    { name: "Joseph M. Kennedy", password: "0195" },
    { name: "Abigail S. Kayah", password: "0185" },
    { name: "Christian O. Blama", password: "0184" },
    { name: "F. Puti Z. Bestman", password: "0194" },
    { name: "Esther M. Kamara", password: "0196" },
    { name: "Sando P. Smith", password: "0186" },
    { name: "Yei S. Kamara", password: "0187" },
    { name: "Henry K. Fannoh", password: "0001" },
    { name: "Momoh T. Barkon", password: "0002" },
    { name: "Sylvester A. Toe", password: "0003" },
    { name: "Albert A. B. Gaye", password: "0004" },
    { name: "Daniel K. Ndorleh", password: "0005" },
    { name: "J. Gabriel Farkollie", password: "0006" },
    { name: "Joseph F. D. Zinnah", password: "0007" },
    { name: "P. Junior Peabody", password: "0008" },
    { name: "George O. K. Dagoseh", password: "0009" },
    { name: "Elton S. Sogbandi", password: "0010" },
    { name: "Micheal S. Anthony", password: "0011" },
    { name: "Anthony B. Slewion", password: "0012" },
    { name: "Boimah S. Nyanford", password: "0013" },
    { name: "Daniel M. Kuyon", password: "0014" },
    { name: "Henry G. Sackie", password: "0015" },
    { name: "Amos K. Baglisah", password: "0016" },
    { name: "James W. Yougbah", password: "0019" },
    { name: "Hawa F. Mansaray", password: "0021" },
    { name: "Vamuyan S. Dukuray", password: "0023" },
    { name: "David K. G. Kleeme", password: "0024" },
    { name: "Charles L. N. Klansay", password: "0025" },
    { name: "Yaw M. G. Dennis", password: "0026" },
    { name: "Junior S. Kwofie", password: "0028" },
    { name: "Prince A. Sampson", password: "0029" },
    { name: "E. Samuel G. R.Gbuoyor", password: "0035" },
    { name: "Christopher B. Joe", password: "0036" },
    { name: "M. Joseph Deah", password: "0037" },
    { name: "Daniel R. Karfee", password: "0041" },
    { name: "Alexander D. K. Doe", password: "0044" },
    { name: "Josephus R. Jalloh", password: "0048" },
    { name: "J. Sackor Gweh", password: "0049" },
    { name: "Alexander B. Goah", password: "0030" },
    { name: "Josephus V. Jallah", password: "0031" },

    // Add more users as needed
  ];
}

// Check if current time is within allowed login window (6:00 AM to 9:00 PM)
function withinAllowedTime() {
  const now = new Date();
  const start = new Date();
  const end = new Date();

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

// Capture photo using device camera
async function capturePhoto() {
  const video = document.createElement("video");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    return new Promise((resolve, reject) => {
      video.onloadedmetadata = () => {
        video.play();
      };

      video.onplaying = () => {
        setTimeout(() => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext("2d");
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          stream.getTracks().forEach((track) => track.stop());

          resolve(canvas.toDataURL("image/png"));
        }, 100);
      };

      video.onerror = (error) => {
        reject(new Error("Failed to play video: " + error.message));
      };
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to capture photo.");
  }
}

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
  }, 3000);
}

// Initialize camera
document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("video");

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function (error) {
        console.error("Error accessing the camera: ", error);
        showNotification(
          "Error accessing the camera. Please check your camera settings.",
          true
        );
      });
  } else {
    console.error("getUserMedia not supported by this browser.");
    showNotification("Your browser does not support camera access.", true);
  }
});

// Initialize the chat log on page load
function initializeChatLog() {
  const logs = JSON.parse(localStorage.getItem("loginData")) || [];
  logs.forEach((log) => {
    updateChatLog(log.name, new Date(log.time), log.photo);
  });
}

// Call initializeChatLog on page load
window.addEventListener("DOMContentLoaded", initializeChatLog);


document.addEventListener("DOMContentLoaded", () => {
  emailjs.init("service_6u734sn");

  // Sample attendance data
  let attendanceData = [
    { name: "Alice", time: "2024-07-01 08:00:00", gender: "female" },
    { name: "Bob", time: "2024-07-01 08:05:00", gender: "male" },
    { name: "Charlie", time: "2024-07-01 08:10:00", gender: "male" },
    // Add more data as needed
  ];

  // Group data by date
  function groupByDate(data, interval) {
    return data.reduce((acc, curr) => {
      const date = new Date(curr.time);
      let key;
      switch (interval) {
        case "daily":
          key = date.toLocaleDateString();
          break;
        case "weekly":
          const weekNumber = Math.ceil(date.getDate() / 7);
          key = `${date.getFullYear()}-W${weekNumber}`;
          break;
        case "monthly":
          key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          break;
        case "yearly":
          key = `${date.getFullYear()}`;
          break;
      }
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);
      return acc;
    }, {});
  }

  // Analyze male and female attendance
  function analyzeGender(data) {
    let maleCount = 0;
    let femaleCount = 0;
    data.forEach((entry) => {
      if (entry.gender === "male") {
        maleCount++;
      } else if (entry.gender === "female") {
        femaleCount++;
      }
    });
    return { male: maleCount, female: femaleCount };
  }

  // Update the analysis summary
  function updateAnalysisSummary(analysis) {
    const summary = document.getElementById("analysisSelect");
    summary.innerHTML = `
              <p>Male: ${analysis.male}</p>
              <p>Female: ${analysis.female}</p>
          `;
  }

  // Initialize the chart
  const ctx = document.getElementById("attendanceChart").getContext("2d");
  const attendanceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [], // Dates will be added dynamically
      datasets: [
        {
          label: "Number of Logins",
          data: [], // Data points will be added dynamically
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
          },
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Number of Logins",
          },
        },
      },
    },
  });

  // Update the chart with new data
  function updateChart(data, interval) {
    const groupedData = groupByDate(data, interval);
    const labels = Object.keys(groupedData);
    const logins = labels.map((date) => groupedData[date].length);
    attendanceChart.data.labels = labels;
    attendanceChart.data.datasets[0].data = logins;
    attendanceChart.update();

    const analysis = analyzeGender(data);
    updateAnalysisSummary(analysis);
  }

  // Initial update with existing data
  updateChart(attendanceData, "daily");

  // Handle dropdown change for analysis view
  document
    .getElementById("analysisSelect")
    .addEventListener("change", (event) => {
      const selectedValue = event.target.value;
      updateChart(attendanceData, selectedValue);
    });

  // Download log and analysis
  document
    .getElementById("downloadButton")
    .addEventListener("click", () => {
      const table = document.getElementById("chatLogTable");
      const analysisCanvas = document.getElementById("attendanceChart");

      // Download table as image
      html2canvas(table).then((tableCanvas) => {
        const link = document.createElement("a");
        link.href = tableCanvas.toDataURL("image/png");
        link.download = "chat-log.png";
        link.click();
      });

      // Download analysis graph as image
      html2canvas(analysisCanvas).then((graphCanvas) => {
        const link = document.createElement("a");
        link.href = graphCanvas.toDataURL("image/png");
        link.download = "attendance-analysis.png";
        link.click();
      });
    });

  // Example function to add a new login entry
  function addLoginEntry(name, time, gender) {
    attendanceData.push({ name, time, gender });
    updateChart(
      attendanceData,
      document.getElementById("analysisSelect").value
    );
  }

  // Example: Add a new login entry dynamically
  addLoginEntry("Dave", "2024-07-01 08:15:00", "male");
});