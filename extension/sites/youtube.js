const blockYouTubeRecommendations = () => {

  const currentPage = parsePage();
  blockSiteSidebar();

  switch (currentPage) {
    case "homePage": {
      blockHomePage();
      return;
    }
    case "watchPage": {
      blockWatchPage();
      return;
    }
    case "shortsPage": {
      blockShortsPage();
      return;
    }
    case "subscriptionsPage": {
      blockSubscriptionsPage();
      return;
    }
    default: {
      return;
    }
  }
};

const blockSiteSidebar = () => {
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
  removeElementIfExists(document.getElementById("secondary-inner"));

  //after video recommendations
  removeElementIfExists(document.querySelector("div.ytp-endscreen-content"));
}

const blockHomePage = () => {
  //homepage recommended videos
  removeElementIfExists(document.querySelector('ytd-rich-grid-renderer'));
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