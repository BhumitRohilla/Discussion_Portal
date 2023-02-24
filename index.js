class newQuestion {
  constructor() {
    this.title = document.createElement("h2");
    this.subtitle = document.createElement("h5");
    this.subjectInput = document.createElement("input");
    this.question = document.createElement("textarea");
    this.button = document.createElement("button");
    this.title.innerText = "Welcome to Discussion Portal !";
    this.subtitle.innerText = "Enter a subject and question to get started";
    this.title.setAttribute("id", "new-question-heading");
    this.subtitle.setAttribute("id", "new-question-subHeading");
    this.subjectInput.setAttribute("id", "new-question-subjectInput");
    this.question.setAttribute("id", "new-question-question");
    this.button.setAttribute("id", "new-question-button");
    this.subjectInput.setAttribute("placeholder", "Subject");
    this.question.setAttribute("placeholder", "Question");
    this.button.innerText = "Submit";
  }
  clear() {
    this.subjectInput.value = "";
    this.question.value = "";
  }
  append(form) {
    form.appendChild(this.title);
    form.appendChild(this.subtitle);
    form.appendChild(this.subjectInput);
    form.appendChild(this.question);
    form.appendChild(this.button);
  }
  createElement() {
    let obj = {};
    if (questionArr.length == 0) {
      obj.id = 0;
    } else {
      obj.id = questionArr[questionArr.length - 1].id + 1;
    }
    let currentDate = new Date;
    obj.subject = this.subjectInput.value;
    obj.question = this.question.value;
    obj.response = [];
    obj.day = currentDate.getDate();
    obj.hour = currentDate.getHours();
    obj.minute = currentDate.getMinutes();
    obj.second = currentDate.getSeconds();
    obj.favourate = false;
    obj.question = obj.question.trim();
    obj.subject = obj.subject.trim();
    obj.vote = 0;
    console.log("Hour:",obj.hour,"\nMinute:",obj.minute,"\nSecond",obj.second);
    if (obj.question == "" || obj.subject == "") {
      alert("Please Enter value");
    } else {
      makeList(obj);
      questionArr.push(obj);
      localStorage.setItem("question", JSON.stringify(questionArr));
    }
    this.clear();
  }
  print() {
    // console.log(this.question);
  }
}

class responsePage {
  constructor(data) {
    this.question = data;
    // console.log(this.question);
    this.questionTitle = document.createElement("h3");
    this.questionDiv = document.createElement("div");
    this.resolveBtn = document.createElement("button");
    this.responseTitle = document.createElement("h3");
    this.responseDiv = document.createElement("div");
    this.addRespnseTitle = document.createElement("h2");
    this.nameField = document.createElement("input");
    this.commentField = document.createElement("textarea");
    this.responseSubmitBtn = document.createElement("button");
    this.questionTitle.innerText = "Question";
    this.responseTitle.innerText = "Response";
    this.addRespnseTitle.innerText = "Add Response";
    this.questionTitle.setAttribute("class", "response-section-heading");
    this.responseTitle.setAttribute("class", "response-section-heading");
    this.addRespnseTitle.classList.add("response-section-heading");
    this.addRespnseTitle.classList.add("large");
    this.resolveBtn.setAttribute("id", "resolve-btn");
    this.resolveBtn.innerText = "Resolve";
    this.responseDiv.classList.add("response-div");
    this.questionDiv.classList.add("response-div");
    this.nameField.setAttribute("id", "name-field");
    this.nameField.setAttribute("placeholder", "Enter Name");
    this.commentField.setAttribute("id", "comment-field");
    this.commentField.setAttribute("placeholder", "Enter Comment");
    this.responseSubmitBtn.setAttribute("id", "response-submit-btn");
    this.responseSubmitBtn.innerText = "Submit";
    let string = data.question.slice();
    string = makeListWithBr(string);
    this.questionDiv.innerHTML = `<h3 class="response-section-heading p-5">${data.subject}</h3><p class="p-5">${string}</p>`;
    this.setResponse(data);
  }
  append(form) {
    form.appendChild(this.questionTitle);
    form.appendChild(this.questionDiv);
    form.appendChild(this.resolveBtn);
    form.appendChild(this.responseTitle);
    form.appendChild(this.responseDiv);
    form.appendChild(this.addRespnseTitle);
    form.appendChild(this.nameField);
    form.appendChild(this.commentField);
    form.appendChild(this.responseSubmitBtn);
  }
  setResponse(data) {
    let stringToAppend = "";
    data.response.forEach(function (element) {
      // console.log(element);
      
      let string = makeListWithBr(element.response);
      stringToAppend += `<div class="response-div-main-container">`
      stringToAppend +=  `<div class="response-up-down-button"><button class="up-down-btn" onclick="upvote_click(${element.id},${data.id})"><img class="upvote-downvote" src="./Image/upvote.png"></button><button class="up-down-btn" onclick="downvote_click(${element.id},${data.id})"><img class="upvote-downvote" src="./Image/downvote.png"></button></div>`
      
      stringToAppend += `<div class="response-div-child"><h3>${element.name}</h3><p>${string}</p></div></div>`;
    });
    this.responseDiv.innerHTML = stringToAppend;
    this.clear();
  }
  clear() {
    this.nameField.value = "";
    this.commentField.value = "";
    // console.log(this.nameField);
  }
}

