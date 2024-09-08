var UserLogin = {
    init: function () {
        // Check if the validate function is available before using it
        if ($.fn.validate) {
            // Validate the login form
            $("#login-form").validate({
                rules: {
                    username: {
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
                        password: $("input[name='password']").val()
                    };
                    UserLogin.login(entity); // Call the login function with form data
                }
            });
        } else {
            console.error("Validation plugin not loaded.");
        }
    },

    login: function (entity) {
        $.ajax({
            url: "../rest/loginUser",
            type: "POST",
            data: JSON.stringify(entity),
            contentType: "application/json",
            dataType: "json",
            success: function (result) {
                console.log(result); // Log the result to check if the token is present
                $('#login-form').find("input[name='username'], input[name='password']").val('');
                if (result.user && result.token) {
                    localStorage.setItem('user', JSON.stringify(result.user));
                    localStorage.setItem('token', result.token);
                    updateNavigation();
                    window.location.href = '#index';
                    toastr.success('Login Successful! Welcome back.');           
                } else {
                    alert("Login response does not contain user or token");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                toastr.error('Login failed. Please check your credentials.');
            }
        });
    }
};

// Document ready: Initialize login validation
$(document).ready(function () {
    UserLogin.init();
});

// Event listener for sign-up button
document.getElementById('signup-button').addEventListener('click', function() {
    window.location.href = '#registration';
});

// Go back to the home page
function goBack() {
    window.location.href = '#index'; // Redirect to the home page
}
