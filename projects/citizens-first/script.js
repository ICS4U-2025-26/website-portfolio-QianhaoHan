// ARRAYS FOR DATA STORAGE

// Array of income categories (objects with name, id, placeholder)
const incomeCategories = [
  { name: "School Funding", id: "income-school", placeholder: "e.g., 2000" },
  { name: "Sponsorships", id: "income-sponsors", placeholder: "e.g., 1500" },
  { name: "Fundraising", id: "income-fundraising", placeholder: "e.g., 800" },
  { name: "Grants", id: "income-grants", placeholder: "e.g., 1000" },
  { name: "Registration Subsidies", id: "income-subsidies", placeholder: "e.g., 500" },
  { name: "Other Income", id: "income-other", placeholder: "e.g., 200" }
];

// Array of expense categories (objects with name, id, placeholder)
const expenseCategories = [
  { name: "Registration Fees", id: "expense-registration", placeholder: "e.g., 1500" },
  { name: "Robot Parts & Electronics", id: "expense-parts", placeholder: "e.g., 2000" },
  { name: "Tools & Equipment", id: "expense-tools", placeholder: "e.g., 500" },
  { name: "Travel (Gas/Transport)", id: "expense-travel", placeholder: "e.g., 800" },
  { name: "Hotels & Accommodation", id: "expense-hotels", placeholder: "e.g., 600" },
  { name: "Practice Field/Space", id: "expense-field", placeholder: "e.g., 300" },
  { name: "Team Shirts/Uniforms", id: "expense-uniforms", placeholder: "e.g., 400" },
  { name: "Other Expenses", id: "expense-other", placeholder: "e.g., 200" }
];

// Array of resource recommendations (objects with name, url, description, riskLevel, category, type)
const resources = [
  { 
    name: "Tech2gether", 
    url: "https://tech2gether.ca/home", 
    description: "Non-profit organization providing funding and support to students passionate about robotics.",
    riskLevel: "all",
    category: "resource",
    type: "general"
  },
  { 
    name: "FIRST Robotics Grants", 
    url: "https://www.firstinspires.org/programs/team-grant-opportunities", 
    description: "Official FIRST grants for teams in need of financial assistance.",
    riskLevel: "At Risk",
    category: "grant",
    type: "first"
  },
  { 
    name: "VEX Robotics Grants", 
    url: "https://www.vexrobotics.com/grants?srsltid=AfmBOopsDOi7x6TPy1QCIaq-ZzBK6R8K4F1cLI-gLjUs7AjQv0LWAKdt", 
    description: "Grant opportunities for VEX competition teams.",
    riskLevel: "At Risk",
    category: "grant",
    type: "vex"
  },
  { 
    name: "Studica Robotics Documentation on the FIRST Tech Challenge", 
    url: "https://docs.studica.com/en/latest/", 
    description: "Information and tutorials on robotics related to FTC.",
    riskLevel: "all",
    category: "resource",
    type: "first"
  },
  { 
    name: "Let's Talk Science", 
    url: "https://letstalkscience.ca/", 
    description: "Free STEM resources and volunteer support for Canadian schools.",
    riskLevel: "all",
    category: "resource",
    type: "general"
  },
  { 
    name: "FIRST Robotics Fundraising Guide", 
    url: "https://www.firstinspires.org/hubfs/web/program/frc/resources/fundraising-guide.pdf?hsLang=en", 
    description: "Tips for approaching businesses and companies for sponsorships.",
    riskLevel: "Caution",
    category: "resource",
    type: "first"
  },
  { 
    name: "Best Buy Teen Tech Teams", 
    url: "https://www.bestbuy.ca/en-ca/about/teen-tech-teams/blt8a155954518efafe", 
    description: "Provides high school robotics teams with funds to access cutting-edge tech.",
    riskLevel: "Caution",
    category: "grant",
    type: "general"
  }
];

// Array to store season events (will be populated by user)
let events = [];

// Array to store tasks
let tasks = [];

// GENERATE INPUT FIELDS USING LOOPS

// Function to generate income input fields
function generateIncomeInputs() {
  let htmlString = "";
  for (let i = 0; i < incomeCategories.length; i++) {
    const category = incomeCategories[i];
    htmlString += `
      <div class="input-group">
        <label for="${category.id}">${category.name} ($)</label>
        <input type="number" id="${category.id}" placeholder="${category.placeholder}">
      </div>
    `;
  }
  document.getElementById("income-inputs").innerHTML = htmlString;
}

