class newQuestion{
    constructor(){
        this.title  = document.createElement("h2");
        this.subtitle = document.createElement("h5");
        this.subjectInput = document.createElement("input");
        this.question = document.createElement("textarea");
        this.button = document.createElement("button");
        this.title.innerText = "Welcome to Discussion Portal !"
        this.subtitle.innerText = "Enter a subject and question to get started";
        this.title.setAttribute("id","new-question-heading");
        this.subtitle.setAttribute("id","new-question-subHeading");
        this.subjectInput.setAttribute("id","new-question-subjectInput");
        this.question.setAttribute("id","new-question-question");
        this.button.setAttribute("id","new-question-button");
        this.subjectInput.setAttribute("placeholder","Subject");
        this.question.setAttribute("placeholder","Question");
        this.button.innerText= "Submit";
    }
    clear(){
        this.subjectInput.value = ""
        this.question.value = ""
    }
    append(form){
        form.appendChild(this.title);
        form.appendChild(this.subtitle);
        form.appendChild(this.subjectInput);
        form.appendChild(this.question);
        form.appendChild(this.button);
    }
    createElement(){
        let obj = {};
        if(questionArr.length == 0){
            obj.id = 0; 
        }else{
            obj.id = questionArr[questionArr.length - 1].id+1;
        }
        obj.subject = this.subjectInput.value;
        obj.question = this.question.value;
        obj.response = [];
        if(obj.question == "" || obj.subject == ""){
            alert("Please Enter value");
        }else{
            makeList(obj);
            questionArr.push(obj);
            localStorage.setItem("question",JSON.stringify(questionArr));
        }
        this.clear();
    }
    print(){
        console.log(this.question);
    }
}

