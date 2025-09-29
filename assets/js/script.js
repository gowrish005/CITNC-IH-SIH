let problemStatements = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 9; // Changed to 9 for better grid layout

// Mobile menu functionality with touch improvements
function initializeMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuIcon = mobileMenuBtn.querySelector("i");

  // Touch events for better mobile support
  let touchStartY = 0;
  let touchEndY = 0;

  mobileMenuBtn.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  });

  // Touch events for swipe gestures
  mobileMenu.addEventListener("touchstart", function(e) {
    touchStartY = e.touches[0].clientY;
  });

  mobileMenu.addEventListener("touchend", function(e) {
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
  });

  function toggleMenu() {
    const isMenuOpen = !mobileMenu.classList.contains("hidden");
    
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    mobileMenu.classList.remove("hidden");
    menuIcon.classList.remove("fa-bars");
    menuIcon.classList.add("fa-times");
    document.body.style.overflow = "hidden"; // Prevent background scroll
    
    // Add animation
    setTimeout(() => {
      mobileMenu.style.opacity = "1";
      mobileMenu.style.transform = "translateY(0)";
    }, 10);
  }

  function closeMenu() {
    mobileMenu.style.opacity = "0";
    mobileMenu.style.transform = "translateY(-10px)";
    
    setTimeout(() => {
      mobileMenu.classList.add("hidden");
      menuIcon.classList.remove("fa-times");
      menuIcon.classList.add("fa-bars");
      document.body.style.overflow = ""; // Restore scroll
    }, 200);
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchStartY - touchEndY;
    
    // Swipe up to close menu
    if (swipeDistance > swipeThreshold) {
      closeMenu();
    }
  }

  // Close menu when clicking on a link
  const mobileMenuLinks = mobileMenu.querySelectorAll("a");
  mobileMenuLinks.forEach(link => {
    link.addEventListener("click", function() {
      closeMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function(event) {
    if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
      closeMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Handle orientation change
  window.addEventListener("orientationchange", function() {
    setTimeout(() => {
      if (!mobileMenu.classList.contains("hidden")) {
        closeMenu();
      }
    }, 100);
  });

  // Initialize menu styles
  mobileMenu.style.transition = "opacity 0.2s ease, transform 0.2s ease";
  mobileMenu.style.opacity = "0";
  mobileMenu.style.transform = "translateY(-10px)";
}

// Create floating particles
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 20 + "s";
    particle.style.animationDuration = Math.random() * 10 + 10 + "s";
    particlesContainer.appendChild(particle);
  }
}

// Update scroll indicator
function updateScrollIndicator() {
  const scrollIndicator = document.getElementById("scrollIndicator");
  const scrollPercent =
    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollIndicator.style.width = scrollPercent + "%";
}

// Load PS.json data
async function loadProblemStatements() {
  try {
    const response = await fetch("./assets/data/PS.json");
    problemStatements = await response.json();
    filteredData = [...problemStatements];
    populateFilters();
    displayProblems();
    updatePagination();
    updateTotalCount();
  } catch (error) {
    console.error("Error loading problem statements:", error);
    // Fallback data for testing
    problemStatements = [
      {
        Statement_id: "SIH1524",
        Title: "Smart Resource Conservation in Home Appliances",
        Category: "Hardware",
        Theme: "Smart Resource Conservation",
        Description:
          "Innovating for Sustainability: Driving Smart Resource Conservation (Energy & Water) in Home Appliances",
        Department: "Godrej Appliances",
        Organisation: "Godrej Appliances",
      },
      {
        Statement_id: "SIH1525",
        Title: "Smart Education Platform",
        Category: "Software",
        Theme: "Smart Education",
        Description:
          "Smart Education, a Concept that Describes learning in digital age",
        Department: "AICTE",
        Organisation: "AICTE, MIC-Student Innovation",
      },
    ];
    filteredData = [...problemStatements];
    populateFilters();
    displayProblems();
    updatePagination();
    updateTotalCount();
  }
}

// Populate filter dropdowns with data from PS.json
function populateFilters() {
  const themes = [...new Set(problemStatements.map((ps) => ps.Theme))]
    .filter(Boolean)
    .sort();
  const organizations = [
    ...new Set(problemStatements.map((ps) => ps.Organisation)),
  ]
    .filter(Boolean)
    .sort();

  const themeFilter = document.getElementById("themeFilter");
  const organizationFilter = document.getElementById("organizationFilter");

  // Clear existing options (except first)
  themeFilter.innerHTML = '<option value="">All Themes</option>';
  organizationFilter.innerHTML = '<option value="">All Organizations</option>';

  themes.forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme;
    option.textContent = theme;
    themeFilter.appendChild(option);
  });

  organizations.forEach((org) => {
    const option = document.createElement("option");
    option.value = org;
    option.textContent = org;
    organizationFilter.appendChild(option);
  });
}

