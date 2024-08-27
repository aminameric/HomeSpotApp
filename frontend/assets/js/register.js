$(document).ready(function() {
    // Toggle dropdown menu
    $('#dropdown-button').on('click', function() {
        $('#dropdown-menu').toggleClass('show');
    });

    // Handle item selection
    $('#dropdown-menu .dropdown-item').on('click', function(e) {
        e.preventDefault(); // Prevent default action (form submission or link navigation)
        
        var selectedText = $(this).text();
        $('#selected-option').text(selectedText);
        $('#dropdown-menu').removeClass('show'); // Hide dropdown after selection
    });

    // Hide dropdown if clicked outside
    $(document).on('click', function(event) {
        if (!$(event.target).closest('.dropdown').length) {
            $('#dropdown-menu').removeClass('show');
        }
    });
});