let welcomePage = null;
let form = document.getElementById("right-container");
let questionListDisp = document.getElementById("list-container");
let questionArr = [];
let newQuestionBtn = document.getElementById("new-question-btn");
let searchBox = document.getElementById("search-box");
let responsep = null;
let intervalID;
let showingFavourate = false;
let currentActive = null;
// console.log(questionListDisp);

window.addEventListener("load", function () {
  welcomePage = new newQuestion();
  welcomePage.append(form);
  welcomePage.button.addEventListener("click", function () {
    welcomePage.createElement();
  });

  intervalID = this.setInterval(function () {
    changeTiming(questionArr);
  }, 10000 );

  questionArr = JSON.parse(this.localStorage.getItem("question"));
  console.log(questionArr);
  if (questionArr != undefined) {
    initialList(questionArr);
  } else {
    questionArr = [];
  }
  searchBox.value = "";
});

function initialList(list) {
    questionListDisp.innerHTML = '';
  Array.from(list).forEach((element) => {
    makeList(element);
  });
  changeTiming(questionArr);
}

function makeList(element) {
  let holder = "<div class=questionListButton>";
  // holder+=`<button><img>`
  holder +=
    `<div class="voteDiv"><div><svg class="voteButton" onclick="upVoteQuestion(${element.id})" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>i</title><g id="Complete"><g id="thumbs-up"><path d="M7.3,11.4,10.1,3a.6.6,0,0,1,.8-.3l1,.5a2.6,2.6,0,0,1,1.4,2.3V9.4h6.4a2,2,0,0,1,1.9,2.5l-2,8a2,2,0,0,1-1.9,1.5H4.3a2,2,0,0,1-2-2v-6a2,2,0,0,1,2-2h3v10" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></g></svg></div><div><svg class="voteButton" onclick="downVoteQuestion(${element.id})" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 14C21 14.5523 20.5523 15 20 15H17V3H20C20.5523 3 21 3.44772 21 4V14Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 13V5L15.0077 3.6718C14.3506 3.23375 13.5786 3 12.7889 3H7.54138C6.07486 3 4.82329 4.06024 4.5822 5.5068L3.38813 12.6712C3.18496 13.8903 4.12504 15 5.36092 15H10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 15L9.31283 18.4358C9.13411 19.3294 9.64876 20.2163 10.5133 20.5044V20.5044C11.3664 20.7888 12.2987 20.4026 12.7008 19.5983L16 13H17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>`;
  holder += `<button class="list-button" onclick="openBtn(${element.id})"><h2>${element.subject}</h2>`;
  holder += `<p>${element.question}</p>`;
  holder += `<span class="VoteShow">Vote:${element.vote}</span></button>`;
  let currentDate = new Date();
  let day = currentDate.getDate() - element.day;
  let hour = currentDate.getHours() - element.hour;
  let min = currentDate.getMinutes() - element.minute;
  let sec = currentDate.getSeconds() - element.second;

  if(sec < 0){
    sec += 60;
    min--;
  }

  if (min < 0) {
    min += 60;
    hour--;
  }

  if (hour < 0) {
    hour += 24;
    day--;
  }

  if (day < 0) {
    day += 30;
  }

  // console.log(day);
  holder += `<div class="TimerSpan">since <span class="Timer">`;
  holder += `few sec</span></div>`;
  // holder+=`<button class="favourate-btn" onclick="favourate(${element.id})">*</button>`

  /*
               <svg  onclick="favourate(${element.id})"  class="star-svg list-favourte-button" width="322" height="308" viewBox="0 0 322 308" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M183.064 53.0322L192.808 83.0199C192.956 83.4745 193.101 83.9244 193.245 84.3697C195.424 91.1045 197.255 96.7641 200.9 101.114C203.958 104.763 207.867 107.604 212.283 109.384C217.546 111.506 223.494 111.499 230.573 111.49C231.041 111.489 231.514 111.488 231.992 111.488H263.523C278.9 111.488 289.845 111.496 297.705 112.156C306.151 112.865 308.332 114.21 308.701 114.565C311.342 117.109 312.542 120.803 311.901 124.414C311.811 124.918 310.837 127.287 304.421 132.826C298.45 137.979 289.6 144.419 277.159 153.458L251.65 171.991C251.263 172.272 250.88 172.55 250.501 172.824C244.77 176.977 239.953 180.467 236.942 185.278C234.416 189.314 232.923 193.91 232.594 198.66C232.202 204.321 234.048 209.976 236.244 216.705C236.389 217.15 236.536 217.599 236.683 218.054L246.427 248.042C251.179 262.666 254.554 273.078 256.355 280.757C258.29 289.01 257.685 291.499 257.462 291.959C255.858 295.258 252.717 297.541 249.084 298.046C248.577 298.117 246.022 297.923 238.772 293.532C232.026 289.446 223.166 283.019 210.726 273.98L185.217 255.447C184.83 255.166 184.448 254.887 184.07 254.612C178.348 250.444 173.54 246.941 168.035 245.564C163.416 244.409 158.584 244.409 153.965 245.564C148.46 246.941 143.652 250.444 137.931 254.612C137.552 254.887 137.17 255.166 136.783 255.447L111.274 273.98C98.8337 283.019 89.9742 289.446 83.2278 293.532C75.9775 297.923 73.423 298.117 72.9161 298.046C69.2834 297.541 66.1415 295.258 64.5383 291.959C64.3146 291.499 63.7095 289.01 65.6452 280.757C67.4463 273.078 70.8212 262.666 75.573 248.042L85.3166 218.054C85.4644 217.599 85.6111 217.15 85.7563 216.705C87.9523 209.976 89.7977 204.321 89.4058 198.66C89.077 193.91 87.5837 189.314 85.0577 185.278C82.0473 180.467 77.2305 176.977 71.4986 172.824C71.1196 172.549 70.7366 172.272 70.3499 171.991L44.8408 153.458C32.4003 144.419 23.5499 137.979 17.5793 132.826C11.1627 127.287 10.1891 124.918 10.0995 124.414C9.45755 120.803 10.6576 117.109 13.2995 114.565C13.6682 114.21 15.8487 112.865 24.2953 112.156C32.1548 111.496 43.1001 111.488 58.4774 111.488H90.0083C90.4864 111.488 90.9594 111.489 91.4274 111.49C98.5058 111.499 104.454 111.506 109.717 109.384C114.133 107.604 118.042 104.763 121.1 101.114C124.745 96.7642 126.576 91.1046 128.755 84.3699C128.899 83.9246 129.044 83.4746 129.192 83.0199L138.935 53.0322C143.687 38.4075 147.077 28.0003 150.133 20.7294C153.418 12.9154 155.371 11.2571 155.822 11.0162C159.058 9.28977 162.942 9.28977 166.178 11.0162C166.629 11.2571 168.582 12.9154 171.867 20.7294C174.923 28.0003 178.313 38.4075 183.064 53.0322Z" fill="white" stroke="black" stroke-width="18"/>
               </svg>
     */
  if (element.favourate) {
    holder += `<svg id="${element.id}"  onclick="favourate(${element.id})"  class="star-svg list-favourte-button favourte-button-active" width="322" height="308" viewBox="0 0 322 308" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M183.064 53.0322L192.808 83.0199C192.956 83.4745 193.101 83.9244 193.245 84.3697C195.424 91.1045 197.255 96.7641 200.9 101.114C203.958 104.763 207.867 107.604 212.283 109.384C217.546 111.506 223.494 111.499 230.573 111.49C231.041 111.489 231.514 111.488 231.992 111.488H263.523C278.9 111.488 289.845 111.496 297.705 112.156C306.151 112.865 308.332 114.21 308.701 114.565C311.342 117.109 312.542 120.803 311.901 124.414C311.811 124.918 310.837 127.287 304.421 132.826C298.45 137.979 289.6 144.419 277.159 153.458L251.65 171.991C251.263 172.272 250.88 172.55 250.501 172.824C244.77 176.977 239.953 180.467 236.942 185.278C234.416 189.314 232.923 193.91 232.594 198.66C232.202 204.321 234.048 209.976 236.244 216.705C236.389 217.15 236.536 217.599 236.683 218.054L246.427 248.042C251.179 262.666 254.554 273.078 256.355 280.757C258.29 289.01 257.685 291.499 257.462 291.959C255.858 295.258 252.717 297.541 249.084 298.046C248.577 298.117 246.022 297.923 238.772 293.532C232.026 289.446 223.166 283.019 210.726 273.98L185.217 255.447C184.83 255.166 184.448 254.887 184.07 254.612C178.348 250.444 173.54 246.941 168.035 245.564C163.416 244.409 158.584 244.409 153.965 245.564C148.46 246.941 143.652 250.444 137.931 254.612C137.552 254.887 137.17 255.166 136.783 255.447L111.274 273.98C98.8337 283.019 89.9742 289.446 83.2278 293.532C75.9775 297.923 73.423 298.117 72.9161 298.046C69.2834 297.541 66.1415 295.258 64.5383 291.959C64.3146 291.499 63.7095 289.01 65.6452 280.757C67.4463 273.078 70.8212 262.666 75.573 248.042L85.3166 218.054C85.4644 217.599 85.6111 217.15 85.7563 216.705C87.9523 209.976 89.7977 204.321 89.4058 198.66C89.077 193.91 87.5837 189.314 85.0577 185.278C82.0473 180.467 77.2305 176.977 71.4986 172.824C71.1196 172.549 70.7366 172.272 70.3499 171.991L44.8408 153.458C32.4003 144.419 23.5499 137.979 17.5793 132.826C11.1627 127.287 10.1891 124.918 10.0995 124.414C9.45755 120.803 10.6576 117.109 13.2995 114.565C13.6682 114.21 15.8487 112.865 24.2953 112.156C32.1548 111.496 43.1001 111.488 58.4774 111.488H90.0083C90.4864 111.488 90.9594 111.489 91.4274 111.49C98.5058 111.499 104.454 111.506 109.717 109.384C114.133 107.604 118.042 104.763 121.1 101.114C124.745 96.7642 126.576 91.1046 128.755 84.3699C128.899 83.9246 129.044 83.4746 129.192 83.0199L138.935 53.0322C143.687 38.4075 147.077 28.0003 150.133 20.7294C153.418 12.9154 155.371 11.2571 155.822 11.0162C159.058 9.28977 162.942 9.28977 166.178 11.0162C166.629 11.2571 168.582 12.9154 171.867 20.7294C174.923 28.0003 178.313 38.4075 183.064 53.0322Z" fill="white" stroke="black" stroke-width="18"/>
        </svg>`;
  } else {
    holder += `<svg id="${element.id + "svg"}"  onclick="favourate(${
      element.id
    })"  class="star-svg list-favourte-button" width="322" height="308" viewBox="0 0 322 308" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M183.064 53.0322L192.808 83.0199C192.956 83.4745 193.101 83.9244 193.245 84.3697C195.424 91.1045 197.255 96.7641 200.9 101.114C203.958 104.763 207.867 107.604 212.283 109.384C217.546 111.506 223.494 111.499 230.573 111.49C231.041 111.489 231.514 111.488 231.992 111.488H263.523C278.9 111.488 289.845 111.496 297.705 112.156C306.151 112.865 308.332 114.21 308.701 114.565C311.342 117.109 312.542 120.803 311.901 124.414C311.811 124.918 310.837 127.287 304.421 132.826C298.45 137.979 289.6 144.419 277.159 153.458L251.65 171.991C251.263 172.272 250.88 172.55 250.501 172.824C244.77 176.977 239.953 180.467 236.942 185.278C234.416 189.314 232.923 193.91 232.594 198.66C232.202 204.321 234.048 209.976 236.244 216.705C236.389 217.15 236.536 217.599 236.683 218.054L246.427 248.042C251.179 262.666 254.554 273.078 256.355 280.757C258.29 289.01 257.685 291.499 257.462 291.959C255.858 295.258 252.717 297.541 249.084 298.046C248.577 298.117 246.022 297.923 238.772 293.532C232.026 289.446 223.166 283.019 210.726 273.98L185.217 255.447C184.83 255.166 184.448 254.887 184.07 254.612C178.348 250.444 173.54 246.941 168.035 245.564C163.416 244.409 158.584 244.409 153.965 245.564C148.46 246.941 143.652 250.444 137.931 254.612C137.552 254.887 137.17 255.166 136.783 255.447L111.274 273.98C98.8337 283.019 89.9742 289.446 83.2278 293.532C75.9775 297.923 73.423 298.117 72.9161 298.046C69.2834 297.541 66.1415 295.258 64.5383 291.959C64.3146 291.499 63.7095 289.01 65.6452 280.757C67.4463 273.078 70.8212 262.666 75.573 248.042L85.3166 218.054C85.4644 217.599 85.6111 217.15 85.7563 216.705C87.9523 209.976 89.7977 204.321 89.4058 198.66C89.077 193.91 87.5837 189.314 85.0577 185.278C82.0473 180.467 77.2305 176.977 71.4986 172.824C71.1196 172.549 70.7366 172.272 70.3499 171.991L44.8408 153.458C32.4003 144.419 23.5499 137.979 17.5793 132.826C11.1627 127.287 10.1891 124.918 10.0995 124.414C9.45755 120.803 10.6576 117.109 13.2995 114.565C13.6682 114.21 15.8487 112.865 24.2953 112.156C32.1548 111.496 43.1001 111.488 58.4774 111.488H90.0083C90.4864 111.488 90.9594 111.489 91.4274 111.49C98.5058 111.499 104.454 111.506 109.717 109.384C114.133 107.604 118.042 104.763 121.1 101.114C124.745 96.7642 126.576 91.1046 128.755 84.3699C128.899 83.9246 129.044 83.4746 129.192 83.0199L138.935 53.0322C143.687 38.4075 147.077 28.0003 150.133 20.7294C153.418 12.9154 155.371 11.2571 155.822 11.0162C159.058 9.28977 162.942 9.28977 166.178 11.0162C166.629 11.2571 168.582 12.9154 171.867 20.7294C174.923 28.0003 178.313 38.4075 183.064 53.0322Z" fill="white" stroke="black" stroke-width="18"/>
        </svg>`;
  }

  holder += "</div>";
  let btn = document.createElement("div");
  btn.classList.add("div-list-btn-container");
  btn.innerHTML = holder;
  btn.setAttribute("id", element.id);
  // btn.addEventListener("click",function(){
  //     openBtn(element.id);
  // });
  questionListDisp.appendChild(btn);
}

