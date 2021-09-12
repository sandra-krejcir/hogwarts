"use strict";

let arrayOfStudents = [];
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  gender: "",
  imageFile: "",
  house: "",
};

document.addEventListener("DOMContentLoaded", start);

function start() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((data) => convertJSONData(data));
}

function convertJSONData(jsonDAta) {
  jsonDAta.forEach((elm) => {
    const student = Object.create(Student);
    const trimmedName = elm.fullname.trim();
    student.firstName = showUppercased(getFirstName(trimmedName));
    student.lastName = showUppercased(getLastName(trimmedName));
    student.middleName = showUppercased(getMiddleName(trimmedName));
    student.nickName = showUppercased(getNickName(trimmedName));
    student.gender = elm.gender;
    if (student.lastName === "Patil") {
      student.imageFile = `${student.lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
    } else if (student.lastName.includes("-")) {
      student.imageFile = `${student.lastName
        .substring(student.lastName.lastIndexOf("-") + 1)
        .toLowerCase()}_${student.firstName.substring(0, 1).toLowerCase()}.png`;
    } else {
      student.imageFile = `${student.lastName.toLowerCase()}_${student.firstName
        .substring(0, 1)
        .toLowerCase()}.png`;
    }
    student.house = showUppercased(elm.house.trim());
    arrayOfStudents.push(student);
    showStudent(student);
  });
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
  copy.querySelector(".prefect").textContent = `PREFECT: /`;
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
  const uppecasedName =
    fulLName.substring(0, 1).toUpperCase() +
    fulLName.substring(1).toLowerCase();
  return uppecasedName;
}
