// scripts/getdates.js

// Dynamically set the current year
document.getElementById("currentyear").textContent = new Date().getFullYear();

// Dynamically set the last modified date of the document
document.getElementById("lastModified").textContent = 
    "Last Modified: " + document.lastModified;