// Filter data based on search and filters
function filterData() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const categoryFilter = document.getElementById("categoryFilter").value;
  const themeFilter = document.getElementById("themeFilter").value;
  const organizationFilter =
    document.getElementById("organizationFilter").value;

  filteredData = problemStatements.filter((ps) => {
    const matchesSearch =
      ps.Title.toLowerCase().includes(searchTerm) ||
      ps.Description.toLowerCase().includes(searchTerm) ||
      ps.Statement_id.toLowerCase().includes(searchTerm);
    const matchesCategory = !categoryFilter || ps.Category === categoryFilter;
    const matchesTheme = !themeFilter || ps.Theme === themeFilter;
    const matchesOrganization =
      !organizationFilter || ps.Organisation === organizationFilter;

    return (
      matchesSearch && matchesCategory && matchesTheme && matchesOrganization
    );
  });

  currentPage = 1;
  displayProblems();
  updatePagination();
  updateTotalCount();
}

// Display problems in magical card layout
function displayProblems() {
  const problemsGrid = document.getElementById("problemsGrid");
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = filteredData.slice(startIndex, endIndex);

  problemsGrid.innerHTML = "";

  pageData.forEach((ps, index) => {
    const card = document.createElement("div");
    card.className = "problem-card rounded-2xl p-6 hover-glow cursor-pointer";
    card.style.animationDelay = `${index * 0.1}s`;

    const categoryColor =
      ps.Category === "Software"
        ? "from-green-400 to-green-600"
        : "from-orange-400 to-orange-600";
    const themeColors = [
      "from-purple-400 to-purple-600",
      "from-blue-400 to-blue-600",
      "from-pink-400 to-pink-600",
      "from-indigo-400 to-indigo-600",
      "from-teal-400 to-teal-600",
    ];
    const themeColor =
      themeColors[Math.abs(ps.Theme.charCodeAt(0)) % themeColors.length];

    card.innerHTML = `
                    <div class="flex flex-col h-full">
                        <div class="flex items-start justify-between mb-4">
                            <span class="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${categoryColor} text-white">
                                ${ps.Category}
                            </span>
                            <span class="text-xs text-gray-400 font-mono">${ps.Statement_id}</span>
                        </div>
                        
                        <h3 class="text-xl font-bold text-white mb-3 leading-tight">${ps.Title}</h3>
                        
                        <div class="theme-badge rounded-full px-3 py-1 mb-3 inline-block">
                            <span class="text-xs font-semibold text-purple-300">${ps.Theme}</span>
                        </div>
                        
                        <p class="text-gray-400 text-sm mb-4 flex-grow line-clamp-3">${ps.Description}</p>
                        
                        <div class="flex items-center justify-between mt-auto">
                            <div class="text-xs text-gray-500 flex items-center min-w-0 flex-1 mr-3">
                                <i class="fas fa-building mr-1 flex-shrink-0"></i>
                                <span class="truncate">${ps.Organisation}</span>
                            </div>
                            <button 
                                class="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-full text-white text-sm font-semibold hover:from-purple-600 hover:to-blue-600 transition flex-shrink-0"
                                onclick="openModal('${ps.Statement_id}')"
                            >
                                <i class="fas fa-eye mr-1"></i>
                                View Details
                            </button>
                        </div>
                    </div>
                `;

    problemsGrid.appendChild(card);
  });

  // Add fade-in animation
  problemsGrid.classList.add("opacity-0");
  setTimeout(() => {
    problemsGrid.classList.remove("opacity-0");
    problemsGrid.classList.add(
      "opacity-100",
      "transition-opacity",
      "duration-500"
    );
  }, 100);
}

