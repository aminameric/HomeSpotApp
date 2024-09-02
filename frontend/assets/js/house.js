$(document).ready(function () {
  console.log('Document is ready');
  
  // Fetch the properties data
  $.ajax({
    url: "../rest/properties",
    method: "GET",
    beforeSend: function (xhr) {
      const token = localStorage.getItem('token');
      if (token) {
        xhr.setRequestHeader("Authorization", token);
      }
    },
    success: function (response) {
      console.log('AJAX request successful');

      // Ensure response is valid
      if (Array.isArray(response)) {
        response.forEach(function (property) {
          const imageUrl = `http://localhost/HomeSpot/rest/storage/${property.image_url}`;
          
          // Create a new column for each card and assign the property ID as data attribute
          const cardContainerHtml = `
            <div class="col-xl-4 col-md-6" data-id="${property.id}" data-aos="fade-up" data-aos-delay="100">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <img src="${imageUrl}">
                  </figure>
                </div>
                <div class="card-body">
                  <span class="sale-rent">Price | $${property.price}</span>
                  <h3><a class="stretched-link">${property.description}</a></h3>
                  <div class="card-content d-flex flex-column justify-content-center text-center">
                    <div class="row property-info">
                      <div class="col">Size: ${property.size}</div>
                      <div class="col">Beds: ${property.bedrooms}</div>
                      <div class="col">Baths: ${property.bathrooms}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;

          // Append each card's column to the row
          $(".row.gy-4").append(cardContainerHtml);
        });
      } else {
        console.error('Unexpected response format');
      }
    },
    error: function (xhr, status, error) {
      console.error('AJAX request failed', error);
    }
  });

  // Handle click events on property cards
  $(document).on('click', '.col-xl-4.col-md-6', function () {
    // Get the property ID from the clicked card's data attribute
    const propertyId = $(this).data('id');
    
    if (propertyId) {
      // Navigate to the property details page, passing the ID as a query parameter
      window.location.href = `?id=${propertyId}#propertysingle`;  // Redirect with query param
    } else {
      console.error('No property ID found for the clicked card');
    }
  });
});
