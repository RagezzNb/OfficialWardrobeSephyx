// Product Data and Management
class ProductManager {
    constructor() {
        this.products = [
            {
                id: 'cybr-jacket-001',
                name: 'ANARCHY LEATHER JACKET',
                price: 299.99,
                category: 'jackets',
                image: './assets/punk-jacket-01.svg',
                description: 'Hand-crafted leather jacket with metal studs, spikes, and removable punk patches. Built for rebellion.',
                sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                colors: ['Midnight Black', 'Blood Red', 'Storm Gray'],
                materials: 'Genuine leather, metal studs, removable patches',
                featured: true
            },
            {
                id: 'cybr-jacket-002',
                name: 'STUDDED PUNK BOMBER',
                price: 249.99,
                category: 'jackets',
                image: './assets/punk-jacket-01.svg',
                description: 'Heavy-duty bomber jacket with metal studs and punk aesthetic. Perfect for underground shows and street rebellion.',
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                colors: ['Pitch Black', 'Rust Red', 'Steel Gray'],
                materials: 'Canvas fabric, metal studs, reinforced stitching',
                featured: false
            },
            {
                id: 'cybr-jacket-003',
                name: 'SPIKED TRENCH COAT',
                price: 399.99,
                category: 'jackets',
                image: './assets/punk-jacket-01.svg',
                description: 'Full-length leather trench with shoulder spikes and chain details. The ultimate statement piece for punk royalty.',
                sizes: ['XS', 'S', 'M', 'L', 'XL'],
                colors: ['Midnight Black', 'Blood Burgundy', 'Storm Charcoal'],
                materials: 'Premium leather, metal spikes, heavy-duty chains',
                featured: true
            },
            {
                id: 'cybr-pants-001',
                name: 'DATA STREAM CARGO PANTS',
                price: 179.99,
                category: 'pants',
                image: './assets/punk-pants-01.svg',
                description: 'Multi-dimensional storage system with encrypted pockets. Each compartment features biometric locks and data encryption.',
                sizes: ['28', '30', '32', '34', '36', '38', '40'],
                colors: ['Terminal Green', 'Shadow Black', 'Cyber Yellow'],
                materials: 'Tactical polyfiber, encrypted storage modules',
                featured: false
            },
            {
                id: 'cybr-pants-002',
                name: 'NEON HIGHWAY JOGGERS',
                price: 149.99,
                category: 'pants',
                image: './assets/punk-pants-01.svg',
                description: 'Light-responsive athletic wear with built-in motion sensors. Generates energy from movement to power integrated LED strips.',
                sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                colors: ['Electric Blue', 'Laser Red', 'Hologram Silver'],
                materials: 'Performance mesh, energy-harvesting fibers',
                featured: true
            },
            {
                id: 'cybr-acc-001',
                name: 'NEURAL INTERFACE VISOR',
                price: 99.99,
                category: 'accessories',
                image: './assets/punk-accessories-01.svg',
                description: 'Augmented reality enhancement system. Provides real-time data overlay and protection from digital surveillance.',
                sizes: ['One Size'],
                colors: ['Chrome Mirror', 'Gold Tint', 'Blue Filter'],
                materials: 'Titanium frame, AR-enabled lenses',
                featured: false
            },
            {
                id: 'cybr-acc-002',
                name: 'QUANTUM COMMUNICATION COLLAR',
                price: 79.99,
                category: 'accessories',
                image: './assets/punk-accessories-01.svg',
                description: 'Encrypted communication device disguised as fashion accessory. Enables secure quantum-encrypted messaging.',
                sizes: ['S', 'M', 'L'],
                colors: ['Stealth Black', 'Signal Gold', 'Data Blue'],
                materials: 'Quantum processors, bio-compatible metals',
                featured: true
            },
            {
                id: 'cybr-acc-003',
                name: 'HOLOGRAPHIC UTILITY BELT',
                price: 129.99,
                category: 'accessories',
                image: './assets/punk-boots-01.svg',
                description: 'Adaptive storage system with holographic interface. Projects virtual inventory and enables gesture-based access.',
                sizes: ['S', 'M', 'L', 'XL'],
                colors: ['Matrix Black', 'Cyber Green', 'Neon Pink'],
                materials: 'Smart polymers, holographic projectors',
                featured: false
            }
        ];
        
        this.init();
    }
    
    init() {
        this.loadProducts();
        this.bindProductEvents();
    }
    
    loadProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;
        
        productsGrid.innerHTML = this.products.map(product => this.createProductCard(product)).join('');
        
        // Initialize wishlist hearts after products are loaded
        if (window.wishlist) {
            window.wishlist.markWishlistItems();
        }
    }
    
    createProductCard(product) {
        return `
            <div class="product-card" data-product-id="${product.id}" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <button class="wishlist-heart" aria-label="Add to wishlist">♡</button>
                    ${product.featured ? '<div class="featured-badge">FEATURED</div>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="product-category">${product.category.toUpperCase()}</p>
                    <button class="add-to-cart" onclick="productManager.quickAddToCart('${product.id}')">
                        ADD TO CART
                    </button>
                    <a href="product.html?id=${product.id}" class="view-details">VIEW DETAILS</a>
                </div>
            </div>
        `;
    }
    
    bindProductEvents() {
        // Product card click navigation
        document.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard && !e.target.closest('.wishlist-heart') && !e.target.closest('.add-to-cart') && !e.target.closest('.view-details')) {
                const productId = productCard.dataset.productId;
                window.location.href = `product.html?id=${productId}`;
            }
        });
    }
    
    quickAddToCart(productId) {
        const product = this.getProductById(productId);
        if (!product || !window.cart) return;
        
        // Create temporary product card for cart functionality
        const tempCard = this.createTempProductCard(product);
        document.body.appendChild(tempCard);
        
        window.cart.addToCart(tempCard);
        
        // Clean up
        document.body.removeChild(tempCard);
    }
    
    createTempProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.productId = product.id;
        card.dataset.category = product.category;
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-category">${product.category}</p>
            </div>
        `;
        
        return card;
    }
    
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }
    
    getProductsByCategory(category) {
        if (category === 'all') return this.products;
        return this.products.filter(product => product.category === category);
    }
    
    getFeaturedProducts() {
        return this.products.filter(product => product.featured);
    }
    
    searchProducts(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.description.toLowerCase().includes(lowercaseQuery) ||
            product.category.toLowerCase().includes(lowercaseQuery)
        );
    }
    
    getRelatedProducts(productId, limit = 3) {
        const product = this.getProductById(productId);
        if (!product) return [];
        
        return this.products
            .filter(p => p.id !== productId && p.category === product.category)
            .slice(0, limit);
    }
}

// Initialize product manager
function loadProducts() {
    if (!window.productManager) {
        window.productManager = new ProductManager();
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProducts);
} else {
    loadProducts();
}
