/**
 * TalentMatch AI — Frontend Controller
 * Rebuilt for Attio-style design matching & three-tier decoupled interface.
 */

// ══════════════════════════════════════════════════════════════════════════════
// 1. GLOBAL ROLE CATALOG — 50 Tech Industry Roles
// ══════════════════════════════════════════════════════════════════════════════
const ALL_ROLES = [
  // AI / Data
  'AI/Machine Learning Engineer',
  'Data Scientist',
  'MLOps Engineer',
  'Data Engineer',
  'NLP/Vision Specialist',
  'AI Research Scientist',
  'Data Analyst',
  'Business Intelligence Engineer',
  'Computer Vision Engineer',
  'Deep Learning Engineer',
  // Software / Web
  'Frontend Engineer',
  'Backend Engineer',
  'Fullstack Engineer',
  'Mobile Engineer (iOS/Android)',
  'React Native Developer',
  'Embedded Systems Engineer',
  'Game Developer',
  'API/Integration Engineer',
  'Performance Engineer',
  'Desktop Application Developer',
  // Cloud / DevOps
  'DevOps Engineer',
  'SRE (Site Reliability Engineer)',
  'Cloud Architect',
  'Systems/Kernel Engineer',
  'Platform Engineer',
  'Infrastructure Engineer',
  'Release Engineer',
  'Network Engineer',
  'Database Administrator',
  'Cloud Security Engineer',
  // Cyber / Security
  'Cybersecurity Engineer',
  'Security Architect',
  'Penetration Tester',
  'SOC Analyst',
  'Application Security Engineer',
  'Identity & Access Management Engineer',
  'Threat Intelligence Analyst',
  'Compliance Engineer',
  'Cryptography Engineer',
  'Security Operations Engineer',
  // Product / Leadership
  'Product Manager',
  'Technical Program Manager',
  'Engineering Manager',
  'VP of Engineering',
  'UI/UX Architect',
  'UI/UX Designer',
  'QA Automation Engineer',
  'Scrum Master',
  'Technical Lead',
  'CTO/Co-Founder (Technical)',
];

// Page detection
const PAGE = {
  isLanding: document.body.classList.contains('page-landing'),
  isDashboard: document.body.classList.contains('page-dashboard'),
};

// Populate role select helper
function populateRoleSelect(selectEl, defaultRole) {
  if (!selectEl) return;
  selectEl.innerHTML = '';
  ALL_ROLES.forEach(role => {
    const opt = document.createElement('option');
    opt.value = role;
    opt.textContent = role;
    if (role === defaultRole) opt.selected = true;
    selectEl.appendChild(opt);
  });
}

// Bind search input to role dropdown filter
function bindRoleSearch(searchInput, selectEl) {
  if (!searchInput || !selectEl) return;
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const options = selectEl.options;
    for (let i = 0; i < options.length; i++) {
      const text = options[i].textContent.toLowerCase();
      options[i].hidden = query && !text.includes(query);
    }
  });
}

// Escape HTML utility
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}


