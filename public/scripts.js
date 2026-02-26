// Dropdown menu functionality for mobile
document.addEventListener('DOMContentLoaded', function() {
    const dropbtns = document.querySelectorAll('.dropbtn');
    const dropdowns = document.querySelectorAll('.dropdown-content');

    dropbtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            const dropdownContent = this.nextElementSibling;
            // Close other dropdowns
            dropdowns.forEach(content => {
                if (content !== dropdownContent) {
                    content.classList.remove('show');
                }
            });
            dropdownContent.classList.toggle('show');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            dropdowns.forEach(content => content.classList.remove('show'));
        }
    });

    // Close dropdown when a link is clicked
    dropdowns.forEach(content => {
        content.addEventListener('click', function() {
            this.classList.remove('show');
        });
    });
});