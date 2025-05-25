// Global variables
let cart = [];
let cartCount = 1; // Start with 1 as shown in HTML

// DOM Elements
const cartBadge = document.querySelector('.cart-badge');
const navLinks = document.querySelectorAll('.nav-links a');
const contentSections = document.querySelectorAll('.content-section');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFilters();
    initializeCart();
    initializeSearch();
    updateCartCount();
});

// Navigation functionality
function showSection(sectionId) {
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update nav links
    navLinks.forEach(link => link.classList.remove('active'));
    navLinks.forEach(link => {
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(sectionId)) {
            link.classList.add('active');
        }
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initializeNavigation() {
    // Navigation is handled by onclick attributes in HTML
    // This function can be used for additional navigation setup if needed
}

// Filter functionality
function initializeFilters() {
    // Get all filter buttons from all sections
    const allFilterButtons = document.querySelectorAll('.filter-btn');
    
    allFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from siblings
            const parentContainer = this.parentElement;
            parentContainer.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter category
            const category = this.textContent.toLowerCase();
            
            // Filter products in the current section
            filterProducts(category);
        });
    });
}

function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
        
        if (category === 'all') {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-in';
        } else {
            const keywords = {
                'kids': ['kids', 'children', 'child', 'scooter', 'bike', 'teddy', 'gaming', 'balance'],
                'outdoor': ['outdoor', 'scooter', 'bike', 'balance', 'adventure', 'trekking'],
                'sports': ['sports', 'bike', 'scooter', 'balance'],
                'toys': ['toys', 'teddy', 'bear', 'gaming', 'console'],
                'scooters': ['scooter', 'foldable'],
                'bikes': ['bike', 'balance'],
                'games': ['gaming', 'console', 'educational']
            };
            
            const categoryKeywords = keywords[category] || [category];
            const isMatch = categoryKeywords.some(keyword => 
                title.includes(keyword) || description.includes(keyword)
            );
            
            if (isMatch) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-in';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Cart functionality
function initializeCart() {
    // Initialize cart buttons
    const cartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    cartButtons.forEach(button => {
        // Skip disabled buttons
        if (button.style.cursor === 'not-allowed' || 
            button.textContent.includes('Coming Soon') || 
            button.textContent.includes('Notify Me')) {
            return;
        }
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.product-card');
            const title = card.querySelector('.product-title')?.textContent || 'Product';
            const priceElement = card.querySelector('.product-price');
            let price = '$0.00';
            
            if (priceElement) {
                // Handle price with strikethrough text
                const priceText = priceElement.textContent || priceElement.innerText;
                const priceMatch = priceText.match(/\$[\d.]+/g);
                if (priceMatch && priceMatch.length > 0) {
                    price = priceMatch[priceMatch.length - 1]; // Get the last price (current price)
                }
            }
            
            const icon = card.querySelector('.product-icon')?.textContent || '🛒';
            
            const product = {
                id: Date.now(),
                title: title,
                price: price,
                icon: icon
            };
            
            addToCart(product);
            
            // Visual feedback
            const originalText = this.textContent;
            const originalBackground = this.style.background;
            
            this.style.background = '#10b981';
            this.textContent = 'Added! ✓';
            
            setTimeout(() => {
                this.style.background = originalBackground || '#6366f1';
                this.textContent = originalText;
            }, 1500);
        });
    });
    
    // Cart icon click handler
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            showCartModal();
        });
    }
}

function addToCart(product) {
    cart.push(product);
    cartCount = cart.length;
    updateCartCount();
    showNotification(`${product.title} added to cart!`);
}

function updateCartCount() {
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.animation = 'pulse 0.3s ease-in-out';
        setTimeout(() => {
            cartBadge.style.animation = '';
        }, 300);
    }
}

function showCartModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        z-index: 10000;
        padding-top: 10vh;
        animation: fadeIn 0.3s ease-out;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 16px;
        max-width: 600px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    let cartItemsHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItemsHTML = `
            <div style="text-align: center; padding: 2rem; color: #6b7280;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🛒</div>
                <p>Your cart is empty</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Add some products to get started!</p>
            </div>
        `;
    } else {
        cart.forEach((item, index) => {
            const price = parseFloat(item.price.replace('$', ''));
            total += price;
            
            cartItemsHTML += `
                <div style="display: flex; align-items: center; padding: 1rem; border-bottom: 1px solid #e5e7eb;">
                    <div style="font-size: 2rem; margin-right: 1rem;">${item.icon}</div>
                    <div style="flex: 1;">
                        <h4 style="font-weight: 600; margin-bottom: 0.25rem;">${item.title}</h4>
                        <p style="color: #6366f1; font-weight: 600;">${item.price}</p>
                    </div>
                    <button onclick="removeFromCart(${index})" style="background: #ef4444; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer;">
                        Remove
                    </button>
                </div>
            `;
        });
        
        cartItemsHTML += `
            <div style="padding: 1rem; text-align: right; border-top: 2px solid #e5e7eb; margin-top: 1rem;">
                <div style="font-size: 1.2rem; font-weight: 600;">
                    Total: $${total.toFixed(2)}
                </div>
                <button style="background: #6366f1; color: white; border: none; padding: 1rem 2rem; border-radius: 8px; margin-top: 1rem; cursor: pointer; font-weight: 600;">
                    Checkout
                </button>
            </div>
        `;
    }
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2 style="font-size: 1.5rem; font-weight: 600; color: #111827; margin: 0;">Shopping Cart (${cart.length})</h2>
            <button class="modal-close-btn" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280; padding: 0.5rem;">&times;</button>
        </div>
        ${cartItemsHTML}
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal handlers
    const closeButton = modalContent.querySelector('.modal-close-btn');
    closeButton.addEventListener('click', () => {
        closeModal(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        const removedItem = cart.splice(index, 1)[0];
        cartCount = cart.length;
        updateCartCount();
        showNotification(`${removedItem.title} removed from cart`);
        
        // Close and reopen cart modal to refresh
        const modal = document.querySelector('.modal-backdrop');
        if (modal) {
            closeModal(modal);
            setTimeout(() => showCartModal(), 100);
        }
    }
}

function closeModal(modal) {
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// Search functionality
function initializeSearch() {
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            showSearchModal();
        });
    }
}

function showSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        z-index: 10000;
        padding-top: 10vh;
        animation: fadeIn 0.3s ease-out;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 16px; max-width: 600px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <h2 style="font-size: 1.5rem; font-weight: 600; color: #111827; margin: 0;">Search Products</h2>
                <button class="modal-close-btn" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280; padding: 0.5rem; margin-left: auto;">&times;</button>
            </div>
            <div style="position: relative; margin-bottom: 1.5rem;">
                <input type="text" id="searchInput" placeholder="Search for scooters, bikes, toys..." style="width: 100%; padding: 1rem 1rem 1rem 3rem; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 1rem; outline: none;" />
                <div style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #6b7280; font-size: 1.2rem;">🔍</div>
            </div>
            <div id="searchResults" style="max-height: 300px; overflow-y: auto;">
                <div style="text-align: center; padding: 2rem; color: #6b7280;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🔍</div>
                    <p>Start typing to search for products...</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeButton = modal.querySelector('.modal-close-btn');
    const searchInput = modal.querySelector('#searchInput');
    const resultsContainer = modal.querySelector('#searchResults');
    
    closeButton.addEventListener('click', () => {
        closeModal(modal);
    });
    
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    searchInput.focus();
    
    searchInput.addEventListener('input', () => {
        performSearch(searchInput.value.trim(), resultsContainer);
    });
}

function performSearch(query, resultsContainer) {
    if (!query) {
        resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6b7280;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">🔍</div>
                <p>Start typing to search for products...</p>
            </div>
        `;
        return;
    }
    
    const allProducts = [];
    
    // Get products from DOM
    document.querySelectorAll('.product-card').forEach(card => {
        const title = card.querySelector('.product-title')?.textContent || '';
        const description = card.querySelector('.product-description')?.textContent || '';
        const priceElement = card.querySelector('.product-price');
        let price = '$0.00';
        
        if (priceElement) {
            const priceText = priceElement.textContent || priceElement.innerText;
            const priceMatch = priceText.match(/\$[\d.]+/g);
            if (priceMatch && priceMatch.length > 0) {
                price = priceMatch[priceMatch.length - 1];
            }
        }
        
        const icon = card.querySelector('.product-icon')?.textContent || '🛒';
        
        allProducts.push({
            title: title,
            description: description,
            price: price,
            icon: icon,
            card: card
        });
    });
    
    const filtered = allProducts.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length === 0) {
        resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6b7280;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">😔</div>
                <p>No products found for "${query}"</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Try searching for "scooter", "bike", "teddy", or "gaming"</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = filtered.map(p => `
        <div class="search-result-item" style="display: flex; align-items: center; padding: 1rem; border-radius: 8px; cursor: pointer; margin-bottom: 0.5rem; transition: background 0.2s;">
            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 1rem; font-size: 1.5rem; color: white;">${p.icon}</div>
            <div style="flex: 1;">
                <h4 style="font-weight: 600; color: #111827; margin-bottom: 0.25rem;">${p.title}</h4>
                <p style="color: #6b7280; font-size: 0.9rem; line-height: 1.4;">${p.description.substring(0, 100)}...</p>
            </div>
            <div style="font-weight: 600; color: #6366f1; font-size: 1.1rem;">
                ${p.price}
            </div>
        </div>
    `).join('');
    
    // Add click and hover behavior
    const items = resultsContainer.querySelectorAll('.search-result-item');
    items.forEach(item => {
        item.addEventListener('mouseenter', () => item.style.backgroundColor = '#f8f9fa');
        item.addEventListener('mouseleave', () => item.style.backgroundColor = 'transparent');
        item.addEventListener('click', () => {
            const title = item.querySelector('h4').textContent;
            selectSearchResult(title);
        });
    });
}

function selectSearchResult(title) {
    closeModal(document.querySelector('.modal-backdrop'));
    
    // Find which section contains the product
    let targetSection = 'home';
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const cardTitle = card.querySelector('.product-title')?.textContent || '';
        if (cardTitle === title || cardTitle.includes(title.split(' ')[0])) {
            const section = card.closest('.content-section');
            if (section) {
                targetSection = section.id;
            }
        }
    });
    
    showSection(targetSection);
    
    setTimeout(() => {
        cards.forEach(card => {
            const cardTitle = card.querySelector('.product-title')?.textContent || '';
            if (cardTitle === title || cardTitle.includes(title.split(' ')[0])) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.style.transform = 'scale(1.05)';
                card.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.3)';
                card.style.border = '2px solid #6366f1';
                setTimeout(() => {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                    card.style.border = '';
                }, 2000);
            }
        });
    }, 300);
    
    showNotification(`Found: ${title}`);
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);