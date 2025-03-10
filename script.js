document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("div[id]");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    window.addEventListener("scroll", function () {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 50) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });
});

// Bejelentkezés
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;
    
    fetch("http://localhost:3301/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert("Sikeres bejelentkezés!");

            const userRole = data.user.role;  // Most már "admin" vagy "user"

            if (rememberMe) {
                localStorage.setItem("loggedInUser", JSON.stringify(data.user));
                localStorage.setItem("userRole", userRole);
            } else {
                sessionStorage.setItem("loggedInUser", JSON.stringify(data.user));
                sessionStorage.setItem("userRole", userRole);
            }

            console.log("Bejelentkezett felhasználó:", data.user); // Ellenőrzés

            window.location.href = userRole === "admin" ? "esemenyek.html" : "index.html";
        }
    })
    .catch(error => console.error("Hiba:", error));
}

// Regisztráció
function register() {
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const message = document.getElementById("message");

    // Ellenőrizzük, hogy minden mező ki van-e töltve
    if (!email || !username || !password || !confirmPassword) {
        message.style.color = "red";
        message.textContent = "Minden mezőt ki kell tölteni!";
        return;
    }

    // Ellenőrizzük az e-mail formátumát
    if (!isValidEmail(email)) {
        message.style.color = "red";
        message.textContent = "Az e-mail cím formátuma nem megfelelő!";
        return;
    }

    // Ellenőrizzük, hogy a jelszó megfelel-e a biztonsági követelményeknek
    if (!isValidPassword(password)) {
        message.style.color = "red";
        message.textContent = "A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell egy nagybetűt és egy számot!";
        return;
    }

    // Ellenőrizzük, hogy a két jelszó megegyezik-e
    if (password !== confirmPassword) {
        message.style.color = "red";
        message.textContent = "A két jelszó nem egyezik!";
        return;
    }

    // Küldés a szervernek
    fetch("http://localhost:3301/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            message.style.color = "red";
            message.textContent = data.error;
        } else {
            message.style.color = "green";
            message.textContent = "Sikeres regisztráció!";
            setTimeout(() => window.location.href = "bejelentkezes.html", 2000);
        }
    })
    .catch(error => console.error("Hiba:", error));
}

// E-mail validálás funkció
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Jelszó validálás funkció
function isValidPassword(password) {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordPattern.test(password);
}

// Bejelentkezési értesítés
document.addEventListener("DOMContentLoaded", () => {
    const justLoggedIn = sessionStorage.getItem("justLoggedIn");
    const loggedInUser = sessionStorage.getItem("loggedInUser");

    if (justLoggedIn === "true" && loggedInUser) {
        alert(`Üdvözlünk, ${loggedInUser}!`);
        sessionStorage.removeItem("justLoggedIn");
    }
});

// Ki-be jelentkezés gomb
document.addEventListener("DOMContentLoaded", () => {
    const loginLogoutBtn = document.getElementById("loginLogoutBtn");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (!loginLogoutBtn) {
        console.error("HIBA: A loginLogoutBtn elem nem található a DOM-ban!");
        return;
    }

    if (loggedInUser) {
        console.log(`Bejelentkezett felhasználó: ${loggedInUser.username}`);
        loginLogoutBtn.textContent = "Kijelentkezés";
        loginLogoutBtn.href = "#";

        loginLogoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("Kijelentkezés gombra kattintottál!");

            sessionStorage.clear();
            localStorage.removeItem("loggedInUser");

            alert("Sikeresen kijelentkeztél!");
            window.location.href = "index.html";
        });

    } else {
        console.log("Nincs bejelentkezve felhasználó.");
        loginLogoutBtn.textContent = "Bejelentkezés";
        loginLogoutBtn.href = "bejelentkezes.html";
    }
});



// Admin
// Admin funkciók betöltése
document.addEventListener("DOMContentLoaded", () => {
    const userRole = sessionStorage.getItem("userRole") || localStorage.getItem("userRole");
    
    if (userRole === "admin") {
        const adminButton = document.getElementById("adminButton");
        if (adminButton) {
            adminButton.style.display = "inline";
        }
    }

    document.getElementById('adminButton').addEventListener('click', function() {
        window.location.href = 'admin.html';  // Itt cseréld le az '/admin' URL-t, ha más URL-re akarod átirányítani.
    });

    // Felhasználók listázása gomb eseménykezelője
    const fetchUsersButton = document.getElementById("fetchUsersButton");
    if (fetchUsersButton) {
        fetchUsersButton.addEventListener("click", fetchUsers);
    } else {
        console.error("HIBA: A fetchUsersButton elem nem található a DOM-ban!");
    }

    // Események listázása gomb eseménykezelője
    const fetchEventsButton = document.getElementById("fetchEventsButton");
    if (fetchEventsButton) {
        fetchEventsButton.addEventListener("click", fetchEvents);
    } else {
        console.error("HIBA: A fetchEventsButton elem nem található a DOM-ban!");
    }
});

// Felhasználók listázása
function fetchUsers() {
    fetch("http://localhost:3301/users")
        .then(response => response.json())
        .then(users => {
            const userList = document.getElementById("userList");
            userList.innerHTML = "";
            users.forEach(user => {
                const li = document.createElement("li");
                li.textContent = `${user.username} (${user.email}) - ${user.role}`;

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Törlés";
                deleteBtn.onclick = () => deleteUser(user.id);

                li.appendChild(deleteBtn);
                userList.appendChild(li);
            });
        })
        .catch(error => console.error("Hiba:", error));
}

// Felhasználó törlése
function deleteUser(userId) {
    fetch(`http://localhost:3301/users/${userId}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchUsers();
        })
        .catch(error => console.error("Hiba:", error));
}

// Események listázása
function fetchEvents() {
    fetch("http://localhost:3301/esemenyek")
        .then(response => response.json())
        .then(events => {
            const eventList = document.getElementById("eventList");
            eventList.innerHTML = "";
            events.forEach(event => {
                const li = document.createElement("li");
                li.textContent = `${event.location} - ${event.date}`;

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Törlés";
                deleteBtn.onclick = () => deleteEvent(event.id);

                li.appendChild(deleteBtn);
                eventList.appendChild(li);
            });
        })
        .catch(error => console.error("Hiba:", error));
}

// Esemény hozzáadása
function addEvent() {
    const location = document.getElementById("eventLocation").value.trim();
    const date = document.getElementById("eventDate").value.trim();

    if (!location || !date) {
        alert("Minden mezőt ki kell tölteni!");
        return;
    }

    fetch("http://localhost:3301/esemenyek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, date })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchEvents();
    })
    .catch(error => console.error("Hiba:", error));
}

// Esemény törlése
function deleteEvent(eventId) {
    fetch(`http://localhost:3301/esemenyek/${eventId}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchEvents();
        })
        .catch(error => console.error("Hiba:", error));
}

// Képfeltöltés
function uploadImage() {
    const fileInput = document.getElementById("imageUpload");
    const file = fileInput.files[0];
    if (!file) {
        alert("Válassz ki egy képet!");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);

    fetch("http://localhost:3301/kepek", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("uploadMessage").textContent = data.message;
    })
    .catch(error => console.error("Hiba:", error));
}
