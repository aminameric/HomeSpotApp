$(document).ready(function () {
  console.log('Document is ready');

  // Fetch the agents data
  $.ajax({
      url: "../rest/agentusers",
      method: "GET",
      beforeSend: function (xhr) {
          const token = localStorage.getItem('token');
          if (token) {
              xhr.setRequestHeader("Authorization", `Bearer ${token}`);
          }
      },
      success: function (response) {
          console.log('AJAX request successful');
          console.log('Response:', response);

          // Ensure response is valid
          if (Array.isArray(response)) {
              // Clear existing content in the #agents .row
              $(".row.gy-5").empty();

              response.forEach(function (agent) {
                  console.log('Processing agent:', agent);

                  // Handle image URL
                  const imageUrl = `http://localhost/HomeSpotApp/rest/storage/${agent.user_image}`;

                  // Create a new column for each agent
                  const agentCardHtml = `
                    <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                      <div class="member">
                        <div class="pic"><img src="${imageUrl}" class="img-fluid" alt="${agent.first_name}"></div>
                        <div class="member-info">
                          <h4>${agent.first_name}</h4>
                          <div class="social">
                            <a href="${agent.facebook || '#'}" target="_blank"><i class="bi bi-facebook"></i></a>
                            <a href="${agent.instagram || '#'}" target="_blank"><i class="bi bi-instagram"></i></a>
                            <a href="${agent.linkedin || '#'}" target="_blank"><i class="bi bi-linkedin"></i></a>
                          </div>
                        </div>
                      </div>
                    </div>
                  `;

                  // Append each agent's column to the row
                  $(".row.gy-5").append(agentCardHtml);
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


