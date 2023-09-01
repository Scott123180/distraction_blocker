const CONFIGS = [
    { id: "blockYoutube", label: "Youtube (beta)" },
    { id: "blockFacebook", label: "Facebook (alpha)" },
    { id: "blockReddit", label: "Reddit (alpha)" },
    { id: "blockImgur", label: "Imgur (alpha)" },
    { id: "blockTikTok", label: "TikTok (alpha)" },
    { id: "blockInstagram", label: "Instagram (alpha)" },
];

document.addEventListener('DOMContentLoaded', function () {
    // Restore saved checkbox states, or set to default
    restoreOptions();

    generateCheckboxes();

    attachEventListeners();
});


function generateCheckboxes() {
    const container = document.getElementById('checkboxContainer'); // A container div for checkboxes

    CONFIGS.forEach(config => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = config.id;

        const label = document.createElement('label');
        label.innerHTML = config.label;
        label.setAttribute('for', config.id);

        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(document.createElement('br')); // New line for clarity
    });
}

function saveOptions() {
    let settings = {};

    CONFIGS.forEach(config => {
        settings[config.id] = document.getElementById(config.id).checked;
    });

    chrome.storage.sync.set(settings);
}

function restoreOptions() {
    chrome.storage.sync.get(null, function(data) {
        CONFIGS.forEach(config => {
            let checkbox = document.getElementById(config.id);

            // If setting exists, set checkbox, else default to unchecked
            if (checkbox) {
                checkbox.checked = data[config.id] || false;
            }
        });
    });
}


function attachEventListeners() {
    CONFIGS.forEach(config => {
        document.getElementById(config.id).addEventListener('change', saveOptions);
    });
}