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
    student.imageFile = `${student.lastName.toLowerCase()}.${student.firstName
      .substring(0, 1)
      .toLowerCase()}.png`;
    student.house = elm.house.trim();
    arrayOfStudents.push(student);
  });
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
