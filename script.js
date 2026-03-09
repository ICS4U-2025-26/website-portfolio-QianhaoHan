// ===== Theme Toggle =====
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// ===== Mobile Menu Toggle =====
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.getElementById('main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
  });

  // Close menu when clicking on a link
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mainNav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== Smooth Scroll for Anchor Links =====
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

// ===== Dino Runner Game (Gaming Corner) =====
const dinoGame = {
  canvas: null,
  ctx: null,
  dino: { x: 50, y: 100, width: 40, height: 50, velocityY: 0, isJumping: false },
  cacti: [],
  ground: 130,
  gravity: 0.8,
  jumpForce: -14,
  gameSpeed: 5,
  score: 0,
  highScore: parseInt(localStorage.getItem('dinoHighScore')) || 0,
  isRunning: false,
  animationId: null,
  frameCount: 0,
  
  init() {
    this.canvas = document.getElementById('dino-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.updateHighScoreDisplay();
    
    // Event listeners
    document.getElementById('start-dino')?.addEventListener('click', () => this.start());
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.canvas) {
        e.preventDefault();
        if (!this.isRunning) this.start();
        else this.jump();
      }
    });
    this.canvas.addEventListener('click', () => {
      if (!this.isRunning) this.start();
      else this.jump();
    });
    
    this.drawStartScreen();
  },
  
  drawStartScreen() {
    this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--surface') || '#f8fafc';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Ground line
    this.ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#1e293b';
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.ground + 20);
    this.ctx.lineTo(this.canvas.width, this.ground + 20);
    this.ctx.stroke();
    
    // Draw dino
    this.drawDino(this.dino.x, this.ground - this.dino.height);
    
    // Start text
    this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#1e293b';
    this.ctx.font = 'bold 16px system-ui, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Press SPACE or Click to Start', this.canvas.width / 2, 70);
  },
  
  start() {
    this.dino.y = this.ground - this.dino.height;
    this.dino.velocityY = 0;
    this.dino.isJumping = false;
    this.cacti = [];
    this.score = 0;
    this.gameSpeed = 5;
    this.frameCount = 0;
    this.isRunning = true;
    
    document.getElementById('dino-message').textContent = 'Press SPACE or tap to jump';
    document.getElementById('dino-score').textContent = '0';
    
    this.gameLoop();
  },
  
  jump() {
    if (!this.dino.isJumping) {
      this.dino.velocityY = this.jumpForce;
      this.dino.isJumping = true;
    }
  },
  
  gameLoop() {
    if (!this.isRunning) return;
    
    this.update();
    this.draw();
    
    this.animationId = requestAnimationFrame(() => this.gameLoop());
  },
  
  update() {
    this.frameCount++;
    
    // Update dino position
    this.dino.velocityY += this.gravity;
    this.dino.y += this.dino.velocityY;
    
    // Ground collision
    if (this.dino.y >= this.ground - this.dino.height) {
      this.dino.y = this.ground - this.dino.height;
      this.dino.velocityY = 0;
      this.dino.isJumping = false;
    }
    
    // Spawn cacti
    if (this.frameCount % Math.max(60, 100 - this.score / 10) === 0) {
      const minGap = 200;
      const lastCactus = this.cacti[this.cacti.length - 1];
      if (!lastCactus || this.canvas.width - lastCactus.x > minGap) {
        this.cacti.push({
          x: this.canvas.width,
          y: this.ground - 30,
          width: 20,
          height: 30 + Math.random() * 20
        });
      }
    }
    
    // Update cacti
    this.cacti.forEach(cactus => {
      cactus.x -= this.gameSpeed;
    });
    
    // Remove off-screen cacti
    this.cacti = this.cacti.filter(c => c.x > -c.width);
    
    // Check collisions
    for (const cactus of this.cacti) {
      if (this.checkCollision(this.dino, cactus)) {
        this.gameOver();
        return;
      }
    }
    
    // Update score
    this.score++;
    if (this.score % 10 === 0) {
      document.getElementById('dino-score').textContent = Math.floor(this.score / 10);
    }
    
    // Increase speed over time
    if (this.score % 500 === 0) {
      this.gameSpeed += 0.5;
    }
  },
  
  checkCollision(dino, cactus) {
    const padding = 5;
    return dino.x + padding < cactus.x + cactus.width &&
           dino.x + dino.width - padding > cactus.x &&
           dino.y + padding < cactus.y + cactus.height &&
           dino.y + dino.height - padding > cactus.y;
  },
  
  draw() {
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#1e293b';
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--surface') || '#f8fafc';
    
    // Clear canvas
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw ground
    this.ctx.strokeStyle = textColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.ground + 20);
    this.ctx.lineTo(this.canvas.width, this.ground + 20);
    this.ctx.stroke();
    
    // Draw dino
    this.drawDino(this.dino.x, this.dino.y);
    
    // Draw cacti
    this.cacti.forEach(cactus => {
      this.drawCactus(cactus);
    });
  },
  
  drawDino(x, y) {
    const ctx = this.ctx;
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#1e293b';
    
    ctx.fillStyle = textColor;
    
    // Body
    ctx.fillRect(x + 10, y + 15, 25, 25);
    
    // Head
    ctx.fillRect(x + 20, y, 20, 20);
    
    // Eye
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--surface') || '#f8fafc';
    ctx.fillRect(x + 32, y + 5, 4, 4);
    
    ctx.fillStyle = textColor;
    
    // Tail
    ctx.fillRect(x, y + 20, 15, 8);
    
    // Legs (animated)
    if (this.isRunning && !this.dino.isJumping) {
      if (Math.floor(this.frameCount / 5) % 2 === 0) {
        ctx.fillRect(x + 15, y + 40, 6, 10);
        ctx.fillRect(x + 28, y + 38, 6, 12);
      } else {
        ctx.fillRect(x + 15, y + 38, 6, 12);
        ctx.fillRect(x + 28, y + 40, 6, 10);
      }
    } else {
      ctx.fillRect(x + 15, y + 40, 6, 10);
      ctx.fillRect(x + 28, y + 40, 6, 10);
    }
    
    // Arms
    ctx.fillRect(x + 30, y + 20, 8, 4);
  },
  
  drawCactus(cactus) {
    const ctx = this.ctx;
    ctx.fillStyle = '#22c55e';
    
    // Main stem
    ctx.fillRect(cactus.x + 5, cactus.y, 10, cactus.height);
    
    // Arms
    ctx.fillRect(cactus.x, cactus.y + 10, 8, 6);
    ctx.fillRect(cactus.x, cactus.y + 5, 4, 11);
    ctx.fillRect(cactus.x + 12, cactus.y + 15, 8, 6);
    ctx.fillRect(cactus.x + 16, cactus.y + 10, 4, 11);
  },
  
  gameOver() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationId);
    
    const finalScore = Math.floor(this.score / 10);
    
    if (finalScore > this.highScore) {
      this.highScore = finalScore;
      localStorage.setItem('dinoHighScore', this.highScore);
      this.updateHighScoreDisplay();
      document.getElementById('dino-message').textContent = `Game Over! New High Score: ${finalScore}!`;
    } else {
      document.getElementById('dino-message').textContent = `Game Over! Score: ${finalScore}. Press SPACE to play again.`;
    }
    
    // Draw game over text
    this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#1e293b';
    this.ctx.font = 'bold 20px system-ui, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, 60);
    this.ctx.font = '14px system-ui, sans-serif';
    this.ctx.fillText('Press SPACE or Click to Restart', this.canvas.width / 2, 85);
  },
  
  updateHighScoreDisplay() {
    const el = document.getElementById('dino-high-score');
    if (el) el.textContent = this.highScore;
  }
};