function openBtn(id) {
  removeCurrentSelection();
  highlightSelected(id);

  let data = questionArr.filter(function (element) {
    if (element.id == id) {
      return true;
    }
    return false;
  })[0];
  responsep = new responsePage(data);
  form.innerHTML = "";
  welcomePage = null;
  responsep.append(form);
  responsep.resolveBtn.addEventListener("click", function () {
    deleteEntry(id);
  });
  responsep.responseSubmitBtn.addEventListener("click", function () {
    let name = responsep.nameField.value;
    let response = responsep.commentField.value;
    name = name.trim();
    // console.log(name);
    response = response.trim();
    if (name == "" || response == "") {
      return;
    }
    addResponse(name, response, id, responsep);
  });
}

newQuestionBtn.addEventListener("click", function () {
  if (welcomePage == null) {
    form.innerHTML = "";
    welcomePage = new newQuestion();
    welcomePage.append(form);
    welcomePage.button.addEventListener("click", function () {
      welcomePage.createElement();
    });
  }
  welcomePage.clear();
  removeCurrentSelection();
});

function deleteEntry(id) {
  questionArr = questionArr.filter(function (element) {
    if (element.id == id) {
      return false;
    }
    return true;
  });
  // console.log(questionArr);
  document.getElementById(id).remove();
  localStorage.setItem("question", JSON.stringify(questionArr));
  let evt = new Event("click");
  newQuestionBtn.dispatchEvent(evt);
}