class responsePage{
    constructor(data){
        this.question = data;
        console.log(this.question);
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
        this.questionTitle.setAttribute("class","response-section-heading");
        this.responseTitle.setAttribute("class","response-section-heading");
        this.addRespnseTitle.classList.add("response-section-heading");
        this.addRespnseTitle.classList.add("large");
        this.resolveBtn.setAttribute("id","resolve-btn");
        this.resolveBtn.innerText="Resolve";
        this.responseDiv.classList.add("response-div");
        this.questionDiv.classList.add("response-div");
        this.nameField.setAttribute("id","name-field");
        this.nameField.setAttribute("placeholder","Enter Name");
        this.commentField.setAttribute("id","comment-field");
        this.commentField.setAttribute("placeholder","Enter Comment");
        this.responseSubmitBtn.setAttribute("id","response-submit-btn")
        this.responseSubmitBtn.innerText = "Submit"
        this.questionDiv.innerHTML = `<h3 class="response-section-heading p-5">${data.subject}</h3><p class="p-5">${data.question}</p>`;
        let stringToAppend = "";
        data.response.forEach(function(element){
            console.log(element);
            stringToAppend+=`<h3><button class=up-down-btn onclick=upvote_click(${element.id},${data.id})>+</button>${element.name}</h3><p><button class="up-down-btn" onclick="downvote_click(${element.id},${data.id})">-</button>${element.response}</p>`
        })
        this.responseDiv.innerHTML=stringToAppend;
        
    }
    append(form){
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
    setResponse(data){
        let stringToAppend = "";
        data.response.forEach(function(element){
            // console.log(element);
            stringToAppend+=`<h3><button class="up-down-btn" onclick="upvote_click(${element.id},${data.id})">+</button>${element.name}</h3><p><button class="up-down-btn" onclick="downvote_click(${element.id},${data.id})">-</button>${element.response}</p>`
        })
        this.responseDiv.innerHTML=stringToAppend;
    }
}


let welcomePage = null ;
let form = document.getElementById("right-container");
let questionListDisp =  document.getElementById("list-container");
let questionArr = [];
let newQuestionBtn = document.getElementById("new-question-btn");
let searchBox = document.getElementById("search-box");
let responsep = null;
console.log(questionListDisp);

window.addEventListener("load",function(){
    welcomePage = new newQuestion();
    welcomePage.append(form);
    welcomePage.button.addEventListener("click",function(){
        welcomePage.createElement();
    })
    questionArr = JSON.parse(this.localStorage.getItem("question"));
    console.log(questionArr);
    if(questionArr!=undefined){
        initialList(questionArr);
    }else{
        questionArr = [];
    }
})

function initialList(list){
    Array.from(list).forEach(element => {
        makeList(element);
    });
    
}

function makeList(element){
    let holder = "";
    holder+= `<h2>${element.subject}</h2>`
    holder+= `<p>${element.question}</p>`
    let btn = document.createElement("button");
    btn.classList.add("list-button");
    btn.innerHTML = holder;
    btn.setAttribute("id",element.id);
    btn.addEventListener("click",function(){
        openBtn(element.id);
    });
    questionListDisp.appendChild(btn)
}



function append(){
    console.log("tess");
}


function openBtn(id){
    let data = questionArr.filter(function(element){
        if(element.id==id){
            return true;
        }
        return false;
    })[0];
    responsep = new responsePage(data);
    form.innerHTML = "";
    welcomePage = null;
    responsep.append(form);
    responsep.resolveBtn.addEventListener("click",function(){
        deleteEntry(id);
    })
    responsep.responseSubmitBtn.addEventListener("click",function(){
        let name = responsep.nameField.value;
        let response = responsep.commentField.value;
        if(name == "" || response == ""){
            return ;
        }
        addResponse(name,response,id,responsep);
    })
}


newQuestionBtn.addEventListener("click",function(){
    if(welcomePage == null){
        form.innerHTML ="";
        welcomePage = new newQuestion();
        welcomePage.append(form);
        welcomePage.button.addEventListener("click",function(){
        welcomePage.createElement();
        
    })
    }
    welcomePage.clear();
})

function deleteEntry(id){
    let evt = new Event("click");
    newQuestionBtn.dispatchEvent(evt);
    questionArr = questionArr.filter(function(element){
        if(element.id == id){
            return false;
        }
        return true;
    })
    console.log(questionArr);
    document.getElementById(id).remove();
    localStorage.setItem("question",JSON.stringify(questionArr));
}


function addResponse(name,response,id, responsep){
    questionArr = questionArr.map(function(element){
        if(element.id == id){
            let obj = {}
            obj.name = name;
            obj.response = response;
            obj.vote = 0 ;
            if(element.response.length == 0){
                obj.id = 1;
            }else{
                obj.id = element.response[element.response.length - 1].id +1 ;
            }
            element.response.push(obj);
            element.response.sort((a,b)=>{
                return  b.vote -  a.vote;
            })
            responsep.setResponse(element);
        }
        return element;
    })
    
    console.log(questionArr);
    
    localStorage.setItem("question",JSON.stringify(questionArr));
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


function onKeyUp(){
    console.log(searchBox.value);
    search(searchBox.value);
}


function upvote_click(repId,id){
    console.log(responsep);
    console.log(repId,"  ",id);
    questionArr.forEach(function(element){
        if(element.id == id){
            element.response.forEach(function(rep){
                if(rep.id == repId){
                    rep.vote = rep.vote+1;
                }
            })
            element.response.sort((a,b)=>{
                return  b.vote -  a.vote;
            })
            responsep.setResponse(element);
        }
    });
    console.log(questionArr);
    localStorage.setItem("question",JSON.stringify(questionArr));
}

function downvote_click(repId,id){
    console.log(responsep);
    console.log(repId,"  ",id);
    questionArr.forEach(function(element){
        if(element.id == id){
            element.response.forEach(function(rep){
                if(rep.id == repId){
                    rep.vote = rep.vote-1;
                }
            })
            element.response.sort((a,b)=>{
                return  b.vote -  a.vote;
            })
            responsep.setResponse(element);
        }
    });
    console.log(questionArr);
    localStorage.setItem("question",JSON.stringify(questionArr));
}