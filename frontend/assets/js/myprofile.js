function loadBoughtProperties(userId) {
    if (!userId) {
        console.error('User ID is not defined in loadBoughtProperties');
        return;
    }

    // Check session storage first
    const cachedProperties = sessionStorage.getItem('boughtProperties');
    
    if (cachedProperties) {
        console.log("Loaded properties from sessionStorage");
        loadBoughtPropertiesFromSession();
        return;
    }

    // If no cached data, make an AJAX request
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

            if (Array.isArray(response.properties) && response.properties.length > 0) {
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
                        <div class="col-xl-6 col-md-6 property-column" data-id="${property.id}">
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
                console.log('No properties bought yet.');
                $("#bought-properties-list").append('<div class="col-12 text-center" style="font-size: 20px; font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif;"><p>No Bought Properties Yet</p></div>');
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
                <div class="col-xl-6 col-md-6" data-id="${property.id}">
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

$(document).ready(function() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;

    // Clear previous content before loading new content
    $('#content-container').empty(); 

    if (userId) {
        loadBoughtProperties(userId); // Load properties for myprofile
        loadBoughtPropertiesFromSession(); // Load session data if available
    } else {
        console.error('User ID not found');
    }
});