function addResponse(name, response, id, responsep) {
  questionArr = questionArr.map(function (element) {
    if (element.id == id) {
      let obj = {};
      obj.name = name;
      obj.response = response;
      obj.vote = 0;
      if (element.response.length == 0) {
        obj.id = 1;
      } else {
        obj.id = element.response[element.response.length - 1].id + 1;
      }
      element.response.push(obj);
      element.response.sort((a, b) => {
        return b.vote - a.vote;
      });
      responsep.setResponse(element);
    }
    return element;
  });

  // console.log(questionArr);

  localStorage.setItem("question", JSON.stringify(questionArr));
}

// function search(searchWord){
//     if(searchWord.length == 0){
//         return ;
//     }
//     let string = questionListDisp.innerHTML;
//     let i =0;
//     let start =0;
//     let end =0;
//     for(;i<string.length;++i){
//         if(string[i]==searchWord[0]){
//             isMatch(){

//             }
//         }
//     }

// }

function upvote_click(repId, id) {
  // console.log(responsep);
  // console.log(repId, "  ", id);
  questionArr.forEach(function (element) {
    if (element.id == id) {
      element.response.forEach(function (rep) {
        if (rep.id == repId) {
          rep.vote = rep.vote + 1;
        }
      });
      element.response.sort((a, b) => {
        return b.vote - a.vote;
      });
      responsep.setResponse(element);
    }
  });
  // console.log(questionArr);
  localStorage.setItem("question", JSON.stringify(questionArr));
}

