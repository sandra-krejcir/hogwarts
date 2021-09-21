"use strict";

let arrayOfStudents = [];
let arrayOfExpelled = [];
let halfbloodFamilies = [];
let purebloodFamilies = [];
let systemIshacked = false;

const filter_sortSettings = {
  filterBy: "all",
  sortBy: "",
  sortDir: "",
};

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  gender: "",
  imageFile: "",
  house: "",
  bloodstatus: "",
  prefect: false,
  inquis: false,
};

const houses = {
  Gryffindor: { prefects: [] },
  Slytherin: { prefects: [] },
  Hufflepuff: { prefects: [] },
  Ravenclaw: { prefects: [] },
};

document.addEventListener("DOMContentLoaded", start);

async function start() {
  console.log("ready");

  const filterButtons = document.querySelectorAll("[data-action='filter']");
  filterButtons.forEach((button) =>
    button.addEventListener("click", selectedFilter)
  );

  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectedSortBy));

  document.querySelector("#hacking").addEventListener("click", hackTheSystem);

  await getFamilies();
  await getJSON();
}

async function getJSON() {
  await fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((data) => prepareData(data));
}

async function getFamilies() {
  await fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    .then((response) => response.json())
    .then((data) => prepareFamilies(data));
}

function prepareData(jsonData) {
  arrayOfStudents = jsonData.map(convertJSONData);

  buildList(arrayOfStudents);
}

function prepareFamilies(familyData) {
  halfbloodFamilies = familyData.half;
  halfbloodFamilies.forEach((elm) => {
    const indexOfFamily = familyData.pure.indexOf(elm);
    familyData.pure.splice(indexOfFamily, 1);
  });
  purebloodFamilies = familyData.pure;
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
  if (purebloodFamilies.includes(student.lastName)) {
    student.bloodstatus = "pureblood";
  } else if (halfbloodFamilies.includes(student.lastName)) {
    student.bloodstatus = "halfblood";
  } else {
    student.bloodstatus = "muggle";
  }
  return student;
}

