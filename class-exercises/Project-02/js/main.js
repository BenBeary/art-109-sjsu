document.addEventListener("DOMContentLoaded", function () {
    const paragraphs = document.querySelectorAll('.animText');
    const typingSpeed = 100; // Adjust typing speed (ms) between each character

    paragraphs.forEach((p, index) => {
        const text = p.getAttribute('data-text'); // Get the text from data-text attribute
        p.textContent = ''; // Clear the content initially

        // Function to print individual characters
        function typeChar(i) {
            if (i < text.length) {
                p.textContent += text.charAt(i); // Add one character at a time
                setTimeout(() => typeChar(i + 1), typingSpeed);
            }
        }

        // Add delay for each paragraph to start typing one after another
        setTimeout(() => {
            typeChar(0); // Start typing for each paragraph
        }, index * text.length * typingSpeed);
    });
});