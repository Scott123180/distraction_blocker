function removeElement(elementToRemove) {
    elementToRemove.parentNode.removeChild(elementToRemove);
}

function removeById(id) {
    const elementToRemove = document.getElementById(id);
    elementToRemove.parentNode.removeChild(elementToRemove);
}

const facebook = () => {
    const elementToRemove = document.querySelector("div[role='main']");
    removeElement(elementToRemove);
}

const removeBody = () => {
    const body = document.querySelector("body");
    removeElement(body);
}

const instagram = () => {
    const mainContent = document.querySelector("main");
    removeElement(mainContent);
    const exploreBar = document.querySelector("a[href='/explore/'");
    removeElement(exploreBar);
}

let pageMap = new Map();
pageMap.set("www.youtube.com", blockYouTubeRecommendations);
pageMap.set("www.facebook.com", facebook);
pageMap.set("www.reddit.com", removeBody);
pageMap.set("imgur.com", removeBody);
pageMap.set("www.tiktok.com", removeBody)
pageMap.set("instagram.com", instagram);

const myLocation = window.location.host;
console.log(myLocation);

const blockFunction = pageMap.get(myLocation);

if (blockFunction) {
    blockFunction();

    // Check repeatedly as many applications are single page and load dynamically
    setInterval(blockFunction, 1000);
}