// Function to generate expense input fields
function generateExpenseInputs() {
  let htmlString = "";
  for (let i = 0; i < expenseCategories.length; i++) {
    const category = expenseCategories[i];
    htmlString += `
      <div class="input-group">
        <label for="${category.id}">${category.name} ($)</label>
        <input type="number" id="${category.id}" placeholder="${category.placeholder}">
      </div>
    `;
  }
  document.getElementById("expense-inputs").innerHTML = htmlString;
}

// Function to generate resources list with filter support
function generateResourcesList() {
  let htmlString = "";
  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    htmlString += `
      <div class="resource-card" data-type="${resource.type}" data-category="${resource.category}">
        <a href="${resource.url}" target="_blank">${resource.name}</a>
        <p>${resource.description}</p>
        <div class="resource-tags">
          <span class="resource-tag ${resource.type}">${resource.type.toUpperCase()}</span>
          <span class="resource-tag ${resource.category}">${resource.category}</span>
          <span class="resource-tag">${resource.riskLevel === "all" ? "All Teams" : resource.riskLevel}</span>
        </div>
      </div>
    `;
  }
  document.getElementById("resources-list").innerHTML = htmlString;
}

// RESOURCE FILTER FUNCTIONALITY

// Function to initialize resource filters
function initializeResourceFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      
      // Filter resources
      const filter = this.getAttribute('data-filter');
      filterResources(filter);
    });
  });
}

