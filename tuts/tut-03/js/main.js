
let pageTitle = document.querySelector("#page-title");
let pageHeader = document.querySelector("header")
let pageBody = document.querySelector("body");


setTimeout(function(){
    pageTitle.style.color = "pink";
}, 3000);


pageHeader.onclick = function(){

    pageBody.style.backgroundColor = "blue";
};