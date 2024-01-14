// Declaring apiData in the global scope
let apiData;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch data and updating product cards
        apiData = await fetchData();
        if (!Array.isArray(apiData)) {
            throw new Error("Data is not an array");
        }

        
        updateProductCards();


        if (window.location.pathname.includes("pingpong.html")) {
            urlDetails();
        }
    } catch (error) {
        console.error("Error in fetching or processing data:", error.message);
    }
});


// API endpoint
const apiProductData = "https://www.kjellinfrontend.com/wp-json/wc/v3/products";

// Fetch data from the API
async function fetchData() {
    try {
        document.getElementById('loading').style.display = 'block';

        const response = await fetch(apiProductData, {
            headers: new Headers({
                'Authorization': 'Basic ' + btoa("ck_8afc9a1020ae5a19f8c4ee465eee98b7a036e461:cs_fbb26ba659a7a3a21b9e7eecd5461c8cbbf4f31f")
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        document.getElementById('loading').style.display = 'none';

        return data;
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        console.error("Error fetching data:", error);
        return null;
    }
}


// Create product card
function storeProductCards(product) {
    // Create container for the product card
    const cardContainer = document.createElement("div");
    cardContainer.className = "productcard";

    // Create elements for cards
    const apiImageData = document.createElement("img");
    apiImageData.src = product.images.length > 0 ? product.images[0].src : 'default-image-url'; // Use the first image or a default image
    apiImageData.className = "product-image";

    const apiTitleData = document.createElement("h2");
    apiTitleData.className = "cardtitle";
    apiTitleData.textContent = product.name;

    const apiPriceData = document.createElement("p");
    apiPriceData.id = "price";
    apiPriceData.className = "price";
    apiPriceData.textContent = `$${parseFloat(product.price).toFixed(2)}`;

    const cardButtonContainer = document.createElement("div");
    cardButtonContainer.id = "cardButtonContainer";

    const button = document.createElement("button");
    button.className = "cartstore";
    button.textContent = "ENTER";

    // click event listener for the button
    button.addEventListener("click", (e) => {
        e.stopPropagation(); 
        window.location.href = `products/pingpong.html?id=${product.id}`;
    });

        // click event listener for the entire card
        cardContainer.addEventListener("click", () => {
            window.location.href = `products/pingpong.html?id=${product.id}`;
        });


    cardButtonContainer.appendChild(button);
    cardContainer.appendChild(apiImageData);
    cardContainer.appendChild(apiTitleData);
    cardContainer.appendChild(apiPriceData);
    cardContainer.appendChild(cardButtonContainer);
    cardContainer.appendChild(button); 

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

        productDetails(Number(productId));
    } else {
        console.error("Invalid or missing product ID in the URL.");
    }
}

// Shows product data on a dedicated product details page
function productDetails(productId) {
    if (Array.isArray(apiData)) {

        const numericProductId = Number(productId);

        const productData = apiData.find((data) => data.id === numericProductId);

        if (productData) {
            productPage(productData);
        } else {
            console.error("Product data not found for ID:", numericProductId);
        }
    } else {
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
    const productDetailsSection = document.getElementById('productdetails');


    if (productDetailsSection) {
        productDetailsSection.style.display = 'none';
    }


    if (apiTitleData) {
        apiTitleData.textContent = productData.name;
    }

    if (descriptionElement) {
        descriptionElement.innerHTML = productData.description;
    }

    if (apiPriceData) {
        apiPriceData.textContent = `$${parseFloat(productData.price).toFixed(2)}`;
    }

    if (apiImageData && productData.images.length > 0) {
        apiImageData.src = productData.images[0].src;
    }


    if (productDetailsSection) {
        productDetailsSection.style.display = 'block'; 
    }
}



