$(document).ready(function() {
    // Call the function to get property details when the document is ready
    getPropertyDetails();
});

$(document).ready(function() {
    getPropertyDetails();
    
});

function getPropertyDetails() {
    // Get the full URL and split into hash and query string
    let fullUrl = window.location.href;
    let urlParts = fullUrl.split('#');
    let queryParams = urlParts[0].split('?')[1]; // Query string before hash
    let hash = urlParts[1]; // Hash after query string

    // Extract the ID from the query string
    let urlParams = new URLSearchParams(queryParams);
    let id = urlParams.get('id');

    console.log("Extracted Property ID from Query Parameters:", id);

    if (!id) {
        console.error("No ID found in the URL.");
        alert("No property ID found in the URL.");
        return;
    }

    // Fetch property details using the extracted ID
    $.ajax({
        url: `../rest/prop/${id}`,
        type: "GET",
        contentType: 'application/json',
        beforeSend: function(xhr) {
            const token = localStorage.getItem('token');
            console.log("Token sent: ", token);  // Debug token value
            if (token) {
                xhr.setRequestHeader("Authorization", token);
            } else {
                console.error("No token found in local storage");
            }
        },
        success: function(result) {
            console.log("Property details result:", result);
    
            let propertyArray = result.result;
    
            if (propertyArray && propertyArray.length > 0) {
                let property = propertyArray[0];
    
                // Handle main property image
                let imageUrl = property.image_url ? `http://localhost/HomeSpotApp/rest/storage/${property.image_url}` : "default.jpg";
                $("#real-estate-image").attr("src", imageUrl);
    
                // Handle floor image
                let floorImageUrl = property.floor_image ? `http://localhost/HomeSpotApp/rest/storage/${property.floor_image}` : "default-floor.jpg";
                $("#floor-image").attr("src", floorImageUrl);  // Assuming #floor-image is the ID for the floor plan image
    
                // Update property information
                let formattedPrice = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'BAM' }).format(property.price || 0);
                $(".portfolio-info li:nth-child(1)").html(`<strong>Price:</strong> ${formattedPrice}`);

                $(".portfolio-info li:nth-child(2)").html(`<strong>Bedrooms:</strong> ${property.bedrooms || 'N/A'}`);
                $(".portfolio-info li:nth-child(3)").html(`<strong>Bathrooms:</strong> ${property.bathrooms || 'N/A'}`);
                $(".portfolio-info li:nth-child(4)").html(`<strong>Area:</strong> <span>${property.area || 'N/A'}m<sup>2</sup></span>`);
    
                // Fetch address details after successfully getting property details
                fetchAddressDetails(property.address_id, property);
            } else {
                console.error("No property details found in the result array");
                alert("No property details found.");
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX request failed", error);
        }
    });
    
}

function fetchAddressDetails(addressId, property) {
    $.ajax({
        url: `../rest/addressbyid/${addressId}`,
        type: "GET",
        contentType: 'application/json',
        beforeSend: function(xhr) {
            const token = localStorage.getItem('token');
            console.log("Token sent: ", token);  // Debug token value
            if (token) {
                xhr.setRequestHeader("Authorization", token);
            } else {
                console.error("No token found in local storage");
            }
        },        
        success: function(addresses) {
            console.log("Address API Response:", addresses);
            let addressArray = addresses.address;
            if (addressArray && addressArray.length > 0) {
                let address = addressArray[0];

                $(".portfolio-info li:nth-child(5)").html(`<strong>Street Address:</strong> ${address.street_address || "N/A"}`);
                $(".portfolio-info li:nth-child(6)").html(`<strong>City:</strong> ${address.city || "N/A"}`);
                $(".portfolio-info li:nth-child(7)").html(`<strong>Country:</strong> ${address.country || "N/A"}`);
                $(".portfolio-info li:nth-child(8)").html(`<strong>Property Type:</strong> ${property.property_type || "N/A"}`);
                $(".portfolio-info li:nth-child(9)").html(`<strong>Postal Code:</strong> ${address.postal_code || "N/A"}`);
            } else {
                console.error("No address data found");
                $(".portfolio-info li:nth-child(5)").html(`<strong>Street Address:</strong> ${property.street_address || "N/A"}`);
                $(".portfolio-info li:nth-child(6)").html(`<strong>City:</strong> ${property.city || "N/A"}`);
                $(".portfolio-info li:nth-child(7)").html(`<strong>Country:</strong> ${property.country || "N/A"}`);
                $(".portfolio-info li:nth-child(8)").html(`<strong>Property Type:</strong> ${property.property_type || "N/A"}`);
                $(".portfolio-info li:nth-child(9)").html(`<strong>Postal Code:</strong> ${property.postal_code || "N/A"}`);
            }
            // Reinitialize AOS after content load
            AOS.refresh();
        },
        error: function(xhr, status, error) {
            console.error("Error fetching address details:", error);
            $(".portfolio-info li:nth-child(5)").html(`<strong>Street Address:</strong> ${property.street_address || "Error fetching address"}`);
            $(".portfolio-info li:nth-child(6)").html(`<strong>City:</strong> ${property.city || "Error fetching address"}`);
            $(".portfolio-info li:nth-child(7)").html(`<strong>Country:</strong> ${property.country || "Error fetching address"}`);
            $(".portfolio-info li:nth-child(8)").html(`<strong>Property Type:</strong> ${property.property_type || "Error fetching address"}`);
            $(".portfolio-info li:nth-child(9)").html(`<strong>Postal Code:</strong> ${property.postal_code || "Error fetching address"}`);
            // Reinitialize AOS even if there's an error
            AOS.refresh();
        }
    });
}