// Function to filter resources based on selected filter
function filterResources(filter) {
  const resourceCards = document.querySelectorAll('.resource-card');
  
  resourceCards.forEach(card => {
    if (filter === 'all') {
      card.classList.remove('hidden');
    } else {
      const resourceType = card.getAttribute('data-type');
      const resourceCategory = card.getAttribute('data-category');
      
      if (resourceType === filter || resourceCategory === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    }
  });
}

// BUDGET CALCULATION FUNCTIONS

// Function to calculate total income using loop and parseFloat for type conversion
function calculateTotalIncome() {
  let totalIncome = 0;
  for (let i = 0; i < incomeCategories.length; i++) {
    const inputValue = document.getElementById(incomeCategories[i].id).value;
    // TYPE CONVERSION: Using parseFloat to convert string to number
    const numericValue = parseFloat(inputValue);
    // Handle empty or invalid inputs (treat as 0)
    if (!isNaN(numericValue)) {
      totalIncome += numericValue;
    }
  }
  return totalIncome;
}

// Function to calculate total expenses using loop and parseFloat for type conversion
function calculateTotalExpenses() {
  let totalExpenses = 0;
  for (let i = 0; i < expenseCategories.length; i++) {
    const inputValue = document.getElementById(expenseCategories[i].id).value;
    // TYPE CONVERSION: Using parseFloat to convert string to number
    const numericValue = parseFloat(inputValue);
    // Handle empty or invalid inputs (treat as 0)
    if (!isNaN(numericValue)) {
      totalExpenses += numericValue;
    }
  }
  return totalExpenses;
}

// Function to determine risk level using conditionals (if/else if/else)
function determineRiskLevel(coverageRatio) {
  // CONDITIONALS: Using if/else if/else to classify risk level
  if (coverageRatio >= 1.2) {
    return "Safe";
  } else if (coverageRatio >= 0.8) {
    return "Caution";
  } else {
    return "At Risk";
  }
}

// Function to get risk explanation based on risk level
function getRiskExplanation(riskLevel, remainingBudget) {
  // CONDITIONALS: Different messages based on risk level
  if (riskLevel === "Safe") {
    return `<strong>Great news!</strong> Your team has a healthy budget with a surplus of $${remainingBudget.toFixed(2)}. 
            You have enough funds to cover all expected expenses with room for unexpected costs. 
            Consider saving the surplus for next season or investing in team development.`;
  } else if (riskLevel === "Caution") {
    if (remainingBudget >= 0) {
      return `<strong>Heads up!</strong> Your budget is tight but manageable. You have $${remainingBudget.toFixed(2)} remaining, 
              but there's little room for unexpected expenses. Consider seeking additional sponsorships or reducing non-essential costs.`;
    } else {
      return `<strong>Warning!</strong> You're projected to have a deficit of $${Math.abs(remainingBudget).toFixed(2)}. 
              You'll need to find additional funding or cut some expenses to break even.`;
    }
  } else {
    return `<strong>Action Required!</strong> Your team is facing a significant budget shortfall of $${Math.abs(remainingBudget).toFixed(2)}. 
            This is common for many teams in Canada, especially those from lower-income schools. 
            Don't give up! Check out the grants and sponsorship resources below. Many organizations specifically help teams in your situation.`;
  }
}

// Function to get recommendations based on risk level
function getRecommendations(riskLevel) {
  let recommendations = "<h4>Recommended Actions:</h4><ul>";
  
  // CONDITIONALS: Different recommendations based on risk level
  if (riskLevel === "Safe") {
    recommendations += "<li>Build an emergency fund for unexpected costs</li>";
    recommendations += "<li>Consider mentoring other teams in need</li>";
    recommendations += "<li>Invest in team training and development</li>";
    recommendations += "<li>Document your fundraising success to help others</li>";
  } else if (riskLevel === "Caution") {
    recommendations += "<li>Apply for additional grants (see resources below)</li>";
    recommendations += "<li>Reach out to 2-3 more local business sponsors</li>";
    recommendations += "<li>Consider carpooling to reduce travel costs</li>";
    recommendations += "<li>Look for used parts from veteran teams</li>";
    recommendations += "<li>Host a fundraising event (car wash, bake sale)</li>";
  } else {
    recommendations += "<li><strong>Apply for emergency grants immediately</strong></li>";
    recommendations += "<li>Contact FIRST or VEX about hardship programs</li>";
    recommendations += "<li>Partner with a veteran team for mentorship and parts</li>";
    recommendations += "<li>Reach out to local tech companies for sponsorship</li>";
    recommendations += "<li>Consider community crowdfunding campaigns</li>";
    recommendations += "<li>Ask your school about emergency activity funds</li>";
  }
  
  recommendations += "</ul>";
  return recommendations;
}

// Main calculation function
function calculateBudgetHealth() {
  // VARIABLES: Store calculated values
  const totalIncome = calculateTotalIncome();
  const totalExpenses = calculateTotalExpenses();
  const remainingBudget = totalIncome - totalExpenses;
  
  // Calculate coverage ratio (handle division by zero)
  let coverageRatio = 0;
  if (totalExpenses > 0) {
    coverageRatio = totalIncome / totalExpenses;
  } else if (totalIncome > 0) {
    coverageRatio = 2; // If no expenses but have income, consider safe
  }
  
  // Determine risk level using conditionals
  const riskLevel = determineRiskLevel(coverageRatio);
  
  // Get team name
  const teamName = document.getElementById("team-name").value || "Your Team";
  
  // DOM MANIPULATION
  
  // Show results container
  document.getElementById("results").classList.remove("hidden");
  
  // Update team name using textContent
  document.getElementById("result-team-name").textContent = teamName;
  
  // Update result values using textContent
  document.getElementById("total-income").textContent = "$" + totalIncome.toFixed(2);
  document.getElementById("total-expenses").textContent = "$" + totalExpenses.toFixed(2);
  document.getElementById("remaining-budget").textContent = "$" + remainingBudget.toFixed(2);
  document.getElementById("coverage-ratio").textContent = (coverageRatio * 100).toFixed(0) + "%";
  
  // Update risk label using textContent
  document.getElementById("risk-label").textContent = "Risk Level: " + riskLevel;
  
  // Update risk indicator styling
  const riskIndicator = document.getElementById("risk-indicator");
  riskIndicator.className = "risk-indicator"; // Reset classes
  
  // CONDITIONALS: Apply different CSS classes based on risk level
  if (riskLevel === "Safe") {
    riskIndicator.classList.add("safe");
  } else if (riskLevel === "Caution") {
    riskIndicator.classList.add("caution");
  } else {
    riskIndicator.classList.add("at-risk");
  }
  
  // Update explanation using innerHTML (for formatted HTML content)
  document.getElementById("risk-explanation").innerHTML = getRiskExplanation(riskLevel, remainingBudget);
  
  // Update recommendations using innerHTML
  document.getElementById("recommendations").innerHTML = getRecommendations(riskLevel);
  
  // DIRECT PROPERTY ACCESS: Change href of resource link based on risk level
  const resourceLink = document.getElementById("main-resource-link");
  if (riskLevel === "At Risk") {
    resourceLink.href = "https://www.firstinspires.org/robotics/frc/grants";
    resourceLink.textContent = "Apply for FIRST Grants Now";
  } else if (riskLevel === "Caution") {
    resourceLink.href = "https://www.firstinspires.org/sites/default/files/uploads/resource_library/fundraising/team-sponsorship-guide.pdf";
    resourceLink.textContent = "View Sponsorship Guide";
  } else {
    resourceLink.href = "#resources";
    resourceLink.textContent = "Explore All Resources";
  }
  
  // FILTER RESOURCES BASED ON RISK LEVEL
  filterResourcesByRiskLevel(riskLevel);
  
  // Scroll to results
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
  
  // Save to localStorage
  saveBudgetData();
}

// New function to filter resources based on risk level
function filterResourcesByRiskLevel(riskLevel) {
  const resourceCards = document.querySelectorAll('.resource-card');
  
  resourceCards.forEach(card => {
    const riskLevelAttr = card.querySelector('.resource-tag:last-child').textContent;
    
    // Show/hide resources based on risk level
    if (riskLevel === "Safe") {
      // Safe teams only see "All Teams" resources
      if (riskLevelAttr === "All Teams") {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    } else if (riskLevel === "Caution") {
      // Caution teams see "All Teams" and "Caution" resources
      if (riskLevelAttr === "All Teams" || riskLevelAttr === "Caution") {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    } else {
      // At Risk teams see all resources
      card.classList.remove('hidden');
    }
  });
  
  // Also update the filter buttons to show "Recommended" as active
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => btn.classList.remove('active'));
  
  // Find and activate the "Recommended" filter button if it exists, or create one
  let recommendedBtn = document.querySelector('.filter-btn[data-filter="recommended"]');
  if (!recommendedBtn) {
    // Create a recommended filter button if it doesn't exist
    const filterButtonsContainer = document.querySelector('.filter-buttons');
    recommendedBtn = document.createElement('button');
    recommendedBtn.className = 'filter-btn active';
    recommendedBtn.setAttribute('data-filter', 'recommended');
    recommendedBtn.textContent = 'Recommended';
    filterButtonsContainer.appendChild(recommendedBtn);
    
    // Add event listener to the new button
    recommendedBtn.addEventListener('click', function() {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      filterResourcesByRiskLevel(riskLevel);
    });
  } else {
    recommendedBtn.classList.add('active');
  }
}

// SEASON PLANNER FUNCTIONS

// Function to render events table using loop and innerHTML
function renderEventsTable() {
  const tableBody = document.getElementById("events-table-body");
  
  if (events.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" class="empty-message">No events added yet. Add your first event above!</td></tr>';
    document.getElementById("events-total").textContent = "";
    return;
  }
  
  // LOOP: Build HTML string for all events
  let eventsHTML = "";
  let totalEventCost = 0;
  
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    totalEventCost += event.cost;
    
    // Determine status badge class
    let statusClass = "status-planned";
    if (event.status === "Registered") {
      statusClass = "status-registered";
    } else if (event.status === "Completed") {
      statusClass = "status-completed";
    }
    
    eventsHTML += `
      <tr>
        <td>${event.name}</td>
        <td>${event.date}</td>
        <td>$${event.cost.toFixed(2)}</td>
        <td><span class="status-badge ${statusClass}">${event.status}</span></td>
        <td><button class="btn-delete" onclick="deleteEvent(${i})">Delete</button></td>
      </tr>
    `;
  }
  
  // Use innerHTML to update the table
  tableBody.innerHTML = eventsHTML;
  
  // Update total using textContent
  document.getElementById("events-total").textContent = "Total Planned Event Costs: $" + totalEventCost.toFixed(2);
}

// Function to add a new event
function addEvent() {
  // Read user input using getElementById().value
  const eventName = document.getElementById("event-name").value;
  const eventDate = document.getElementById("event-date").value;
  const eventCostValue = document.getElementById("event-cost").value;
  const eventStatus = document.getElementById("event-status").value;
  
  // Validate inputs
  if (!eventName.trim()) {
    alert("Please enter an event name.");
    return;
  }
  
  if (!eventDate) {
    alert("Please select a date.");
    return;
  }
  
  // TYPE CONVERSION: Convert cost string to number using parseFloat
  const eventCost = parseFloat(eventCostValue) || 0;
  
  // Create event object and push to events array
  const newEvent = {
    name: eventName,
    date: eventDate,
    cost: eventCost,
    status: eventStatus
  };
  
  events.push(newEvent);
  
  // Re-render the events table
  renderEventsTable();
  
  // Clear input fields
  document.getElementById("event-name").value = "";
  document.getElementById("event-date").value = "";
  document.getElementById("event-cost").value = "";
  document.getElementById("event-status").value = "Planned";
  
  // Save to localStorage
  saveEventsData();
}

// Function to delete an event
function deleteEvent(index) {
  events.splice(index, 1);
  renderEventsTable();
  saveEventsData();
}

// TASK MANAGEMENT FUNCTIONS

// Function to add a new task
function addTask() {
  // Read user input
  const taskName = document.getElementById("task-name").value;
  const taskDeadline = document.getElementById("task-deadline").value;
  const taskAssigned = document.getElementById("task-assigned").value;
  const taskPriority = document.getElementById("task-priority").value;
  const taskProgress = document.getElementById("task-progress").value;
  
  // Validate inputs
  if (!taskName.trim()) {
    alert("Please enter a task name.");
    return;
  }
  
  if (!taskDeadline) {
    alert("Please select a deadline.");
    return;
  }
  
  // Create task object
  const newTask = {
    id: Date.now(), // Unique ID based on timestamp
    name: taskName,
    deadline: taskDeadline,
    assigned: taskAssigned || "Unassigned",
    priority: taskPriority,
    progress: taskProgress,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  
  // Re-render the tasks
  renderTasks();
  
  // Clear input fields
  document.getElementById("task-name").value = "";
  document.getElementById("task-deadline").value = "";
  document.getElementById("task-assigned").value = "";
  document.getElementById("task-priority").value = "Medium";
  document.getElementById("task-progress").value = "Not Started";
  
  // Save to localStorage
  saveTasksData();
  
  // Update summary
  updateTasksSummary();
}

// Function to render tasks
function renderTasks() {
  const tasksGrid = document.querySelector(".tasks-grid");
  const progressFilter = document.getElementById("progress-filter").value;
  const priorityFilter = document.getElementById("priority-filter").value;
  const sortBy = document.getElementById("sort-tasks").value;
  
  // Filter tasks
  let filteredTasks = tasks.filter(task => {
    const progressMatch = progressFilter === "all" || task.progress === progressFilter;
    const priorityMatch = priorityFilter === "all" || task.priority === priorityFilter;
    return progressMatch && priorityMatch;
  });
  
  // Sort tasks
  filteredTasks.sort((a, b) => {
    switch (sortBy) {
      case "deadline":
        return new Date(a.deadline) - new Date(b.deadline);
      case "priority":
        const priorityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
  
  // Check if there are tasks
  if (filteredTasks.length === 0) {
    tasksGrid.innerHTML = '<div class="empty-tasks">No tasks found. Add your first task above!</div>';
    return;
  }
  
  // Build HTML for tasks
  let tasksHTML = "";
  
  for (let i = 0; i < filteredTasks.length; i++) {
    const task = filteredTasks[i];
    const deadline = new Date(task.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Determine deadline status
    let deadlineStatus = "future";
    let deadlineText = "Due " + formatDate(deadline);
    
    if (deadline < today) {
      deadlineStatus = "overdue";
      const daysOverdue = Math.floor((today - deadline) / (1000 * 60 * 60 * 24));
      deadlineText = `Overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`;
    } else if (deadline.getTime() === today.getTime()) {
      deadlineStatus = "upcoming";
      deadlineText = "Due today";
    } else if ((deadline - today) / (1000 * 60 * 60 * 24) <= 7) {
      deadlineStatus = "upcoming";
      const daysUntil = Math.floor((deadline - today) / (1000 * 60 * 60 * 24));
      deadlineText = `Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`;
    }
    
    tasksHTML += `
      <div class="task-card" data-priority="${task.priority}">
        <div class="task-card-header">
          <h4 class="task-card-title">${task.name}</h4>
          <span class="task-priority ${task.priority}">${task.priority}</span>
        </div>
        <div class="task-card-body">
          <div class="task-detail">
            <span class="task-detail-label">Assigned to:</span>
            <span class="task-detail-value">${task.assigned}</span>
          </div>
          <div class="task-detail">
            <span class="task-detail-label">Deadline:</span>
            <span class="task-detail-value deadline-warning ${deadlineStatus}">${deadlineText}</span>
          </div>
          <div class="task-detail">
            <span class="task-detail-label">Created:</span>
            <span class="task-detail-value">${formatDate(new Date(task.createdAt))}</span>
          </div>
        </div>
        <div class="task-card-footer">
          <span class="task-progress ${task.progress.replace(' ', '-')}">${task.progress}</span>
          <div class="task-actions">
            <button class="btn-update-progress" onclick="updateTaskProgress(${task.id})">
              Update Progress
            </button>
            <button class="btn-delete-task" onclick="deleteTask(${task.id})">
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  tasksGrid.innerHTML = tasksHTML;
}

// Function to format date
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Function to update task progress
function updateTaskProgress(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  
  // Get current progress and determine next progress
  const progressOptions = ["Not Started", "In Progress", "Completed"];
  const currentIndex = progressOptions.indexOf(task.progress);
  const nextIndex = (currentIndex + 1) % progressOptions.length;
  task.progress = progressOptions[nextIndex];
  
  // Re-render tasks
  renderTasks();
  
  // Save to localStorage
  saveTasksData();
  
  // Update summary
  updateTasksSummary();
}

// Function to delete a task
function deleteTask(taskId) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
    saveTasksData();
    updateTasksSummary();
  }
}

// Function to update tasks summary
function updateTasksSummary() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.progress === "Completed").length;
  const inProgressTasks = tasks.filter(task => task.progress === "In Progress").length;
  const notStartedTasks = tasks.filter(task => task.progress === "Not Started").length;
  
  // Calculate overdue tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueTasks = tasks.filter(task => {
    return new Date(task.deadline) < today && task.progress !== "Completed";
  }).length;
  
  // Update summary values
  document.getElementById("total-tasks").textContent = totalTasks;
  document.getElementById("completed-tasks").textContent = completedTasks;
  document.getElementById("inprogress-tasks").textContent = inProgressTasks;
  document.getElementById("notstarted-tasks").textContent = notStartedTasks;
  document.getElementById("overdue-tasks").textContent = overdueTasks;
}

// LOCAL STORAGE FUNCTIONS

// Save budget data to localStorage
function saveBudgetData() {
  const budgetData = {
    teamName: document.getElementById("team-name").value
  };
  
  // Save income values
  for (let i = 0; i < incomeCategories.length; i++) {
    budgetData[incomeCategories[i].id] = document.getElementById(incomeCategories[i].id).value;
  }
  
  // Save expense values
  for (let i = 0; i < expenseCategories.length; i++) {
    budgetData[expenseCategories[i].id] = document.getElementById(expenseCategories[i].id).value;
  }
  
  localStorage.setItem("tech2gether-budget", JSON.stringify(budgetData));
}

// Load budget data from localStorage
function loadBudgetData() {
  const savedData = localStorage.getItem("tech2gether-budget");
  if (savedData) {
    const budgetData = JSON.parse(savedData);
    
    // Load team name
    if (budgetData.teamName) {
      document.getElementById("team-name").value = budgetData.teamName;
    }
    
    // Load income values
    for (let i = 0; i < incomeCategories.length; i++) {
      const savedValue = budgetData[incomeCategories[i].id];
      if (savedValue) {
        document.getElementById(incomeCategories[i].id).value = savedValue;
      }
    }
    
    // Load expense values
    for (let i = 0; i < expenseCategories.length; i++) {
      const savedValue = budgetData[expenseCategories[i].id];
      if (savedValue) {
        document.getElementById(expenseCategories[i].id).value = savedValue;
      }
    }
  }
}

// Save events to localStorage
function saveEventsData() {
  localStorage.setItem("tech2gether-events", JSON.stringify(events));
}

// Load events from localStorage
function loadEventsData() {
  const savedEvents = localStorage.getItem("tech2gether-events");
  if (savedEvents) {
    events = JSON.parse(savedEvents);
    renderEventsTable();
  }
}

// Function to save tasks to localStorage
function saveTasksData() {
  localStorage.setItem("tech2gether-tasks", JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasksData() {
  const savedTasks = localStorage.getItem("tech2gether-tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
    updateTasksSummary();
  }
}

// PLANNER TOGGLE FUNCTIONALITY

// Function to toggle between events and tasks views
function initializePlannerToggle() {
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  const views = document.querySelectorAll('.planner-view');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons and views
      toggleButtons.forEach(btn => btn.classList.remove('active'));
      views.forEach(view => view.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Show corresponding view
      const viewToShow = this.getAttribute('data-view');
      document.getElementById(`${viewToShow}-view`).classList.add('active');
    });
  });
}

// Initialize task filters
function initializeTaskFilters() {
  const filters = ['progress-filter', 'priority-filter', 'sort-tasks'];
  
  filters.forEach(filterId => {
    document.getElementById(filterId).addEventListener('change', function() {
      renderTasks();
    });
  });
}

// SMOOTH SCROLLING FUNCTIONALITY

// Function to handle smooth scrolling for navigation
function initializeSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      // Calculate offset based on navbar height
      const navbarHeight = document.getElementById('navbar').offsetHeight;
      const targetPosition = targetElement.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update URL hash without scrolling
      history.pushState(null, null, targetId);
    });
  });
  
  // Also fix any other anchor links in the page
  const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
  allAnchorLinks.forEach(link => {
    if (!link.classList.contains('nav-link')) {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        e.preventDefault();
        
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = targetElement.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        history.pushState(null, null, targetId);
      });
    }
  });
}

// EVENT LISTENERS

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // Generate input fields using loops
  generateIncomeInputs();
  generateExpenseInputs();
  generateResourcesList();
  
  // Initialize resource filters
  initializeResourceFilters();
  
  // Initialize smooth scrolling
  initializeSmoothScrolling();
  
  // Load saved data from localStorage
  loadBudgetData();
  loadEventsData();
  loadTasksData();
  
  // Initialize planner toggle
  initializePlannerToggle();
  
  // Initialize task filters
  initializeTaskFilters();
  
  // Get references to elements
  const calculateButton = document.getElementById("calculate-button");
  const teamNameInput = document.getElementById("team-name");
  
  // DIRECT PROPERTY ACCESS: Disable calculate button initially
  calculateButton.disabled = true;
  
  // Function to check if required fields are filled
  function checkRequiredFields() {
    const teamName = teamNameInput.value.trim();
    
    // Enable button only if team name is provided
    if (teamName.length > 0) {
      calculateButton.disabled = false;
      calculateButton.style.opacity = "1";
      calculateButton.style.cursor = "pointer";
    } else {
      calculateButton.disabled = true;
      calculateButton.style.opacity = "0.6";
      calculateButton.style.cursor = "not-allowed";
    }
  }
  
  // Check required fields on page load
  checkRequiredFields();
  
  // Add input event listener to team name field
  teamNameInput.addEventListener("input", function() {
    checkRequiredFields();
    
    // Optional: Auto-save team name as user types
    saveBudgetData();
  });
  
  // Add input event listeners to all income and expense fields for auto-save
  for (let i = 0; i < incomeCategories.length; i++) {
    const incomeInput = document.getElementById(incomeCategories[i].id);
    if (incomeInput) {
      incomeInput.addEventListener("input", saveBudgetData);
    }
  }
  
  for (let i = 0; i < expenseCategories.length; i++) {
    const expenseInput = document.getElementById(expenseCategories[i].id);
    if (expenseInput) {
      expenseInput.addEventListener("input", saveBudgetData);
    }
  }
  
  // Add click event listener to Calculate Budget Health button
  calculateButton.addEventListener("click", calculateBudgetHealth);
  
  // Add click event listener to Add Event button
  document.getElementById("add-event-button").addEventListener("click", addEvent);
  
  // Add click event listener to Add Task button
  document.getElementById("add-task-button").addEventListener("click", addTask);
});

