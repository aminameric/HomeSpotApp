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
                $(".portfolio-info li:nth-child(1)").html(`<strong>Price:</strong> $${property.price || 'N/A'}`);
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

//edit button
