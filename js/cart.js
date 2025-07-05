// Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('sephyx_cart')) || [];
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateCartDisplay();
    }
    
    bindEvents() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart') || e.target.closest('.add-to-cart')) {
                const button = e.target.matches('.add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                const productCard = button.closest('.product-card');
                if (productCard) {
                    this.addToCart(productCard);
                }
            }
        });
    }
    
    addToCart(productCard) {
        const productData = this.extractProductData(productCard);
        if (!productData) return;
        
        const existingItem = this.cart.find(item => item.id === productData.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...productData,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showAddedNotification(productData.name);
        
        // Add visual feedback
        this.animateAddToCart(productCard);
    }
    
    removeFromCart(productId) {
        const index = this.cart.findIndex(item => item.id === productId);
        if (index > -1) {
            const removedItem = this.cart[index];
            this.cart.splice(index, 1);
            this.saveCart();
            this.updateCartDisplay();
            
            if (window.SEPHYX) {
                window.SEPHYX.showNotification(`${removedItem.name} REMOVED FROM CART`, 'warning');
            }
        }
    }
    
    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }
    
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
        
        if (window.SEPHYX) {
            window.SEPHYX.showNotification('CART PURGED', 'warning');
        }
    }
    
    getTotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
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
    
    saveCart() {
        localStorage.setItem('sephyx_cart', JSON.stringify(this.cart));
    }
    
    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
        
        // Update cart page if it exists
        this.updateCartPage();
    }
    
    updateCartPage() {
        const cartContainer = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartContainer) return;
        
        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <h3>YOUR CART IS EMPTY</h3>
                    <p>No cyberpunk drip detected. Start your collection.</p>
                    <a href="index.html#collection" class="cta-button">EXPLORE COLLECTION</a>
                </div>
            `;
            if (cartTotal) cartTotal.textContent = '$0.00';
            return;
        }
        
        cartContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        <button class="remove-item" onclick="cart.removeFromCart('${item.id}')">REMOVE</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `).join('');
        
        if (cartTotal) {
            cartTotal.textContent = `$${this.getTotal().toFixed(2)}`;
        }
    }
    
    animateAddToCart(productCard) {
        const button = productCard.querySelector('.add-to-cart');
        if (!button) return;
        
        // Change button text temporarily
        const originalText = button.textContent;
        button.textContent = 'ADDED';
        button.style.background = 'var(--neon-blue)';
        
        // Particle burst effect
        const rect = button.getBoundingClientRect();
        this.createCartParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1500);
    }
    
    createCartParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: var(--neon-blue);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                left: ${x}px;
                top: ${y}px;
                box-shadow: 0 0 10px var(--neon-blue);
            `;
            
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 / 8) * i;
            const velocity = 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            gsap.to(particle, {
                x: vx,
                y: vy,
                opacity: 0,
                scale: 0,
                duration: 1,
                ease: 'power2.out',
                onComplete: () => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }
            });
        }
    }
    
    showAddedNotification(productName) {
        if (window.SEPHYX) {
            window.SEPHYX.showNotification(`${productName} ADDED TO CART`, 'success');
        }
    }
    
    checkout() {
        if (this.cart.length === 0) {
            if (window.SEPHYX) {
                window.SEPHYX.showNotification('CART IS EMPTY', 'warning');
            }
            return;
        }
        
        // Generate order details for Instagram message
        const orderNumber = 'SPX' + Date.now().toString().slice(-6);
        const orderDate = new Date().toLocaleDateString();
        const total = this.getTotal();
        
        // Create formatted message for Instagram
        let orderMessage = `🔥 SEPHYX ORDER REQUEST 🔥\n\n`;
        orderMessage += `Order: ${orderNumber}\n`;
        orderMessage += `Date: ${orderDate}\n\n`;
        orderMessage += `ITEMS:\n`;
        orderMessage += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        
        this.cart.forEach((item, index) => {
            orderMessage += `${index + 1}. ${item.name}\n`;
            orderMessage += `   Price: $${item.price.toFixed(2)}\n`;
            orderMessage += `   Quantity: ${item.quantity}\n`;
            orderMessage += `   Category: ${item.category.toUpperCase()}\n`;
            if (index < this.cart.length - 1) orderMessage += `\n`;
        });
        
        orderMessage += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        orderMessage += `TOTAL: $${total.toFixed(2)}\n\n`;
        orderMessage += `📝 Please specify:\n`;
        orderMessage += `• Size preferences for each item\n`;
        orderMessage += `• Color preferences\n`;
        orderMessage += `• Shipping address\n`;
        orderMessage += `• Preferred contact method\n\n`;
        orderMessage += `Send this message to @SephyxOfficial on Instagram to complete your order! 🚀`;
        
        // Save order to localStorage for order history
        const orders = JSON.parse(localStorage.getItem('sephyx_orders')) || [];
        orders.push({
            orderNumber,
            items: [...this.cart],
            total: total,
            date: new Date().toISOString(),
            status: 'Pending Instagram Contact',
            message: orderMessage
        });
        localStorage.setItem('sephyx_orders', JSON.stringify(orders));
        
        // Show order message modal
        this.showOrderModal(orderMessage, orderNumber);
    }
    
    showOrderModal(orderMessage, orderNumber) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'order-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: var(--secondary-bg);
            border: 2px solid var(--accent-gold);
            max-width: 600px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            padding: 30px;
            position: relative;
            box-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
        `;
        
        modalContent.innerHTML = `
            <button class="modal-close" style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                color: var(--text-primary);
                font-size: 24px;
                cursor: pointer;
                z-index: 1;
            ">&times;</button>
            
            <h2 style="
                font-family: var(--font-heading);
                color: var(--accent-gold);
                text-align: center;
                margin-bottom: 20px;
                font-size: 1.8rem;
                letter-spacing: 2px;
            ">ORDER GENERATED</h2>
            
            <p style="
                color: var(--text-secondary);
                text-align: center;
                margin-bottom: 25px;
                line-height: 1.6;
            ">Copy the message below and send it to <strong style="color: var(--neon-pink);">@SephyxOfficial</strong> on Instagram to complete your order:</p>
            
            <textarea readonly style="
                width: 100%;
                height: 300px;
                background: var(--primary-bg);
                border: 1px solid var(--text-secondary);
                color: var(--text-primary);
                padding: 15px;
                font-family: monospace;
                font-size: 14px;
                line-height: 1.4;
                resize: none;
                margin-bottom: 20px;
            ">${orderMessage}</textarea>
            
            <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                <button class="copy-btn" style="
                    flex: 1;
                    background: var(--accent-gold);
                    border: none;
                    color: var(--primary-bg);
                    padding: 15px 25px;
                    font-family: var(--font-heading);
                    font-weight: 700;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: var(--transition);
                    text-transform: uppercase;
                    min-width: 140px;
                ">COPY MESSAGE</button>
                
                <a href="https://instagram.com/SephyxOfficial" target="_blank" style="
                    flex: 1;
                    background: var(--neon-pink);
                    border: none;
                    color: var(--primary-bg);
                    padding: 15px 25px;
                    font-family: var(--font-heading);
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-decoration: none;
                    transition: var(--transition);
                    text-transform: uppercase;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 140px;
                ">OPEN INSTAGRAM</a>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modalContent.querySelector('.modal-close');
        const copyBtn = modalContent.querySelector('.copy-btn');
        const textarea = modalContent.querySelector('textarea');
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            this.clearCart();
            window.location.href = 'index.html';
        });
        
        copyBtn.addEventListener('click', () => {
            textarea.select();
            textarea.setSelectionRange(0, 99999); // For mobile devices
            navigator.clipboard.writeText(orderMessage).then(() => {
                copyBtn.textContent = 'COPIED!';
                copyBtn.style.background = 'var(--neon-blue)';
                setTimeout(() => {
                    copyBtn.textContent = 'COPY MESSAGE';
                    copyBtn.style.background = 'var(--accent-gold)';
                }, 2000);
            }).catch(() => {
                // Fallback for older browsers
                textarea.select();
                document.execCommand('copy');
                copyBtn.textContent = 'COPIED!';
                copyBtn.style.background = 'var(--neon-blue)';
                setTimeout(() => {
                    copyBtn.textContent = 'COPY MESSAGE';
                    copyBtn.style.background = 'var(--accent-gold)';
                }, 2000);
            });
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBtn.click();
            }
        });
        
        // Animate modal entrance
        gsap.fromTo(modal, 
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );
        
        gsap.fromTo(modalContent, 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)', delay: 0.1 }
        );
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Global cart functions
window.cart = cart;
