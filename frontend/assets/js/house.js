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
          const imageUrl = property.image_url ? `http://localhost/HomeSpotApp/rest/storage/${property.image_url}` : null;
          
          // Create a new column for each card and assign the property ID as data attribute
          const cardContainerHtml = `
            <div class="col-xl-4 col-md-6" data-id="${property.id}" data-aos="fade-up" data-aos-delay="100">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <img class="property-image" alt="Property Image">
                  </figure>
                </div>
                <div class="card-body">
                  <span class="sale-rent">Price | $${property.price}</span>
                  <h3><a class="stretched-link">${property.description}</a></h3>
                  <div class="card-content d-flex flex-column justify-content-center text-center">
                    <div class="row property-info">
                      <div class="col">Area: ${property.area}</div>
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

          // Load image with token if imageUrl is valid
          if (imageUrl) {
            loadImageWithToken(imageUrl, $(`[data-id='${property.id}'] .property-image`));
          }
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

// Function to load images with authorization token
function loadImageWithToken(imageUrl, imgElement) {
  $.ajax({
    url: imageUrl,
    type: 'GET',
    headers: {
      'Authorization': localStorage.getItem('token')
    },
    xhrFields: {
      responseType: 'blob' // Get the image as a blob
    },
    success: function (data) {
      const url = window.URL || window.webkitURL;
      const imgSrc = url.createObjectURL(data);
      $(imgElement).attr('src', imgSrc); // Set the blob URL as the src of the image
    },
    error: function () {
      console.error('Failed to load image');
    }
  });
}

var propertyService = {
  init: function () {
      console.log("Initializing property service...");

      $("#property-form").on("submit", function(event) {
          event.preventDefault();

          if (!$(this).valid()) {
              return; // Exit if the form is invalid
          }

          console.log("Form submission intercepted for AJAX handling.");

          var addressEntity = {
              street_address: $("input[name='street_address']").val(),
              city: $("input[name='city']").val(),
              country: $("input[name='country']").val(),
              postal_code: $("input[name='postal_code']").val()
          };
          
          var entity = new FormData();
          var image = $("input[name='image']").prop('files')[0];
          entity.append("description", $("input[name='description']").val());
          entity.append("price", $("input[name='price']").val());
          entity.append("area", $("input[name='area']").val());
          entity.append("property_type", $("input[name='propertytype']").val());
          entity.append("bedrooms", $("input[name='bedrooms']").val());
          entity.append("bathrooms", $("input[name='bathrooms']").val());
          entity.append("image", image);

          propertyService.addAddress(addressEntity);
          propertyService.addProperty(entity);
      });
  },

  addAddress: function(entity) {
      console.log("Submitting address:", entity);
      $.ajax({
          url: "../rest/addAddress",
          type: "POST",
          data: JSON.stringify(entity),
          contentType: "application/json",
          beforeSend: function(xhr) {
              if(localStorage.getItem('user')){
                  xhr.setRequestHeader("Authorization", localStorage.getItem('token'));
              }
          },
          success: function (result) {
              console.log("Address AJAX request successful:", result);
              localStorage.setItem('property', JSON.stringify(result.property));
              alert("Property's address posted successfully!");
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
              console.error("Address AJAX request failed:", textStatus);
              alert("Property's address posting failed: " + XMLHttpRequest.responseText);
          }
      });
  },
  

  addProperty: function(entity) {
      var user = JSON.parse(localStorage.getItem('user'));
  
      var userId = user.id || user[0];
      console.log("User ID:", userId);
  
      entity.append('users_id', userId);
  
      $.ajax({
          url: "../rest/addProperty",
          type: "POST",
          data: entity,
          processData: false, // Prevent jQuery from processing the data
          contentType: false, // Set content type to false for FormData
          beforeSend: function(xhr) {
              if(localStorage.getItem('user')){
                  xhr.setRequestHeader("Authorization", localStorage.getItem('token'));
              }
          },
          success: function (result) {
            console.log("Property AJAX request successful:", result);
            localStorage.setItem('property', JSON.stringify(result.property));
            alert("Property posted successfully!");
            $('#myModal').modal('hide');
            
            $(document).trigger('propertyAdded', result.property);
            
            window.location.hash = '#properties';
        },
        
          error: function (XMLHttpRequest, textStatus, errorThrown) {
              alert("Property posting failed: " + XMLHttpRequest.responseText);
          }
      });
  }
};

$(document).ready(function () {
  propertyService.init();
});

$(document).on('propertyAdded', function(event, property) {
  const imageUrl = property.image_url ? `http://localhost/HomeSpotApp/rest/storage/${property.image_url}` : null;

  const cardContainerHtml = `
      <div class="col-xl-4 col-md-6" data-id="${property.id}" data-aos="fade-up" data-aos-delay="100">
          <div class="card">
              <div class="card-image">
                  <figure class="image is-4by3">
                      <img class="property-image" alt="Property Image">
                  </figure>
              </div>
              <div class="card-body">
                  <span class="sale-rent">Price | $${property.price}</span>
                  <h3><a class="stretched-link">${property.description}</a></h3>
                  <div class="card-content d-flex flex-column justify-content-center text-center">
                      <div class="row property-info">
                          <div class="col">Area: ${property.area}</div>
                          <div class="col">Beds: ${property.bedrooms}</div>
                          <div class="col">Baths: ${property.bathrooms}</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  `;

  $(".row.gy-4").append(cardContainerHtml);

  // Load the image for the newly added property if imageUrl is valid
  if (imageUrl) {
    loadImageWithToken(imageUrl, $(`[data-id='${property.id}'] .property-image`));
  }
});
