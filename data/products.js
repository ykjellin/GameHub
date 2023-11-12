// Declare apiData in the global scope
let apiData;

document.addEventListener("DOMContentLoaded", async () => {
    // Fetch data if not already fetched
    apiData = apiData || await fetchData();
    updateProductCards();

    // Checks if the current page is pingpong.html
    if (Array.isArray(apiData) && window.location.pathname.includes("pingpong.html")) {
        showProductDetailsFromUrl();
    } else {
        console.error("Invalid or missing data. Check if fetchData is working properly.");
    }
});

// API endpoint
const apiEndpoint = "https://api.noroff.dev/api/v1/gamehub";

// Fetch data from the API
async function fetchData() {
    try {

        const response = await fetch(apiEndpoint);

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
function createProductCard(product) {
    // Create a container for the product card
    const cardContainer = document.createElement("div");
    cardContainer.className = "productcard";

    // Create elements for image, title, console, price, and buttons
    const imageElement = document.createElement("img");
    imageElement.src = product.image;
    imageElement.className = "product-image";

    const titleElement = document.createElement("h2");
    titleElement.className = "cardtitle";
    titleElement.textContent = product.title;

    const consoleElement = document.createElement("p");
    consoleElement.className = "console";
    consoleElement.textContent = "-PS4/PS5, Xbox X/S, PC, Nintendo Switch.";

    const priceElement = document.createElement("p");
    priceElement.id = "price";
    priceElement.className = "price";
    priceElement.textContent = `$${product.price.toFixed(2)}`;

    const buttonsContainer = document.createElement("div");
    buttonsContainer.id = "buttonsContainer";

    const button = document.createElement("button");
    button.className = "cartstore";
    button.textContent = "ENTER";
    button.addEventListener("click", () => {
        // Navigate to the product description page without changing data on the store page
        window.location.href = `products/pingpong.html?id=${product.id}`;
    });

    // Appending the button to the buttons container
    buttonsContainer.appendChild(button);

    // Appending elements to the card container
    cardContainer.appendChild(imageElement);
    cardContainer.appendChild(titleElement);
    cardContainer.appendChild(consoleElement);
    cardContainer.appendChild(priceElement);
    cardContainer.appendChild(buttonsContainer);

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
        const cardContainer = createProductCard(product);
        productContainer.appendChild(cardContainer);
    });
}

// Show product details based on ID in the URL
function showProductDetailsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
        // Show product details for the specified ID
        showProductDetails(productId);
    } else {
         // Error message when the product ID in the URL is invalid or missing
        console.error("Invalid or missing product ID in the URL.");
    }
}

// Shows product data on a dedicated product details page
function showProductDetails(productId) {
    if (Array.isArray(apiData)) {
        // Find the product in the fetched data based on the provided ID
        const productData = apiData.find((data) => data.id === productId);

        if (productData) {
            // Update the product details page with the found product data
            updateProductPage(productData);
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
function updateProductPage(productData) {
    // Select elements on the product details page for updating
    const titleElement = document.querySelector(".pongtitle");
    const descriptionElement = document.querySelector(".pongdescription");
    const priceElement = document.querySelector(".pongprice");
    const imageElement = document.querySelector(".pongcontainer img");

    // Update the content of the selected elements with the product data
    if (titleElement) {
        titleElement.textContent = productData.title;
    }

    if (descriptionElement) {
        descriptionElement.textContent = productData.description;
    }

    if (priceElement) {
        priceElement.textContent = `$${productData.price.toFixed(2)}`;
    }

    if (imageElement) {
        imageElement.src = productData.image;
    }
}
