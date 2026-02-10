// script.js

const noBtn = document.querySelector(".no-btn");

// Function to handle button click events
function selectOption(option) {
    // Check which option was clicked
    if (option === 'yes') {
        // Flash rainbow colors
        flashRainbowColors(function() {
            document.getElementById('question').style.display = 'none'; // Hide the question
            displayCatHeart(); // Display the cat-heart.gif
        });
    } else if (option === 'no') {
        // Change text on the "No" button to "You sure?"
        document.getElementById('no-button').innerText = 'You sure?'; 
        // Increase font size of "Yes" button
        var yesButton = document.getElementById('yes-button');
        var currentFontSize = window.getComputedStyle(yesButton).getPropertyValue('font-size');
        var newSize = parseFloat(currentFontSize) * 2; // Increase font size by  * 2px
        yesButton.style.fontSize = newSize + 'px';
    } else {
        // If neither "Yes" nor "No" was clicked, show an alert message
        alert('Invalid option!');
    }
}

// Function to flash rainbow colors and then execute a callback function
function flashRainbowColors(callback) {
    var colors = ['#ffe6f0', '#ff80bf', '#ff4da6', '#ff1a8c', '#b3004d'];
    var darkest = '#b3004d';
    var i = 0;
    var transitionDuration = 300; // ms for rapid cycling
    var finalFade = 500; // ms to fade into the darkest shade

    // start cycling
    document.body.style.transition = 'background-color ' + transitionDuration + 'ms linear';
    document.body.style.backgroundColor = colors[0];
    var interval = setInterval(function() {
        i = (i + 1) % colors.length;
        document.body.style.backgroundColor = colors[i];
    }, transitionDuration);

    // after one full cycle, stop and fade into the darkest shade, then swap screens
    setTimeout(function() {
        clearInterval(interval);

        // smoothly fade into the darkest shade
        document.body.style.transition = 'background-color ' + finalFade + 'ms linear';
        document.body.style.backgroundColor = darkest;

        // after fading to darkest, fade out current screen elements
        setTimeout(function() {
            var fadeTargets = [
                document.getElementById('image-container'),
                document.getElementById('question'),
                document.getElementById('options')
            ].filter(Boolean);

            fadeTargets.forEach(function(el) {
                // ensure starting opacity and transition
                el.style.transition = 'opacity 500ms ease';
                el.style.opacity = '1';
                // trigger fade out
                requestAnimationFrame(function() {
                    el.style.opacity = '0';
                });
            });

            // after fade-out, run callback to replace content
            setTimeout(function() {
                if (callback) callback();

                // wait for new images inside image-container to load, then fade them in
                var imageContainer = document.getElementById('image-container');
                if (!imageContainer) return;

                // ensure container starts invisible so we can fade in
                imageContainer.style.opacity = '0';
                imageContainer.style.transition = 'opacity 500ms ease';

                var imgs = Array.from(imageContainer.getElementsByTagName('img'));
                if (imgs.length === 0) {
                    // no images: just fade container in
                    requestAnimationFrame(function() { imageContainer.style.opacity = '1'; });
                    return;
                }

                var remaining = imgs.length;
                imgs.forEach(function(img) {
                    if (img.complete) {
                        remaining--;
                    } else {
                        img.addEventListener('load', function() { remaining--; });
                        img.addEventListener('error', function() { remaining--; });
                    }
                });

                // poll until all images report loaded/errored
                var checkInterval = setInterval(function() {
                    if (remaining <= 0) {
                        clearInterval(checkInterval);
                        requestAnimationFrame(function() { imageContainer.style.opacity = '1'; });
                    }
                }, 50);
            }, 600); // wait a bit after fade-out to call callback
        }, finalFade);
    }, colors.length * transitionDuration);
}

// Function to display the cat.gif initially
function displayCasette() {
    // Get the container where the image will be displayed
    var imageContainer = document.getElementById('image-container');
    if (!imageContainer) {
        // Guard: if the container is missing, do nothing to avoid errors
        return;
    }
    // Create a new Image element for the cassette
    var casetteImage = new Image();
    // Set the source (file path) for the cassette image
    casetteImage.src = 'casette.png'; // Assuming the cassette image is named "cassette.png"
    // Set alternative text for the image (for accessibility)
    casetteImage.alt = 'Casette';
    // When the cassette image is fully loaded, add it to the image container
    casetteImage.onload = function() {
        imageContainer.appendChild(casetteImage);
    };
}

// Function to display the cat-heart.gif
function displayCatHeart() {
    var imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = '';

    // Center contents vertically and horizontally
    imageContainer.style.display = 'flex';
    imageContainer.style.flexDirection = 'column';
    imageContainer.style.alignItems = 'center';
    imageContainer.style.justifyContent = 'center';
    imageContainer.style.gap = '10px';
    imageContainer.style.minHeight = '60vh';

    var catHeartImage = new Image();
    catHeartImage.src = 'cat-heart.gif';
    catHeartImage.alt = 'Cat Heart';
    catHeartImage.style.display = 'block';
    catHeartImage.style.maxWidth = '90%';
    catHeartImage.style.height = 'auto';

    catHeartImage.onload = function() {
        imageContainer.appendChild(catHeartImage);

        var spcodeImage = new Image();
        spcodeImage.src = 'spcode.png';
        spcodeImage.alt = 'SP Code';
        spcodeImage.style.display = 'block';
        spcodeImage.style.marginTop = '10px';
        spcodeImage.style.maxWidth = '90%';
        spcodeImage.style.height = 'auto';

        // Create anchor that wraps the spcode image and links to Spotify
        var spotifyLink = document.createElement('a');
        spotifyLink.href = 'https://open.spotify.com/playlist/5wWLS3pSlPAlz1jfWdaYyh?si=f_asVkgSQ6y4kP5POFxtNA';
        spotifyLink.target = '_blank';
        spotifyLink.rel = 'noopener noreferrer';
        spotifyLink.appendChild(spcodeImage);

        if (spcodeImage.complete) {
            imageContainer.appendChild(spotifyLink);
        } else {
            spcodeImage.onload = function() {
                imageContainer.appendChild(spotifyLink);
            };
            spcodeImage.onerror = function() {
                // still append the link even if image fails, so link is accessible
                imageContainer.appendChild(spotifyLink);
            };
        }

        document.getElementById('options').style.display = 'none';
    };

    if (catHeartImage.complete) catHeartImage.onload();
}


// Display the casette.png initially once DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    displayCasette();
});