// Open modal with enhanced problem statement details
function openModal(statementId) {
  const ps = problemStatements.find((p) => p.Statement_id === statementId);
  if (!ps) return;

  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
    <div class="space-y-8">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/20">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="text-sm font-bold px-4 py-2 rounded-full bg-gradient-to-r ${
                          ps.Category === "Software"
                            ? "from-green-400 to-green-600"
                            : "from-orange-400 to-orange-600"
                        } text-white shadow-lg">
                            <i class="fas ${ps.Category === "Software" ? "fa-code" : "fa-microchip"} mr-2"></i>
                            ${ps.Category}
                        </span>
                        <span class="text-xs text-gray-400 font-mono bg-slate-800 px-3 py-1 rounded-full border border-slate-600">
                            ID: ${ps.Statement_id}
                        </span>
                    </div>
                    <h4 class="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight break-words">${ps.Title}</h4>
                    <div class="theme-badge bg-gradient-to-r from-purple-600 to-blue-600 rounded-full px-4 py-2 inline-block">
                        <span class="text-sm font-semibold text-white">
                            <i class="fas fa-tag mr-2"></i>${ps.Theme}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Organization Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center mb-3">
                    <i class="fas fa-building text-purple-400 text-lg mr-3"></i>
                    <label class="text-sm font-bold text-purple-400 uppercase tracking-wide">Department</label>
                </div>
                <p class="text-white font-semibold text-lg">${ps.Department}</p>
            </div>
            <div class="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center mb-3">
                    <i class="fas fa-university text-blue-400 text-lg mr-3"></i>
                    <label class="text-sm font-bold text-blue-400 uppercase tracking-wide">Organisation</label>
                </div>
                <p class="text-white font-semibold text-lg break-words">${ps.Organisation}</p>
            </div>
        </div>

        <!-- Problem Description -->
        <div class="bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-2xl p-8 border border-slate-600">
            <div class="flex items-center mb-6">
                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mr-4">
                    <i class="fas fa-file-alt text-white"></i>
                </div>
                <h5 class="text-xl font-bold text-white">Problem Description</h5>
            </div>
            <div class="prose prose-invert max-w-none">
                <p class="text-gray-300 leading-relaxed text-base break-words whitespace-pre-wrap">${ps.Description}</p>
            </div>
        </div>

        ${ps.Datasetfile && ps.Datasetfile !== "NULL" ? `
        <!-- Dataset Section -->
        <div class="bg-green-500/10 rounded-xl p-6 border border-green-500/30">
            <div class="flex items-center mb-3">
                <i class="fas fa-database text-green-400 text-lg mr-3"></i>
                <label class="text-sm font-bold text-green-400 uppercase tracking-wide">Available Dataset</label>
            </div>
            <p class="text-green-200 font-semibold">${ps.Datasetfile}</p>
            <p class="text-green-300/70 text-sm mt-2">
                <i class="fas fa-info-circle mr-2"></i>
                Dataset provided to help you get started with your solution
            </p>
        </div>
        ` : ""}

        <!-- Guidelines Section -->
        <div class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20">
            <h5 class="text-xl font-bold text-white mb-6 flex items-center">
                <i class="fas fa-clipboard-list text-blue-400 mr-3"></i>
                Implementation Guidelines
            </h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div class="flex items-start">
                        <i class="fas fa-users text-purple-400 mt-1 mr-3"></i>
                        <div>
                            <h6 class="font-semibold text-white">Team Size</h6>
                            <p class="text-gray-300 text-sm">2-6 members per team</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <i class="fas fa-clock text-blue-400 mt-1 mr-3"></i>
                        <div>
                            <h6 class="font-semibold text-white">Duration</h6>
                            <p class="text-gray-300 text-sm">48 hours coding marathon</p>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <div class="flex items-start">
                        <i class="fas fa-code text-green-400 mt-1 mr-3"></i>
                        <div>
                            <h6 class="font-semibold text-white">Technology</h6>
                            <p class="text-gray-300 text-sm">Any programming language/framework</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <i class="fas fa-trophy text-yellow-400 mt-1 mr-3"></i>
                        <div>
                            <h6 class="font-semibold text-white">Prizes</h6>
                            <p class="text-gray-300 text-sm">Cash prizes & certificates</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Call to Action -->
        <div class="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-purple-500/30 text-center">
            <div class="mb-6">
                <i class="fas fa-rocket text-4xl text-purple-400 mb-4"></i>
                <h5 class="text-2xl font-bold text-white mb-2">Ready to Take on This Challenge?</h5>
                <p class="text-gray-300">
                    Join thousands of innovators and showcase your skills in this exciting problem statement!
                </p>
            </div>
            <div class="flex flex-col md:flex-row gap-4 justify-center items-center">
                <div class="flex items-center text-sm text-gray-400">
                    <i class="fas fa-calendar mr-2 text-purple-400"></i>
                    Registration closes soon
                </div>
                <div class="flex items-center text-sm text-gray-400">
                    <i class="fas fa-users mr-2 text-blue-400"></i>
                    Limited teams per problem
                </div>
                <div class="flex items-center text-sm text-gray-400">
                    <i class="fas fa-medal mr-2 text-yellow-400"></i>
                    Win amazing prizes
                </div>
            </div>
        </div>
    </div>
  `;

  document.getElementById("psModal").classList.remove("hidden");
}

// Update pagination with magical styling
function updatePagination() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  // Previous button
  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.className =
      "px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-purple-600 hover:text-white transition border border-gray-600";
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.onclick = () => changePage(currentPage - 1);
    pagination.appendChild(prevBtn);
  }

  // Page numbers
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = `px-4 py-2 rounded-full transition border ${
      i === currentPage
        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white border-purple-500"
        : "bg-gray-800 text-gray-300 hover:bg-purple-600 hover:text-white border-gray-600"
    }`;
    pageBtn.textContent = i;
    pageBtn.onclick = () => changePage(i);
    pagination.appendChild(pageBtn);
  }

  // Next button
  if (currentPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.className =
      "px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-purple-600 hover:text-white transition border border-gray-600";
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.onclick = () => changePage(currentPage + 1);
    pagination.appendChild(nextBtn);
  }
}

// Change page
function changePage(page) {
  currentPage = page;
  displayProblems();
  updatePagination();

  // Scroll to problems section
  document.getElementById("problems").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// Update total count with animation
function updateTotalCount() {
  const countElement = document.getElementById("totalCount");
  const currentCount = parseInt(countElement.textContent) || 0;
  const targetCount = filteredData.length;

  const duration = 500;
  const step = (targetCount - currentCount) / (duration / 16);
  let current = currentCount;

  const animate = () => {
    current += step;
    if (
      (step > 0 && current >= targetCount) ||
      (step < 0 && current <= targetCount)
    ) {
      countElement.textContent = targetCount;
    } else {
      countElement.textContent = Math.floor(current);
      requestAnimationFrame(animate);
    }
  };

  animate();
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Initialize magical effects
  createParticles();
  setupSmoothScrolling();

  // Load data
  loadProblemStatements();

  // Search and filter event listeners
  document.getElementById("searchInput").addEventListener("input", filterData);
  document
    .getElementById("categoryFilter")
    .addEventListener("change", filterData);
  document.getElementById("themeFilter").addEventListener("change", filterData);
  document
    .getElementById("organizationFilter")
    .addEventListener("change", filterData);

  // Modal close functionality
  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("psModal").classList.add("hidden");
    });
  });

  // Close modal when clicking the close button in footer
  document
    .querySelector("#psModal .bg-gradient-to-r")
    .addEventListener("click", () => {
      document.getElementById("psModal").classList.add("hidden");
    });

  // Close modal when clicking outside
  document.getElementById("psModal").addEventListener("click", (e) => {
    if (e.target.id === "psModal") {
      document.getElementById("psModal").classList.add("hidden");
    }
  });

  // Feedback Modal functionality
  const feedbackBtn = document.getElementById("feedbackBtn");
  const feedbackModal = document.getElementById("feedbackModal");
  const feedbackForm = document.getElementById("feedbackForm");
  const feedbackSuccess = document.getElementById("feedbackSuccess");
  const closeFeedbackBtns = document.querySelectorAll(".close-feedback-btn");

  // Priority radio button functionality
  function setupPriorityRadios() {
    const priorityRadios = document.querySelectorAll('input[name="priority"]');
    priorityRadios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        // Reset all radio indicators
        priorityRadios.forEach((r) => {
          const indicator = r.parentElement.querySelector('div div');
          indicator.classList.add('hidden');
        });
        
        // Show selected radio indicator
        if (e.target.checked) {
          const indicator = e.target.parentElement.querySelector('div div');
          indicator.classList.remove('hidden');
        }
      });
    });
    
    // Set default selection (Low priority)
    const defaultRadio = document.querySelector('input[name="priority"][value="Low"]');
    if (defaultRadio) {
      defaultRadio.checked = true;
      const indicator = defaultRadio.parentElement.querySelector('div div');
      indicator.classList.remove('hidden');
    }
  }

  // Open feedback modal
  feedbackBtn.addEventListener("click", () => {
    feedbackModal.classList.remove("hidden");
    setupPriorityRadios();
    
    // Set browser info and page URL
    document.getElementById("browserInfo").value = `${navigator.userAgent} | Screen: ${screen.width}x${screen.height} | Viewport: ${window.innerWidth}x${window.innerHeight}`;
    document.getElementById("pageUrl").value = window.location.href;
    document.getElementById("timestamp").value = new Date().toISOString();
  });

  // Close feedback modal
  closeFeedbackBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      feedbackModal.classList.add("hidden");
      feedbackForm.style.display = "block";
      feedbackSuccess.classList.add("hidden");
      feedbackForm.reset();
      
      // Reset priority radio indicators
      const indicators = document.querySelectorAll('input[name="priority"] ~ div div');
      indicators.forEach(indicator => indicator.classList.add('hidden'));
    });
  });

  // Close feedback modal when clicking outside
  feedbackModal.addEventListener("click", (e) => {
    if (e.target.id === "feedbackModal") {
      feedbackModal.classList.add("hidden");
      feedbackForm.style.display = "block";
      feedbackSuccess.classList.add("hidden");
      feedbackForm.reset();
      
      // Reset priority radio indicators
      const indicators = document.querySelectorAll('input[name="priority"] ~ div div');
      indicators.forEach(indicator => indicator.classList.add('hidden'));
    }
  });

  // Handle form submission
  feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const submitBtn = feedbackForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
    submitBtn.disabled = true;
    
    try {
      const formData = new FormData(feedbackForm);
      
      const response = await fetch(feedbackForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Show success message
        feedbackForm.style.display = "none";
        feedbackSuccess.classList.remove("hidden");
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error:', error);
      
      // Show user-friendly error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4 text-center';
      errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle text-red-400 text-2xl mb-2"></i>
        <p class="text-red-300 font-semibold">Sorry, there was an error sending your feedback.</p>
        <p class="text-red-400 text-sm">Please try again later or contact us directly.</p>
      `;
      
      feedbackForm.insertBefore(errorDiv, feedbackForm.firstChild);
      
      // Remove error message after 5 seconds
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.remove();
        }
      }, 5000);
      
      // Reset button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });

  // Scroll events
  window.addEventListener("scroll", updateScrollIndicator);
  
  // Initialize mobile menu
  initializeMobileMenu();
  
  // Add smooth scrolling for anchor links
  initializeSmoothScrolling();
  
  // Add touch optimizations
  initializeTouchOptimizations();
});

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Check if on desktop (lg breakpoint) for sticky nav
        const isDesktop = window.innerWidth >= 1024;
        const navHeight = isDesktop ? document.querySelector('nav').offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - navHeight - (isDesktop ? 20 : 10);
        
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });
      }
    });
  });
}

