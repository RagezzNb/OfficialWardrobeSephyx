// Manifesto Generator
class ManifestoGenerator {
    constructor() {
        this.manifestos = [
            "Drip is not worn. Drip is summoned.",
            "You are not buying clothes. You are becoming iconography.",
            "Style is rebellion encrypted in fabric.",
            "Fashion dies. Drip is eternal.",
            "Your outfit is your operating system.",
            "Conform to stand out. Stand out to conform.",
            "Every thread tells a story of defiance.",
            "Beauty is found in the breakdown of systems.",
            "Wear your rebellion. Code your identity.",
            "The future is wearable. The wearable is you.",
            "Glitch your way to glory.",
            "Style without substance is simulation.",
            "Your aesthetic is your architecture.",
            "Fashion fades. Code endures.",
            "Be the virus in the system of sameness.",
            "Cyberpunk is not a look. It's a lifestyle.",
            "Your wardrobe is your weapon.",
            "Dress for the dystopia you want to see.",
            "Beauty exists in broken systems.",
            "Your style is your signal in the noise.",
            "Hack reality through haute couture.",
            "Be the glitch in their perfect matrix.",
            "Style is the syntax of self-expression.",
            "Fashion is data. You are the algorithm.",
            "Your outfit is your user interface.",
            "Elevate through elaborate aesthetics.",
            "Be beautifully broken.",
            "Style transcends the physical realm.",
            "Your closet is your command center.",
            "Dress like the future you're building.",
            "Fashion is philosophy made manifest.",
            "Be the error they never expected.",
            "Your style is your source code.",
            "Aesthetics are arguments.",
            "Be the beautiful breakdown.",
            "Style is resistance disguised as refinement.",
            "Your wardrobe is your world-building toolkit.",
            "Fashion is the future speaking through fabric.",
            "Be the upgrade they didn't see coming.",
            "Style is survival in the simulation."
        ];
        
        this.currentManifesto = 0;
        this.isAnimating = false;
        this.autoRotateInterval = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.startAutoRotation();
        this.displayCurrentManifesto();
    }
    
    bindEvents() {
        window.generateManifesto = () => {
            this.generateNewManifesto();
        };
        
        // Pause auto-rotation on hover
        const manifestoSection = document.querySelector('.manifesto-section');
        if (manifestoSection) {
            manifestoSection.addEventListener('mouseenter', () => {
                this.pauseAutoRotation();
            });
            
            manifestoSection.addEventListener('mouseleave', () => {
                this.startAutoRotation();
            });
        }
    }
    
    generateNewManifesto() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const manifestoText = document.getElementById('manifestoText');
        
        if (!manifestoText) {
            this.isAnimating = false;
            return;
        }
        
        // Get next manifesto (avoid repeating the same one)
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * this.manifestos.length);
        } while (nextIndex === this.currentManifesto && this.manifestos.length > 1);
        
        this.currentManifesto = nextIndex;
        
        // Animate out current text
        gsap.to(manifestoText, {
            opacity: 0,
            y: -20,
            scale: 0.9,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                // Apply glitch effect
                this.applyGlitchEffect(manifestoText);
                
                // Change text
                manifestoText.textContent = this.manifestos[this.currentManifesto];
                
                // Animate in new text
                gsap.fromTo(manifestoText, 
                    {
                        opacity: 0,
                        y: 20,
                        scale: 1.1
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                        onComplete: () => {
                            this.isAnimating = false;
                            this.removeGlitchEffect(manifestoText);
                        }
                    }
                );
            }
        });
        
        // Create particle burst
        this.createManifestoBurst();
    }
    
    displayCurrentManifesto() {
        const manifestoText = document.getElementById('manifestoText');
        if (manifestoText) {
            manifestoText.textContent = this.manifestos[this.currentManifesto];
            
            // Initial entrance animation
            gsap.fromTo(manifestoText,
                {
                    opacity: 0,
                    y: 30,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: 'power2.out',
                    delay: 0.5
                }
            );
        }
    }
    
    applyGlitchEffect(element) {
        element.classList.add('glitch-intense');
        element.setAttribute('data-text', element.textContent);
        
        // Add random glitch variations
        const glitchStyles = [
            'filter: hue-rotate(90deg) saturate(2)',
            'filter: invert(1) hue-rotate(180deg)',
            'filter: blur(1px) brightness(2)',
            'filter: contrast(2) saturate(0)'
        ];
        
        const randomStyle = glitchStyles[Math.floor(Math.random() * glitchStyles.length)];
        element.style.cssText += randomStyle;
    }
    
    removeGlitchEffect(element) {
        element.classList.remove('glitch-intense');
        element.removeAttribute('data-text');
        element.style.filter = '';
    }
    
    createManifestoBurst() {
        const manifestoSection = document.querySelector('.manifesto-section');
        if (!manifestoSection) return;
        
        const rect = manifestoSection.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create text fragments
        const fragments = ['CODE', 'STYLE', 'REBEL', 'CYBER', 'DRIP', 'GLITCH'];
        
        fragments.forEach((text, i) => {
            const fragment = document.createElement('div');
            fragment.textContent = text;
            fragment.style.cssText = `
                position: fixed;
                color: var(--accent-gold);
                font-family: var(--font-heading);
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 2px;
                pointer-events: none;
                z-index: 1000;
                left: ${centerX}px;
                top: ${centerY}px;
                text-shadow: 0 0 10px var(--accent-gold);
                opacity: 0.8;
            `;
            
            document.body.appendChild(fragment);
            
            const angle = (Math.PI * 2 / fragments.length) * i;
            const distance = 200;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            gsap.to(fragment, {
                x: x,
                y: y,
                opacity: 0,
                scale: 0.5,
                rotation: 360,
                duration: 2,
                ease: 'power2.out',
                onComplete: () => {
                    if (fragment.parentNode) {
                        fragment.parentNode.removeChild(fragment);
                    }
                }
            });
        });
        
        // Create particle ring
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--neon-blue);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${centerX}px;
                top: ${centerY}px;
                box-shadow: 0 0 10px var(--neon-blue);
            `;
            
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 / 12) * i;
            const distance = 150;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            gsap.to(particle, {
                x: x,
                y: y,
                opacity: 0,
                scale: 2,
                duration: 1.5,
                ease: 'power2.out',
                delay: i * 0.05,
                onComplete: () => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }
            });
        }
    }
    
    startAutoRotation() {
        this.pauseAutoRotation(); // Clear existing interval
        
        this.autoRotateInterval = setInterval(() => {
            if (!this.isAnimating) {
                this.generateNewManifesto();
            }
        }, 8000); // Change every 8 seconds
    }
    
    pauseAutoRotation() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }
    
    // Method to add custom manifestos
    addManifesto(text) {
        if (text && !this.manifestos.includes(text)) {
            this.manifestos.push(text);
        }
    }
    
    // Method to get random manifesto for other components
    getRandomManifesto() {
        return this.manifestos[Math.floor(Math.random() * this.manifestos.length)];
    }
}

// Initialize manifesto generator
function initializeManifesto() {
    new ManifestoGenerator();
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeManifesto);
} else {
    initializeManifesto();
}
