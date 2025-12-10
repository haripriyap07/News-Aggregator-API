// Alert auto-hide
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });
});

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password && password.length >= 6;
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// API helper functions
async function saveArticle(data) {
    try {
        const response = await fetch('/saved/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            alert('Article saved successfully!');
            return true;
        } else {
            alert(result.message || 'Error saving article');
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving article');
        return false;
    }
}

async function deleteArticle(articleId) {
    if (confirm('Are you sure you want to delete this article?')) {
        try {
            const response = await fetch(`/saved/${articleId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Article deleted successfully!');
                location.reload();
            } else {
                alert('Error deleting article');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting article');
        }
    }
}

async function addComment(articleUrl, commentText) {
    try {
        const response = await fetch('/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                articleUrl: articleUrl,
                text: commentText
            })
        });
        const result = await response.json();
        if (response.ok) {
            alert('Comment added successfully!');
            return true;
        } else {
            alert(result.message || 'Error adding comment');
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding comment');
        return false;
    }
}

async function deleteComment(commentId) {
    if (confirm('Are you sure you want to delete this comment?')) {
        try {
            const response = await fetch(`/comments/${commentId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Comment deleted successfully!');
                location.reload();
            } else {
                alert('Error deleting comment');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting comment');
        }
    }
}

// Debounce function
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Throttle function
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            func(...args);
            lastCall = now;
        }
    };
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Error copying to clipboard:', err);
    });
}

// Logout confirmation
function confirmLogout() {
    return confirm('Are you sure you want to logout?');
}

// Loading spinner
function showLoader(element) {
    element.innerHTML = '<div class="spinner">Loading...</div>';
}

function hideLoader(element) {
    element.innerHTML = '';
}
