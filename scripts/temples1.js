document.addEventListener("DOMContentLoaded", () => {
    const templeGrid = document.getElementById("templeGrid");
    const buttons = document.querySelectorAll("nav button");
    const figures = templeGrid.querySelectorAll("figure");

    // Filter temples based on button click
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            // Highlight active button
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.id; // home, old, new, large, small

            figures.forEach(figure => {
                const category = figure.dataset.category;
                if (filter === "home") {
                    figure.style.display = "block";
                } else {
                    figure.style.display = category.includes(filter) ? "block" : "none";
                }
            });
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mainNav = document.getElementById("main-nav");
    mobileMenuBtn.addEventListener("click", () => {
        mainNav.classList.toggle("open");
    });

    // Close menu when a nav button is clicked (mobile)
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            if (mainNav.classList.contains("open")) {
                mainNav.classList.remove("open");
            }
        });
    });

    // Footer dynamic info
    document.getElementById("copyright-year").textContent = new Date().getFullYear();
    document.getElementById("last-modified").textContent = document.lastModified;
});
