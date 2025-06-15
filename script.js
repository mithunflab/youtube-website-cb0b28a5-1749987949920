// Professional website JavaScript functionality
console.log('Professional website loaded successfully!');

// YouTube data integration
let youtubeData = null;

// Initialize website functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded - initializing website');
    loadYouTubeData();
    setupNavigation();
    setupAnimations();
});

// Load YouTube channel data
async function loadYouTubeData() {
    try {
        console.log('Loading YouTube data...');
        const response = await fetch('yticon.json');
        youtubeData = await response.json();
        console.log('YouTube data loaded:', youtubeData);
        renderVideos();
    } catch (error) {
        console.error('Failed to load YouTube data:', error);
        renderFallbackContent();
    }
}

// Render video content dynamically
function renderVideos() {
    const videoGrid = document.getElementById('video-grid');
    if (!videoGrid || !youtubeData) return;

    const videos = youtubeData.channel?.videos || [];
    
    if (videos.length === 0) {
        videoGrid.innerHTML = '<p>Latest videos coming soon...</p>';
        return;
    }

    videoGrid.innerHTML = videos.map(video => `
        <div class="video-card">
            <img src="${video.thumbnail}" alt="${video.title}" loading="lazy" style="width: 100%; height: 200px; object-fit: cover;">
            <div style="padding: 1rem;">
                <h4 style="margin-bottom: 0.5rem; font-weight: bold;">${video.title}</h4>
                <p style="color: #666; font-size: 0.9rem;">${formatViewCount(video.viewCount)} views • ${formatDate(video.publishedAt)}</p>
                <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank" 
                   style="display: inline-block; background: #FF0000; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 5px; margin-top: 0.5rem;">
                    ▶️ Watch Now
                </a>
            </div>
        </div>
    `).join('');
}

// Render fallback content when data loading fails
function renderFallbackContent() {
    const videoGrid = document.getElementById('video-grid');
    if (!videoGrid) return;
    
    videoGrid.innerHTML = `
        <div class="video-card">
            <div style="height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
                <p>Latest videos will appear here soon!</p>
            </div>
        </div>
    `;
}

// Setup smooth navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup scroll animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll('.about, .videos, .contact');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Utility function to format view count
function formatViewCount(count) {
    const num = parseInt(count || '0');
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Update data periodically
setInterval(loadYouTubeData, 5 * 60 * 1000); // Update every 5 minutes