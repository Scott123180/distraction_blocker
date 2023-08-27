const blockYouTubeRecommendations = () => {

  const currentPage = parsePage();

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
    default: {
      return;
    }
  }
};

const blockShortsPage = () => {
  //offline container
  removeElementIfExists(document.getElementById("offline-container"));

  //shorts container
  removeElementIfExists(document.getElementById("shorts-container"));
}

const blockWatchPage = () => {
  //recommended video sidbar
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
  }
}