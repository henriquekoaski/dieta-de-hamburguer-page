// Main JavaScript file for Dieta de Hambúrguer Landing Page
// Author: [Seu Nome]
// Version: 1.0.0

document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  const yearElement = document.getElementById('y');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Initialize all components
  initParallax();
  initFAQ();
  initVideoControls();
  initSmoothScroll();
});

// Parallax effect for hero section (desktop only)
function initParallax() {
  function updateParallax() {
    // Only apply parallax on desktop devices
    if (window.innerWidth <= 768) return;
    
    const heroSection = document.querySelector('.fullscreen-section');
    const heroBg = document.querySelector('.section-bg');
    
    if (heroSection && heroBg) {
      const rect = heroSection.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      // Only apply parallax when hero section is visible
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        heroBg.style.transform = `translateY(${rate}px)`;
      }
    }
  }
  
  // Throttle scroll events for better performance
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  function handleScroll() {
    ticking = false;
    requestTick();
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Reset parallax on window resize
  window.addEventListener('resize', () => {
    const heroBg = document.querySelector('.section-bg');
    if (heroBg && window.innerWidth <= 768) {
      heroBg.style.transform = 'none';
    }
  });
}

// FAQ Toggle functionality
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains('active');
      
      // Close all FAQ items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Open clicked item if it wasn't active
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });
}

