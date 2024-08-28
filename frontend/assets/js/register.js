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

var UserService = {
    init: function () {
        // Validate the registration form
        $("#registration-form").validate({
            rules: {
                name: {
                    required: true
                },
                password: {
                    required: true,
                    minlength: 8
                }
            },
            submitHandler: function (form) {
                var entity = {
                    username: $("input[name='username']").val(),
                    email: $("input[name='email']").val(),
                    password: $("input[name='password']").val(),
                    first_name: $("input[name='name']").val(),
                    last_name: $("input[name='surname']").val(),
                    type_of_user: $("#selected-option").text()
                };
                UserService.register(entity); // Call the register function with form data
            }
        });
    },
  
    register: function (entity) {

        $.ajax({
            url: "../rest/addUser",
            type: "POST",
            data: JSON.stringify(entity),
            contentType: "application/json",
            dataType: "json",
            success: function (result) {
                localStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = '/HomeSpotApp/frontend/properties.html';
                alert("Registration successful!");
                // Optionally, redirect to another page or perform other actions
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Registration failed: " + XMLHttpRequest.responseText);
                // Optionally, display error message or perform other actions
            }
        });
    }
};

$(document).ready(function () {
    UserService.init();
});

