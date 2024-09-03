$(document).ready(function() {
    // Toggle dropdown menu
    $('#dropdown-button').on('click', function() {
        $('#dropdown-menu').toggleClass('show');
    });

    // Handle item selection
    $('#dropdown-menu .dropdown-item').on('click', function(e) {
        e.preventDefault(); // Prevent default action (form submission or link navigation)
        
        var selectedText = $(this).text();
        var selectedValue = $(this).data('value');
        $('#selected-option').text(selectedText);
        $('#dropdown-menu').removeClass('show'); // Hide dropdown after selection

        // Show the image upload section if "Agent" is selected
        if (selectedValue === 'agent') {
            $('#image-upload-section').show();
        } else {
            $('#image-upload-section').hide();
            $('#image-preview').attr('src', '#').hide(); // Clear the image preview if not an agent
        }
    });

    // Hide dropdown if clicked outside
    $(document).on('click', function(event) {
        if (!$(event.target).closest('.dropdown').length) {
            $('#dropdown-menu').removeClass('show');
        }
    });

    // Preview image after file selection
    $('#upload-image').on('change', function(event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#image-preview').attr('src', e.target.result).show(); // Show the image preview
            }
            reader.readAsDataURL(file); // Convert file to data URL for preview
        } else {
            $('#image-preview').hide(); // Hide preview if no file is selected
        }
    });
});

var UserService = {
    init: function () {
        $("#registration-form").validate({
            rules: {
                username: { required: true },
                email: { required: true, email: true },
                password: { required: true, minlength: 8 },
                name: { required: true },
                surname: { required: true }
            },
            submitHandler: function (form) {
                var formData = new FormData();
                formData.append('username', $("input[name='username']").val());
                formData.append('email', $("input[name='email']").val());
                formData.append('password', $("input[name='password']").val());
                formData.append('first_name', $("input[name='name']").val());
                formData.append('last_name', $("input[name='surname']").val());
                formData.append('type_of_user', $("#selected-option").text());
                
                // Handle image upload if "Agent" is selected
                if ($("#selected-option").text() === 'Agent') {
                    var file = $('#upload-image')[0].files[0];
                    if (file) {
                        formData.append('file', file);
                    }
                }

                $.ajax({
                    url: "../rest/addAgent", // Adjust this path if needed
                    type: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        localStorage.setItem('user', JSON.stringify(result.user));
                        window.location.href = '#login';
                        alert("Registration successful!");
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("Registration failed: " + XMLHttpRequest.responseText);
                    }
                });
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
                window.location.href = '/HomeSpotApp/frontend/login.html';
                alert("Registration successful!");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Registration failed: " + XMLHttpRequest.responseText);
            }
        });
    }
};

$(document).ready(function () {
    UserService.init();
});
