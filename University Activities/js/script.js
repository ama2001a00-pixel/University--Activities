// Drawing Workshop
function drawing() {
    if (confirm("Do you want to register?")) {
        addActivity("Drawing Workshop", "10 AM - 12 PM");
    }
}

// Cybersecurity Workshop
function cybersecurity() {
    if (confirm("Do you want to register?")) {
        addActivity("Cybersecurity Workshop", "12 PM - 2 PM");
    }
}

// Save Activity
function addActivity(name, time) {
    const activities = JSON.parse(localStorage.getItem("myActivities") || "[]") || [];
    const currentStudent = JSON.parse(localStorage.getItem("currentStudent") || "null");

    if (!currentStudent) {
        alert("Please register as a student before signing up for an activity.");
        return;
    }

    const exists = activities.some(activity =>
        activity.name === name && activity.studentName === currentStudent.name
    );

    if (exists) {
        alert("You are already registered for this activity!");
        return;
    }

    activities.push({
        name,
        time,
        studentName: currentStudent.name,
        section: currentStudent.section
    });
    localStorage.setItem("myActivities", JSON.stringify(activities));
    alert("Registration Successful!");
}

// Student and Professor Registration
function register(event) {
    event.preventDefault();
    const name = document.getElementById("fullName").value;
    const section = document.getElementById("section").value;
    const type = document.getElementById("userType").value;

    if (type === "Student") {
        const students = JSON.parse(localStorage.getItem("students") || "[]") || [];
        const student = { name, section };
        const existingStudent = students.find(item => item.name === name);

        if (existingStudent) {
            existingStudent.section = section;
        } else {
            students.push(student);
        }

        localStorage.setItem("students", JSON.stringify(students));
        localStorage.setItem("currentStudent", JSON.stringify(student));
        window.location.href = "activities.html";
    } else if (type === "Professor") {
        localStorage.removeItem("currentStudent");
        window.location.href = "students.html";
    }
}

// Connect Registration Form
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", register);
}

// Display My Activities
function displayActivities() {
    const allActivities = JSON.parse(localStorage.getItem("myActivities") || "[]") || [];
    const currentStudent = JSON.parse(localStorage.getItem("currentStudent") || "null");
    const activities = currentStudent
        ? allActivities
            .map((activity, index) => ({ activity, index }))
            .filter(item => item.activity.studentName === currentStudent.name)
        : [];
    const list = document.getElementById("myActivitiesList");
    const emptyMessage = document.getElementById("emptyMessage");

    if (!list) {
        return;
    }

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    if (activities.length === 0) {
        if (emptyMessage) {
            emptyMessage.style.display = "block";
        }
        return;
    }

    if (emptyMessage) {
        emptyMessage.style.display = "none";
    }

    activities.forEach(({ activity, index }) => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const timeCell = document.createElement("td");
        const actionCell = document.createElement("td");
        const button = document.createElement("button");

        nameCell.textContent = activity.name;
        timeCell.textContent = activity.time;
        button.type = "button";
        button.textContent = "Cancel Registration";
        button.addEventListener("click", () => cancelActivity(index));

        actionCell.appendChild(button);
        row.appendChild(nameCell);
        row.appendChild(timeCell);
        row.appendChild(actionCell);
        list.appendChild(row);
    });
}

// Cancel Activity
function cancelActivity(index) {
    if (!confirm("Are you sure you want to cancel?")) {
        return;
    }

    const activities = JSON.parse(localStorage.getItem("myActivities") || "[]") || [];
    activities.splice(index, 1);
    localStorage.setItem("myActivities", JSON.stringify(activities));
    displayActivities();
    alert("Registration Cancelled!");
}

// Display Student Activity Registrations
function displayStudents() {
    const activities = JSON.parse(localStorage.getItem("myActivities") || "[]") || [];
    const list = document.getElementById("studentsList");
    const emptyMessage = document.getElementById("emptyStudentsMessage");

    if (!list) {
        return;
    }

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    const registrations = activities.filter(activity => activity.studentName);
    if (emptyMessage) {
        emptyMessage.style.display = registrations.length === 0 ? "block" : "none";
    }

    registrations.forEach(activity => {
        const row = document.createElement("tr");
        [activity.studentName, activity.name, activity.time, activity.section].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });
        list.appendChild(row);
    });
}

displayActivities();
displayStudents();
