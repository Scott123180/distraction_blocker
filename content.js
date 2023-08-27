function removeElement(elementToRemove){
    elementToRemove.parentNode.removeChild(elementToRemove);
}

function removeById(id){
    const elementToRemove = document.getElementById(id);
    elementToRemove.parentNode.removeChild(elementToRemove);
}

const youtube = () => {
    // Initial check
    blockYouTubeRecommendations();

    // // Check repeatedly as YouTube is a single-page application and content might get loaded dynamically
    setInterval(blockYouTubeRecommendations, 1000);
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
pageMap.set("https://www.youtube.com/", youtube);
pageMap.set("https://www.facebook.com/", facebook);
pageMap.set("https://www.reddit.com/", removeBody);
pageMap.set("https://imgur.com/", removeBody);
pageMap.set("https://www.tiktok.com/en/", removeBody)


pageMap.set("https://www.instagram.com/", instagram);
pageMap.set("https://www.instagram.com/explore/", instagram);


const myLocation = window.location.host;
console.log("location!")
console.log(myLocation);

const filterFunction = pageMap.get(myLocation);

if(filterFunction){
    filterFunction();
}