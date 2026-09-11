```javascript
/* =========================================
   STYLES - MAIN JAVASCRIPT
   ========================================= */


/* =========================================
   CART FUNCTIONS
   ========================================= */

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}


// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// Add product to cart
function addToCart(name, price, image, description = "") {

    let cart = getCart();

    // Check whether product already exists
    const existingProduct = cart.find(
        item => item.name === name
    );

    if (existingProduct) {
        existingProduct.quantity =
            Number(existingProduct.quantity || 1) + 1;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            image: image,
            description: description,
            quantity: 1
        });
    }

    saveCart(cart);

    updateCartCount();

    alert("✅ Product added to cart!");
}


// Remove product from cart
function removeFromCart(index) {

    let cart = getCart();

    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
    }

    saveCart(cart);

    updateCartCount();

    // Reload if cart page is open
    if (window.location.pathname.includes("cart.html")) {
        location.reload();
    }
}


// Increase quantity
function increaseQuantity(index) {

    let cart = getCart();

    if (cart[index]) {
        cart[index].quantity =
            Number(cart[index].quantity || 1) + 1;
    }

    saveCart(cart);

    location.reload();
}


// Decrease quantity
function decreaseQuantity(index) {

    let cart = getCart();

    if (cart[index]) {

        let quantity =
            Number(cart[index].quantity || 1);

        if (quantity > 1) {
            cart[index].quantity = quantity - 1;
        } else {
            cart.splice(index, 1);
        }
    }

    saveCart(cart);

    location.reload();
}


/* =========================================
   CART COUNT
   ========================================= */

function updateCartCount() {

    const cart = getCart();

    const count = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 1),
        0
    );

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = count;
    }
}


/* =========================================
   SEARCH PRODUCTS
   ========================================= */

function searchProducts() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }

    const query =
        searchInput.value.trim();

    if (query === "") {
        alert("Please enter a product name.");
        return;
    }

    window.location.href =
        "products.html?search=" +
        encodeURIComponent(query);
}


/* =========================================
   SEARCH ON ENTER KEY
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const searchInput =
        document.getElementById("searchInput");

    if (searchInput) {

        searchInput.addEventListener(
            "keypress",
            function (event) {

                if (event.key === "Enter") {
                    searchProducts();
                }

            }
        );
    }

    updateCartCount();

});


/* =========================================
   CATEGORY FILTER
   ========================================= */

function filterCategory(category) {

    if (!category) {
        return;
    }

    window.location.href =
        "products.html?category=" +
        encodeURIComponent(category);
}


/* =========================================
   SORT PRODUCTS
   ========================================= */

function sortProducts() {

    const sortSelect =
        document.getElementById("sortSelect");

    if (!sortSelect) {
        return;
    }

    const value = sortSelect.value;

    const productContainer =
        document.querySelector(".product-grid");

    if (!productContainer) {
        return;
    }

    const products =
        Array.from(
            productContainer.children
        );

    if (value === "price-low") {

        products.sort(function (a, b) {

            return getProductPrice(a) -
                   getProductPrice(b);

        });

    } else if (value === "price-high") {

        products.sort(function (a, b) {

            return getProductPrice(b) -
                   getProductPrice(a);

        });

    } else if (value === "rating") {

        products.sort(function (a, b) {

            return getProductRating(b) -
                   getProductRating(a);

        });

    }

    products.forEach(function (product) {
        productContainer.appendChild(product);
    });
}


// Get price from product card
function getProductPrice(product) {

    const priceElement =
        product.querySelector(".price");

    if (!priceElement) {
        return 0;
    }

    const priceText =
        priceElement.textContent
            .replace(/[₹,]/g, "")
            .trim();

    return parseFloat(priceText) || 0;
}


// Get rating from product card
function getProductRating(product) {

    const ratingElement =
        product.querySelector(".rating");

    if (!ratingElement) {
        return 0;
    }

    const match =
        ratingElement.textContent.match(
            /([0-5](\.[0-9])?)/
        );

    return match
        ? parseFloat(match[1])
        : 0;
}


/* =========================================
   LOGIN STATUS
   ========================================= */

function isUserLoggedIn() {

    return localStorage.getItem("isLoggedIn")
        === "true";
}


/* =========================================
   LOGOUT
   ========================================= */

function logout() {

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");

    alert("You have been logged out.");

    window.location.href = "index.html";
}


/* =========================================
   BUY NOW
   ========================================= */

function buyNowProduct(
    name,
    price,
    image,
    description = ""
) {

    let cart = getCart();

    cart = [{
        name: name,
        price: Number(price),
        image: image,
        description: description,
        quantity: 1
    }];

    saveCart(cart);

    window.location.href =
        "checkout.html";
}


/* =========================================
   PRODUCT DETAILS
   ========================================= */

function viewProduct(
    name,
    price,
    image,
    description = ""
) {

    const product = {
        name: name,
        price: Number(price),
        image: image,
        description: description
    };

    localStorage.setItem(
        "selectedProduct",
        JSON.stringify(product)
    );

    window.location.href =
        "product.html";
}


/* =========================================
   CLEAR CART
   ========================================= */

function clearCart() {

    const cart =
        getCart();

    if (cart.length === 0) {
        alert("Your cart is already empty.");
        return;
    }

    const confirmClear =
        confirm(
            "Are you sure you want to remove all products from your cart?"
        );

    if (confirmClear) {

        localStorage.removeItem("cart");

        updateCartCount();

        location.reload();
    }
}


/* =========================================
   WISHLIST
   ========================================= */

function getWishlist() {

    return JSON.parse(
        localStorage.getItem("wishlist")
    ) || [];
}


function toggleWishlist(
    name,
    price,
    image
) {

    let wishlist = getWishlist();

    const existingIndex =
        wishlist.findIndex(
            item => item.name === name
        );

    if (existingIndex !== -1) {

        wishlist.splice(existingIndex, 1);

        alert("Removed from wishlist.");

    } else {

        wishlist.push({
            name: name,
            price: Number(price),
            image: image
        });

        alert("❤️ Added to wishlist!");

    }

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );
}


/* =========================================
   FORMAT PRICE
   ========================================= */

function formatPrice(price) {

    return "₹" +
        Number(price).toLocaleString("en-IN");
}


/* =========================================
   URL SEARCH PARAMETERS
   ========================================= */

function getURLParameter(name) {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get(name);
}


/* =========================================
   PRODUCT SEARCH ON PRODUCTS PAGE
   ========================================= */

function applySearchFilter() {

    const searchQuery =
        getURLParameter("search");

    const category =
        getURLParameter("category");

    const productCards =
        document.querySelectorAll(
            ".product-card"
        );

    if (!productCards.length) {
        return;
    }

    productCards.forEach(function (card) {

        const productName =
            card.querySelector("h3")
                ?.textContent
                .toLowerCase() || "";

        const productCategory =
            card.dataset.category
                ?.toLowerCase() || "";

        let showProduct = true;

        // Search filter
        if (searchQuery) {

            showProduct =
                productName.includes(
                    searchQuery.toLowerCase()
                );
        }

        // Category filter
        if (category && showProduct) {

            showProduct =
                productCategory ===
                category.toLowerCase();
        }

        card.style.display =
            showProduct ? "" : "none";
    });
}


/* =========================================
   INITIALIZE PAGE
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        applySearchFilter();

    }
);
```
