/* ==========================================================================
   Ayu Health Suite Commercial Website - Interactive JS Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // === 1. Navbar Sticky & Active Link Tracking ===
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Add sticky class on scroll
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Dynamic active tab highlighting
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(currentSection)) {
        link.classList.add('active');
      }
    });
  });

  // === 2. Hamburger Mobile Menu Toggle ===
  const hamburger = document.getElementById('hamburger');
  const navLinksList = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinksList.classList.toggle('active');
      hamburger.classList.toggle('active');
      const isExpanded = navLinksList.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isExpanded);
    });
  }

  // Close mobile menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksList.classList.remove('active');
      if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // === 3. Interactive EMR & Smart Billing Simulator ===
  const diagnosisSelect = document.getElementById('sim-diagnosis');
  const cartBody = document.getElementById('sim-cart-body');
  const totalPriceEl = document.getElementById('sim-total-price');
  const stockAlert = document.getElementById('sim-stock-alert');

  // Diagnosis-based Drug Template Data Mock
  const templates = {
    none: [],
    bronchitis: [
      { name: 'Paracetamol 500mg', type: 'Drug', qty: 15, unitPrice: 2.00, stock: 300 },
      { name: 'Amoxicillin 250mg', type: 'Drug', qty: 20, unitPrice: 15.00, stock: 200 },
      { name: 'Cetirizine 10mg', type: 'Drug', qty: 10, unitPrice: 3.00, stock: 150 }
    ],
    hypertension: [
      { name: 'Losartan 50mg', type: 'Drug', qty: 30, unitPrice: 12.00, stock: 500 },
      { name: 'Amlodipine 5mg', type: 'Drug', qty: 30, unitPrice: 8.00, stock: 400 },
      { name: 'Digital Thermometer', type: 'Equipment', qty: 1, unitPrice: 850.00, stock: 2 } // Mock Equipment item
    ],
    allergy: [
      { name: 'Cetirizine 10mg', type: 'Drug', qty: 10, unitPrice: 3.00, stock: 150 },
      { name: 'Sterile Gauze Pads', type: 'Equipment', qty: 1, unitPrice: 50.00, stock: 80 }
    ]
  };

  if (diagnosisSelect) {
    diagnosisSelect.addEventListener('change', (e) => {
      const selectedDiag = e.target.value;
      const items = templates[selectedDiag] || [];

      // Clear previous rows
      cartBody.innerHTML = '';
      stockAlert.style.display = 'none';

      if (items.length === 0) {
        cartBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); font-style: italic; padding: 2rem 0;">Select a diagnosis above to load presets...</td></tr>`;
        totalPriceEl.textContent = 'Rs. 0.00';
        return;
      }

      let grandTotal = 0;
      let lowStockAlertTriggered = false;

      items.forEach(item => {
        const itemTotal = item.qty * item.unitPrice;
        grandTotal += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
          <td style="font-weight: 600;">${item.name} <span class="badge" style="padding: 0.15rem 0.45rem; font-size: 0.65rem; margin-bottom: 0; background-color: var(--primary-glow); color: var(--primary);">${item.type}</span></td>
          <td>${item.qty}</td>
          <td>Rs. ${item.unitPrice.toFixed(2)}</td>
          <td style="font-weight: 700;">Rs. ${itemTotal.toFixed(2)}</td>
        `;
        cartBody.appendChild(row);

        // Check if template items exceed sample inventory limits to showcase real-time alerts
        if (item.name === 'Digital Thermometer' && item.qty >= item.stock) {
          lowStockAlertTriggered = true;
        }
      });

      // Update total price formatted as Rupees
      totalPriceEl.textContent = 'Rs. ' + grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      // Showcase the real-time stock-level warnings
      if (lowStockAlertTriggered) {
        stockAlert.style.display = 'block';
        stockAlert.textContent = '⚠️ WARNING: Insufficient inventory levels for Digital Thermometer (Only 2 units remaining in stock).';
      }
    });
  }

  // === 4. Booking & Contact Forms Form Submissions ===
  const bookingForm = document.getElementById('bookingForm');
  const contactForm = document.getElementById('contactForm');
  
  const successModal = document.getElementById('success-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  const showPopup = (title, message) => {
    modalTitle.textContent = title;
    modalText.textContent = message;
    successModal.classList.add('active');
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
  }

  // Close modal when clicking overlay background
  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('book-name').value;
      const email = document.getElementById('book-email').value;
      const phone = document.getElementById('book-phone').value;
      const date = document.getElementById('book-date').value;
      const time = document.getElementById('book-time').value;

      if (!name || !email || !phone || !date || !time) {
        alert('Please fill in all details to schedule your demo.');
        return;
      }

      // Disable button during submission to prevent double submission
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Scheduling Demo...';

      // Send POST request to backend email endpoint
      fetch('http://localhost:5000/api/send-demo-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, date, time })
      })
      .then(res => res.json())
      .then(data => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        if (data.success) {
          bookingForm.reset();
          showPopup(
            'Demo Request Received! 🎉',
            `Thank you ${name}. Your EMR system live demo is scheduled for ${date} at ${time}. One of our software engineers from Axentratech will reach out to you at ${email} shortly.`
          );
        } else {
          alert('Failed to submit demo request: ' + (data.error || 'Server error'));
        }
      })
      .catch(err => {
        console.error('Demo booking error:', err);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        alert('Failed to connect to email server. Please check your connection.');
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;

      if (!name || !email || !subject || !message) {
        alert('Please fill in all details to submit your inquiry.');
        return;
      }

      // Disable button during submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';

      // Send POST request to backend email endpoint
      fetch('http://localhost:5000/api/send-inquiry-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      })
      .then(res => res.json())
      .then(data => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        if (data.success) {
          contactForm.reset();
          showPopup(
            'Message Sent Successfully! ✉️',
            `Thank you ${name}. Your message regarding "${subject}" has been successfully forwarded to our support desk. Axentratech Software Solutions will get back to you within 24 business hours.`
          );
        } else {
          alert('Failed to send message: ' + (data.error || 'Server error'));
        }
      })
      .catch(err => {
        console.error('Contact inquiry error:', err);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        alert('Failed to connect to email server. Please check your connection.');
      });
    });
  }

  // === 6. Interactive Ayu System Modules Modal ===
  const moduleModal = document.getElementById('module-modal');
  const moduleModalTitle = document.getElementById('module-modal-title');
  const moduleModalBody = document.getElementById('module-modal-body');
  const moduleModalIcon = document.getElementById('module-modal-icon');
  const moduleModalClose = document.getElementById('module-modal-close');
  const moduleModalBtn = document.getElementById('module-modal-btn');
  const featureBtns = document.querySelectorAll('.feature-link-btn');

  const moduleContent = {
    emr: {
      title: "Patient Onboarding & EMR",
      icon: "fa-address-card",
      desc: "A comprehensive Electronic Medical Records (EMR) system designed to digitize patient history. Quickly onboard patients, store vital clinical records, track allergies, and view chronological medical histories at a glance.",
      subFeatures: [
        "Quick Patient Registration Wizard",
        "Dynamic Clinical Vital Logs (BP, Temp, SpO2)",
        "Comprehensive Treatment & History Timeline",
        "Allergies & Chronic Illness Flags",
        "Secure Patient Document Attachments",
        "Smart Demographics & Contact Tracker"
      ]
    },
    queue: {
      title: "Token Queue & Appointment Routing",
      icon: "fa-list-ol",
      desc: "Optimize patient flow from check-in to consultation. Automatically issue sequential queue tokens, update active doctor statuses, and manage check-ins through a live clinical dashboard.",
      subFeatures: [
        "Automated Token Generation on Check-in",
        "Live Receptionist Check-in Panel",
        "Real-time Doctor Consultation Queue View",
        "Multi-Room & Multi-Doctor Routing Support",
        "Walk-in & Scheduled Appointment Sync",
        "Patient Status Tracking (Waiting, Active, Done)"
      ]
    },
    billing: {
      title: "Real-Time POS Billing & Cart",
      icon: "fa-receipt",
      desc: "A clinic POS billing system that updates calculations instantly. Directly edit drug unit prices, quantities, and discounts. Instantly check inventory levels while building the invoice.",
      subFeatures: [
        "Instantaneous Totals & Discount Calculations",
        "Dynamic Cart Editing (Price, Qty, Discounts)",
        "Stock Availability Verification on Item Add",
        "Multiple Payment Modes (Cash, Card, Split)",
        "Printed Receipt & Direct Invoice PDF Generator",
        "Refund, Void & Outstanding Bill Tracking"
      ]
    },
    inventory: {
      title: "Stock & Expiry Batch Management",
      icon: "fa-box-open",
      desc: "Maintain flawless pharmacy and clinic inventory. Track inventory levels by batch numbers, monitor cost prices, set minimum safety stock alerts, and automatically flag approaching drug expiry dates.",
      subFeatures: [
        "Separate Batch-wise Stock Tracking",
        "Automatic FIFO Stock Deductions",
        "Dynamic Drug Expiry Date Notifications",
        "Minimum Safety Stock Level Alerts",
        "Stock Inflow & Supplier Bill Bookkeeping",
        "Comprehensive Wastage & Expiry Logs"
      ]
    },
    followups: {
      title: "Follow-Up Appointments Tracker",
      icon: "fa-calendar-check",
      desc: "Track and organize clinical follow-ups. Schedule next clinic dates directly from the consultation screen, monitor overdue clinic visits, and send reminders to patients.",
      subFeatures: [
        "One-click 'Next Clinic Date' Consultation Picker",
        "Color-Coded Status (Overdue, Due Today, Upcoming)",
        "Interactive Follow-Up Calendar & Schedule View",
        "One-click Consultation Routing for Returning Patients",
        "Exportable Patient Follow-up Excel/CSV Lists",
        "Automated Patient Re-engagement Workflows"
      ]
    },
    whatsapp: {
      title: "Automated WhatsApp Communications",
      icon: "fa-comments",
      desc: "Engage patients automatically via WhatsApp. Dispatches instant token numbers, check-in updates, digital prescription receipt links, and follow-up appointment reminders.",
      subFeatures: [
        "Automated Registration & Token Notification",
        "Digital Invoice Receipts Sent Direct via Chat Link",
        "Scheduled Follow-Up Clinic Reminders",
        "Customizable Template Message Library",
        "Delivery Status & Logs Monitoring Panel",
        "GDPR & HIPAA Compliant Opt-in/Opt-out Handling"
      ]
    },
    presets: {
      title: "Smart Diagnosis Drug Presets",
      icon: "fa-prescription-bottle-medical",
      desc: "Accelerate billing and prescribing workflows. Pre-configure templates for specific diagnoses (e.g., Asthma, Hypertension). Selecting a diagnosis instantly populates the billing cart with prescribed drugs.",
      subFeatures: [
        "Custom Diagnosis Template Builder",
        "One-click Billing Cart Auto-Population",
        "Preset Quantity, Dosage & Instructions Link",
        "Dynamic Customization per Doctor Specialty",
        "Saves Up to 80% of Manual Typing Time",
        "Reduces Medical Prescription Errors"
      ]
    },
    rbac: {
      title: "Role-Based Access Control (RBAC)",
      icon: "fa-user-shield",
      desc: "Secure your clinic's database. Dynamically configure custom sidebar tab permissions for Administrators, Doctors, Receptionists, and Cashiers, ensuring patient data privacy.",
      subFeatures: [
        "Predefined Roles (Admin, Doctor, Reception, Cashier)",
        "Granular Sidebar Tab-by-Tab Access Settings",
        "Real-time Access Restriction Enforcement",
        "Detailed System Activity Logs per User",
        "Secure Session Logouts & Inactivity Timeouts",
        "Encrypted Database Credentials Storage"
      ]
    },
    analytics: {
      title: "Analytics & Financial Intelligence",
      icon: "fa-chart-line",
      desc: "Gain real-time insights into your clinic's operations and financial health. Track total consultation counts, revenue collections, cost of goods sold (COGS), and net profit margins.",
      subFeatures: [
        "Live Collections & Sales Trend Graphs",
        "Cost of Goods Sold (COGS) & Profit Margin Counter",
        "Doctor Consultation Volume Analytics",
        "Fast-Moving & Slow-Moving Drug Reports",
        "Outstanding Dues & Credit Collections Tracker",
        "Secure Financial Reports Export (Excel/PDF)"
      ]
    }
  };

  const openModuleModal = (moduleKey) => {
    const data = moduleContent[moduleKey];
    if (!data) return;

    // Populate modal contents
    moduleModalTitle.textContent = data.title;
    moduleModalIcon.innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
    
    // Generate sub-features HTML list
    let listHtml = '<div class="sub-features-list">';
    data.subFeatures.forEach(feat => {
      listHtml += `
        <div class="sub-feature-item">
          <i class="fa-solid fa-circle-check"></i>
          <span>${feat}</span>
        </div>
      `;
    });
    listHtml += '</div>';

    moduleModalBody.innerHTML = `
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">${data.desc}</p>
      <h4 style="font-size: 0.95rem; color: var(--secondary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">Core Features & Capabilities</h4>
      ${listHtml}
    `;

    // Show modal
    moduleModal.classList.add('active');
    moduleModal.setAttribute('aria-hidden', 'false');
  };

  const closeModuleModal = () => {
    moduleModal.classList.remove('active');
    moduleModal.setAttribute('aria-hidden', 'true');
  };

  // Add click events to Read More buttons
  featureBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const moduleKey = btn.getAttribute('data-module');
      openModuleModal(moduleKey);
    });
  });

  // Close triggers
  if (moduleModalClose) {
    moduleModalClose.addEventListener('click', closeModuleModal);
  }
  if (moduleModalBtn) {
    moduleModalBtn.addEventListener('click', closeModuleModal);
  }
  if (moduleModal) {
    moduleModal.addEventListener('click', (e) => {
      if (e.target === moduleModal) {
        closeModuleModal();
      }
    });
  }

  // Esc key closure
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && moduleModal && moduleModal.classList.contains('active')) {
      closeModuleModal();
    }
  });

  // === 5. Interactive Canvas Particles Network (SITS-inspired) ===
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    // Adjust density based on screen size for performance
    const maxParticles = window.innerWidth < 768 ? 25 : 65;
    const connectionDist = 115;
    
    let mouse = {
      x: null,
      y: null,
      radius: 140
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Particle definition
    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * canvas.width;
        // Start randomly on screen on load, or offscreen at top/sides during loop reset
        this.y = init ? Math.random() * canvas.height : -10;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4 + 0.15; // subtle downward drift
        this.radius = Math.random() * 2 + 1;
        // Color mapping: green primary or blue accent
        this.color = Math.random() > 0.4 ? '15, 191, 123' : '56, 189, 248';
        this.alpha = Math.random() * 0.4 + 0.15;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < -15 || this.x > canvas.width + 15 || this.y > canvas.height + 15) {
          this.reset(false);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
      }
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }

    // Debounced or standard resize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        // Cursor interactive link
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            const alpha = (1 - dist / mouse.radius) * 0.16;
            ctx.strokeStyle = `rgba(${p1.color}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Particle connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / connectionDist) * 0.12;
            ctx.strokeStyle = `rgba(${p1.color}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  // === 7. Brand Preloader Screen Logic ===
  const preloader = document.getElementById('preloader');
  const progressBar = document.querySelector('.preloader-progress-bar');
  const statusText = document.querySelector('.preloader-status-text');

  if (preloader) {
    const statuses = [
      "Initializing Clinical Workspace...",
      "Connecting to Supabase Database...",
      "Loading Active Diagnosis Templates...",
      "Securing Session Workspace...",
      "Ready!"
    ];

    let currentStatusIndex = 0;
    let progress = 0;

    // Simulate progress bar movement
    const progressInterval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        if (progressBar) progressBar.style.width = `${progress}%`;
      }
    }, 200);

    // Periodically update the loading text
    const statusInterval = setInterval(() => {
      if (currentStatusIndex < statuses.length - 2) {
        currentStatusIndex++;
        if (statusText) {
          statusText.textContent = statuses[currentStatusIndex];
        }
      }
    }, 400);

    // Fade out when loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        clearInterval(progressInterval);
        clearInterval(statusInterval);
        if (statusText) statusText.textContent = "Ready!";
        if (progressBar) progressBar.style.width = "100%";

        setTimeout(() => {
          preloader.classList.add('fade-out');
        }, 350);
      }, 1600); // 1.6s minimum presentation time
    });

    // Fallback in case load event takes too long or already fired
    setTimeout(() => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
      if (progressBar) progressBar.style.width = "100%";
      preloader.classList.add('fade-out');
    }, 4500);
  }
});