$(document).ready(function() {
    // Get the query parameter 'id' from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id'); // Get the 'id' query parameter

    // Check if we're on the #propertysingle view
    if (window.location.hash === '#propertysingle' && propertyId) {
        // Make an AJAX call to get the property details based on the ID
        $.ajax({
            url: `../rest/propname/${propertyId}`, // Backend route to get the property name/details
            method: 'GET',
            success: function(response) {
                // Update the HTML with the property name/details
                $('#property-name').text(response.result || 'Unknown Property');
            },
            error: function(xhr, status, error) {
                console.error('Error fetching property details:', error);
                $('#property-name').text('Error loading property details');
            }
        });
    }
});

$(document).ready(function() {
    // Get the query parameter 'id' from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id'); // Get the 'id' query parameter

    // Check if we're on the #propertysingle view
    if (window.location.hash === '#propertysingle' && propertyId) {
        // Make an AJAX call to get the property details based on the ID
        $.ajax({
            url: `../rest/propaddinfo/${propertyId}`, // Backend route to get the property name/details
            method: 'GET',
            success: function(response) {
                // Update the HTML with the property name/details
                $('#property-info').text(response.result || 'Unknown Property');
            },
            error: function(xhr, status, error) {
                console.error('Error fetching property details:', error);
                $('#property-name').text('Error loading property details');
            }
        });
    }
});