// Initialize dino game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  dinoGame.init();
});

// ===== Image Gallery Lightbox (for project screenshots) =====
function initLightbox() {
  const images = document.querySelectorAll('.project-section img, .lightbox-enabled');
  
  images.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      openLightbox(img.src, img.alt);
    });
  });
}

function openLightbox(src, alt) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
      <img src="${src}" alt="${alt}">
      <p>${alt}</p>
    </div>
  `;
  
  lightbox.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
  `;
  
  const content = lightbox.querySelector('.lightbox-content');
  content.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    text-align: center;
  `;
  
  const closeBtn = lightbox.querySelector('.lightbox-close');
  closeBtn.style.cssText = `
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
  `;
  
  const lightboxImg = lightbox.querySelector('img');
  lightboxImg.style.cssText = `
    max-width: 100%;
    max-height: 80vh;
    border-radius: 8px;
  `;
  
  const caption = lightbox.querySelector('p');
  caption.style.cssText = `
    color: white;
    margin-top: 1rem;
  `;
  
  document.body.appendChild(lightbox);
  
  // Close on click outside or close button
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === closeBtn) {
      lightbox.remove();
    }
  });
  
  // Close on escape key
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      lightbox.remove();
      document.removeEventListener('keydown', escHandler);
    }
  });
}

// Initialize lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', initLightbox);

// ===== Active Navigation Highlighting =====
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkPath = link.getAttribute('href');
    
    // Check if current page matches the link
    if (currentPath.endsWith(linkPath) || 
        (currentPath.endsWith('/') && linkPath === 'index.html') ||
        (currentPath.includes('/projects/') && linkPath.includes('projects/'))) {
      link.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', setActiveNavLink);