// Touch optimizations for mobile devices
function initializeTouchOptimizations() {
  // Add touch feedback for buttons and links
  const interactiveElements = document.querySelectorAll('button, a, .glass-card');
  
  interactiveElements.forEach(element => {
    element.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
      this.style.transition = 'transform 0.1s ease';
    });
    
    element.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
    
    element.addEventListener('touchcancel', function() {
      this.style.transform = 'scale(1)';
    });
  });
  
  // Improve modal touch experience
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('touchmove', function(e) {
      // Prevent background scroll when modal is open
      if (e.target === this) {
        e.preventDefault();
      }
    });
  });
  
  // Add swipe to close for modals
  let startY = 0;
  let currentY = 0;
  
  document.addEventListener('touchstart', function(e) {
    startY = e.touches[0].clientY;
  });
  
  document.addEventListener('touchmove', function(e) {
    currentY = e.touches[0].clientY;
  });
  
  document.addEventListener('touchend', function(e) {
    const modal = document.querySelector('.modal:not(.hidden)');
    if (modal && startY - currentY > 100) {
      // Swipe up detected, close modal
      modal.classList.add('hidden');
    }
  });
}







// Function to get venue color
function getVenueColor(venue) {
  switch(venue) {
    case 'SEMINAR HALL':
      return 'from-green-500 to-emerald-600';
    case 'IOT LAB':
      return 'from-purple-500 to-pink-600';
    case 'STARTUP STUDIO':
      return 'from-orange-500 to-red-600';
    default:
      return 'from-blue-500 to-cyan-600';
  }
}



