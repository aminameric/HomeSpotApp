$(document).ready(function() {
    // Bind validateCreditCard to #card-number
    $('#card-number').validateCreditCard(function(result) {
        console.log('cc',result);
        if (!$('#card-number').val()){
            return;
        }
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

    function buyProperty(userId, propertyId) {
        
        $.ajax({
            url: '../rest/buyProperty',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ users_id: userId, property_id: propertyId }),
            success: function(response) {
                console.log('Sent data:', { users_id: userId, property_id: propertyId });
                console.log('Response from backend:', response);
                
                if (response.success) {
                    toastr.success('Property bought successfully!');
                    // Call update status only if buying is successful
                    updatePropertyStatus(propertyId, 1, userId);
                } else {
                    alert('Failed to buy property: ' + response.message);
                }
            },
            error: function(xhr) {
                toastr.error('Error: ' + xhr.responseJSON.message);
                console.error('Backend error:', xhr);
            }
        });
    }
    
    // Function to update the property status
    function updatePropertyStatus(propertyId, status, userId) {
        $.ajax({
            url: '../rest/updatePropertyStatus',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ propertyId: propertyId, status: status }),
            success: function(updateResponse) {
                console.log('Update status response:', updateResponse);
                if (updateResponse.success) {
                    //toastr.success('Property status updated successfully!');
                    $('#buyModal').modal('hide'); // Hide the modal if using Bootstrap, for example
                    // Redirect user
                    window.location.href="#properties"
                    loadBoughtProperties(userId);
                } else {
                    //toastr.error('Failed to update property status: ' + updateResponse.message);
                }
            },
            error: function(updateError, textStatus, errorThrown) {
                console.error('Error updating property status:', updateError);
                let errorMessage = 'Unknown error'; // Default message
                if (updateError.responseJSON && updateError.responseJSON.message) {
                    errorMessage = updateError.responseJSON.message;
                } else if (updateError.responseText) {
                    errorMessage = updateError.responseText; // Fallback if responseJSON is not available
                } else {
                    errorMessage = errorThrown; // Use errorThrown if no other details are available
                }
                alert('Error updating property status: ' + errorMessage);
            }
            
        });
    }

    
    
    // Form submission handler
    $('#submit-buy-btn').click(function(event) {
        event.preventDefault(); // Prevent default form submission
        var isValid = true;
    
        // Collect data from the form
        var cardNumber = $('#card-number').val().replace(/\s/g, ''); // Remove spaces from card number
        var cardHolderName = $('#card-holder-name').val().trim();
        var expiryDate = $('#expiry-date').val().trim();
        var cvc = $('#cvc').val().trim();
    
        // Retrieve property ID from URL query parameters
        var urlParams = new URLSearchParams(window.location.search);
        var propertyId = urlParams.get('id');
    
        // Validate inputs
        if (!$('#card-number').hasClass('cc-valid')) {
            toastr.error('Please enter a valid credit card number.');
            isValid = false;
        }
    
        if (!cardHolderName || !expiryDate || !cvc) {
            toastr.error('Please fill out all fields.');
            isValid = false;
        }
    
        if (!propertyId) {
            alert('Property ID not found.');
            return;
        }
    
        if (isValid) {
            const userId = JSON.parse(localStorage.getItem('user')).id;
            if (!userId) {
                alert('User not logged in.');
                return;
            }
    
            buyProperty(userId, propertyId);
        }
    });
     
});





