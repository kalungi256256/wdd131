 // JavaScript functionality (temples.js)
        
        // Menu toggle functionality
        const menuToggle = document.getElementById('menuToggle');
        const navigation = document.getElementById('navigation');

        menuToggle.addEventListener('click', function() {
            navigation.classList.toggle('active');
            // Change hamburger to X when menu is open
            if (navigation.classList.contains('active')) {
                menuToggle.textContent = 'Exit';
            } else {
                menuToggle.textContent = '☰';
            }
        });

        // Temple filtering functionality
        const filterLinks = document.querySelectorAll('nav a[data-filter]');
        const temples = document.querySelectorAll('figure[data-category]');

        filterLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const filter = this.getAttribute('data-filter');
                
                // Remove active class from all links
                filterLinks.forEach(l => l.style.backgroundColor = '');
                
                // Add active styling to clicked link
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                
                // Filter temples
                temples.forEach(temple => {
                    if (filter === 'all') {
                        temple.style.display = 'block';
                    } else {
                        const categories = temple.getAttribute('data-category').split(' ');
                        if (categories.includes(filter)) {
                            temple.style.display = 'block';
                        } else {
                            temple.style.display = 'none';
                        }
                    }
                });
                
                // Close mobile menu after selection
                if (window.innerWidth < 768) {
                    navigation.classList.remove('active');
                    menuToggle.textContent = '☰';
                }
            });
        });

        // Footer dynamic content
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        document.getElementById('lastModified').textContent = document.lastModified;

        // Close mobile menu when window is resized to larger screen
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768) {
                navigation.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });

        // Set Home as default active filter
        document.querySelector('nav a[data-filter="all"]').style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    