function selectedFilter(choice) {
  const filter = choice.target.dataset.filter;
  filter_sortSettings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  console.log(filter_sortSettings.filterBy);
  if (filter_sortSettings.filterBy === "Gryffindor") {
    filteredList = arrayOfStudents.filter(onlyGryffindor);
  } else if (filter_sortSettings.filterBy === "Slytherin") {
    filteredList = arrayOfStudents.filter(onlySlytherin);
  } else if (filter_sortSettings.filterBy === "Hufflepuff") {
    filteredList = arrayOfStudents.filter(onlyHufflepuff);
  } else if (filter_sortSettings.filterBy === "Ravenclaw") {
    filteredList = arrayOfStudents.filter(onlyRavenclaw);
  } else if (filter_sortSettings.filterBy === "Expelled") {
    filteredList = arrayOfExpelled;
  } else if (filter_sortSettings.filterBy === "Prefects") {
    filteredList = arrayOfStudents.filter(thePrefects);
  }

  console.log(filteredList);
  return filteredList;
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

function thePrefects(student) {
  if (student.prefect === true) {
    return true;
  } else {
    return false;
  }
}

function selectedSortBy(sortChoice) {
  const sortBy = sortChoice.target.dataset.sort;
  const sortDir = sortChoice.target.dataset.sortDirection;
  filter_sortSettings.sortBy = sortBy;
  filter_sortSettings.sortDir = sortDir;

  const oldSortBy = document.querySelector(
    `[data-sort='${filter_sortSettings.sortBy}']`
  );
  oldSortBy.classList.remove("sortBy");

  sortChoice.target.classList.add("sortBy");

  if (sortDir === "asc") {
    sortChoice.target.dataset.sortDirection = "desc";
  } else {
    sortChoice.target.dataset.sortDirection = "asc";
  }

  buildList();
}

function sortList(sortedList) {
  let direction = 1;

  if (filter_sortSettings.sortDir === "asc") {
    direction = -1;
  } else {
    direction = 1;
  }

  console.log(sortedList);

  sortedList = sortedList.sort(sortByParameter);

  function sortByParameter(studentA, studentB) {
    if (
      studentA[filter_sortSettings.sortBy] <
      studentB[filter_sortSettings.sortBy]
    ) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

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
    .querySelector(".otherBorder")
    .classList.add(`${aStudent.house.toLowerCase()}Border`);
  copy.querySelector(".cresent").src = `images/${aStudent.house}_crest.png`;
  copy
    .querySelector(".profile")
    .setAttribute("id", `${aStudent.firstName}${aStudent.lastName}Popup`);
  copy
    .querySelector(".exit")
    .setAttribute("id", `${aStudent.firstName}${aStudent.lastName}X`);
  copy.querySelector(".profilePic").src = `images/${aStudent.imageFile}`;
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
  if (systemIshacked === true) {
    aStudent.bloodstatus = getRandomBlood();
  }
  copy.querySelector(
    ".bloodStatus"
  ).textContent = `BLOOD-STATUS: ${aStudent.bloodstatus} `;
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
    console.log("aStudent.house", aStudent.house);
    console.log("houses[aStudent.house]", houses[aStudent.house]);
    if (houses[aStudent.house].prefects.length <= 1) {
      aStudent.prefect = true;
      houses[aStudent.house].prefects.push(aStudent);
      buildList(arrayOfStudents);
      PopUp();
    } else {
      console.log("Student is not in Gryffindor");
    }
  }

  function removePrefect() {
    aStudent.prefect = false;
    const prefectIndex = houses[aStudent.house].prefects.indexOf(aStudent);
    houses[aStudent.house].prefects.splice(prefectIndex, 1);
    console.log("houses[aStudent.house]", houses[aStudent.house]);
    buildList(arrayOfStudents);
    PopUp();
  }

  if (aStudent.inquis === false) {
    copy.querySelector(".theSquad").textContent = `INQUIS. SQUAD: no`;
    copy.querySelector(".addToSquad").textContent = "ADD";
    if (systemIshacked === true) {
      copy.querySelector(".addToSquad").addEventListener("click", hackSquad);
    } else {
      copy.querySelector(".addToSquad").addEventListener("click", addToSquad);
    }
  } else {
    copy.querySelector(".theSquad").textContent = `INQUIS. SQUAD: yes`;
    copy.querySelector(".addToSquad").textContent = "REMOVE";
    copy
      .querySelector(".addToSquad")
      .addEventListener("click", removeFromSquad);
  }

  function addToSquad() {
    if (systemIshacked === true) {
      aStudent.inquis = true;
      buildList(arrayOfStudents);
      setTimeout(removeFromSquad, 7000);
    } else if (aStudent.house === "Slytherin") {
      aStudent.inquis = true;
      buildList(arrayOfStudents);
    } else if (aStudent.bloodstatus === "pureblood") {
      aStudent.inquis = true;
      buildList(arrayOfStudents);
    } else {
      aStudent.inquis = false;
      console.log("Student in not worthy of the inquisitorial squad.");
    }
  }

  function removeFromSquad() {
    aStudent.inquis = false;
    buildList(arrayOfStudents);
  }

  function hackSquad() {
    aStudent.inquis = true;
    buildList(arrayOfStudents);
    setTimeout(removeFromSquad, 3000);
  }

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
    if (aStudent.lastName === "Krejcir") {
      console.log("You cannot expell the master.");
    } else {
      const studentIndex = arrayOfStudents.indexOf(aStudent);
      arrayOfStudents.splice(studentIndex, 1);
      arrayOfExpelled.push(aStudent);
      console.log(arrayOfExpelled);
      buildList();
    }
  }
  const parent = document.querySelector("ul");
  parent.appendChild(copy);
}

console.log("arrayOfStudents", arrayOfStudents);

function buildList() {
  const displayedList = filterList(arrayOfStudents);
  const sortedList = sortList(displayedList);
  showStudents(sortedList);
}

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

function hackTheSystem() {
  systemIshacked = true;
  console.log("systemIshacked", systemIshacked);
  const meTheImposter = Object.create(Student);
  meTheImposter.firstName = "Sandra";
  meTheImposter.lastName = "Krejcir";
  meTheImposter.middleName = "Null";
  meTheImposter.nickName = "SandyD";
  meTheImposter.house = "Gryffindor";
  meTheImposter.gender = "girl";
  meTheImposter.bloodstatus = "muggle";
  meTheImposter.prefect = false;
  meTheImposter.inquis = false;
  arrayOfStudents.unshift(meTheImposter);
  document
    .querySelector("#hacking")
    .removeEventListener("click", hackTheSystem);
  buildList();
}

function getRandomBlood() {
  let randBlood = Math.round(Math.random() * 2);

  if (randBlood === 0) {
    return "pureblood";
  } else if (randBlood === 1) {
    return "muggle";
  } else {
    return "halfblood";
  }
}
