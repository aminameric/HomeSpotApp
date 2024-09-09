
  $(document).ready(function () {
    // Handle form submission
    $(".php-email-form").submit(function (e) {
      e.preventDefault(); // Prevent the default form submission

      // Get form values
      const name = $("input[name='name']").val();
      const email = $("input[name='email']").val();
      const subject = $("input[name='subject']").val();
      const message = $("textarea[name='message']").val();

      // Get users_id from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const users_id = user ? user.id : null; // Assuming the user's ID is stored in 'id'
      // Disable the submit button to prevent multiple submissions
      const submitButton = $("button[type='submit']");
      submitButton.prop('disabled', true);

      // Show loading message and hide others
      $(".loading").show();
      $(".sent-message").hide();
      $(".error-message").hide();

      // Prepare the feedback data
      const feedbackData = {
        users_id: users_id,
        name: name,
        email: email,
        subject: subject,
        message: message
      };

      // AJAX request to send the form data
      $.ajax({
        url: "../rest/addFeedback", // Update to your backend route
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(feedbackData),
        success: function (response) {
          // Hide the loading message
          $(".loading").hide();
          
          if (response.status === "success") {
            // Show success message and reset the form
            $(".sent-message").show();
            $(".php-email-form")[0].reset(); // Reset the form fields
          } else {
            // Show error message from server
            $(".error-message").html(response.message || "An error occurred, please try again.").show();
          }
        },
        error: function (xhr, status, error) {
          // Hide the loading message and show error message
          $(".loading").hide();
          $(".error-message").html("There was an error sending the message.").show();
        },
        complete: function () {
          // Re-enable the submit button after request completion
          submitButton.prop('disabled', false);
        }
      });
    });
  });

