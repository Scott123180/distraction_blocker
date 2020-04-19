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
    const elementToRemove = document.querySelector("div[role='main']")
    removeElement(elementToRemove);
} 

let pageMap = new Map();
pageMap.set("https://www.youtube.com/", youtube);
pageMap.set("https://www.facebook.com/", facebook);

const myLocation = window.location.href;

const filterFunction = pageMap.get(myLocation);
filterFunction();