// Function to create jury card
function createJuryCard(venue, juryData, index) {
  const venueColor = getVenueColor(venue);
  
  // Map venue names to image filenames
  const venueImageMap = {
    'SEMINAR HALL': 'SeminarHall.jpg',
    'IOT LAB': 'IotLab.jpg',
    'STARTUP STUDIO': 'StartUpStudio.jpg'
  };
  
  const imageUrl = `assets/images/jury/${venueImageMap[venue]}`;
  const juryTeamNumber = index + 1;
  
  return `
    <div class="jury-card glass-card p-4 sm:p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105">
      <div class="text-center">
        <!-- Jury Team Number - Inside Card -->
        <div class="jury-team-badge text-2xl font-black text-white mb-6 tracking-wider">
          JURY TEAM ${juryTeamNumber}
        </div>
        
        <!-- Venue Image - Super Large -->
        <div class="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto mb-4 rounded-xl overflow-hidden border-3 border-white/30 group-hover:border-white/50 transition-all duration-300 shadow-2xl">
          <img src="${imageUrl}" alt="${venue} Jury Panel" class="w-full h-full object-cover object-center" 
               onerror="this.src='assets/images/logo.png'; this.classList.remove('object-cover', 'object-center'); this.classList.add('object-contain', 'p-4');">
        </div>
        
       
        
        <!-- Evaluation Panel Badge -->
        <div class="inline-block px-4 py-2 mt-3 rounded-full text-sm font-medium bg-gradient-to-r ${venueColor} text-white">
          <i class="fas fa-gavel mr-2"></i>
          ${venue}
        </div>
      </div>
    </div>
  `;
}

