// we collect elements

const form = document.getElementById("student-form");

const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const markInput = document.getElementById("mark");
const searchInput = document.getElementById("searchInput");

const studentList = document.getElementById("student-list");

const totalStudents = document.getElementById("total-students");
const totalMarks = document.getElementById("total-marks");
const averageMarks = document.getElementById("average-marks");

// creating the array

let students = JSON.parse(localStorage.getItem("students")) || [];

// listen form

form.addEventListener("submit", (e) => {
  e.preventDefault();
  // addStudent();

  if (editId !== null) {
    updateStudents();
  } else {
    addStudent();
  }

  renderStudents(students);
  updateStatistics();
  saveToLocalStorage();

  nameInput.value = "";
  ageInput.value = "";
  markInput.value = "";
  editId = null;
});

// add student
function addStudent() {
  // get input values and store new variables

  const studentName = nameInput.value.trim();
  const studentAge = Number(ageInput.value.trim());
  const studentMark = Number(markInput.value.trim());
  // validate or check

  if (studentName === "" || isNaN(studentAge) || isNaN(studentMark)) {
    return;
  }
  //   create object and push in to the array
  students.push({
    id: Date.now(),
    name: studentName,
    age: studentAge,
    mark: studentMark,
  });
  // nameInput.value = "";
  // ageInput.value = "";
  // markInput.value = "";
  saveToLocalStorage();
}

// display students
function renderStudents(studentArray) {
  // clear old rows
  studentList.innerHTML = "";

  studentArray.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${student.name}</td>
        <td>${student.age}</td>
        <td>${student.mark}</td>
        <td>
         <button class="edit-btn" data-id="${student.id}">Edit</button>
        <button class="delete-btn" data-id="${student.id}">Delete</button>
        </td>
        `;
    studentList.appendChild(row);
  });
}

// Statistics

function updateStatistics() {
  // total students
  totalStudents.textContent = students.length;
  // total marks
  const total = students.reduce((sum, student) => {
    return sum + student.mark;
  }, 0);

  totalMarks.textContent = total;

  // average marks
  if (students.length === 0) {
    averageMarks.textContent = 0;
    return;
  }
  const average = (total / students.length).toFixed(1);
  averageMarks.textContent = average;
}

// search
searchInput.addEventListener("input", searchStudents);

function searchStudents() {
  const searchValue = searchInput.value.trim().toLowerCase();

  const filteredStudents = students.filter((student) => {
    return student.name.toLowerCase().includes(searchValue);
  });
  renderStudents(filteredStudents);
}

// delete

studentList.addEventListener("click", (e) => {
  // checking if click element has class name..
  if (e.target.classList.contains("delete-btn")) {
    // geting id
    const id = Number(e.target.dataset.id);
    students = students.filter((student) => {
      return student.id !== id;
    });
    renderStudents(students);
    updateStatistics();
    saveToLocalStorage();
  }
});

// editing
let editId = null;
studentList.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const id = Number(e.target.dataset.id);

    const student = students.find((student) => student.id === id);
    if (!student) return;

    nameInput.value = student.name;
    ageInput.value = student.age;
    markInput.value = student.mark;
    editId = id;
  }
});

function updateStudents() {
  const studentName = nameInput.value.trim();
  const studentAge = Number(ageInput.value.trim());
  const studentMark = Number(markInput.value.trim());
  students = students.map((student) => {
    if (student.id === editId) {
      return {
        ...student,
        name: studentName,
        age: studentAge,
        mark: studentMark,
      };
    }
    return student;
  });

  saveToLocalStorage();
}

// save data to the local storage

function saveToLocalStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

renderStudents(students);
updateStatistics();
