/**
 * ==========================================================================
 * Ummay Maimona Chaman - Research Portfolio Core Logic
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Particle Backdrop Canvas Animation
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        // Resize handler
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off boundaries
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                const isDark = document.body.classList.contains('dark-theme');
                ctx.fillStyle = isDark ? 'rgba(124, 58, 237, 0.4)' : 'rgba(124, 58, 237, 0.15)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 16000);
            for (let i = 0; i < Math.min(particleCount, 80); i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const isDark = document.body.classList.contains('dark-theme');
            const connectionColor = isDark ? 'rgba(6, 182, 212, 0.04)' : 'rgba(6, 182, 212, 0.05)';
            const maxDistance = 120;

            // Update and draw connections
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        ctx.strokeStyle = connectionColor;
                        ctx.lineWidth = 0.5 * (1 - dist / maxDistance);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animateParticles();
    }

    // ----------------------------------------------------------------------
    // 2. Dynamic Project & Publication Filtering
    // ----------------------------------------------------------------------
    setupFilters('.project-filter-btn', '.project-card');
    setupFilters('.pub-filter-btn', '.pub-card');

    function setupFilters(buttonSelector, cardSelector) {
        const buttons = document.querySelectorAll(buttonSelector);
        const cards = document.querySelectorAll(cardSelector);

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Set active button
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                cards.forEach(card => {
                    const categories = card.getAttribute('data-category') || card.getAttribute('data-category') === '' 
                        ? card.getAttribute('data-category').split(' ') 
                        : [card.getAttribute('data-category')];
                    
                    const isDirectMatch = filterValue === 'all' || categories.includes(filterValue);
                    const isPubMatch = cardSelector === '.pub-card' && (filterValue === 'all' || card.getAttribute('data-category') === filterValue);
                    
                    if (isDirectMatch || isPubMatch) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ----------------------------------------------------------------------
    // 3. Technical Skills Panel Switcher
    // ----------------------------------------------------------------------
    const skillTabs = document.querySelectorAll('.skills-tab-btn');
    const skillPanels = document.querySelectorAll('.skills-panel');

    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetId = tab.getAttribute('data-tab');
            skillPanels.forEach(panel => {
                if (panel.id === targetId) {
                    panel.classList.add('active');
                    // Reset and re-trigger progress fill animation
                    const fills = panel.querySelectorAll('.skill-fill');
                    fills.forEach(fill => {
                        const originalWidth = fill.style.width;
                        fill.style.transform = 'scaleX(0)';
                        setTimeout(() => {
                            fill.style.transform = 'scaleX(1)';
                        }, 50);
                    });
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });

    // ----------------------------------------------------------------------
    // 4. Contact Card 3D Tilt Micro-interaction
    // ----------------------------------------------------------------------
    const tiltCard = document.getElementById('interactive-card');
    if (tiltCard) {
        tiltCard.addEventListener('mousemove', (e) => {
            const rect = tiltCard.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within element
            const y = e.clientY - rect.top;  // y position within element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 10; // Max tilt 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            tiltCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            
            // Adjust glowing pointer light
            const glow = tiltCard.querySelector('.card-glow');
            if (glow) {
                glow.style.left = `${x - 150}px`;
                glow.style.top = `${y - 150}px`;
                glow.style.background = 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 60%)';
            }
        });

        tiltCard.addEventListener('mouseleave', () => {
            tiltCard.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
            const glow = tiltCard.querySelector('.card-glow');
            if (glow) {
                glow.style.left = '-50px';
                glow.style.top = '-50px';
                glow.style.background = 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)';
            }
        });
    }

    // ----------------------------------------------------------------------
    // 5. Stat Counter Animation
    // ----------------------------------------------------------------------
    const statsSection = document.querySelector('.hero-stats');
    let countersAnimated = false;

    function animateCounters() {
        const counters = [
            { id: 'stat-pubs', target: 3, decimals: 0, suffix: '+' },
            { id: 'stat-projects', target: 15, decimals: 0, suffix: '' }
        ];

        counters.forEach(counter => {
            const element = document.getElementById(counter.id);
            if (!element) return;

            let current = 0;
            const step = counter.target / (2000 / 60); // 2 seconds animation at 60fps

            function updateCounter() {
                current += step;
                if (current >= counter.target) {
                    element.textContent = counter.target.toFixed(counter.decimals) + counter.suffix;
                } else {
                    element.textContent = current.toFixed(counter.decimals) + counter.suffix;
                    requestAnimationFrame(updateCounter);
                }
            }
            updateCounter();
        });
    }

    // Trigger counters when stats section enters viewport
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    animateCounters();
                    countersAnimated = true;
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }

    // ----------------------------------------------------------------------
    // 6. Navigation Link Scroll Spy & Hamburger Toggle
    // ----------------------------------------------------------------------
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    function scrollActive() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
    window.addEventListener('scroll', scrollActive);

    // Hamburger Mobile Toggle
    const navToggle = document.getElementById('nav-toggle-btn');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }

    // ----------------------------------------------------------------------
    // 7. Light / Dark Theme Toggle
    // ----------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        // Check saved preference
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme === 'light') {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            updateThemeIcon(true);
        } else {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            updateThemeIcon(false);
        }

        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.body.classList.contains('light-theme');
            if (isLight) {
                document.body.classList.remove('light-theme');
                document.body.classList.add('dark-theme');
                localStorage.setItem('portfolio-theme', 'dark');
                updateThemeIcon(false);
            } else {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
                localStorage.setItem('portfolio-theme', 'light');
                updateThemeIcon(true);
            }
        });
    }

    function updateThemeIcon(isLight) {
        const icon = themeToggleBtn.querySelector('i');
        if (icon) {
            if (isLight) {
                icon.className = 'fa-solid fa-moon';
            } else {
                icon.className = 'fa-solid fa-sun';
            }
        }
    }
});
