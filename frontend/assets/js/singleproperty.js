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
            if (localStorage.getItem('user')) {
                xhr.setRequestHeader("Authorization", localStorage.getItem('token'));
            }
        },
        success: function(result) {
            console.log("Property details result:", result);

            let propertyArray = result.result;

            if (propertyArray && propertyArray.length > 0) {
                let property = propertyArray[0];

                let imageUrl = property.image_url ? `http://localhost/HomeSpotApp/rest/storage/${property.image_url}` : "default.jpg";

                // Update the src of the img tag inside #real-estate-2-tab1
                $("#real-estate-image").attr("src", imageUrl);
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
            if (localStorage.getItem('user')) {
                xhr.setRequestHeader("Authorization", localStorage.getItem('token'));
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
