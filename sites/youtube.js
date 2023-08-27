const blockYouTubeRecommendations = () => {

  const currentPage = parsePage();
  blockSidebar();

  switch (currentPage) {
    case "homePage": {
      blockHomePage();
    }
    case "watchPage": {
      blockWatchPage();
    }
    case "shortsPage": {
      blockShortsPage();
    }
    case "subscriptionsPage": {
      blockSubscriptionsPage();
    }
    default: {
      return;
    }
  }
};

const blockSidebar = () => {
  removeElementIfExists(document.getElementById("guide-inner-content"));
}

const blockSubscriptionsPage = () => {
  removeElementIfExists(document.getElementById("primary"))
}

const blockShortsPage = () => {
  removeElementIfExists(document.getElementById("offline-container"));
  removeElementIfExists(document.getElementById("shorts-container"));
}

const blockWatchPage = () => {
  //recommended video sidebar
  removeElementIfExists(document.getElementById("secondary"));

  //after video recommendations
  removeElementIfExists(document.querySelector("div.ytp-endscreen-content"));
}

const blockHomePage = () => {
  //homepage recommended videos
  removeElementIfExists(document.getElementById("primary"));
}

const removeElementIfExists = (element) => {
  if (element) {
    element.remove();
  }
}

const parsePage = () => {
  const href = window.location.href;

  if (href === 'https://www.youtube.com/') {
    return "homePage";
  }
  else if (href.includes("watch")) {
    return "watchPage";
  } else if (href.includes("shorts")) {
    return "shortsPage";
  } else if(href.includes("subscriptions")){
    return "subscriptionsPage";

  }
}