// ══════════════════════════════════════════════════════════════════════════════
// 2. PUBLIC LANDING PAGE — Widget Simulation Engine
// ══════════════════════════════════════════════════════════════════════════════
if (PAGE.isLanding) {
  const MOCK_CANDIDATES = [
    {
      name: 'Elena Kozlova',
      title: 'Senior ML Engineer @ TechFlow',
      score: 96,
      tech_depth: 'Exemplary',
      culture_fit: 'High Alignment',
      why_fit: 'Deep expertise in PyTorch distributed training; scaled models for 50M+ users.',
      skills: ['Python', 'PyTorch', 'AWS', 'Docker'],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100'
    },
    {
      name: 'Julian Duarte',
      title: 'Backend Architect @ AlphaNodes',
      score: 91,
      tech_depth: 'Exemplary',
      culture_fit: 'Founder Mindset',
      why_fit: 'Built high-throughput Go microservices; strong system design fundamentals.',
      skills: ['Go', 'PostgreSQL', 'Redis', 'Docker'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
    },
    {
      name: 'Sarah Manning',
      title: 'Fullstack Lead @ CloudScale',
      score: 84,
      tech_depth: 'Strong',
      culture_fit: 'Medium Alignment',
      why_fit: 'Solid React/TypeScript patterns; lacks deep database optimization patterns.',
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
    },
    {
      name: 'Alex Chen',
      title: 'DevOps Engineer @ CloudStack',
      score: 78,
      tech_depth: 'Average',
      culture_fit: 'High Alignment',
      why_fit: 'Competent infrastructure automations with Kubernetes; learning PyTorch deployment models.',
      skills: ['Python', 'Kubernetes', 'AWS', 'Docker'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
    }
  ];

  let simRole = 'Frontend Engineer';
  let simSeniority = 'Senior';
 
  const demoRoleSelect = document.getElementById('demoRoleSelect');
  const demoRoleSearch = document.getElementById('demoRoleSearch');
  const demoSeniorityPills = document.getElementById('demoSeniorityPills');
  const demoLeaderboard = document.getElementById('demoLeaderboard');
 
  populateRoleSelect(demoRoleSelect, simRole);
  bindRoleSearch(demoRoleSearch, demoRoleSelect);
 
  // Render mock rows with shimmer transition
  function renderSimLeaderboard() {
    if (!demoLeaderboard) return;
 
    // Show 4 loading shimmer row placeholders
    demoLeaderboard.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      const tr = document.createElement('tr');
      tr.className = 'shimmer-loading';
      tr.innerHTML = `<td colspan="7"></td>`;
      demoLeaderboard.appendChild(tr);
    }
 
    // Trigger simulate delay
    setTimeout(() => {
      // Calculate scores dynamically based on simRole & simSeniority
      const scored = MOCK_CANDIDATES.map(cand => {
        let scoreMod = cand.score;
        // Apply responsive simulation modifiers
        if (simRole.includes('Frontend') || simRole.includes('React') || simRole.includes('Fullstack')) {
          if (cand.skills.includes('React') || cand.skills.includes('TypeScript')) {
            scoreMod = Math.min(100, scoreMod + 5);
          } else if (cand.skills.includes('PyTorch')) {
            scoreMod = Math.max(40, scoreMod - 15);
          }
        } else if (simRole.includes('Machine Learning') || simRole.includes('AI')) {
          if (cand.skills.includes('PyTorch')) {
            scoreMod = Math.min(100, scoreMod + 3);
          }
        } else {
          if (cand.skills.includes('PyTorch')) {
            scoreMod = Math.max(40, scoreMod - 10);
          }
        }
 
        if (simSeniority === 'Junior') {
          scoreMod = Math.round(scoreMod * 0.7);
        } else if (simSeniority === 'Mid') {
          scoreMod = Math.round(scoreMod * 0.85);
        } else if (simSeniority === 'Lead') {
          scoreMod = Math.min(100, scoreMod + 2);
        }
 
        // Clamp
        scoreMod = Math.max(20, Math.min(100, scoreMod));
 
        return { ...cand, score: scoreMod };
      });

      // Sort
      scored.sort((a, b) => b.score - a.score);

      // Render
      demoLeaderboard.innerHTML = '';
      scored.forEach((cand, idx) => {
        const rank = idx + 1;
        const tr = document.createElement('tr');
        tr.style.opacity = '0';
        tr.style.transform = 'translateY(4px)';
        tr.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

        const trClass = cand.tech_depth.toLowerCase();
        const cfClass = cand.culture_fit.toLowerCase().replace(/\s/g, '').replace('/', '');

        tr.innerHTML = `
          <td class="col-rank">#${String(rank).padStart(2, '0')}</td>
          <td>
            <div class="candidate-cell">
              <div class="candidate-avatar">
                <img src="${cand.avatar}" alt="${cand.name}">
              </div>
              <div class="candidate-info">
                <span class="candidate-name">${cand.name}</span>
                <span class="candidate-role-sub">${cand.title}</span>
              </div>
            </div>
          </td>
          <td class="score-cell">
            <div class="score-bar-container">
              <div class="score-bar-bg">
                <div class="score-bar-fill" style="width: ${cand.score}%"></div>
              </div>
              <span class="score-text">${cand.score}%</span>
            </div>
          </td>
          <td><span class="tech-badge ${trClass}">${cand.tech_depth}</span></td>
          <td><span class="culture-badge ${cfClass}">${cand.culture_fit}</span></td>
          <td class="col-justification">"${cand.why_fit}"</td>
          <td class="col-tags">
            <div class="row-tags-wrapper">
              ${cand.skills.map(s => `<span class="row-tag">${s}</span>`).join('')}
            </div>
          </td>
        `;
        demoLeaderboard.appendChild(tr);

        // Fade entry
        requestAnimationFrame(() => {
          setTimeout(() => {
            tr.style.opacity = '1';
            tr.style.transform = 'translateY(0)';
          }, idx * 60);
        });
      });
    }, 400);
  }

  // Bind simulation listeners safely
  if (demoRoleSelect) {
    demoRoleSelect.addEventListener('change', () => {
      simRole = demoRoleSelect.value;
      renderSimLeaderboard();
    });
  }
 
  if (demoSeniorityPills) {
    demoSeniorityPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.seniority-pill');
      if (!pill) return;
      demoSeniorityPills.querySelectorAll('.seniority-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      simSeniority = pill.dataset.level;
      renderSimLeaderboard();
    });
  }
 
  // Initial simulation run if table element is present
  if (demoLeaderboard) {
    renderSimLeaderboard();
  }

  // Scroll reveal observer for educational animations in how.html
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // If it's Step 2 (Evaluation), trigger the percentage counter animation
          if (entry.target.id === 'step-evaluation') {
            const matchValEl = document.getElementById('matchValue');
            if (matchValEl && matchValEl.textContent === '0%') {
              animatePercentCounter(matchValEl, 97, 1000);
            }
          }
        }
      });
    }, { threshold: 0.25 });

    revealElements.forEach(el => observer.observe(el));
  }

  function animatePercentCounter(el, targetValue, durationMs) {
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      let progress = Math.min((timestamp - startTime) / durationMs, 1);
      let current = Math.floor(progress * targetValue);
      el.textContent = current + "%";
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = targetValue + "%";
      }
    }
    window.requestAnimationFrame(step);
  }
}


