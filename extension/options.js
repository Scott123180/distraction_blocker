const CONFIGS = [
    { id: "blockYoutube", label: "Youtube (beta)" },
    { id: "blockFacebook", label: "Facebook (alpha)" },
    { id: "blockReddit", label: "Reddit (alpha)" },
    { id: "blockImgur", label: "Imgur (alpha)" },
    { id: "blockTikTok", label: "TikTok (alpha)" },
    { id: "blockInstagram", label: "Instagram (alpha)" },
    { id: "blockWeather", label: "Weather.com (alpha)" },
];

document.addEventListener('DOMContentLoaded', function () {
    generateCheckboxes();

    // Restore saved checkbox states, or set to default
    restoreOptions();

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

// function restoreOptions() {
//     chrome.storage.sync.get(null, function(data) {
//         CONFIGS.forEach(config => {
//             let checkbox = document.getElementById(config.id);

//             // If setting exists, set checkbox, else default to unchecked
//             if (checkbox) {
//                 checkbox.checked = data[config.id] || false;
//             }
//         });
//     });
// }

function restoreOptions() {
    chrome.storage.sync.get(null, function(data) {
        CONFIGS.forEach(config => {
            let checkbox = document.getElementById(config.id);
            if (checkbox) {
                // If the config setting exists in storage, use that, else default to unchecked
                if (data.hasOwnProperty(config.id)) {
                    checkbox.checked = data[config.id];
                } else {
                    checkbox.checked = false;
                    saveOptions();  // Save this default value to storage
                }
            }
        });
    });
}



function attachEventListeners() {
    CONFIGS.forEach(config => {
        document.getElementById(config.id).addEventListener('change', saveOptions);
    });
}