function downvote_click(repId, id) {
  // console.log(responsep);
  // console.log(repId, "  ", id);
  questionArr.forEach(function (element) {
    if (element.id == id) {
      element.response.forEach(function (rep) {
        if (rep.id == repId) {
          rep.vote = rep.vote - 1;
        }
      });
      element.response.sort((a, b) => {
        return b.vote - a.vote;
      });
      responsep.setResponse(element);
    }
  });
  // console.log(questionArr);
  localStorage.setItem("question", JSON.stringify(questionArr));
}

function onKeyUp() {
  search(searchBox.value);
  let evt = new Event("click");
  newQuestionBtn.dispatchEvent(evt);
}

function search(val) {
  // console.log(val);

  if (val == "!FAV") {
    displayFav();
    return;
  }

  if (val == "") {
    // console.log(questionArr);
    questionListDisp.innerHTML = "";
    initialList(questionArr);
    // console.log(questionArr);
    return;
  }

  questionListDisp.innerHTML = "";

  question = JSON.parse(localStorage.getItem("question"));

  // console.log(question);

  question = question.filter(function (element) {
    element.question = removeNextLineCharacter(element.question);
    let heading = element.subject;
    let questions = element.question;

    if (heading.includes(val)) {
      return true;
    }
    if (questions.includes(val)) {
      console.log(element.question);
      
      return true;
    }
    return false;
  });

  // console.log(question[0].question);
  // console.log(question);
  searchListCreation(question, val);
}

