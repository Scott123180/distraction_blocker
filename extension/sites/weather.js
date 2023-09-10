const blockWeatherRecommendations = () => {

    removeElementIfExists(document.querySelector(".region-sidebar"))

    removeNonAlertMessagingFromCurrentConditionsCard();

    removeContentMedia();

}

const removeContentMedia = () => {

    const contentArray = elementIdContains("div", "WxuContentMedia-main");
    contentArray.forEach(c => c.remove());
}

const removeNonAlertMessagingFromCurrentConditionsCard = () => {
    const matchedDiv = elementClassnameContains("div", "CurrentConditions--messaging")[0];

    if(matchedDiv){
        const weatherAlert = elementClassnameContains("a", "AlertHeadline--AlertHeadline")[0]
        if(!weatherAlert) {
            matchedDiv.remove();
        }
    }
}

function elementClassnameContains(selector, text) {
    let elements = document.querySelectorAll(selector);

    return Array.from(elements).filter(element => element.className.includes(text));
}

function elementIdContains(selector, text) {
    let elements = document.querySelectorAll(selector);

    return Array.from(elements).filter(element => element.id.includes(text));
}