// Custom Video Play/Pause Control
function initVideoControls() {
  const video = document.querySelector('.hero-video-iframe');
  const playButton = document.getElementById('customPlayButton');
  const progressFill = document.getElementById('progressFill');
  let userInteracted = false;
  let autoplayAttempted = false;
  
  if (video && playButton && progressFill) {
    // Remove all native controls programmatically
    video.removeAttribute('controls');
    video.controls = false;
    
    // Function to update button state
    function updateButtonState() {
      if (video.paused || video.ended) {
        playButton.classList.remove('hidden', 'playing');
        playButton.querySelector('.play-icon').style.display = 'block';
      } else {
        playButton.classList.add('hidden', 'playing');
        playButton.querySelector('.play-icon').style.display = 'none';
      }
    }
    
    // Function to attempt autoplay
    function attemptAutoplay() {
      if (autoplayAttempted) return;
      autoplayAttempted = true;
      
      // For mobile, start muted for better autoplay success
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        // Mobile strategy: start muted, then unmute
        video.muted = true;
        video.play().then(() => {
          console.log('Mobile autoplay muted successful');
          // Unmute after a short delay
          setTimeout(() => {
            video.muted = false;
            console.log('Mobile video unmuted');
          }, 500);
        }).catch((error) => {
          console.log('Mobile autoplay failed, trying with sound:', error);
          // If muted fails, try with sound
          video.muted = false;
          video.play().then(() => {
            console.log('Mobile autoplay with sound successful');
          }).catch((error) => {
            console.log('Mobile autoplay failed completely:', error);
            // Show play button if autoplay fails
            playButton.classList.remove('hidden');
          });
        });
      } else {
        // Desktop strategy: try with sound first
        video.muted = false;
        video.play().then(() => {
          console.log('Desktop autoplay with sound successful');
        }).catch((error) => {
          console.log('Desktop autoplay with sound failed, trying muted:', error);
          // If autoplay with sound fails, try muted
          video.muted = true;
          video.play().then(() => {
            console.log('Desktop autoplay muted successful');
            // Unmute after a short delay
            setTimeout(() => {
              video.muted = false;
            }, 1000);
          }).catch((error) => {
            console.log('Desktop autoplay failed completely:', error);
            // Show play button if autoplay fails
            playButton.classList.remove('hidden');
          });
        });
      }
    }
    
    // Function to handle user interaction
    function handleUserInteraction() {
      if (!userInteracted) {
        userInteracted = true;
        if (video.paused) {
          video.muted = false;
          video.play().catch(console.log);
        }
      }
    }
    
    // Function to update progress bar with marketing effect
    function updateProgress() {
      if (video.duration) {
        const currentTime = video.currentTime;
        const duration = video.duration;
        const realProgress = (currentTime / duration) * 100;
        
        // Marketing effect: show faster progress than real time
        let marketingProgress;
        if (realProgress < 25) {
          // First 25% of video: show 50% progress (2x faster)
          marketingProgress = realProgress * 2;
        } else if (realProgress < 60) {
          // 25-60% of video: show 50-85% progress (1.4x faster)
          marketingProgress = 50 + (realProgress - 25) * 1.4;
        } else if (realProgress < 90) {
          // 60-90% of video: show 85-95% progress (slower)
          marketingProgress = 85 + (realProgress - 60) * 0.33;
        } else {
          // 90-100% of video: show 95-100% progress (sync with end)
          marketingProgress = 95 + (realProgress - 90) * 0.5;
        }
        
        // Ensure it reaches 100% when video ends
        if (realProgress >= 99.5) {
          marketingProgress = 100;
        }
        
        progressFill.style.width = marketingProgress + '%';
      }
    }
    
    // Click handler for custom button
    playButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      handleUserInteraction();
      
      if (video.paused) {
        // If video ended, restart from beginning
        if (video.ended) {
          video.currentTime = 0;
          progressFill.style.width = '0%';
        }
        video.muted = false;
        video.play();
      } else {
        video.pause();
      }
    });
    
    // Click handler for video (to show button when paused)
    video.addEventListener('click', function(e) {
      if (e.target === video) {
        handleUserInteraction();
        
        if (video.paused) {
          // If video ended, restart from beginning
          if (video.ended) {
            video.currentTime = 0;
            progressFill.style.width = '0%';
          }
          video.muted = false;
          video.play();
        } else {
          video.pause();
        }
        // Small delay to prevent icon flicker
        setTimeout(updateButtonState, 50);
      }
    });
    
    // Event listeners
    video.addEventListener('play', updateButtonState);
    video.addEventListener('pause', updateButtonState);
    video.addEventListener('ended', function() {
      updateButtonState();
      // Ensure progress bar reaches 100% when video ends
      progressFill.style.width = '100%';
    });
    
    // Progress bar event listeners
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', function() {
      progressFill.style.width = '0%';
    });
    video.addEventListener('pause', function() {
      // Keep progress bar at current position when paused
    });
    
    // Video ready to play
    video.addEventListener('canplay', function() {
      console.log('Video can play');
    });
    
    // Add user interaction listeners for the entire page
    const interactionEvents = ['click', 'touchstart', 'keydown', 'scroll'];
    interactionEvents.forEach(eventType => {
      document.addEventListener(eventType, handleUserInteraction, { once: true, passive: true });
    });
    
    // Attempt autoplay when video is ready
    video.addEventListener('loadeddata', attemptAutoplay);
    video.addEventListener('canplay', attemptAutoplay);
    video.addEventListener('loadedmetadata', attemptAutoplay);
    
    // Force autoplay attempt immediately and multiple times for mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Mobile: more aggressive autoplay attempts
      attemptAutoplay(); // Immediate attempt
      setTimeout(attemptAutoplay, 100); // Very quick retry
      setTimeout(attemptAutoplay, 300); // Quick retry
      setTimeout(attemptAutoplay, 500); // Medium retry
      setTimeout(attemptAutoplay, 1000); // Longer retry
    } else {
      // Desktop: standard attempts
      setTimeout(attemptAutoplay, 500);
    }
    
    // Additional autoplay attempts
    window.addEventListener('load', attemptAutoplay);
    document.addEventListener('DOMContentLoaded', attemptAutoplay);
    
    // Mobile-specific: try autoplay on any touch interaction
    if (isMobile) {
      const touchEvents = ['touchstart', 'touchend', 'touchmove'];
      touchEvents.forEach(eventType => {
        document.addEventListener(eventType, function() {
          if (!userInteracted) {
            attemptAutoplay();
          }
        }, { once: true, passive: true });
      });
    }
    
    // Fallback: try autoplay when user scrolls (common mobile interaction)
    let scrollAttempted = false;
    window.addEventListener('scroll', function() {
      if (!scrollAttempted && !userInteracted) {
        scrollAttempted = true;
        setTimeout(attemptAutoplay, 100);
      }
    }, { passive: true });
    
    // Initial state
    updateButtonState();
    
    // Continuously ensure controls are hidden
    setInterval(() => {
      if (video.controls) {
        video.controls = false;
        video.removeAttribute('controls');
      }
    }, 100);
  }
}


// Smooth scroll for anchor links and CTA buttons
function initSmoothScroll() {
  // Handle anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Custom smooth scroll function for CTA buttons
  window.smoothScrollToPreco = function() {
    console.log('smoothScrollToPreco called!');
    const precoSection = document.getElementById('preco');
    console.log('precoSection found:', precoSection);
    
    if (precoSection) {
      const targetPosition = precoSection.offsetTop - 50;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 800; // 0.8 seconds
      let start = null;

      function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }

      function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animation);
    } else {
      console.error('precoSection not found!');
    }
  };
}

// Initialize smooth scroll
initSmoothScroll();