function searchListCreation(list, val) {
  // console.log(list, val);
  let heading = list.heading;

  // console.log("searchListCreating");

  list.forEach(function (element) {
    // console.log(element.subject);
    // console.log(element.question);
    if (element.subject.includes(val)) {
      // console.log(element.subject.search(val));
      let index = element.subject.search(val);
      element.subject =
        element.subject.slice(0, index) +
        "<span style='background-color:blue; color:white'>" +
        element.subject.slice(index, val.length + index) +
        "</span>" +
        element.subject.slice(val.length + index);
      // console.log(element.subject);
    }
    if (element.question.includes(val)) {
      let index = element.question.search(val);
      // console.log(element.question);
      element.question =
        element.question.slice(0, index) +
        "<span style='background-color:blue; color:white'>" +
        element.question.slice(index, val.length + index) +
        "</span>" +
        element.question.slice(val.length + index);
    }
  });

  initialList(list);
}

function favourate(id) {
  // console.log(svg);
  var button = document.getElementById(id);
  button = button.querySelector(".star-svg");
  // console.log(button.classList);
  questionArr.forEach(function (element) {
    if (element.id == id) {
      if (element.favourate) {
        element.favourate = false;
        button.classList.remove("favourte-button-active");
        // console.log(button);
      } else {
        element.favourate = true;
        button.classList.add("favourte-button-active");
        // console.log(button);
      }
    }
  });

  localStorage.setItem("question", JSON.stringify(questionArr));
}

