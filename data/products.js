// Declare apiData in the global scope
let apiData;

document.addEventListener("DOMContentLoaded", async () => {
    // Fetch data if not already fetched
    apiData = apiData || await fetchData();
    updateProductCards();

    // Checks if the current page is pingpong.html
    if (Array.isArray(apiData) && window.location.pathname.includes("pingpong.html")) {
        urlDetails();
    } else {
        console.error("Invalid or missing data. Check if fetchData is working properly.");
    }
});

// API endpoint
const apiProductData = "https://api.noroff.dev/api/v1/gamehub";

// Fetch data from the API
async function fetchData() {
    try {

        const response = await fetch(apiProductData);

        if (!response.ok) {
            // Throw an error if the HTTP response is not successful
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse and return the JSON data
        const data = await response.json();
        return data;
    } catch (error) {
        // Log an error message if fetching data fails
        console.error("Error fetching data:", error);
        return null;
    }
}

// Create a product card
function storeProductCards(product) {
    // Create a container for the product card
    const cardContainer = document.createElement("div");
    cardContainer.className = "productcard";

    // Create elements for image, title, console, price, and buttons
    const apiImageData = document.createElement("img");
    apiImageData.src = product.image;
    apiImageData.className = "product-image";

    const apiTitleData = document.createElement("h2");
    apiTitleData.className = "cardtitle";
    apiTitleData.textContent = product.title;

    const platformData = document.createElement("p");
    platformData.className = "console";
    platformData.textContent = "-PS4/PS5, Xbox X/S, PC, Nintendo Switch.";

    const apiPriceData = document.createElement("p");
    apiPriceData.id = "price";
    apiPriceData.className = "price";
    apiPriceData.textContent = `$${product.price.toFixed(2)}`;

    const cardButtonContainer = document.createElement("div");
    cardButtonContainer.id = "cardButtonContainer";

    const button = document.createElement("button");
    button.className = "cartstore";
    button.textContent = "ENTER";
    button.addEventListener("click", () => {
        // Navigate to the product description page without changing data on the store page
        window.location.href = `products/pingpong.html?id=${product.id}`;
    });

    // Appending the button to the buttons container
    cardButtonContainer.appendChild(button);

    // Appending elements to the card container
    cardContainer.appendChild(apiImageData);
    cardContainer.appendChild(apiTitleData);
    cardContainer.appendChild(platformData);
    cardContainer.appendChild(apiPriceData);
    cardContainer.appendChild(cardButtonContainer);

    // Return the generated product card container
    return cardContainer;
}

// Update product cards on the page
async function updateProductCards() {
    const data = await fetchData();

    if (!data) {
        return;
    }

    const productContainer = document.querySelector(".containercards");
    if (!productContainer) {
        return;
    }

    // Clear existing content in the product container
    productContainer.innerHTML = '';

    // create card for each product in the data
    data.forEach((product) => {
        const cardContainer = storeProductCards(product);
        productContainer.appendChild(cardContainer);
    });
}

// Show product details based on ID in the URL
function urlDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
        // Show product details for the specified ID
        productDetails(productId);
    } else {
         // Error message when the product ID in the URL is invalid or missing
        console.error("Invalid or missing product ID in the URL.");
    }
}

// Shows product data on a dedicated product details page
function productDetails(productId) {
    if (Array.isArray(apiData)) {
        // Find the product in the fetched data based on the provided ID
        const productData = apiData.find((data) => data.id === productId);

        if (productData) {
            // Update the product details page with the found product data
            productPage(productData);
        } else {
            // Error message when the product data is not found for the given ID
            console.error("Product data not found for object ID:", productId);
        }
    } else {
         // Error message when the fetched data is invalid or missing
        console.error("Invalid or missing data. Check if fetchData is working properly.");
    }
}

// Update the product details page content (pingpong.html)
function productPage(productData) {
    // Select elements on the product details page for updating
    const apiTitleData = document.querySelector(".pongtitle");
    const descriptionElement = document.querySelector(".pongdescription");
    const apiPriceData = document.querySelector(".pongprice");
    const apiImageData = document.querySelector(".pongcontainer img");

    // Update the content of the selected elements with the product data
    if (apiTitleData) {
        apiTitleData.textContent = productData.title;
    }

    if (descriptionElement) {
        descriptionElement.textContent = productData.description;
    }

    if (apiPriceData) {
        apiPriceData.textContent = `$${productData.price.toFixed(2)}`;
    }

    if (apiImageData) {
        apiImageData.src = productData.image;
    }
}
