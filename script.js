// --- NAVBAR SCROLL EFFECT ---
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- MOBILE MENU TOGGLE ---
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('nav-links');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    hamburger.innerHTML = navLinksContainer.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// --- SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER) ---
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// --- ACTIVE LINK UPDATE ON SCROLL ---
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// --- SET CURRENT YEAR IN FOOTER ---
document.getElementById('year').textContent = new Date().getFullYear();

// Trigger reveal for elements that are in viewport on load
window.addEventListener('load', () => {
    // Add active class to hero elements immediately
    setTimeout(() => {
        document.querySelectorAll('#home .reveal').forEach(el => {
            el.classList.add('active');
        });
    }, 100);
});

// --- 3D TILT EFFECT FOR SKILL CARDS ---
const skillCards = document.querySelectorAll('.skill-category');

skillCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation based on cursor distance from center
        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        card.style.transition = 'none'; // Disable transition for smooth real-time tracking
    });

    card.addEventListener('mouseleave', () => {
        // Reset card to original hover position
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(-8px)`;
        card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';

        setTimeout(() => {
            if (!card.matches(':hover')) {
                card.style.transform = '';
            }
        }, 400);
    });
});

// --- IMAGE MODAL LOGIC ---
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const closeModalBtn = document.getElementById("closeModal");
const viewScreenshotBtns = document.querySelectorAll(".view-screenshot-btn");

// Open modal when a screenshot button is clicked
viewScreenshotBtns.forEach(btn => {
    btn.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent default link behavior
        const imgSrc = this.getAttribute("href");

        // Skip if href is # (empty link)
        if (imgSrc && imgSrc !== "#") {
            modalImg.src = imgSrc;
            modal.classList.add("show");
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        }
    });
});

// Close modal function
const closeModal = () => {
    modal.classList.remove("show");

    // Reset after transition finishes
    setTimeout(() => {
        modalImg.src = "";
        document.body.style.overflow = "auto";
    }, 300); // 300ms matches the CSS transition time
};

// Close when clicking the (x) button
closeModalBtn.addEventListener("click", closeModal);

// Close when clicking outside the image (on the modal background)
modal.addEventListener("click", function (e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Close on escape key press
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("show")) {
        closeModal();
    }
});

// --- CGPA CIRCULAR ANIMATION ---
const cgpaSection = document.getElementById('education');
const circleProgress = document.querySelector('.circle-progress');
const cgpaValueElement = document.querySelector('.cgpa-value');

if (cgpaSection && circleProgress && cgpaValueElement) {
    let animated = false;

    const animateCGPA = () => {
        if (animated) return;
        animated = true;

        const target = parseFloat(cgpaValueElement.getAttribute('data-target'));
        const duration = 2000;
        const steps = 60;
        const stepTime = duration / steps;

        // Calculate offset for the SVG circle (239 is the stroke-dasharray max)
        // 7.33 out of 10 means we fill 73.3% of the circle
        const percentage = target / 10;
        const offset = 239 - (239 * percentage);

        // Trigger CSS transition
        setTimeout(() => {
            circleProgress.style.strokeDashoffset = offset;
        }, 100);

        // Number counter animation
        let current = 0;
        const increment = target / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                cgpaValueElement.textContent = target.toFixed(2);
                clearInterval(timer);
            } else {
                cgpaValueElement.textContent = current.toFixed(2);
            }
        }, stepTime);
    };

    // Use Intersection Observer to trigger when Education section enters viewport
    const cgpaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCGPA();
                cgpaObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 }); // Trigger when 30% of section is visible

    cgpaObserver.observe(cgpaSection);
}

// --- SKILL CATEGORY HOVER TO ORBIT INTERACTION ---
const categoryMap = {
    'Languages': ['C++', 'Python', 'HTML', 'CSS'],
    'Frameworks': ['Scikit-learn', 'Scikit-Learn', 'NumPy', 'Pandas', 'Keras', 'React', 'Node.js'],
    'Tools & Platforms': ['GitHub', 'Google Colab', 'LeetCode']
};

const skillCategoriesList = document.querySelectorAll('.skill-category');
const orbitNetwork = document.querySelector('.orbit-network-container');
const orbitIcons = document.querySelectorAll('.orbit-icon');

if (orbitNetwork && orbitIcons.length > 0) {
    skillCategoriesList.forEach(category => {
        const titleHeader = category.querySelector('h3');
        if (!titleHeader) return;

        // Remove icon text if any, getting just the text string
        const titleText = titleHeader.textContent.trim();
        const targetSkills = categoryMap[titleText] || [];

        category.addEventListener('mouseenter', () => {
            // Only active if there are matching skills mapped
            if (targetSkills.length > 0) {
                orbitNetwork.classList.add('orbit-hover-active');
                orbitIcons.forEach(icon => {
                    const iconTitle = icon.getAttribute('data-title');
                    // Check if the icon matches our array of target skills
                    if (targetSkills.includes(iconTitle)) {
                        icon.classList.add('highlight-orbit');
                    } else {
                        icon.classList.remove('highlight-orbit');
                    }
                });
            }
        });

        category.addEventListener('mouseleave', () => {
            orbitNetwork.classList.remove('orbit-hover-active');
            orbitIcons.forEach(icon => {
                icon.classList.remove('highlight-orbit');
            });
        });
    });
}

// --- TYPEWRITER ANIMATION ---
const typewriterElement = document.getElementById('typewriter');
const phrases = [
    "Machine Learning Engineer",
    "Creative Developer",
    "AI / NLP Explorer"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        // Remove characters
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50; // Deleting is faster
    } else {
        // Add characters
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100; // Normal typing speed
    }

    // Handle end of phrase typing
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end of phrase
    }
    // Handle end of phrase deleting
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500; // Pause before starting next phrase
    }

    setTimeout(type, typeSpeed);
}

// Start typewriter when content is loaded
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000); // Initial delay before starting
});

// --- CONTACT FORM SUBMISSION ---
const contactForm = document.getElementById('contact-form');
const submitBtn = document.querySelector('.submit-btn-gradient');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Show loading state
        submitBtn.classList.add('loading');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        btnText.textContent = 'Sending...';

        formStatus.classList.remove('show', 'success', 'error');

        // Dummy timeout to simulate backend request
        setTimeout(() => {
            // Show Success Message
            formStatus.textContent = 'Submitted Successfully! I will get back to you soon.';
            formStatus.classList.add('show', 'success');
            
            // Reset Form and button
            contactForm.reset();
            submitBtn.classList.remove('loading');
            btnText.textContent = originalText;
        }, 1500); // Wait 1.5 seconds for visual effect
    });
}
// --- ANTI-GRAVITY PARTICLE BACKGROUND (GOOGLE STYLE) ---
const pCanvas = document.getElementById('particle-canvas');
const pCtx = pCanvas.getContext('2d');

let particles = [];
const pColors = [
    'rgba(66, 133, 244,',  // Blue
    'rgba(219, 68, 55,',   // Red
    'rgba(244, 180, 0,',   // Yellow
    'rgba(15, 157, 88,',   // Green
    'rgba(191, 0, 255,',   // Purple
    'rgba(255, 0, 150,'    // Pink
];

const pMouse = {
    x: null,
    y: null,
    radius: 150 // Influence radius
};

// Track mouse
window.addEventListener('mousemove', (e) => {
    pMouse.x = e.clientX;
    pMouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
    pMouse.x = null;
    pMouse.y = null;
});

// Click burst
window.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A' && !e.target.closest('.btn')) {
        createExplosion(e.clientX, e.clientY);
    }
});

class Particle {
    constructor(x, y, vx, vy, size, colorBase, isTemporary = false) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.initialVx = vx;
        this.initialVy = vy;
        this.size = size;
        this.colorBase = colorBase;
        this.isTemporary = isTemporary;
        this.life = isTemporary ? 1.0 : Infinity;
        this.opacity = isTemporary ? 1.0 : (Math.random() * 0.4 + 0.3);

        // --- TWINKLE PROPERTIES ---
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = 0.02 + Math.random() * 0.03;
    }

    draw() {
        this.twinklePhase += this.twinkleSpeed;

        let currentOpacity = this.isTemporary ? this.life : this.opacity;

        // Apply twinkle pulsation to non-temporary particles
        if (!this.isTemporary) {
            const twinkle = (Math.sin(this.twinklePhase) + 1) / 2; // 0 to 1
            currentOpacity *= (0.6 + twinkle * 0.4); // Modulate opacity between 60% and 100% of base
        }

        let currentGlow = 4;

        // --- CURSOR AURA ENHANCEMENT ---
        if (pMouse.x !== null && !this.isTemporary) {
            let dx = pMouse.x - this.x;
            let dy = pMouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // If near mouse, boost brightness and glow
            if (distance < pMouse.radius + 50) {
                let auraStrength = 1 - (distance / (pMouse.radius + 50));
                auraStrength = Math.max(0, auraStrength);

                // Boost opacity towards 1.0 and increase glow
                currentOpacity = Math.min(1.0, currentOpacity + auraStrength * 0.6);
                currentGlow = 4 + auraStrength * 12;
            }
        }

        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fillStyle = `${this.colorBase}${currentOpacity})`;

        if (!this.isTemporary) {
            pCtx.shadowBlur = currentGlow;
            pCtx.shadowColor = `${this.colorBase}0.8)`;
        } else {
            pCtx.shadowBlur = 0;
        }

        pCtx.fill();
        pCtx.closePath();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Teleport from edges for continuous field feel
        const margin = 20;
        if (this.x < -margin) this.x = pCanvas.width + margin;
        if (this.x > pCanvas.width + margin) this.x = -margin;
        if (this.y < -margin) this.y = pCanvas.height + margin;
        if (this.y > pCanvas.height + margin) this.y = -margin;

        // Anti-Gravity Repulsion
        if (pMouse.x !== null) {
            let dx = pMouse.x - this.x;
            let dy = pMouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < pMouse.radius) {
                let force = (pMouse.radius - distance) / pMouse.radius;
                let directionX = dx / distance;
                let directionY = dy / distance;

                // Repel away from cursor
                this.vx -= directionX * force * 0.8;
                this.vy -= directionY * force * 0.8;
            }
        }

        // Return to drift velocity
        if (!this.isTemporary) {
            this.vx += (this.initialVx - this.vx) * 0.03;
            this.vy += (this.initialVy - this.vy) * 0.03;
        } else {
            this.life -= 0.02;
            this.vx *= 0.96;
            this.vy *= 0.96;
            this.size *= 0.98;
        }
    }
}

function createExplosion(x, y) {
    const burstCount = 25;
    for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        const color = pColors[Math.floor(Math.random() * pColors.length)];
        particles.push(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, Math.random() * 1.5 + 1.2, color, true));
    }
}

function drawBackgroundAtmosphere() {
    // Soft Blue Edge Vignette to mimic Antigravity.google
    const gradient = pCtx.createRadialGradient(
        pCanvas.width / 2, pCanvas.height / 2, 0,
        pCanvas.width / 2, pCanvas.height / 2, pCanvas.width * 0.8
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(66, 133, 244, 0.04)');

    pCtx.fillStyle = gradient;
    pCtx.fillRect(0, 0, pCanvas.width, pCanvas.height);
}

function initParticles() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
    particles = [];

    // Dense starfield: 600-800 particles
    const count = Math.min(800, Math.max(600, Math.floor((pCanvas.width * pCanvas.height) / 3200)));

    for (let i = 0; i < count; i++) {
        const size = Math.random() * 1.2 + 0.6; // Tiny 0.6 - 1.8px
        const color = pColors[Math.floor(Math.random() * pColors.length)];
        const vx = (Math.random() - 0.5) * 0.45;
        const vy = (Math.random() - 0.5) * 0.45;
        particles.push(new Particle(Math.random() * pCanvas.width, Math.random() * pCanvas.height, vx, vy, size, color));
    }
}

function animateParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);

    drawBackgroundAtmosphere();

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].isTemporary && (particles[i].life <= 0 || particles[i].size <= 0.2)) {
            particles.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(animateParticles);
}

// Resizing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initParticles();
    }, 250);
});

// Initialization
initParticles();
animateParticles();
