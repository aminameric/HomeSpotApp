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
                    toggleNewPropertyButton();
                    window.location.href = '#properties';
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
    console.log(typeof jQuery); // Should log "function"

    console.log(typeof $.fn.validate); // Should log "function"

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

function toggleNewPropertyButton() {
    const rawUser = localStorage.getItem('user');
    console.log('rawUser from localStorage:', rawUser);
  
    if (!rawUser) {
        console.error('No user data found in localStorage');
        return;
    }
  
    let user;
    try {
        user = JSON.parse(rawUser);
        console.log('Parsed user object:', user);
    } catch (error) {
        console.error('Error parsing user data:', error);
        return;
    }
  
    const type_of_user = user.type_of_user;
    console.log('type_of_user:', type_of_user);
  
    if (!type_of_user) {
        console.error('type_of_user not found in user object');
        return;
    }
  
    const $newPropButton = $('#new-prop');
    if ($newPropButton.length === 0) {
        console.error('Element with ID "new-prop" not found');
        return;
    }
  
    if (type_of_user.toLowerCase() === 'agent') {
        $newPropButton.removeClass('d-none');
        console.log('Removed d-none class, showing button');
    } else {
        $newPropButton.addClass('d-none');
        console.log('Added d-none class, hiding button');
    }
  }