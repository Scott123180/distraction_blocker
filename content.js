function removeElement(elementToRemove){
    elementToRemove.parentNode.removeChild(elementToRemove);
}

function removeById(id){
    const elementToRemove = document.getElementById(id);
    elementToRemove.parentNode.removeChild(elementToRemove);
}

const youtube = () => {
    removeById("primary");
}

const facebook = () => {
    const elementToRemove = document.querySelector("div[role='main']");
    removeElement(elementToRemove);
} 

const instagram = () => {
    const mainContent = document.querySelector("main");
    removeElement(mainContent);
    const exploreBar = document.querySelector("a[href='/explore/'");
    removeElement(exploreBar);
} 

let pageMap = new Map();
pageMap.set("https://www.youtube.com/", youtube);
pageMap.set("https://www.facebook.com/", facebook);

pageMap.set("https://www.instagram.com/", instagram);
pageMap.set("https://www.instagram.com/explore/", instagram);


const myLocation = window.location.href;

const filterFunction = pageMap.get(myLocation);
filterFunction();