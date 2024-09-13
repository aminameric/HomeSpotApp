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


function loadBoughtProperties(userId) {
    if (!userId) {
        console.error('User ID is not defined in loadBoughtProperties');
        return;
    }

    $.ajax({
        url: `../rest/myProperties/${userId}?cacheBuster=${new Date().getTime()}`,
        method: "GET",
        beforeSend: function (xhr) {
            const token = localStorage.getItem('token');
            if (token) {
                xhr.setRequestHeader("Authorization", token);
            }
        },
        success: function (response) {
            console.log('AJAX request successful', response);
            
            // Clear previous properties
            $("#bought-properties-list").empty();
            console.log('Cleared previous properties');

            if (Array.isArray(response.properties)) {
                sessionStorage.setItem('boughtProperties', JSON.stringify(response.properties)); // Store in sessionStorage

                response.properties.forEach(function (property) {
                    console.log('Processing property:', property);

                    const imageUrl = property.image_url ? `http://localhost/HomeSpotApp/rest/storage/${property.image_url}` : null;

                    // Format the price in BAM
                    let formattedPrice = new Intl.NumberFormat('de-DE', { 
                        style: 'currency', 
                        currency: 'BAM', 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                    }).format(property.price || 0);

                    // Create a new column for each card with unique class
                    const cardContainerHtml = `
    
                        <div class="col-xl-4 col-md-6" data-id="${property.id}" data-aos="fade-up" data-aos-delay="100">
                            <div class="bought-property-card">
                                <div class="bought-card-image">
                                    <figure class="image is-4by3">
                                        <img class="bought-property-image" src="${imageUrl}" alt="Property Image">
                                    </figure>
                                </div>
                                <div class="bought-card-body">
                                    <h3 class="bought-property-name">${property.name}</h3>
                                    <span class="bought-property-price">Price: ${formattedPrice}</span>
                                    <div class="bought-property-details">
                                        <div class="bought-property-info">Area: ${property.area} sqm</div>
                                        <div class="bought-property-info">Beds: ${property.bedrooms}</div>
                                        <div class="bought-property-info">Baths: ${property.bathrooms}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    // Append each card's column to the row
                    $("#bought-properties-list").append(cardContainerHtml);
                    console.log('Appended property card:', property.id);
                });
            } else {
                console.error('Unexpected response format');
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX request failed', error);
        }
    });
}

function loadBoughtPropertiesFromSession() {
    const properties = JSON.parse(sessionStorage.getItem('boughtProperties'));
    if (properties) {
        $("#bought-properties-list").empty();

        properties.forEach(function (property) {
            console.log('Processing property from session:', property);

            const imageUrl = property.image_url ? `http://localhost/HomeSpotApp/rest/storage/${property.image_url}` : null;

            // Format the price in BAM
            let formattedPrice = new Intl.NumberFormat('de-DE', { 
                style: 'currency', 
                currency: 'BAM', 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            }).format(property.price || 0);

            // Create a new column for each card with unique class
            const cardContainerHtml = `
                <div class="col-xl-4 col-md-6" data-id="${property.id}" data-aos="fade-up" data-aos-delay="100">
                    <div class="bought-property-card">
                        <div class="bought-card-image">
                            <figure class="image is-4by3">
                                <img class="bought-property-image" src="${imageUrl}" alt="Property Image">
                            </figure>
                        </div>
                        <div class="bought-card-body">
                            <h3 class="bought-property-name">${property.name}</h3>
                            <span class="bought-property-price">Price: ${formattedPrice}</span>
                            <div class="bought-property-details">
                                <div class="bought-property-info">Area: ${property.area} sqm</div>
                                <div class="bought-property-info">Beds: ${property.bedrooms}</div>
                                <div class="bought-property-info">Baths: ${property.bathrooms}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Append each card's column to the row
            $("#bought-properties-list").append(cardContainerHtml);
            console.log('Appended property card from session:', property.id);
        });
    }
}


// Call the function with no userId for testing
$(document).ready(function() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;

    if (userId) {
        loadBoughtProperties(userId);
        // Load properties from session storage if available
        loadBoughtPropertiesFromSession();
    } else {
        console.error('User ID not found');
    }
});






