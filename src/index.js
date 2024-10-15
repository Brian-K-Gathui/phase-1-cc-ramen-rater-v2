// index.js

// Callbacks
const handleClick = (ramen) => {
  const detailImg = document.querySelector("#ramen-detail > .detail-image");
  const detailName = document.querySelector("#ramen-detail > .name");
  const detailRestaurant = document.querySelector("#ramen-detail > .restaurant");
  const detailsRating = document.getElementById("rating-display");
  const detailsComment = document.getElementById("comment-display");
  
  detailImg.src = ramen.image;
  detailName.textContent = ramen.name;
  detailRestaurant.textContent = ramen.restaurant;
  detailsRating.textContent = ramen.rating;
  detailsComment.textContent = ramen.comment;

  // Set current ramen for edit functionality
  document.getElementById('edit-ramen').dataset.id = ramen.id;
};

// Add new ramen to menu
const addSubmitListener = () => {
  const ramenForm = document.getElementById('new-ramen');
  ramenForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const newRamen = {
      name: event.target['new-name'].value,
      restaurant: event.target['new-restaurant'].value,
      image: event.target['new-image'].value,
      rating: event.target['new-rating'].value,
      comment: event.target['new-comment'].value
    };

    // Add ramen to the menu dynamically
    const ramenMenuDiv = document.getElementById('ramen-menu');
    const newImg = document.createElement('img');
    newImg.src = newRamen.image;
    newImg.addEventListener('click', () => handleClick(newRamen));
    ramenMenuDiv.appendChild(newImg);

    // Persist new ramen
    fetch('http://localhost:3000/ramens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRamen),
    });

    event.target.reset(); // clear form fields after submission
  });
};

// Display all ramen images
const displayRamens = () => {
  fetch('http://localhost:3000/ramens')
    .then((response) => response.json())
    .then((ramens) => {
      const ramenMenuDiv = document.getElementById('ramen-menu');
      ramens.forEach((ramen) => {
        const ramenImg = document.createElement('img');
        ramenImg.src = ramen.image;
        ramenImg.addEventListener('click', () => handleClick(ramen));
        ramenMenuDiv.appendChild(ramenImg);
      });
      
      // Display first ramen by default
      handleClick(ramens[0]);
    });
};

// Edit and update ramen rating and comment
const addEditListener = () => {
  const editForm = document.getElementById('edit-ramen');
  editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const ramenId = editForm.dataset.id;

    const updatedRamen = {
      rating: event.target['new-rating'].value,
      comment: event.target['new-comment'].value,
    };

    // Update the frontend
    const detailsRating = document.getElementById("rating-display");
    const detailsComment = document.getElementById("comment-display");
    detailsRating.textContent = updatedRamen.rating;
    detailsComment.textContent = updatedRamen.comment;

    // Persist update using PATCH request
    fetch(`http://localhost:3000/ramens/${ramenId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedRamen),
    });
  });
};

// Delete ramen from the menu and DOM
const addDeleteListener = () => {
  const deleteButton = document.getElementById('delete-ramen');
  deleteButton.addEventListener('click', () => {
    const ramenId = document.getElementById('edit-ramen').dataset.id;
    
    // Remove ramen image from the menu
    const ramenMenuDiv = document.getElementById('ramen-menu');
    const ramenImgs = ramenMenuDiv.querySelectorAll('img');
    ramenImgs.forEach(img => {
      if (img.src.includes(`/${ramenId}.jpg`)) {
        ramenMenuDiv.removeChild(img);
      }
    });

    // Clear ramen detail section
    const detailImg = document.querySelector("#ramen-detail > .detail-image");
    const detailName = document.querySelector("#ramen-detail > .name");
    const detailRestaurant = document.querySelector("#ramen-detail > .restaurant");
    const detailsRating = document.getElementById("rating-display");
    const detailsComment = document.getElementById("comment-display");
    detailImg.src = './assets/image-placeholder.jpg';
    detailName.textContent = 'Insert Name Here';
    detailRestaurant.textContent = 'Insert Restaurant Here';
    detailsRating.textContent = 'Insert rating here';
    detailsComment.textContent = 'Insert comment here';

    // Persist deletion using DELETE request
    fetch(`http://localhost:3000/ramens/${ramenId}`, {
      method: 'DELETE',
    });
  });
};

// Main function
const main = () => {
  displayRamens();
  addSubmitListener();
  addEditListener();
  addDeleteListener();
};

main();

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  addEditListener,
  addDeleteListener,
  main,
};
