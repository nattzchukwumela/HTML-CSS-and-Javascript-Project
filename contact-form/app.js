// Get form and success message elements
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// Form validation and submission
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset error messages
    hideAllErrors();
    
    // Get form fields
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    // Validate form fields
    let isValid = true;
    
    // Name validation
    if (!name.value.trim()) {
        showError('nameError');
        isValid = false;
    }
    
    // Email validation
    if (!isValidEmail(email.value)) {
        showError('emailError');
        isValid = false;
    }
    
    // Subject validation
    if (!subject.value.trim()) {
        showError('subjectError');
        isValid = false;
    }
    
    // Message validation
    if (!message.value.trim()) {
        showError('messageError');
        isValid = false;
    }
    
    // If form is valid, submit it
    if (isValid) {
        // Here you would typically send the form data to a server
        // For demo purposes, we'll just show the success message
        contactForm.reset();
        successMessage.style.display = 'block';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
});

// Email validation helper function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error message helper function
function showError(errorId) {
    document.getElementById(errorId).style.display = 'block';
}

// Hide all error messages helper function
function hideAllErrors() {
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => error.style.display = 'none');
}