// Function to render jury information
function renderJury() {
  const juryGrid = document.getElementById('jury-grid');
  if (!juryGrid) return;
  
  fetch('assets/data/jury_details.json')
    .then(response => response.json())
    .then(data => {
      const juryHtml = Object.entries(data.jury_details).map(([venue, juryData], index) => 
        createJuryCard(venue, juryData, index)
      ).join('');
      
      juryGrid.innerHTML = juryHtml;
      
      // Add animation to jury cards
      const juryCards = juryGrid.querySelectorAll('.jury-card');
      juryCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          card.style.transition = 'all 0.5s ease-out';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 150);
      });
    })
    .catch(error => {
      console.error('Error loading jury data:', error);
    });
}

// Teams functionality
let teamsData = [];
let currentVenueFilter = 'SEMINAR HALL'; // Default to Seminar Hall

// Function to parse CSV data
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  const teams = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length === headers.length && values[0].trim()) {
      const team = {};
      headers.forEach((header, index) => {
        team[header.trim()] = values[index].trim();
      });
      teams.push(team);
    }
  }
  
  return teams;
}

// Function to normalize team name for image lookup
function normalizeTeamName(teamName) {
  // Handle special cases and normalize team names to match image filenames
  const specialCases = {
    'GenNext': 'GenNext.jpg',
    'Coderz Galaxy': 'Coderz Galaxy.jpg',
    'Tech Warriors': 'Tech Warriors.jpg', 
    'Hackonauts': 'Hackonauts.jpg',
    'DisasterX': 'DisasterX.jpg',
    'Tesla': 'TESLA.jpg',
    'SkyWalkers': 'Sky Walkers.jpg',
    'Circuitronix': 'Circuitronix.jpg',
    'Sadak Mitra': 'Sadak Mitra.jpg',
    'Synap Tech': 'SynapTech.jpg',
    'Infinite Loopers': 'Infinite Loopers.jpg',
    'Aura Tech': 'AuraTech.jpg',
    'Breed Spoilers': 'BREED SPOTTERS.jpg',
    'SIH 11': 'SIH 11.jpg',
    'Koshin': 'Koshin .jpg',
    'EPICELECTRONS': 'Epicelectrons.jpg',
    'Echoes of Sikkim': 'Echoes of Sikkim.jpg',
    'Chainspark': 'CHAINSPARK.jpg',
    'BackTech': 'Back Tech.jpg',
    'Syamparani': 'Syamparani.jpg',
    'Obsidian': 'Obsidian.jpg',
    'Impactware': 'ImpactWare.jpg',
    'OutCast': 'OUTCAST.jpg',
    'ShieldMy Trip': 'Shield My Trip.jpg',
    'Rising Pheonix': 'Rising Phoenix.jpg',
    'Onion Vault': 'ONION VAULT.jpg',
    'Sky Hackers': 'sky hackers.jpg',
    'Brain Wave solutions': 'Brainwave Solutions.jpg',
    'Tech Titans': 'Tech titans.jpg',
    'Binary Bunch': 'Brainy bunch.jpg',
    'Scratch': 'scratch.jpg',
    'Code Brigade': 'Code Brigade.png',
    'Aero Vision': 'Aerovision.jpg',
    'BlueMarble': 'BlueMarble.jpg',
    'Neuro Ninjas': 'Neuro Ninjas.jpg',
    'Hydro Smart': 'Hydro Smart.jpg',
    'Cultural Impactors': 'Cultural Impactors.jpg',
    'Innoventures': 'Innoventures.jpg',
    'Vector Vision': 'Vector Vision.jpg',
    'Max Matrix': 'MAX MATRIX.jpg',
    'Igniters': 'Igniters.png',
    'SmartEd Icons': 'SmartEd Icons.jpg',
    'Hackathon Hackers': 'Hackathon Hackers.jpg',
    'Digital Dreamers': 'Digital Dreamers.jpg',
    'Dropout Shield': 'Dropout sheild.jpg',
    'NeverMore': 'Nevermore.jpg'
  };
  
  return specialCases[teamName] || teamName;
}