function displayFav() {
  // console.log("Test");
  questionListDisp.innerHTML = "";
  let favList = questionArr.filter(function (element) {
    if (element.favourate) {
      return true;
    } else {
      return false;
    }
  });
  initialList(favList);
  changeTiming(favList);
}

function favourateButtonPress() {
  let button = document.getElementById("favourate-button");
  // console.log(button);
  if (showingFavourate == false) {
    button.classList.add("favourte-button-active");
    showingFavourate = true;
    displayFav();
  } else {
    button.classList.remove("favourte-button-active");
    showingFavourate = false;
    questionListDisp.innerHTML = "";
    initialList(questionArr);
    // console.log(questionArr);
  }
}

function setTimeNow(element) {
  let currentDate = new Date();
  let day = currentDate.getDate() - element.day;
  let hour = currentDate.getHours() - element.hour;
  let min = currentDate.getMinutes() - element.minute;
  let sec = currentDate.getSeconds() - element.second;
  if(sec < 0){
    sec += 60;
    min--;
  }

  if (min < 0) {
    min += 60;
    hour--;
  }

  if (hour < 0) {
    hour += 24;
    day--;
  }

  if (day < 0) {
    day += 30;
  }

  let string = ``;
  if (day != 0) {
    string += `${day} days`;
  } else if (hour != 0) {
    string += `${hour} hour`;
  } else if (min != 0 ){
    string += `${min} min`;
  } else {
    string += `few sec`;
  }

  return string;
}

function changeTiming(arrayList) {
  let a = document.getElementsByClassName("Timer");
  // console.log(a);
  let currentDate = new Date();
  let day = currentDate.getDate();
  let hour = currentDate.getHours();
  let minute = currentDate.getMinutes();

  let index = 0;

  Array.from(a).forEach(function (element) {
    // console.log(element.innerHTML);
    element.innerHTML = setTimeNow(arrayList[index]);
    // console.log(questionArr[index++]);
    index++;
  });
}

function upVoteQuestion(id) {

  let value ;
  questionArr.forEach(function(element){
    if(element.id == id){
        if(element.vote == undefined) {
            element.vote=0;
        }
        element.vote++;
        value = element.vote;
    }
  })
  if(searchBox.value!=""){
    let elementToChange = document.getElementById(id);
    let VoteDiv = elementToChange.getElementsByClassName("VoteShow")[0];
    // console.log(VoteDiv);
    VoteDiv.innerText = `Vote:${value}`;
    // console.log(elementToChange);
  }else{
    initialList(questionArr);
  }
  questionArr.sort((a, b) => {
    // console.log(a);
    return b.vote - a.vote;
  })
  
//   console.log(questionArr);

  
  
  if(currentActive!=null){
    highlightSelected(currentActive);
  }

  localStorage.setItem("question",JSON.stringify(questionArr));
}


function downVoteQuestion(id) {
    questionArr.forEach(function(element){
      if(element.id == id){
          if(element.vote == undefined) {
              element.vote=0;
          }
          element.vote--;
      }
    })
    questionArr.sort((a, b) => {
      // console.log(a.vote);
      return b.vote - a.vote;
    })
    
  //   console.log(questionArr);
  
    initialList(questionArr);
    
  
    localStorage.setItem("question",JSON.stringify(questionArr));
    if(currentActive!=null){
      highlightSelected(currentActive);
    }
  }


  function makeListWithBr(string){
    let newString ="";
    for(let i=0;i<string.length;++i){
      if(string[i] == '\n'){
        newString += "<br/>";
      }else{
        newString+=string[i];
      }
    }
    return newString;
  }


function removeCurrentSelection(){
  if(currentActive !=null ){
    let child = document.getElementById(currentActive);
    child = child.children;
    child = child[0].children;
    Array.from(child).forEach(function(element){
      element.classList.remove("list-button-active");
    });
  }
}

function highlightSelected(id){
  let child = document.getElementById(id).children;
  console.log(child);
  child = child[0].children;
  Array.from(child).forEach(function(element){
    element.classList.add("list-button-active");
    console.log(element);
  });
  console.log(currentActive);
  currentActive = id;
  console.log(currentActive);
}

function removeNextLineCharacter(string){
  let result = "";
  for(let i =0 ;i<string.length;++i){
    if(string[i] == '\n'){
      result+='';
    }else{
      result+=string[i];
    }
  }
  console.log(result);
  return result;
}