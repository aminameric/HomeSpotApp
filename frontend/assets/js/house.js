console.log('house.js is loaded');

$(document).ready(function () {
  console.log('Document is ready');
  
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
          
          // Create a new column for each card
          const cardContainerHtml = `
            <div class="col-xl-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <img src="${imageUrl}">
                  </figure>
                </div>
                <div class="card-body">
                  <span class="sale-rent">Price | $${property.price}</span>
                  <h3><a href="./property-single.html" class="stretched-link">204 Mount Olive Road Two</a></h3>
                  <div class="card-content d-flex flex-column justify-content-center text-center">
                    <div class="row property-info">
                      <div class="col">Description: ${property.description}</div>
                      <div class="col">Beds: ${property.bedrooms}</div>
                      <div class="col">Baths: ${property.bathrooms}</div>
                    </div>
                    <div class="row">
                      <div class="col">Size: ${property.size}</div>
                      <div class="col">5</div>
                      <div class="col">2</div>
                      <div class="col">1</div>
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
});
