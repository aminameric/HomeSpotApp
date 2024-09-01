$(document).ready(function () {
    $.ajax({
        url:"../rest/properties",
        method:"GET",
        beforeSend: function(xhr) {
            if(localStorage.getItem('user')){
              xhr.setRequestHeader("Authentication", localStorage.getItem('token'));
            }
        },    
        success: function(response) {
            // Loop through the properties and generate HTML for each
            response.forEach(function(property) {
            var imageUrl = "http://localhost/HomeSpot/rest/storage/" + property.image_url;

            var cardContainerHtml = `
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
                  <div class="row propery-info">
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
            
        `;
        $(".col-xl-4 col-md-6").append(cardContainerHtml);
            });
        },
        error: function(xhr, status, error) {
            // Handle error
            console.error(error);
        }
    });
});