// nav.js
document.addEventListener('DOMContentLoaded', function () {
    // Fetch the HTML of the navigation from index.html
    fetch('index.html')
        .then(response => response.text())
        .then(data => {
            // Create a temporary div to parse the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;
            
            // Extract the navigation HTML
            const navHTML = tempDiv.querySelector('#navmenu').outerHTML;
            
            // Insert the navigation into the current page
            document.body.insertAdjacentHTML('afterbegin', navHTML);
        })
        .catch(error => console.error('Error loading navigation:', error));
});
