// Fetch listings from RestDB
const fetchListings = async () => {
    try {
      const response = await fetch(
        'https://mokesell-12345.restdb.io/rest/listings',
        {
          headers: {
            'x-apikey': 'YOUR_RESTDB_API_KEY', // Replace with your RestDB API key
          },
        }
      );
      const listings = await response.json();
      displayListings(listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };
  
  // Display listings in the DOM
  const displayListings = (listings) => {
    const listingsContainer = document.getElementById('listings-container');
    listingsContainer.innerHTML = listings
      .map(
        (listing) => `
        <div class="col-md-4 col-sm-6 col-12">
          <div class="card h-100">
            <img src="${listing.image}" class="card-img-top img-fluid" alt="${listing.title}">
            <div class="card-body">
              <h5 class="card-title">${listing.title}</h5>
              <p class="card-text">${listing.description}</p>
              <p class="card-text"><strong>Price:</strong> $${listing.price}</p>
            </div>
          </div>
        </div>
      `
      )
      .join('');
  };
  
  // Fetch listings when the page loads
  document.addEventListener('DOMContentLoaded', fetchListings);