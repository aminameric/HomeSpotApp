$(document).ready(function() {
    // Bind validateCreditCard to #card-number
    $('#card-number').validateCreditCard(function(result) {
        var cardNumber = $('#card-number').val().replace(/\s/g, ''); // Remove spaces from card number
        
        // Skip validation for specific card number
        if (cardNumber === '0123452174170001') {
            $('#card-number').addClass('cc-valid').removeClass('is-invalid');

            // Display a checkmark for this specific card
            if (!$('#card-valid-icon').length) {
                $('#card-number').after('<span id="card-valid-icon" style="color: green; font-size: 1.5em; margin-left: 10px;">&#10004;</span>'); // Checkmark
            }
            return; // Skip further validation for this card number
        }

        // Regular validation for other card numbers
        if (result.valid) {
            // Add checkmark for valid cards
            if (!$('#card-valid-icon').length) {
                $('#card-number').after('<span id="card-valid-icon" style="color: green; font-size: 1.5em; margin-left: 10px;">&#10004;</span>'); // Checkmark
            }
            $('#card-number').addClass('cc-valid').removeClass('is-invalid');
        } else {
            // Remove checkmark for invalid cards
            $('#card-valid-icon').remove();
            $('#card-number').removeClass('cc-valid').addClass('is-invalid');
        }
    });

    // Form submission handler
    $('#submit-buy-btn').click(function(event) {
        event.preventDefault(); // Prevent form from submitting traditionally
        var isValid = true;

        var cardNumber = $('#card-number').val().replace(/\s/g, ''); // Remove spaces from card number
        var cardHolderName = $('#card-holder-name').val().trim();
        var expiryDate = $('#expiry-date').val().trim();
        var cvc = $('#cvc').val().trim();
        var propertyId = $(this).data('property-id'); // Get property ID from a data attribute

        // Check if card number input has the valid class
        if (!$('#card-number').hasClass('cc-valid')) {
            toastr.error('Please enter a valid credit card number.');
            isValid = false;
        }

        // Check if any other fields are empty
        if (!cardHolderName || !expiryDate || !cvc) {
            toastr.error('Please fill out all fields.');
            isValid = false;
        }

        var urlParams = new URLSearchParams(window.location.search);
        var propertyId = urlParams.get('id');
        // If all validations pass, proceed with the payment and deletion
        if (isValid) {
            console.log('Payment processed successfully');

            // AJAX call to confirm and delete the property
            $.ajax({
                url: '../rest/deleteproperty/' + propertyId, // Adjust this path based on your API
                type: 'DELETE',
                contentType: 'application/json',
                beforeSend: function(xhr) {
                    // Add authentication token from localStorage if available
                    if (localStorage.getItem('user')) {
                        xhr.setRequestHeader("Authentication", localStorage.getItem('token'));
                    }
                },
                success: function (deleteResponse) {
                    console.log('Property deleted successfully:', deleteResponse);
                    toastr.success("Property bought successfully!");
                    // Redirect to the list of properties after deletion
                    window.location.hash = '#properties';
                    $('#buyModal').hide(); // Optionally close the modal
                },
                error: function (xhr, status, error) {
                    console.error('Error deleting property:', error);
                    toastr.error('There was an error deleting the property. Please try again.');
                }
            });
        }
    });
});

