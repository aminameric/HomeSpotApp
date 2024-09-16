$(document).ready(function () {
  console.log('Document is ready');

  // Fetch the properties data
  $.ajax({
    url: "../rest/properties/status",
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
      
          // Format the price in BAM
          let formattedPrice = new Intl.NumberFormat('de-DE', { 
              style: 'currency', 
              currency: 'BAM', 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
          }).format(property.price || 0);
      
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
                          <span class="sale-rent">Price | ${formattedPrice}</span>
                          <h3><a class="stretched-link">${property.name}</a></h3>
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

          // Create an entity for property data including images
          var entity = new FormData();

          var propertyType = $('#property_type').select2('data')[0] ? $('#property_type').select2('data')[0].text : '';
          
          // Append property details
          entity.append("name", $("input[name='name']").val());
          entity.append("description", $("textarea[name='description']").val());
          entity.append("price", $("input[name='price']").val());
          entity.append("area", $("input[name='area']").val());
          entity.append("property_type", propertyType);
          entity.append("bedrooms", $("input[name='bedrooms']").val());
          entity.append("bathrooms", $("input[name='bathrooms']").val());

          // Append image files
          var image = $("input[name='image']").prop('files')[0];
          if (image) {
              entity.append("image", image);
          }

          var floorImage = $("input[name='floor_image']").prop('files')[0];
          if (floorImage) {
              entity.append("floor_image", floorImage);
          }

          // Add `users_id` from localStorage (assuming it's stored after login)
          var user = JSON.parse(localStorage.getItem('user'));
          if (user && user.id) {
              entity.append("users_id", user.id);
          } else {
              console.error("User ID not found");
              alert("User is not logged in.");
              return;
          }

        // Define formData here using 'this' which refers to the form element
          var formData = new FormData(this);
          // Add the address first, then proceed to add the property
          // Correctly capturing the country name from the Select2 field
          var countryName = $('#country').select2('data')[0] ? $('#country').select2('data')[0].text : '';

          // Correctly defining the addressEntity object
          var addressEntity = {
              street_address: $("input[name='street_address']").val(),
              city: $("input[name='city']").val(),
              country: countryName, // You should include the country here if it's part of addressEntity
              postal_code: $("input[name='postal_code']").val()
          };

          // Assuming formData is a FormData object defined elsewhere for the form
          formData.append("country", countryName); // Append country name to formData outside the object
          
          propertyService.addAddress(addressEntity, function(addressResult) {
              // Append address_id after address is successfully added
              entity.append("address_id", addressResult.id);
              propertyService.addProperty(entity);
          });
      });
  },

  addAddress: function(entity, callback) {
      console.log("Submitting address:", entity);
      $.ajax({
          url: "../rest/addAddress",
          type: "POST",
          data: JSON.stringify(entity),
          contentType: "application/json",
          beforeSend: function(xhr) {
              if (localStorage.getItem('token')) {
                  xhr.setRequestHeader("Authorization", localStorage.getItem('token'));
              }
          },
          success: function(result) {
              console.log("Address added successfully:", result);
              if (typeof callback === "function") {
                  callback(result);
              }
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
              console.error("Address AJAX request failed:", textStatus);
              alert("Property's address posting failed: " + XMLHttpRequest.responseText);
          }
      });
  },

  addProperty: function(entity) {
    $.ajax({
        url: "../rest/addProperty", // Adjust the URL to your API endpoint
        type: "POST",
        data: entity,
        processData: false, // Prevent jQuery from processing the data
        contentType: false, // Prevent jQuery from setting the content type
        beforeSend: function(xhr) {
            var token = localStorage.getItem('token');
            if (token) {
                xhr.setRequestHeader("Authorization", token);
            }
        },
        success: function (result) {
          console.log("Property AJAX request successful:", result);
          localStorage.setItem('property', JSON.stringify(result.property));
          toastr.success("Property posted successfully!");
          $('#myModalAdd').modal('hide');
          
          $(document).trigger('propertyAdded', result.property);
          $('#property-form')[0].reset(); 
          
          window.location.hash = '#properties';
      },
        error: function(xhr, status, error) {
            console.error("Error adding property:", xhr.responseText);
            alert("Property posting failed.");
        }
    });
}

};

$(document).ready(function () {
  propertyService.init();
  toggleNewPropertyButton();
});



$(document).on('propertyAdded', function(event, property) {
  const imageUrl = property.image_url ? `http://localhost/HomeSpotApp/rest/storage/${property.image_url}` : null;

  const cardContainerHtml = `
      <div class="col-xl-4 col-md-6" data-id="${property.id}">
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

function toggleNewPropertyButton() {
  const rawUser = localStorage.getItem('user');
  console.log('rawUser from localStorage:', rawUser);

  if (!rawUser) {
      console.error('No user data found in localStorage');
      return;
  }

  let user;
  try {
      user = JSON.parse(rawUser);
      console.log('Parsed user object:', user);
  } catch (error) {
      console.error('Error parsing user data:', error);
      return;
  }

  const type_of_user = user.type_of_user;
  console.log('type_of_user:', type_of_user);

  if (!type_of_user) {
      console.error('type_of_user not found in user object');
      return;
  }

  const $newPropButton = $('#new-prop');
  if ($newPropButton.length === 0) {
      console.error('Element with ID "new-prop" not found');
      return;
  }

  if (type_of_user.toLowerCase() === 'agent') {
      $newPropButton.removeClass('d-none');
      console.log('Removed d-none class, showing button');
  } else {
      $newPropButton.addClass('d-none');
      console.log('Added d-none class, hiding button');
  }
}