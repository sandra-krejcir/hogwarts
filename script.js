"use strict";

let arrayOfStudents = [];
let arrayOfExpelled = [];

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  gender: "",
  imageFile: "",
  house: "",
  prefect: false,
};

document.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("ready");

  const filterButtons = document.querySelectorAll("[data-action='filter']");
  filterButtons.forEach((button) =>
    button.addEventListener("click", selectedFilter)
  );

  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectedSortBy));

  getJSON();
}

async function getJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((data) => prepareData(data));
}

function prepareData(jsonData) {
  arrayOfStudents = jsonData.map(convertJSONData);

  showStudents(arrayOfStudents);
}

function convertJSONData(jsonDAta) {
  const student = Object.create(Student);
  const trimmedName = jsonDAta.fullname.trim();
  student.firstName = showUppercased(getFirstName(trimmedName));
  student.lastName = showUppercased(getLastName(trimmedName));
  student.middleName = showUppercased(getMiddleName(trimmedName));
  student.nickName = showUppercased(getNickName(trimmedName));
  student.gender = jsonDAta.gender;
  if (student.lastName === "Patil") {
    student.imageFile = `${student.lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
  } else if (student.lastName.includes("-")) {
    student.imageFile = `${student.lastName
      .substring(student.lastName.indexOf("-") + 1)
      .toLowerCase()}_${student.firstName.substring(0, 1).toLowerCase()}.png`;
  } else {
    student.imageFile = `${student.lastName.toLowerCase()}_${student.firstName
      .substring(0, 1)
      .toLowerCase()}.png`;
  }
  student.house = showUppercased(jsonDAta.house.trim());
  return student;
}

function selectedFilter(choice) {
  const filter = choice.target.dataset.filter;
  filterList(filter);
}

function filterList(house) {
  let filteredList = arrayOfStudents;
  console.log(house);
  if (house === "Gryffindor") {
    filteredList = arrayOfStudents.filter(onlyGryffindor);
  } else if (house === "Slytherin") {
    filteredList = arrayOfStudents.filter(onlySlytherin);
  } else if (house === "Hufflepuff") {
    filteredList = arrayOfStudents.filter(onlyHufflepuff);
  } else if (house === "Ravenclaw") {
    filteredList = arrayOfStudents.filter(onlyRavenclaw);
  }

  console.log(filteredList);
  showStudents(filteredList);
}

function onlyGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}

function onlySlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

function onlyHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}

function onlyRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}

function selectedSortBy(sortChoice) {
  const sortBy = sortChoice.target.dataset.sort;
  const sortDir = sortChoice.target.dataset.sortDirection;

  if (sortDir === "asc") {
    sortChoice.target.dataset.sortDirection = "desc";
  } else {
    sortChoice.target.dataset.sortDirection = "asc";
  }

  sortList(sortBy, sortDir);
}

function sortList(sortedBy, dirOfSort) {
  let sortedList = arrayOfStudents;
  let direction = 1;

  if (dirOfSort === "asc") {
    direction = -1;
  } else {
    direction = 1;
  }

  console.log(sortedList);

  sortedList = sortedList.sort(sortByParameter);

  function sortByParameter(studentA, studentB) {
    if (studentA[sortedBy] < studentB[sortedBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  /*if (sortedBy === "firstName") {
    sortedList = sortedList.sort(sortTheFirstName);
  } else if (sortedBy === "lastName") {
    sortedList = sortedList.sort(sortTheLastName);
  } else if (sortedBy === "house") {
    sortedList = sortedList.sort(sortTheHouses);
  }*/

  showStudents(sortedList);
}

/*function sortTheFirstName(studentA, studentB) {
  if (studentA.firstName < studentB.firstName) {
    return -1;
  } else {
    return 1;
  }
}

function sortTheLastName(studentA, studentB) {
  if (studentA.lastName < studentB.lastName) {
    return -1;
  } else {
    return 1;
  }
}

function sortTheHouses(studentA, studentB) {
  if (studentA.house < studentB.house) {
    return -1;
  } else {
    return 1;
  }
}*/

function showStudents(students) {
  document.querySelector("ul").innerHTML = "";

  students.forEach(showStudent);
}

function showStudent(aStudent) {
  const template = document.querySelector(".theStudentList").content;
  const copy = template.cloneNode(true);
  if (aStudent.lastName === "Null") {
    copy.querySelector(".studName").textContent = aStudent.firstName;
  } else {
    copy.querySelector(
      ".studName"
    ).textContent = `${aStudent.firstName} ${aStudent.lastName}`;
  }
  copy
    .querySelector(".studName")
    .setAttribute("id", `${aStudent.firstName}${aStudent.lastName}`);
  copy
    .querySelector(".profile")
    .setAttribute("id", `${aStudent.firstName}${aStudent.lastName}Popup`);
  copy.querySelector(".cresent").setAttribute("id", aStudent.house);
  copy
    .querySelector(".exit")
    .setAttribute("id", `${aStudent.firstName}${aStudent.lastName}X`);
  copy.querySelector("img").src = `images/${aStudent.imageFile}`;
  copy.querySelector(
    ".firstName"
  ).textContent = `FIRST NAME: ${aStudent.firstName}`;
  copy.querySelector(
    ".lastName"
  ).textContent = `LAST NAME: ${aStudent.lastName}`;
  copy.querySelector(
    ".middleName"
  ).textContent = `MIDDLE NAME: ${aStudent.middleName}`;
  copy.querySelector(
    ".nickName"
  ).textContent = ` NICKNAME: ${aStudent.nickName}`;
  copy.querySelector(".house").textContent = `HOUSE: ${aStudent.house}`;
  copy.querySelector(".bloodStatus").textContent = `BLOOD-STATUS: /`;
  if (aStudent.prefect === false) {
    copy.querySelector(".prefect").textContent = `PREFECT: no`;
    copy.querySelector(".addPrefect").textContent = "ADD";
    copy.querySelector(".addPrefect").addEventListener("click", addPrefect);
  } else {
    copy.querySelector(".prefect").textContent = `PREFECT: yes`;
    copy.querySelector(".addPrefect").textContent = "REMOVE";
    copy.querySelector(".addPrefect").addEventListener("click", removePrefect);
  }

  function addPrefect() {
    if (aStudent.house === "Gryffindor") {
      aStudent.prefect = true;
      showStudents(arrayOfStudents);
    } else {
      console.log("Student is not in Gryffindor");
    }
  }

  function removePrefect() {
    aStudent.prefect = false;

    showStudents(arrayOfStudents);
  }
  copy.querySelector(".theSquad").textContent = `INQUIS. SQUAD: /`;

  copy
    .getElementById(`${aStudent.firstName}${aStudent.lastName}`)
    .addEventListener("click", PopUp);
  const popUp = copy.getElementById(
    `${aStudent.firstName}${aStudent.lastName}Popup`
  );
  const exClose = copy.getElementById(
    `${aStudent.firstName}${aStudent.lastName}X`
  );
  function PopUp() {
    console.log("function PopUp");
    popUp.classList.remove("disapear");
    exClose.addEventListener("click", popClose);
  }
  function popClose() {
    console.log("function popClose()");
    popUp.classList.add("disapear");
  }
  copy.querySelector(".expell").addEventListener("click", expellStudent);
  function expellStudent() {
    const studentIndex = arrayOfStudents.indexOf(aStudent);
    arrayOfStudents.splice(studentIndex, 1);
    arrayOfExpelled.push(aStudent);
    console.log(arrayOfExpelled);
    showStudents(arrayOfStudents);
  }
  const parent = document.querySelector("ul");
  parent.appendChild(copy);
}

console.log("arrayOfStudents", arrayOfStudents);

function getFirstName(fullName) {
  if (fullName.includes(" ")) {
    const firstName = fullName.substring(0, fullName.indexOf(" "));
    return firstName;
  } else {
    const firstName = fullName.substring(0);
    return firstName;
  }
}

function getLastName(fullName) {
  if (fullName.includes(" ")) {
    const lastName = fullName.substring(fullName.lastIndexOf(" ")).trim();
    return lastName;
  } else {
    const noLastName = "null";
    return noLastName;
  }
}

function getMiddleName(fullName) {
  const middleNameStart = fullName.indexOf(" ") + 1;
  const middleNameEnd = fullName.lastIndexOf(" ");
  const middleName = fullName.substring(middleNameStart, middleNameEnd);
  if (middleName.includes(" ")) {
    return "null";
  } else if (middleName.includes('"')) {
    return "null";
  } else {
    return middleName;
  }
}

function getNickName(nicKName) {
  const nickNameStart = nicKName.indexOf(" ");
  const nickNameEnd = nicKName.lastIndexOf(" ");
  const nickName = nicKName.substring(nickNameStart, nickNameEnd);
  if (nickName.includes('"')) {
    return nickName.replaceAll('"', "").trim();
  } else {
    return "null";
  }
}

function showUppercased(fulLName) {
  if (fulLName.includes("-")) {
    const uppecasedName =
      fulLName.substring(0, 1).toUpperCase() +
      fulLName.substring(1, fulLName.indexOf("-") + 1).toLowerCase() +
      fulLName[fulLName.indexOf("-") + 1].toUpperCase() +
      fulLName.substring(fulLName.indexOf("-") + 2).toLowerCase();
    return uppecasedName;
  }
  const uppecasedName =
    fulLName.substring(0, 1).toUpperCase() +
    fulLName.substring(1).toLowerCase();
  return uppecasedName;
}
