// SEPHYX - Cyberpunk Streetwear E-commerce
// Main JavaScript functionality

// Global SEPHYX object for shared functionality
window.SEPHYX = {
    cart: null,
    wishlist: null,
    showNotification: function(message, type = 'info') {
        showNotification(message, type);
    }
};

function initializeApp() {
    initializeLoader();
    initializeNavigation();
    initializeScrollEffects();
    initializeScrollAnimations();
    initializeParticles();
    initializeCursor();
    initializeProductFilters();
    initializeNewsletter();
    initializeChatBot();
    updateCartCount();
    updateWishlistCount();
    
    // Initialize products if product manager exists
    if (typeof ProductManager !== 'undefined') {
        window.productManager = new ProductManager();
    }
    
    // Simple scroll animations without external dependencies
    initializeScrollAnimations();
}

function initializeLoader() {
    const loader = document.getElementById('loader');
    const loaderBar = document.querySelector('.loader-bar');
    
    if (loader && loaderBar) {
        // Animate loader progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Hide loader after completion
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 500);
                }, 500);
            }
            loaderBar.style.width = progress + '%';
        }, 100);
    }
}

function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        const navLinkItems = document.querySelectorAll('.nav-link');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        }
    });
}

function initializeScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

function initializeScrollAnimations() {
    // Simple intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    // Observe elements for animation
    document.querySelectorAll('.hero-content, .section-title, .product-card, .animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter products with animation
            productCards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initializeNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (email) {
                showNotification('NEWSLETTER SUBSCRIPTION INITIATED. PREPARE FOR UPDATES.', 'success');
                newsletterForm.reset();
            }
        });
    }
}

function initializeChatBot() {
    const chatToggle = document.getElementById('chatToggle');
    const chatWidget = document.getElementById('chatWidget');
    const chatClose = document.getElementById('chatClose');
    const chatForm = document.getElementById('chatForm');
    
    if (chatToggle && chatWidget) {
        chatToggle.addEventListener('click', () => {
            chatWidget.classList.add('active');
        });
        
        if (chatClose) {
            chatClose.addEventListener('click', () => {
                chatWidget.classList.remove('active');
            });
        }
        
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = chatForm.querySelector('input');
                const message = input.value.trim();
                
                if (message) {
                    // Redirect to Instagram for real chat
                    window.open('https://instagram.com/SephyxOfficial', '_blank');
                    showNotification('REDIRECTING TO INSTAGRAM FOR LIVE CHAT', 'info');
                    input.value = '';
                    chatWidget.classList.remove('active');
                }
            });
        }
    }
}

function scrollToCollection() {
    const collectionSection = document.getElementById('collection');
    if (collectionSection) {
        collectionSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('sephyx_cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('sephyx_wishlist')) || [];
    const wishlistCount = document.querySelector('.wishlist-count');
    
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--secondary-bg);
        color: var(--text-primary);
        padding: 15px 25px;
        border-left: 4px solid var(--accent-gold);
        border-radius: 4px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-family: var(--font-heading);
        font-weight: 600;
        letter-spacing: 1px;
    `;
    
    if (type === 'success') {
        notification.style.borderColor = 'var(--neon-blue)';
    } else if (type === 'warning') {
        notification.style.borderColor = 'var(--neon-pink)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Initialize particles, cursor, and manifesto if their scripts are loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initializeParticles === 'function') {
        initializeParticles();
    }
    if (typeof initializeCursor === 'function') {
        initializeCursor();
    }
    if (typeof initializeManifesto === 'function') {
        initializeManifesto();
    }
});