// ══════════════════════════════════════════════════════════════════════════════
// 3. DASHBOARD CONTROLLER — Full Functional Pipeline
// ══════════════════════════════════════════════════════════════════════════════
if (PAGE.isDashboard) {

  // State Management
  const state = {
    role: 'AI/Machine Learning Engineer',
    seniority: 'Senior',
    selectedSkills: new Set(['Python', 'AWS', 'PyTorch', 'Docker']),
    focusAreas: ['System Scalability', 'Clean Code'],
    redFlags: [],
    files: [],
    isEvaluating: false,
    results: null,
    currentSort: 'score',
  };

  // DOM Elements mapping
  const dom = {
    roleSearch: document.getElementById('roleSearch'),
    roleSelect: document.getElementById('roleSelect'),
    seniorityPills: document.getElementById('seniorityPills'),
    fileInput: document.getElementById('fileInput'),
    fileList: document.getElementById('fileList'),
    uploadZone: document.getElementById('uploadZone'),
    executeBtn: document.getElementById('executeBtn'),
    activeFilters: document.getElementById('activeFilters'),
    leaderboard: document.getElementById('leaderboard'),
    
    // Metrics
    metricProcessing: document.getElementById('metricProcessing'),
    metricCost: document.getElementById('metricCost'),
    metricSkill: document.getElementById('metricSkill'),
    metricFlags: document.getElementById('metricFlags'),
    metricFlagsBadge: document.getElementById('metricFlagsBadge'),
    
    // Sort Controls
    sortButtons: document.querySelectorAll('.sort-button'),
    
    // Loading overlay
    loadingOverlay: document.getElementById('loadingOverlay'),
    progressFill: document.getElementById('progressFill'),
    loadingText: document.getElementById('loadingText'),

    // Drawer
    drawerBackdrop: document.getElementById('drawerBackdrop'),
    detailDrawer: document.getElementById('detailDrawer'),
    drawerTitle: document.getElementById('drawerTitle'),
    drawerBody: document.getElementById('drawerBody'),
    drawerClose: document.getElementById('drawerClose'),
  };

  // Populate roles dropdown
  populateRoleSelect(dom.roleSelect, state.role);
  bindRoleSearch(dom.roleSearch, dom.roleSelect);

  dom.roleSelect.addEventListener('change', () => {
    state.role = dom.roleSelect.value;
    syncCheckboxesToFiltersPanel();
  });

  // Experience Seniority Pills Selection
  dom.seniorityPills.addEventListener('click', (e) => {
    const pill = e.target.closest('.seniority-pill');
    if (!pill) return;
    dom.seniorityPills.querySelectorAll('.seniority-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    state.seniority = pill.dataset.level;
  });

  // Technical Accordion filters & lists management
  function updateCheckboxStateFromPillChange(skillName, checked) {
    const checkbox = document.querySelector(`.tech-checklist input[value="${skillName}"]`);
    if (checkbox) {
      checkbox.checked = checked;
    }
  }

  function collectFilters() {
    // Collect stack checkbox values
    state.selectedSkills.clear();
    document.querySelectorAll('.tech-checklist input[type="checkbox"]').forEach(cb => {
      const section = cb.closest('details');
      // If it belongs to one of stack filters (Languages, Clouds, Databases)
      if (section && (section.innerHTML.includes('Languages') || section.innerHTML.includes('Clouds') || section.innerHTML.includes('Databases'))) {
        if (cb.checked) {
          state.selectedSkills.add(cb.value);
        }
      }
    });

    // Collect Engineering Focus checkbox values
    state.focusAreas = [];
    ['focus-scalability', 'focus-cleancode', 'focus-cultural'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.checked) state.focusAreas.push(el.value);
    });

    // Collect Red Flags checkbox values
    state.redFlags = [];
    ['flag-jobhopping', 'flag-keywordstuffing'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.checked) state.redFlags.push(el.value);
    });

    syncCheckboxesToFiltersPanel();
  }

  // Micro-search checklist filter behavior
  document.querySelectorAll('.tech-micro-search').forEach(searchField => {
    searchField.addEventListener('input', () => {
      const query = searchField.value.toLowerCase();
      const listContainer = searchField.nextElementSibling;
      if (!listContainer) return;
      listContainer.querySelectorAll('.tech-check-item').forEach(item => {
        const labelText = item.textContent.toLowerCase();
        item.style.display = labelText.includes(query) ? 'flex' : 'none';
      });
    });
  });

  // Render bottom active filters tags
  function syncCheckboxesToFiltersPanel() {
    dom.activeFilters.innerHTML = '';
    
    // Add active target role as fixed indicator
    const rolePill = document.createElement('span');
    rolePill.className = 'active-tag';
    rolePill.style.borderColor = 'var(--color-accent-blue)';
    rolePill.innerHTML = `💼 ${state.role}`;
    dom.activeFilters.appendChild(rolePill);

    // Add active skills tags
    state.selectedSkills.forEach(skill => {
      const pill = document.createElement('span');
      pill.className = 'active-tag';
      pill.innerHTML = `${skill} <span class="tag-close" data-skill="${skill}">&times;</span>`;
      dom.activeFilters.appendChild(pill);
    });
  }

  // Handle active filters close button tag click event
  dom.activeFilters.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.tag-close');
    if (!closeBtn) return;
    const skillName = closeBtn.dataset.skill;
    state.selectedSkills.delete(skillName);
    updateCheckboxStateFromPillChange(skillName, false);
    syncCheckboxesToFiltersPanel();
  });

  // Bind change events to all sidebar checkboxes to update active tags listing
  document.querySelectorAll('.tech-checklist input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', collectFilters);
  });

  // Initial Sync
  collectFilters();

  // ── File Upload List management ──────────────────────────────────────────
  function addUploadFiles(newFiles) {
    for (const f of newFiles) {
      if (!state.files.some(existing => existing.name === f.name)) {
        state.files.push(f);
      }
    }
    renderUploadFilesList();
  }

  function removeUploadFile(index) {
    state.files.splice(index, 1);
    renderUploadFilesList();
  }

  function renderUploadFilesList() {
    dom.fileList.innerHTML = '';
    state.files.forEach((file, idx) => {
      const tag = document.createElement('span');
      tag.className = 'file-pill';
      tag.innerHTML = `📄 ${escapeHtml(file.name)} <span class="remove-file" data-idx="${idx}">&times;</span>`;
      dom.fileList.appendChild(tag);
    });

    if (state.files.length > 0) {
      dom.uploadZone.style.borderColor = 'var(--color-accent-blue)';
    } else {
      dom.uploadZone.style.borderColor = 'var(--color-light-ash)';
    }
  }

  dom.fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) addUploadFiles(e.target.files);
  });

  dom.fileList.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.remove-file');
    if (removeBtn) {
      removeUploadFile(parseInt(removeBtn.dataset.idx, 10));
    }
  });

  // Drag-and-drop event bindings
  dom.uploadZone.addEventListener('dragenter', (e) => { e.preventDefault(); dom.uploadZone.classList.add('drag-over'); });
  dom.uploadZone.addEventListener('dragover',  (e) => { e.preventDefault(); dom.uploadZone.classList.add('drag-over'); });
  dom.uploadZone.addEventListener('dragleave', (e) => { e.preventDefault(); dom.uploadZone.classList.remove('drag-over'); });
  dom.uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dom.uploadZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length) addUploadFiles(e.dataTransfer.files);
  });

  // ── Execute Evaluation Pipeline ──────────────────────────────────────────
  dom.executeBtn.addEventListener('click', async () => {
    if (state.files.length === 0) {
      alert("Please upload at least one candidate resume PDF or text file.");
      return;
    }
    if (state.isEvaluating) return;
    state.isEvaluating = true;
    dom.executeBtn.disabled = true;

    // Show loading screen progress indicator
    dom.loadingOverlay.classList.add('visible');
    dom.progressFill.style.width = '10%';
    dom.loadingText.textContent = 'Formatting parameters strategy...';

    // Synchronize latest configuration states
    collectFilters();

    const config = {
      target_role: state.role,
      seniority: state.seniority,
      tech_stack: Array.from(state.selectedSkills),
      focus_areas: state.focusAreas,
      red_flags: state.redFlags,
    };

    const formData = new FormData();
    formData.append('config', JSON.stringify(config));
    state.files.forEach(file => formData.append('files', file));

    dom.progressFill.style.width = '35%';
    dom.loadingText.textContent = 'Connecting evaluation pipeline...';
    const startTime = performance.now();

    try {
      const response = await fetch('/api/evaluate', { method: 'POST', body: formData, credentials: 'same-origin' });
      dom.progressFill.style.width = '75%';
      dom.loadingText.textContent = 'Analyzing and scoring profiles...';

      if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: 'API error response failed' }));
        throw new Error(err.detail || `Server status ${response.status}`);
      }

      const results = await response.json();
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);

      dom.progressFill.style.width = '100%';
      dom.loadingText.textContent = 'Drawing live metrics...';
      
      // Delay slightly for presentation
      await new Promise(r => setTimeout(r, 200));

      state.results = results;
      state.currentSort = 'score';
      updateMetricsKPI(elapsed, config);
      renderLeaderboardRows(results);
      syncSortControls();

    } catch (err) {
      console.error('API Post Execution Failure:', err);
      dom.leaderboard.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="leaderboard-empty" style="color: var(--color-accent-red); border-color: var(--color-accent-red);">
              ⚠️ Evaluation failed: ${escapeHtml(err.message)}
            </div>
          </td>
        </tr>`;
    } finally {
      dom.loadingOverlay.classList.remove('visible');
      state.isEvaluating = false;
      dom.executeBtn.disabled = false;
    }
  });

  // Render metrics KPIs
  function updateMetricsKPI(seconds, config) {
    dom.metricProcessing.textContent = `${seconds}s`;
    dom.metricCost.textContent = '$14.2k';
    
    const topSkill = config.tech_stack[0] || 'Python';
    dom.metricSkill.textContent = topSkill;

    const density = config.red_flags.length;
    if (density === 0) {
      dom.metricFlags.textContent = 'Low (0%)';
      dom.metricFlagsBadge.className = 'analytics-badge green';
      dom.metricFlagsBadge.textContent = 'Low';
    } else if (density === 1) {
      dom.metricFlags.textContent = 'Med (12%)';
      dom.metricFlagsBadge.className = 'analytics-badge gray';
      dom.metricFlagsBadge.textContent = 'Moderate';
    } else {
      dom.metricFlags.textContent = 'High (24%)';
      dom.metricFlagsBadge.className = 'analytics-badge gray';
      dom.metricFlagsBadge.textContent = 'High Density';
    }
  }

  // Render leaderboard rows
  function renderLeaderboardRows(results) {
    dom.leaderboard.innerHTML = '';
    if (!results || results.length === 0) {
      dom.leaderboard.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="leaderboard-empty">No matching candidates could be fetched.</div>
          </td>
        </tr>`;
      return;
    }

    results.forEach((cand, idx) => {
      const rank = idx + 1;
      const tr = document.createElement('tr');
      tr.dataset.idx = idx; // Store data index for drawer modal
      tr.style.cursor = 'pointer';

      // Load matching classes for badges
      const tdClass = cand.tech_depth.toLowerCase();
      const cfClass = cand.culture_fit.toLowerCase().replace(/\s/g, '').replace('/', '');

      // Profile avatar mockup generator
      let avatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'; // Default male
      if (cand.name.includes('Elena') || cand.name.includes('Sarah') || cand.name.includes('Sofia') || cand.name.includes('Olivia') || cand.name.includes('Sophia')) {
        avatarUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'; // Female
      } else if (cand.name.includes('Julian') || cand.name.includes('Alex') || cand.name.includes('Chen') || cand.name.includes('Liam')) {
        avatarUrl = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100';
      }

      tr.innerHTML = `
        <td class="col-rank">#${String(rank).padStart(2, '0')}</td>
        <td>
          <div class="candidate-cell">
            <div class="candidate-avatar">
              <img src="${avatarUrl}" alt="${escapeHtml(cand.name)}">
            </div>
            <div class="candidate-info">
              <span class="candidate-name">${escapeHtml(cand.name)}</span>
              <span class="candidate-role-sub">${escapeHtml(cand.title)}</span>
            </div>
          </div>
        </td>
        <td class="score-cell">
          <div class="score-bar-container">
            <div class="score-bar-bg">
              <div class="score-bar-fill" style="width: ${cand.score}%"></div>
            </div>
            <span class="score-text">${cand.score}%</span>
          </div>
        </td>
        <td><span class="tech-badge ${tdClass}">${cand.tech_depth}</span></td>
        <td><span class="culture-badge ${cfClass}">${cand.culture_fit}</span></td>
        <td class="col-justification">"${escapeHtml(cand.why_fit)}"</td>
        <td class="col-tags">
          <div class="row-tags-wrapper">
            ${(cand.skills || []).slice(0, 4).map(s => `<span class="row-tag">${s}</span>`).join('')}
          </div>
        </td>
      `;

      // Drawer details inspector click trigger
      tr.addEventListener('click', () => {
        openCandidateDetailsDrawer(cand, avatarUrl);
      });

      dom.leaderboard.appendChild(tr);
    });
  }

  // Profile Inspector Detail Drawer
  function openCandidateDetailsDrawer(candidate, avatar) {
    dom.drawerTitle.textContent = candidate.name;
    
    dom.drawerBody.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px;">
        <div class="candidate-avatar" style="width: 64px; height: 64px;">
          <img src="${avatar}" alt="${candidate.name}" style="width: 100%; height: 100%;">
        </div>
        <div style="display: flex; flex-direction: column;">
          <h3 style="font-size: 18px; font-weight: 700;">${candidate.name}</h3>
          <span style="font-size: 13px; color: var(--color-graphite);">${candidate.title}</span>
        </div>
      </div>

      <div class="drawer-section">
        <label class="sidebar-label">Strategy Fit Score</label>
        <div class="score-bar-container" style="margin-top: 5px;">
          <div class="score-bar-bg" style="width: 150px; height: 8px;">
            <div class="score-bar-fill" style="width: ${candidate.score}%"></div>
          </div>
          <strong style="font-size: 15px; color: var(--color-accent-blue);">${candidate.score}% Overall Fit</strong>
        </div>
      </div>

      <div class="drawer-section">
        <label class="sidebar-label">Signal Assessments</label>
        <div style="display: flex; gap: 10px; margin-top: 5px;">
          <div>
            <span class="sidebar-label" style="font-size: 10px; display: block; margin-bottom: 2px;">Tech Depth</span>
            <span class="tech-badge ${candidate.tech_depth.toLowerCase()}">${candidate.tech_depth}</span>
          </div>
          <div>
            <span class="sidebar-label" style="font-size: 10px; display: block; margin-bottom: 2px;">Culture Alignment</span>
            <span class="culture-badge ${candidate.culture_fit.toLowerCase().replace(/\s/g, '').replace('/', '')}">${candidate.culture_fit}</span>
          </div>
        </div>
      </div>

      <div class="drawer-section">
        <label class="sidebar-label">Pipeline Justification</label>
        <p style="font-size: 13px; color: var(--color-graphite); font-style: italic; margin-top: 5px; line-height: 1.5;">
          "${candidate.why_fit}"
        </p>
      </div>

      <div class="drawer-section">
        <label class="sidebar-label">Extracted Skill Keywords</label>
        <div class="row-tags-wrapper" style="margin-top: 8px; gap: 6px;">
          ${(candidate.skills || []).map(s => `<span class="row-tag" style="font-size: 12px; padding: 3px 10px;">${s}</span>`).join('')}
        </div>
      </div>
    `;

    dom.drawerBackdrop.classList.add('visible');
    dom.detailDrawer.classList.add('open');
  }

  function closeCandidateDrawer() {
    dom.detailDrawer.classList.remove('open');
    dom.drawerBackdrop.classList.remove('visible');
  }

  dom.drawerClose.addEventListener('click', closeCandidateDrawer);
  dom.drawerBackdrop.addEventListener('click', closeCandidateDrawer);

  // Sorting columns triggers
  dom.sortButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!state.results) return;
      state.currentSort = btn.dataset.sort;
      syncSortControls();
      
      const sorted = [...state.results];
      if (state.currentSort === 'score') {
        sorted.sort((a, b) => b.score - a.score);
      } else if (state.currentSort === 'tech_depth') {
        const priority = { 'Exemplary': 3, 'Strong': 2, 'Average': 1 };
        sorted.sort((a, b) => (priority[b.tech_depth] || 0) - (priority[a.tech_depth] || 0));
      } else if (state.currentSort === 'name') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
      }
      renderLeaderboardRows(sorted);
    });
  });

  function syncSortControls() {
    dom.sortButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.sort === state.currentSort);
    });
  }

  // Omni-search input filter behavior
  const omniSearch = document.getElementById('omniSearch');
  if (omniSearch) {
    omniSearch.addEventListener('input', () => {
      if (!state.results) return;
      const query = omniSearch.value.toLowerCase();
      const filtered = state.results.filter(cand => {
        return cand.name.toLowerCase().includes(query) || 
               cand.title.toLowerCase().includes(query) ||
               (cand.skills || []).some(s => s.toLowerCase().includes(query));
      });
      renderLeaderboardRows(filtered);
    });
  }

  // ── Initial Pre-Population Setup ─────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    collectFilters();
  });
}