// Function to get venue color
function getVenueColor(venue) {
  switch(venue) {
    case 'SEMINAR HALL':
      return 'from-green-500 to-emerald-600';
    case 'IOT LAB':
      return 'from-purple-500 to-pink-600';
    case 'STARTUP STUDIO':
      return 'from-orange-500 to-red-600';
    default:
      return 'from-blue-500 to-cyan-600';
  }
}

// Function to create team card
function createTeamCard(team) {
  const venueColor = getVenueColor(team.Venue);
  const imageUrl = `assets/images/teams/${normalizeTeamName(team['TEAM NAME'])}`;
  
  return `
    <div class="problem-card rounded-2xl p-6 hover-glow cursor-pointer">
      <div class="flex flex-col h-full">
        <div class="flex items-start justify-between mb-4">
          <span class="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${venueColor} text-white">
            ${team.Venue}
          </span>
        </div>
        
        <h3 class="text-xl font-bold text-white mb-3 leading-tight">${team['TEAM NAME']}</h3>
        
        <div class="flex-1 flex items-center justify-center mb-4">
          <div class="w-32 h-32 rounded-lg overflow-hidden border-3 border-white/30 shadow-lg">
            <img src="${imageUrl}" alt="${team['TEAM NAME']}" class="w-full h-full object-cover" 
                 onerror="this.src='assets/images/logo.png'; this.classList.remove('object-cover'); this.classList.add('object-contain', 'p-4');">
          </div>
        </div>
        
        <div class="text-gray-400 text-sm mb-4">
          <div class="flex items-center mb-2">
            <i class="fas fa-user mr-2 text-purple-400"></i>
            <span>${team['TEAM LEAD NAME']}</span>
          </div>
          <div class="flex items-center">
            <i class="fas fa-code mr-2 text-blue-400"></i>
            <span>${team['PS ID']}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Function to render teams
function renderTeams() {
  const grid = document.getElementById('teams-grid');
  if (!grid) return;
  
  // Filter teams based on current venue filter
  let filteredTeams = currentVenueFilter === 'all' 
    ? teamsData 
    : teamsData.filter(team => team.Venue === currentVenueFilter);
  
  // Sort teams by total score descending
  const sortedTeams = [...filteredTeams].sort((a, b) => (parseInt(b.TOTAL) || 0) - (parseInt(a.TOTAL) || 0));
  
  grid.innerHTML = sortedTeams.map(team => createTeamCard(team)).join('');
  
  // Add fade-in animation
  grid.classList.add("opacity-0");
  setTimeout(() => {
    grid.classList.remove("opacity-0");
    grid.classList.add("opacity-100", "transition-opacity", "duration-500");
  }, 100);
}

// Function to initialize venue filter buttons
function initializeVenueFilters() {
  const filterBtns = document.querySelectorAll('.venue-filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.classList.remove('bg-gradient-to-r', 'from-blue-500', 'to-cyan-500', 'from-green-500', 'to-emerald-500', 'from-purple-500', 'to-pink-500', 'from-orange-500', 'to-red-500');
        b.classList.add('bg-gray-700/50', 'text-gray-300');
      });
      
      btn.classList.add('active');
      btn.classList.remove('bg-gray-700/50', 'text-gray-300');
      btn.classList.add('bg-gradient-to-r', 'text-white', 'shadow-lg');
      
      // Apply appropriate gradient based on venue
      const venue = btn.dataset.venue;
      switch(venue) {
        case 'SEMINAR HALL':
          btn.classList.add('from-green-500', 'to-emerald-500');
          break;
        case 'IOT LAB':
          btn.classList.add('from-purple-500', 'to-pink-500');
          break;
        case 'STARTUP STUDIO':
          btn.classList.add('from-orange-500', 'to-red-500');
          break;
      }
      
      // Update filter and re-render
      currentVenueFilter = venue;
      renderTeams();
    });
  });
  
  // Set default active button for Seminar Hall
  const defaultBtn = document.querySelector('.venue-filter-btn[data-venue="SEMINAR HALL"]');
  if (defaultBtn) {
    defaultBtn.classList.add('active');
    defaultBtn.classList.remove('bg-gray-700/50', 'text-gray-300');
    defaultBtn.classList.add('bg-gradient-to-r', 'from-green-500', 'to-emerald-500', 'text-white', 'shadow-lg');
  }
}

// Function to load teams data
async function loadTeamsData() {
  try {
    const response = await fetch('assets/data/SelectedTeams.csv');
    const csvText = await response.text();
    teamsData = parseCSV(csvText);
    
    initializeVenueFilters();
    renderTeams();
  } catch (error) {
    console.error('Error loading teams data:', error);
  }
}

// Initialize jury when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  renderJury();
  loadTeamsData();
});
