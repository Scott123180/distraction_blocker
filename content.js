function removeElement(elementToRemove) {
    elementToRemove.parentNode.removeChild(elementToRemove);
}

function removeById(id) {
    const elementToRemove = document.getElementById(id);
    elementToRemove.parentNode.removeChild(elementToRemove);
}
//breaks auth login pages :(
//https://www.facebook.com/privacy/consent/gdp/?params%5Bapp_id%5D=207996792688965&params%5Berror_unsupported_step%5D=false&params%5Bkid_directed_site%5D=false&params%5Blogger_id%5D=%22821b9fc7-2c23-4862-a8df-3949a8738c34%22&params%5Bnext%5D=%22read%22&params%5Bredirect_uri%5D=%22https%3A%5C%2F%5C%2Fcpauthentication.civicplus.com%5C%2Fsignin-facebook%22&params%5Bresponse_type%5D=%22code%22&params%5Breturn_scopes%5D=false&params%5Bscope%5D=%5B%22email%22%5D&params%5Bstate%5D=%22CfDJ8M7cKe0qVmpJoSPOY6KqDjjkAdZ9F7p4VodIWPkIr-xq6PFu_qBbfIaS_h8rzIVSua5-oNVEdYFDqFTLiTxKptkfvt5hsl7qqFvcSDs3QNEnTrZyzWUTtp-QsnA_UYplG7zeMhwvHCRrOnVJIeIIY2zejBx9Z640nFfiMvXAVDO_%22&params%5Bsteps%5D=%7B%22read%22%3A%5B%22email%22%2C%22baseline%22%2C%22public_profile%22%5D%7D&params%5Btp%5D=%22unspecified%22&params%5Bcui_gk%5D=%22login_platformization_read%22&source=gdp_delegated
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

let blockConfigMap = new Map();
blockConfigMap.set("www.youtube.com", "blockYoutube");
blockConfigMap.set("www.facebook.com", "blockFacebook");
blockConfigMap.set("www.reddit.com", "blockReddit");
blockConfigMap.set("imgur.com", "blockImgur");
blockConfigMap.set("www.tiktok.com", "blockTikTok")
blockConfigMap.set("instagram.com", "blockInstagram");
//twitter
//zillow
//news sites

const myLocation = window.location.host;
console.log(myLocation);

const blockFunction = pageMap.get(myLocation);
const blockConfig = blockConfigMap.get(myLocation);

if(blockFunction){
    chrome.storage.sync.get(blockConfig, function(data) {
        if (data[blockConfig]) {
                blockFunction();

                // Check repeatedly as many applications are single page and load dynamically
                setInterval(blockFunction, 1000);
            }
        }
    )
};
