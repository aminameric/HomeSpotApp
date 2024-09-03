var UserLogin = {
    init: function () {
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
                UserLogin.login(entity); // Call the register function with form data
            }
        });
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
                if (result.user && result.token) {
                    localStorage.setItem('user', JSON.stringify(result.user));
                    localStorage.setItem('token', result.token);
                    updateNavigation();
                    window.location.href = '#index';
                    alert("Login successful!");
    
                    $('#navigation-button').hide();
                    $('#logout-button').show();
    
                    $('#houses-link').show();
                    $('#apartments-link').show();
                    $('#list-real-estate-link').show();
                } else {
                    alert("Login response does not contain user or token");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Login failed: " + XMLHttpRequest.responseText);
            }
        });
    }
    
    
};

$(document).ready(function () {
    UserLogin.init();
});


document.getElementById('signup-button').addEventListener('click', function() {
    window.location.href = 'register.html';
});