function getAgentForProperty(propertyId) {
    $.ajax({
        url: `../rest/agentname/${propertyId}`,  // Call the new route
        type: "GET",
        success: function(response) {
            if (response && response.result) {
                const agentName = response.result.first_name;  // Extract the agent's name
                const agentImage = response.result.user_image;  // Extract the agent's image
                
                // Update agent name in HTML
                $('#agent-name').text(agentName);

                // Update agent image in HTML (assuming you have an img tag with id="agent-image")
                const imageUrl = `../rest/storage/${agentImage}`;  // Adjust the path as needed
                $('#agent-image').attr('src', imageUrl); // Assuming there's an <img id="agent-image">
            } else {
                console.error("Agent not found.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error fetching agent:", error);
        }
    });
}


// Function to extract property ID from the URL
function getPropertyIdFromUrl() {
    let fullUrl = window.location.href;
    let urlParts = fullUrl.split('#');
    let queryParams = urlParts[0].split('?')[1]; // Query string before hash
    let urlParams = new URLSearchParams(queryParams);
    return urlParams.get('id');
}

$(document).ready(function() {
    const propertyId = getPropertyIdFromUrl(); // Extract the property ID from URL

    if (propertyId) {
        getPropertyDetails(); // Assuming this function works for fetching property details
        getAgentForProperty(propertyId); // Now pass the extracted property ID
    } else {
        console.error("No property ID found in the URL.");
    }
});


//delete
function deleteProperty() {
    // Get the query string and extract the property ID from URL parameters
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var propertyId = urlParams.get('id');

    // Send DELETE request to the backend using jQuery AJAX
    $.ajax({
        url: '../rest/deleteproperty/' + propertyId, // Adjust this path based on your API
        type: 'DELETE',
        contentType: 'application/json',
        beforeSend: function(xhr) {
            // Add authentication token from localStorage if available
            if(localStorage.getItem('user')){
                xhr.setRequestHeader("Authentication", localStorage.getItem('token'));
            }
        },
        success: function (response) {
            console.log('Property deleted successfully:', response);
            // Redirect to the list of houses after deletion
            window.location.hash = '#properties';
        },
        error: function (xhr, status, error) {
            console.error('Error deleting property:', error);
            alert('There was an error deleting the property. Please try again.');
        }
    });
}

// reserve modal
// Get the modal element
const modal = document.getElementById("myReservartionModal");

// Get the "Reserve" button that opens the modal
const reserveBtn = document.getElementById("reserveBtn");

// Get the <span> element that closes the modal (X button)
const closeBtn = modal.querySelector(".close");

// Get the "Cancel" button inside the modal
const cancelBtn = modal.querySelector("#cancel-btn");

// Open the modal when the "Reserve" button is clicked
reserveBtn.onclick = function () {
  modal.classList.add("show");
};

// Close the modal when the "X" button is clicked
closeBtn.onclick = function () {
  modal.classList.remove("show");
};

// Close the modal when the "Cancel" button is clicked
cancelBtn.onclick = function () {
  modal.classList.remove("show");
};

// Close the modal if the user clicks outside of the modal content
window.onclick = function (event) {
  if (event.target == modal) {
    modal.classList.remove("show");
  }
};

document.addEventListener('DOMContentLoaded', function () {
    // Buy Property Modal Elements
    const buyModal = document.getElementById('buyModal');
    const buyPropertyBtn = document.getElementById('buyBtn');
    const cancelBuyBtn = document.getElementById('cancel-buy-btn');
    const closeBtns = document.querySelectorAll('.close');
    const submitBuyBtn = document.getElementById('submit-buy-btn');

    // Open the Buy Property modal when the "Buy" button is clicked
    buyPropertyBtn.addEventListener('click', function () {
        buyModal.style.display = 'block'; // Show the Buy modal
    });

    // Close the modal when the 'X' button is clicked
    closeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            buyModal.style.display = 'none'; // Hide the modal
        });
    });

    // Close the Buy modal if the user clicks 'Cancel'
    cancelBuyBtn.addEventListener('click', function () {
        buyModal.style.display = 'none';
    });

    // Close the modal if the user clicks outside of the modal content
    window.onclick = function (event) {
        if (event.target == buyModal) {
            buyModal.style.display = 'none';
        }
    };

    // Handle the Buy submission ('Submit Payment' button clicked)
    submitBuyBtn.addEventListener('click', function () {
        const cardHolderName = document.getElementById('card-holder-name').value;
        const cardNumber = document.getElementById('card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvc = document.getElementById('cvc').value;

        // Log the details (or handle them in the backend)
        console.log('Card Holder Name:', cardHolderName);
        console.log('Card Number:', cardNumber);
        console.log('Expiry Date:', expiryDate);
        console.log('CVC:', cvc);

        // After submission, close the modal
        buyModal.style.display = 'none';
        alert('Payment submitted successfully!');
    });
});

//property reservation ajax
$(document).on('click', '#save-property-btn', function(e) {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    // Get values from the form inputs
    var reservationDate = $('#reservation-date').val();
    var comments = $('#reservation-comments').val();
    
    // Extract the property ID from the URL
    var urlParams = new URLSearchParams(window.location.search);
    var propertyId = urlParams.get('id');

    // Retrieve user ID from local storage
    var user = JSON.parse(localStorage.getItem('user'));
    var userId = user.id;

    // Log values to make sure they're being captured correctly
    console.log({
        date: reservationDate,
        additional_comment: comments,
        users_id: userId,
        property_id: propertyId
    });

    // Call a validation function before attempting to reserve the property
    if (validateReservationForm()) {
        addPropertyReservation(); // Call the reservation function only if validation passes
    }
});

