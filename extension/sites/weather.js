const blockWeatherRecommendations = () => {
    // Right-side sidebar column
    removeElementIfExists(document.querySelector('div[style="grid-area: sidebar;"]'));

    // Bottom content area (Taboola feed)
    removeElementIfExists(document.querySelector('div[style="grid-area: contentBottom;"]'));

    // Ad unit containers (WX_* slots)
    document.querySelectorAll('[data-testid$="-container"]').forEach(el => {
        if (el.dataset.testid && el.dataset.testid.startsWith('WX_')) {
            el.remove();
        }
    });

    // Taboola recommendation feed
    document.querySelectorAll('[id^="taboola"]').forEach(el => el.remove());
}
