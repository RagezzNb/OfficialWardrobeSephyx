// Wishlist Functionality
class Wishlist {
    constructor() {
        this.wishlist = JSON.parse(localStorage.getItem('sephyx_wishlist')) || [];
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateWishlistDisplay();
        this.markWishlistItems();
    }
    
    bindEvents() {
        // Heart buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.wishlist-heart') || e.target.closest('.wishlist-heart')) {
                const button = e.target.matches('.wishlist-heart') ? e.target : e.target.closest('.wishlist-heart');
                const productCard = button.closest('.product-card');
                if (productCard) {
                    this.toggleWishlist(productCard, button);
                }
            }
        });
    }
    
    toggleWishlist(productCard, button) {
        const productData = this.extractProductData(productCard);
        if (!productData) return;
        
        const existingIndex = this.wishlist.findIndex(item => item.id === productData.id);
        
        if (existingIndex > -1) {
            // Remove from wishlist
            this.wishlist.splice(existingIndex, 1);
            button.classList.remove('active');
            button.innerHTML = '♡';
            this.animateHeartRemove(button);
            
            if (window.SEPHYX) {
                window.SEPHYX.showNotification(`${productData.name} REMOVED FROM WISHLIST`, 'warning');
            }
        } else {
            // Add to wishlist
            this.wishlist.push({
                ...productData,
                addedAt: new Date().toISOString()
            });
            button.classList.add('active');
            button.innerHTML = '♥';
            this.animateHeartAdd(button);
            
            if (window.SEPHYX) {
                window.SEPHYX.showNotification(`${productData.name} ADDED TO WISHLIST`, 'success');
            }
        }
        
        this.saveWishlist();
        this.updateWishlistDisplay();
    }
    
    removeFromWishlist(productId) {
        const index = this.wishlist.findIndex(item => item.id === productId);
        if (index > -1) {
            const removedItem = this.wishlist[index];
            this.wishlist.splice(index, 1);
            this.saveWishlist();
            this.updateWishlistDisplay();
            this.markWishlistItems();
            
            if (window.SEPHYX) {
                window.SEPHYX.showNotification(`${removedItem.name} REMOVED FROM WISHLIST`, 'warning');
            }
        }
    }
    
    addToCartFromWishlist(productId) {
        const item = this.wishlist.find(item => item.id === productId);
        if (item && window.cart) {
            // Create a temporary product card element for cart functionality
            const tempCard = this.createTempProductCard(item);
            document.body.appendChild(tempCard);
            
            window.cart.addToCart(tempCard);
            
            // Clean up
            document.body.removeChild(tempCard);
        }
    }
    
    createTempProductCard(item) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.productId = item.id;
        card.dataset.category = item.category;
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${item.name}</h3>
                <p class="product-price">$${item.price.toFixed(2)}</p>
                <p class="product-category">${item.category}</p>
            </div>
        `;
        
        return card;
    }
    
    extractProductData(productCard) {
        const id = productCard.dataset.productId;
        const name = productCard.querySelector('.product-name')?.textContent;
        const priceText = productCard.querySelector('.product-price')?.textContent;
        const image = productCard.querySelector('.product-image img')?.src;
        const category = productCard.dataset.category;
        
        if (!id || !name || !priceText) return null;
        
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        
        return {
            id,
            name,
            price,
            image,
            category
        };
    }
    
    saveWishlist() {
        localStorage.setItem('sephyx_wishlist', JSON.stringify(this.wishlist));
    }
    
    updateWishlistDisplay() {
        const wishlistCount = document.querySelector('.wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = this.wishlist.length;
        }
        
        // Update wishlist page if it exists
        this.updateWishlistPage();
    }
    
    updateWishlistPage() {
        const wishlistContainer = document.getElementById('wishlistItems');
        if (!wishlistContainer) return;
        
        if (this.wishlist.length === 0) {
            wishlistContainer.innerHTML = `
                <div class="empty-wishlist">
                    <h3>YOUR WISHLIST IS EMPTY</h3>
                    <p>No desired items detected. Explore our cyberpunk collection.</p>
                    <a href="index.html#collection" class="cta-button">DISCOVER DRIP</a>
                </div>
            `;
            return;
        }
        
        wishlistContainer.innerHTML = this.wishlist.map(item => `
            <div class="wishlist-item" data-product-id="${item.id}">
                <div class="wishlist-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="wishlist-item-info">
                    <h4 class="wishlist-item-name">${item.name}</h4>
                    <p class="wishlist-item-price">$${item.price.toFixed(2)}</p>
                    <p class="wishlist-item-category">${item.category}</p>
                    <div class="wishlist-item-actions">
                        <button class="add-to-cart-wishlist" onclick="wishlist.addToCartFromWishlist('${item.id}')">
                            ADD TO CART
                        </button>
                        <button class="remove-from-wishlist" onclick="wishlist.removeFromWishlist('${item.id}')">
                            REMOVE
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    markWishlistItems() {
        // Mark items that are in wishlist on product cards
        document.querySelectorAll('.product-card').forEach(card => {
            const productId = card.dataset.productId;
            const heartButton = card.querySelector('.wishlist-heart');
            
            if (heartButton && productId) {
                const isInWishlist = this.wishlist.some(item => item.id === productId);
                
                if (isInWishlist) {
                    heartButton.classList.add('active');
                    heartButton.innerHTML = '♥';
                } else {
                    heartButton.classList.remove('active');
                    heartButton.innerHTML = '♡';
                }
            }
        });
    }
    
    animateHeartAdd(button) {
        // Create floating hearts effect
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '♥';
            heart.style.cssText = `
                position: fixed;
                color: var(--neon-pink);
                font-size: 20px;
                pointer-events: none;
                z-index: 10000;
                left: ${button.getBoundingClientRect().left + 20}px;
                top: ${button.getBoundingClientRect().top + 20}px;
                text-shadow: 0 0 10px var(--neon-pink);
            `;
            
            document.body.appendChild(heart);
            
            gsap.to(heart, {
                y: -100 - (i * 20),
                x: (Math.random() - 0.5) * 100,
                opacity: 0,
                scale: 0.5,
                rotation: 360,
                duration: 2,
                delay: i * 0.1,
                ease: 'power2.out',
                onComplete: () => {
                    if (heart.parentNode) {
                        heart.parentNode.removeChild(heart);
                    }
                }
            });
        }
        
        // Scale animation for button
        gsap.fromTo(button, 
            { scale: 1 },
            { 
                scale: 1.3,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            }
        );
    }
    
    animateHeartRemove(button) {
        // Broken heart effect
        const brokenHeart = document.createElement('div');
        brokenHeart.innerHTML = '💔';
        brokenHeart.style.cssText = `
            position: fixed;
            font-size: 24px;
            pointer-events: none;
            z-index: 10000;
            left: ${button.getBoundingClientRect().left + 20}px;
            top: ${button.getBoundingClientRect().top + 20}px;
        `;
        
        document.body.appendChild(brokenHeart);
        
        gsap.to(brokenHeart, {
            y: -50,
            opacity: 0,
            scale: 1.5,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => {
                if (brokenHeart.parentNode) {
                    brokenHeart.parentNode.removeChild(brokenHeart);
                }
            }
        });
        
        // Shake animation for button
        gsap.to(button, {
            x: -5,
            duration: 0.1,
            yoyo: true,
            repeat: 5,
            ease: 'power2.inOut'
        });
    }
    
    clearWishlist() {
        this.wishlist = [];
        this.saveWishlist();
        this.updateWishlistDisplay();
        this.markWishlistItems();
        
        if (window.SEPHYX) {
            window.SEPHYX.showNotification('WISHLIST PURGED', 'warning');
        }
    }
}

// Initialize wishlist
const wishlist = new Wishlist();

// Global wishlist functions
window.wishlist = wishlist;