function validateReservationForm() {
    var reservationDate = $('#reservation-date').val();
    var comments = $('#reservation-comments').val();

    if (!reservationDate) {
        toastr.error('Please enter a reservation date.');
        return false; // Prevent submission if the date is empty
    }

    if (!comments) {
        toastr.error('Please enter additional comments.');
        return false; // Prevent submission if comments are empty
    }

    return true; // Proceed with submission if both fields are filled
}



function addPropertyReservation() {
    // Get values from the form inputs
    var reservationDate = $('#reservation-date').val();
    var comments = $('#reservation-comments').val();
    var urlParams = new URLSearchParams(window.location.search);
    var propertyId = urlParams.get('id');
    var user = JSON.parse(localStorage.getItem('user'));
    var userId = user.id;

    // Log the request payload
    console.log('Sending reservation data:', {
        date: reservationDate,
        additional_comment: comments,
        users_id: userId,
        property_id: propertyId
    });

    // Make the AJAX POST request to add the reservation
    $.ajax({
        url: '../rest/addPropertyReservation',
        type: 'POST',
        data: JSON.stringify({
            date: reservationDate,
            additional_comment: comments,
            users_id: userId,
            property_id: propertyId,
        }),
        contentType: 'application/json',
        beforeSend: function(xhr) {
            if (localStorage.getItem('user')) {
                xhr.setRequestHeader("Authentication", localStorage.getItem('token'));
            }
        },
        success: function(response) {
            console.log('Property reserved successfully:', response);
            toastr.success('Reservation of property successful!');
            closeModal2();
        },
        error: function(xhr, status, error) {
            console.error('Error reserving property:', error);
            console.log('Error details:', xhr.responseText); // To see the error message from the server
            toastr.error('Failed to reserve property. Please try again.');
        }
    });
}

function closeModal2() {
    $('#myReservartionModal').removeClass('show'); // Hide the modal
}

//edit property
$(document).ready(function() {
    $(document).on('click', '#save-property-btn1', function () {
        // Get values from the form inputs
        var propertyName = $('#property-name-input').val();
        var propertyDescription = $('#property-description').val();
        var propertyPrice = $('#property-price').val();

        // Log data to make sure it's captured correctly
        console.log('Property Name:', propertyName);
        console.log('Property Description:', propertyDescription);
        console.log('Property Price:', propertyPrice);

        // Extract the property ID from the URL
        var urlParams = new URLSearchParams(window.location.search);
        var propertyId = urlParams.get('id');

        // Retrieve user token from local storage
        var token = localStorage.getItem('token');

        // Check if token and property ID exist before proceeding
        if (!token || !propertyId) {
            alert('Failed to authenticate or retrieve property ID.');
            return;
        }

        // Create a data object only with fields that have values (i.e., not empty)
        var propertyData = {};
        
        if (propertyName.trim()) {
            propertyData.name = propertyName;  // Only add name if not empty
        }

        if (propertyDescription.trim()) {
            propertyData.description = propertyDescription;  // Only add description if not empty
        }

        if (propertyPrice.trim()) {
            propertyData.price = propertyPrice;  // Only add price if not empty
        }

        // Ensure at least one field is being updated
        console.log('Property Data Object:', propertyData);

        if (Object.keys(propertyData).length === 0) {
            toastr.error('No fields to update. Please modify at least one field.');
            return;
        }

        // Send PUT request to update the property details
        $.ajax({
            url: `../rest/property/${propertyId}`,  // Correct URL for updating property
            type: 'PUT',  // Use PUT method for update
            data: JSON.stringify(propertyData),  // Send the property data
            contentType: 'application/json',  // Specify the content type as JSON
            success: function(response) {
                console.log('Property updated successfully:', response);


                toastr.success('Property updated successfully!');
                closeModal();  // Close the modal after success
                location.reload();  // Reload the page to ensure all elements are updated
            },
            error: function(xhr, status, error) {
                console.error('Error updating property:', error);
                toastr.error('Failed to update property. Please try again.');
            }
        });
        
    });
});

// Function to close the modal after successful update or if cancel is clicked
function closeModal() {
    $('#myModal').removeClass('show');  // Hide the modal
}

//for cleaning input fields in a form
$(document).on('click', '#cancel-btn, .close', function () {
    clearFormFields(); // Clear form when cancel or close is clicked
});

function clearFormFields() {
    $('#edit-property-form').trigger('reset'); // Reset the form fields
}
