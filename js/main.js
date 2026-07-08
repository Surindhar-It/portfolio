/* ==========================================================================
   Cyberpunk Purple Portfolio Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    /* --- Theme Manager --- */
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Set initial theme
    if (savedTheme === 'light') {
        document.body.removeAttribute('class');
        document.body.setAttribute('data-theme', 'light');
    } else {
        document.body.className = 'dark-theme';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.body.removeAttribute('data-theme');
            document.body.className = 'dark-theme';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.removeAttribute('class');
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });


    /* --- Mobile Menu Drawer --- */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close menu when links are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });


    /* --- Scroll Progress Tracker --- */
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    });


    /* --- Lag-Following Custom Cursor --- */
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant inner dot placement
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Lerp (Linear Interpolation) loop for outer ring lag effect
    function animateCursor() {
        const delay = 0.15; // Speed multiplier (lag amount)
        
        cursorX += (mouseX - cursorX) * delay;
        cursorY += (mouseY - cursorY) * delay;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover Morph Events for custom cursor
    const hovers = document.querySelectorAll('.cursor-hover');
    hovers.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
        });
    });


    /* --- Hero Section Typewriter Glitch Effect --- */
    const textTarget = document.getElementById('typewriter');
    const professions = ['a Software Engineer', 'a Java Developer', 'a Problem Solver', 'an IT Student'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function handleTypewriter() {
        const currentWord = professions[wordIndex];
        
        if (isDeleting) {
            textTarget.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            textTarget.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Natural typing speed
        }

        // Handle states
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % professions.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(handleTypewriter, typingSpeed);
    }
    
    if (textTarget) {
        handleTypewriter();
    }


    /* --- Project Filters --- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active state from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Add fade out animation first, then toggle displays
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide');
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });


    /* --- Project Modals Manager --- */
    const openModalButtons = document.querySelectorAll('.open-modal');
    const closeModalButtons = document.querySelectorAll('.modal-close');
    const modals = document.querySelectorAll('.modal-overlay');

    openModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                targetModal.classList.add('open');
                document.body.style.overflow = 'hidden'; // Lock background scroll
            }
        });
    });

    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const openModal = btn.closest('.modal-overlay');
            if (openModal) {
                openModal.classList.remove('open');
                document.body.style.overflow = 'auto'; // Unlock scroll
            }
        });
    });

    // Close modal if background is clicked
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
                document.body.style.overflow = 'auto';
            }
        });
    });


    /* --- Scroll reveal & Skill meter expansion --- */
    const revealItems = document.querySelectorAll('.reveal-item');
    const skillProgressBars = document.querySelectorAll('.skill-progress-bar');
    
    // Intersection Observer for fade-in reveals
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // Intersection Observer for animated skill bars
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetBar = entry.target;
                const widthValue = targetBar.getAttribute('data-width');
                targetBar.style.width = widthValue;
                observer.unobserve(targetBar);
            }
        });
    }, {
        threshold: 0.1
    });

    skillProgressBars.forEach(bar => {
        skillObserver.observe(bar);
    });


    /* --- Active Navigation Link Update on Scroll --- */
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollOffset = 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - scrollOffset)) {
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


    /* --- Contact Form Live Validation & Submission --- */
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');
    const submitBtn = contactForm.querySelector('.btn-submit');

    // Validation handler helper
    function validateField(inputElement) {
        const formGroup = inputElement.parentElement;
        let isValid = true;

        if (inputElement.required && !inputElement.value.trim()) {
            isValid = false;
        } else if (inputElement.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(inputElement.value.trim());
        }

        if (isValid) {
            formGroup.classList.remove('invalid');
        } else {
            formGroup.classList.add('invalid');
        }

        return isValid;
    }

    // Add live check events on input fields
    const inputs = contactForm.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.parentElement.classList.contains('invalid')) {
                validateField(input);
            }
        });
    });

    // Form submit listener
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        
        inputs.forEach(input => {
            const isFieldValid = validateField(input);
            if (!isFieldValid) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Set loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simulate broadcast transmission wait (1.5s)
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Show success response banner
                successMsg.style.display = 'flex';
                contactForm.reset();
                
                // Clear any floating labels classes by resetting state
                inputs.forEach(input => {
                    input.parentElement.classList.remove('invalid');
                });

                // Auto hide message banner after 5 seconds
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 5000);
            }, 1500);
        }
    });
});
