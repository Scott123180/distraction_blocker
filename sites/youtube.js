const blockYouTubeRecommendations = () => {
    //contains all the url info - we can tell what page people are on and determine what to block 
    // from there
    const href = window.location.href;


    // Block the main homepage feed
    let homeFeed = document.querySelector("ytd-browse");
    if (homeFeed) {
      homeFeed.remove();
    }
    let primary = document.getElementById("primary")
    if(primary) {
        primary.remove();
    }
  
    // Block the sidebar recommendations
    let recommendedSidebar = document.querySelectorAll("ytd-watch-next-secondary-results-renderer");
    if (recommendedSidebar.length > 0) {
      recommendedSidebar.forEach(element => {
        element.remove();
      });
    }
  };
  