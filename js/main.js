 // Initialize Mermaid
    mermaid.initialize({ 
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'default',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      }
    });
    
    // Add event listeners for direction toggle
    document.addEventListener('DOMContentLoaded', function() {
      const directionRadios = document.querySelectorAll('input[name="chart-direction"]');
      directionRadios.forEach(radio => {
        radio.addEventListener('change', function() {
          generateMermaidCode();
          renderChart();
        });
      });
    });
    
    // Initialize data structures
    let people = [];
    let relationships = [];
    
    // Add sample data
    function loadSampleData() {
      try {
        // Clear existing data
        people = [];
        relationships = [];
        
        // Show loading feedback toast
        const toast = document.createElement('div');
        toast.className = 'template-loaded-toast';
        toast.textContent = 'Loading sample data...';
        document.body.appendChild(toast);
        
        // Remove toast after animation completes
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 3000);
      
      // Add sample people with departments
      people = [
        { id: 'Alice', name: 'Alice', role: 'CEO', department: 'executive' },
        { id: 'Bob', name: 'Bob', role: 'CTO', department: 'engineering' },
        { id: 'Charlie', name: 'Charlie', role: 'CFO', department: 'finance' },
        { id: 'Daisy', name: 'Daisy', role: 'Dev Manager', department: 'engineering' },
        { id: 'Ethan', name: 'Ethan', role: 'Developer', department: 'engineering' },
        { id: 'Frank', name: 'Frank', role: 'HR Director', department: 'hr' },
        { id: 'Grace', name: 'Grace', role: 'HR Specialist', department: 'hr' }
      ];
      
      // Add sample relationships
      relationships = [
        { manager: 'Alice', report: 'Bob', type: 'reports-to' },
        { manager: 'Alice', report: 'Charlie', type: 'reports-to' },
        { manager: 'Alice', report: 'Frank', type: 'reports-to' },
        { manager: 'Bob', report: 'Daisy', type: 'reports-to' },
        { manager: 'Daisy', report: 'Ethan', type: 'reports-to' },
        { manager: 'Frank', report: 'Grace', type: 'reports-to' }
      ];
      
      // Update UI
      updateUI();
      
      // Reset any form inputs
      document.getElementById('personName').value = '';
      document.getElementById('personRole').value = '';
      document.getElementById('customRole').value = '';
      document.getElementById('customRole').style.display = 'none';
      document.getElementById('personDepartment').value = '';
      document.getElementById('manager').value = '';
      document.getElementById('report').value = '';
      
      // Clear any validation messages
      const validationElements = document.querySelectorAll('.validation-feedback');
      validationElements.forEach(el => {
        el.textContent = '';
      });
      } catch (error) {
        console.error("Error in loadSampleData function:", error);
        alert("An error occurred while loading sample data. Please try again.");
      }
    }
    
    // Generate a safe ID from a name (remove spaces, special chars)
    function generateId(name) {
      return name.replace(/[^a-zA-Z0-9]/g, '');
    }
    
    // Show role category
    function showRoleCategory(category) {
      // Hide all role preset containers
      document.getElementById('common-roles').style.display = 'none';
      document.getElementById('executive-roles').style.display = 'none';
      document.getElementById('management-roles').style.display = 'none';
      document.getElementById('department-roles').style.display = 'none';
      
      // Show selected category
      document.getElementById(category + '-roles').style.display = 'flex';
      
      // Update active state on buttons
      const buttons = document.querySelectorAll('.role-category-btn');
      buttons.forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Find and activate the clicked button
      const activeButton = Array.from(buttons).find(btn => 
        btn.getAttribute('onclick').includes(category)
      );
      
      if (activeButton) {
        activeButton.classList.add('active');
      }
    }
    
    // Select position type
    function selectPositionType(type) {
      // Hide all title containers
      document.getElementById('executive-titles').style.display = 'none';
      document.getElementById('management-titles').style.display = 'none';
      document.getElementById('staff-titles').style.display = 'none';
      
      // Show selected type
      document.getElementById(type + '-titles').style.display = 'flex';
      
      // Update active state on buttons
      document.querySelectorAll('.position-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      document.getElementById('position-' + type).classList.add('active');
      
      // Update department options based on position type
      const departmentSelect = document.getElementById('personDepartment');
      
      // Remember current selection
      const currentDept = departmentSelect.value;
      
      // Clear options
      while (departmentSelect.options.length > 1) {
        departmentSelect.remove(1);
      }
      
      // Add appropriate options based on position type
      if (type === 'executive') {
        addOption(departmentSelect, 'executive', 'Executive');
        addOption(departmentSelect, 'board', 'Board');
      } else if (type === 'management') {
        addOption(departmentSelect, 'engineering', 'Engineering');
        addOption(departmentSelect, 'finance', 'Finance');
        addOption(departmentSelect, 'hr', 'Human Resources');
        addOption(departmentSelect, 'marketing', 'Marketing');
        addOption(departmentSelect, 'sales', 'Sales');
        addOption(departmentSelect, 'operations', 'Operations');
        addOption(departmentSelect, 'research', 'Research & Development');
        addOption(departmentSelect, 'product', 'Product');
      } else {
        addOption(departmentSelect, 'engineering', 'Engineering');
        addOption(departmentSelect, 'finance', 'Finance');
        addOption(departmentSelect, 'hr', 'Human Resources');
        addOption(departmentSelect, 'marketing', 'Marketing');
        addOption(departmentSelect, 'sales', 'Sales');
        addOption(departmentSelect, 'operations', 'Operations');
        addOption(departmentSelect, 'research', 'Research & Development');
        addOption(departmentSelect, 'product', 'Product');
        addOption(departmentSelect, 'customer-support', 'Customer Support');
        addOption(departmentSelect, 'legal', 'Legal');
        addOption(departmentSelect, 'admin', 'Administrative');
      }
      
      // Restore selection if possible
      if (Array.from(departmentSelect.options).some(option => option.value === currentDept)) {
        departmentSelect.value = currentDept;
      }
    }
    
    // Helper function to add option to select
    function addOption(selectElement, value, text) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = text;
      selectElement.add(option);
    }
    
    // Set role preset
    function setRolePreset(role) {
      const roleSelect = document.getElementById('personRole');
      const customRoleInput = document.getElementById('customRole');
      
      // Try to find the role in the dropdown
      let found = false;
      for (let i = 0; i < roleSelect.options.length; i++) {
        if (roleSelect.options[i].value === role) {
          roleSelect.value = role;
          found = true;
          break;
        }
      }
      
      // If not found in dropdown, set as custom
      if (!found) {
        roleSelect.value = 'custom';
        customRoleInput.style.display = 'block';
        customRoleInput.value = role;
      } else {
        customRoleInput.style.display = 'none';
      }
    }
    
    // Handle role selection
    function handleRoleSelection() {
      const roleSelect = document.getElementById('personRole');
      const customRoleInput = document.getElementById('customRole');
      
      if (roleSelect.value === 'custom') {
        customRoleInput.style.display = 'block';
      } else {
        customRoleInput.style.display = 'none';
      }
    }
    
    // Add a new person
    function addPerson() {
      try {
        const nameInput = document.getElementById('personName');
      const roleSelect = document.getElementById('personRole');
      const customRoleInput = document.getElementById('customRole');
      const departmentSelect = document.getElementById('personDepartment');
      const nameValidation = document.getElementById('nameValidation');
      const roleValidation = document.getElementById('roleValidation');
      
      // Clear previous validation messages
      nameValidation.textContent = '';
      roleValidation.textContent = '';
      
      const name = nameInput.value.trim();
      let role = roleSelect.value.trim();
      
      // Validate both name and role are not empty
      if (!name && role === '') {
        nameValidation.textContent = 'Please enter a name';
        roleValidation.textContent = 'Please select or enter a role';
        nameInput.focus();
        return;
      }
      
      // If custom role is selected, use value
      if (role === 'custom') {
        role = customRoleInput.value.trim();
      }
      
      // store department
      const department = departmentSelect.value;
      
      // Validate name
      if (!name) {
        nameValidation.textContent = 'Please enter a name';
        nameInput.focus();
        return;
      }
      
      if (name.length > 30) {
        nameValidation.textContent = 'Name should be 30 characters or less';
        nameInput.focus();
        return;
      }
      
      // Generate a unique ID
      const id = generateId(name);
      
      // Check if this person already exists
      if (people.some(p => p.id === id)) {
        nameValidation.textContent = 'A person with this name already exists';
        nameInput.focus();
        return;
      }
      
      // Add to our people array with isNew flag for animation
      people.push({ id, name, role, department, isNew: true });
      
      // Clear inputs
      nameInput.value = '';
      roleSelect.value = '';
      customRoleInput.value = '';
      customRoleInput.style.display = 'none';
      departmentSelect.value = '';
      
      // Show success feedback
      const feedbackElement = document.getElementById('personAddedFeedback');
      feedbackElement.textContent = `${name} was added successfully!`;
      
      // Clear feedback after animation completes
      setTimeout(() => {
        feedbackElement.textContent = '';
      }, 3000);
      
      // Update UI
      updateUI();
      } catch (error) {
        console.error("Error in addPerson function:", error);
        alert("An error occurred while adding the person. Please try again.");
      }
    }
    
    // Add a relationship between manager and report
    function addRelationship() {
      try {
      const managerSelect = document.getElementById('manager');
      const reportSelect = document.getElementById('report');
      const managerValidation = document.getElementById('managerValidation');
      const reportValidation = document.getElementById('reportValidation');
      
      // Clear previous validation messages
      managerValidation.textContent = '';
      reportValidation.textContent = '';
      
      const manager = managerSelect.value;
      const report = reportSelect.value;
      
      // Get relationship type
      const relationshipType = document.querySelector('input[name="relationshipType"]:checked').value;
      
      // Update relationship visual one more time
      updateRelationshipVisual();
      
      if (!manager) {
        managerValidation.textContent = 'Please select a manager';
        managerSelect.focus();
        return;
      }
      
      if (!report) {
        reportValidation.textContent = 'Please select a person who reports to the manager';
        reportSelect.focus();
        return;
      }
      
      if (manager === report) {
        reportValidation.textContent = 'A person cannot report to themselves';
        reportSelect.focus();
        return;
      }
      
      // Check if this relationship already exists
      if (relationships.some(r => r.manager === manager && r.report === report)) {
        reportValidation.textContent = 'This relationship already exists';
        return;
      }
      
      // Check for circular relationships
      if (wouldCreateCircularRelationship(manager, report)) {
        reportValidation.textContent = 'This would create a circular reporting structure';
        return;
      }
      
      // Add to our relationships array with isNew flag for animation
      relationships.push({ manager, report, type: relationshipType, isNew: true });
      
      // Reset the selects
      managerSelect.selectedIndex = 0;
      reportSelect.selectedIndex = 0;
      
      // Show success feedback
      const managerPerson = people.find(p => p.id === manager);
      const reportPerson = people.find(p => p.id === report);
      const feedbackElement = document.getElementById('relationshipAddedFeedback');
      
      if (managerPerson && reportPerson) {
        feedbackElement.textContent = `Relationship between ${reportPerson.name} and ${managerPerson.name} added successfully!`;
      } else {
        feedbackElement.textContent = 'Relationship added successfully!';
      }
      
      // Clear feedback after animation completes
      setTimeout(() => {
        feedbackElement.textContent = '';
      }, 3000);
      
      // Update the UI
      updateUI();
      } catch (error) {
        console.error("Error in addRelationship function:", error);
        alert("An error occurred while adding the relationship. Please try again.");
      }
    }
    
    // Check if adding a relationship would create a circular structure
    function wouldCreateCircularRelationship(manager, report) {
      // If the report is already a manager of the proposed manager, it would create a circle
      function isManagerOf(person, potentialReport) {
        // Direct relationship check
        if (relationships.some(r => r.manager === potentialReport && r.report === person)) {
          return true;
        }
        
        // Check indirect relationships (recursively)
        for (const rel of relationships) {
          if (rel.manager === potentialReport && isManagerOf(person, rel.report)) {
            return true;
          }
        }
        
        return false;
      }
      
      return isManagerOf(manager, report);
    }
    
    // Remove a person
    function removePerson(id) {
      // Find the person
      const person = people.find(p => p.id === id);
      if (!person) return;
      
      // Count relationships involving this person
      const involvedRelationships = relationships.filter(r => r.manager === id || r.report === id).length;
      
      // Confirmation message
      let confirmMessage = `Are you sure you want to remove ${person.name}?`;
      if (involvedRelationships > 0) {
        confirmMessage += `\n\nThis will also remove ${involvedRelationships} relationship(s) connected to this person.`;
      }
      
      if (confirm(confirmMessage)) {
        // Remove the person
        people = people.filter(p => p.id !== id);
        
        // Remove any relationships involving this person
        relationships = relationships.filter(r => r.manager !== id && r.report !== id);
        
        // Update the UI
        updateUI();
      }
    }
    
    // Remove a relationship
    function removeRelationship(index) {
      const relationship = relationships[index];
      if (!relationship) return;
      
      // Find the involved people
      const manager = people.find(p => p.id === relationship.manager);
      const report = people.find(p => p.id === relationship.report);
      
      if (manager && report) {
        if (confirm(`Are you sure you want to remove the relationship where ${report.name} reports to ${manager.name}?`)) {
          relationships.splice(index, 1);
          updateUI();
        }
      } else {
        // If we can't find the people, just remove it without confirmation
        relationships.splice(index, 1);
        updateUI();
      }
    }
    
    // Clear input field
    function clearInput(inputId) {
      const inputElement = document.getElementById(inputId);
      inputElement.value = '';
      
      // Handle special case for role selector
      if (inputId === 'personRole') {
        const customRoleInput = document.getElementById('customRole');
        customRoleInput.value = '';
        customRoleInput.style.display = 'none';
      }
      
      // Clear validation message if any
      const validationId = inputId + 'Validation';
      const validationElement = document.getElementById(validationId);
      if (validationElement) {
        validationElement.textContent = '';
      }
      
      // Focus the cleared input
      inputElement.focus();
    }
    
    // Reset everything
    function resetStructure() {
      if (confirm('Are you sure you want to reset the entire structure?\n\nThis will delete all people and relationships.')) {
        people = [];
        relationships = [];
        updateUI();
        
        // Clear input fields
        clearInput('personName');
        clearInput('personRole');
      }
    }
    
    // Calculate hierarchy levels for each person
    function calculateHierarchyLevels() {
      // Start with all persons at level -1 (unassigned)
      const levels = {};
      people.forEach(person => {
        levels[person.id] = -1;
      });
      
      // Find top-level people (those who don't report to anyone)
      const topLevel = people.filter(person => 
        !relationships.some(rel => rel.report === person.id)
      );
      
      // Assign level 0 to top-level people
      topLevel.forEach(person => {
        levels[person.id] = 0;
      });
      
      // Breadth-first traversal to assign levels
      let currentLevel = 0;
      let currentLevelPeople = topLevel.map(p => p.id);
      
      while (currentLevelPeople.length > 0) {
        const nextLevelPeople = [];
        
        currentLevelPeople.forEach(managerId => {
          // Find all direct reports
          const directReports = relationships
            .filter(rel => rel.manager === managerId)
            .map(rel => rel.report);
            
          // Assign next level
          directReports.forEach(reportId => {
            if (levels[reportId] === -1) { // Only if not already assigned
              levels[reportId] = currentLevel + 1;
              nextLevelPeople.push(reportId);
            }
          });
        });
        
        currentLevel++;
        currentLevelPeople = nextLevelPeople;
      }
      
      return levels;
    }
    
    // Update the UI elements
    function updateUI() {
      const hierarchyLevels = calculateHierarchyLevels();
      updatePeopleList(hierarchyLevels);
      updateRelationshipsList(hierarchyLevels);
      updateDropdowns();
      generateMermaidCode();
      renderChart();
    }
    
    // Update the people list
    function updatePeopleList(hierarchyLevels) {
      const peopleList = document.getElementById('peopleList');
      peopleList.innerHTML = '';
      
      if (people.length === 0) {
        peopleList.innerHTML = '<li class="list-item">No people added yet</li>';
        return;
      }
      
      // Sort people by hierarchy level
      const sortedPeople = [...people].sort((a, b) => {
        const levelA = hierarchyLevels[a.id] !== undefined ? hierarchyLevels[a.id] : 999;
        const levelB = hierarchyLevels[b.id] !== undefined ? hierarchyLevels[b.id] : 999;
        return levelA - levelB || a.name.localeCompare(b.name);
      });
      
      sortedPeople.forEach((person, index) => {
        const li = document.createElement('li');
        li.className = 'list-item person-item';
        li.setAttribute('data-name', person.name.toLowerCase());
        li.setAttribute('data-role', (person.role || '').toLowerCase());
        li.setAttribute('data-id', person.id);
        li.setAttribute('data-level', hierarchyLevels[person.id] || 0);
        
        // Add level indicator if level is defined
        const level = hierarchyLevels[person.id] !== undefined ? hierarchyLevels[person.id] : -1;
        const levelIndicator = level >= 0 ? `<span class="hierarchy-level level-${Math.min(level, 3)}">${level}</span>` : '';
        
        // Add department tag if available
        const departmentTag = person.department ? 
          `<span class="department-tag dept-${person.department}">${capitalizeFirstLetter(person.department)}</span>` : '';
        
        // Add indentation class based on level
        li.classList.add(`level-indent-${Math.min(level, 3)}`);
        
        // Find relationships for this person
        const manages = relationships.filter(r => r.manager === person.id)
          .map(r => people.find(p => p.id === r.report))
          .filter(p => p); // Filter out undefined
          
        const reportsTo = relationships.filter(r => r.report === person.id)
          .map(r => people.find(p => p.id === r.manager))
          .filter(p => p); // Filter out undefined
        
        // Create relationship indicators
        let relationshipHTML = '';
        if (manages.length > 0 || reportsTo.length > 0) {
          relationshipHTML = '<div class="relationship-indicators">';
          
          if (reportsTo.length > 0) {
            relationshipHTML += '<div class="reports-to-list">Reports to: ';
            relationshipHTML += reportsTo.map(p => `<strong>${p.name}</strong>`).join(', ');
            relationshipHTML += '</div>';
          }
          
          if (manages.length > 0) {
            relationshipHTML += '<div class="manages-list">Manages: ';
            relationshipHTML += manages.map(p => `<strong>${p.name}</strong>`).join(', ');
            relationshipHTML += '</div>';
          }
          
          relationshipHTML += '</div>';
        }
        
        li.innerHTML = `
          <span>${levelIndicator}<strong>${person.name}</strong>${person.role ? ` - ${person.role}` : ''}${departmentTag}</span>
          <button class="btn btn-danger btn-sm" onclick="removePerson('${person.id}')" title="Remove ${person.name} from the organization">Remove</button>
          ${relationshipHTML}
        `;
        
        // Add highlight animation for newly added items
        if (person.isNew) {
          li.classList.add('highlight-animation');
          // Remove the isNew flag after animation
          setTimeout(() => {
            person.isNew = false;
          }, 2000);
        }
        
        peopleList.appendChild(li);
      });
    }
    
    // Update the relationships list
    function updateRelationshipsList(hierarchyLevels) {
      const relationshipsList = document.getElementById('relationshipsList');
      relationshipsList.innerHTML = '';
      
      if (relationships.length === 0) {
        relationshipsList.innerHTML = '<li class="list-item">No relationships defined yet</li>';
        return;
      }
      
      // Sort relationships to show hierarchy
      const sortedRelationships = [...relationships].sort((a, b) => {
        const managerLevelA = hierarchyLevels[a.manager] !== undefined ? hierarchyLevels[a.manager] : 999;
        const managerLevelB = hierarchyLevels[b.manager] !== undefined ? hierarchyLevels[b.manager] : 999;
        return managerLevelA - managerLevelB;
      });
      
      sortedRelationships.forEach((relationship, index) => {
        const managerPerson = people.find(p => p.id === relationship.manager);
        const reportPerson = people.find(p => p.id === relationship.report);
        
        if (!managerPerson || !reportPerson) return;
        
        const li = document.createElement('li');
        li.className = 'list-item relationship-item';
        
        // Get hierarchy levels
        const managerLevel = hierarchyLevels[relationship.manager] !== undefined ? hierarchyLevels[relationship.manager] : 0;
        const reportLevel = hierarchyLevels[relationship.report] !== undefined ? hierarchyLevels[relationship.report] : 0;
        
        // Create level indicators
        const managerLevelIndicator = `<span class="hierarchy-level level-${Math.min(managerLevel, 3)}">${managerLevel}</span>`;
        const reportLevelIndicator = `<span class="hierarchy-level level-${Math.min(reportLevel, 3)}">${reportLevel}</span>`;
        
        // Determine relationship type indicator
        const relationshipTypeIndicator = relationship.type === 'dotted-line' ? 
          '<span style="margin: 0 5px; color: #666;">⋯⋯⋯</span>' : 
          '<span class="level-indicator">→</span>';
          
        li.innerHTML = `
          <span>
            ${reportLevelIndicator} <strong>${reportPerson.name}</strong> 
            ${relationshipTypeIndicator}
            ${managerLevelIndicator} <strong>${managerPerson.name}</strong>
          </span>
          <button class="btn btn-danger btn-sm" onclick="removeRelationship(${sortedRelationships.indexOf(relationship)})" title="Remove this reporting relationship">Remove</button>
        `;
        
        // Add highlight animation for newly added items
        if (relationship.isNew) {
          li.classList.add('highlight-animation');
          // Remove the isNew flag after animation
          setTimeout(() => {
            relationship.isNew = false;
          }, 2000);
        }
        
        relationshipsList.appendChild(li);
      });
    }
    
    // Update the dropdown menus
    function updateDropdowns() {
      const managerSelect = document.getElementById('manager');
      const reportSelect = document.getElementById('report');
      
      // Save current selections
      const managerValue = managerSelect.value;
      const reportValue = reportSelect.value;
      
      // Clear options
      managerSelect.innerHTML = '<option value="">Select a person</option>';
      reportSelect.innerHTML = '<option value="">Select a person</option>';
      
      // Add people as options
      people.forEach(person => {
        const managerOption = document.createElement('option');
        managerOption.value = person.id;
        managerOption.textContent = person.name;
        
        const reportOption = document.createElement('option');
        reportOption.value = person.id;
        reportOption.textContent = person.name;
        
        managerSelect.appendChild(managerOption);
        reportSelect.appendChild(reportOption);
      });
      
      // Restore selections if still valid
      if (people.some(p => p.id === managerValue)) {
        managerSelect.value = managerValue;
      }
      
      if (people.some(p => p.id === reportValue)) {
        reportSelect.value = reportValue;
      }
    }
    
    // Generate Mermaid code from the data structures
    function generateMermaidCode() {
      // Get selected direction
      const directionValue = document.querySelector('input[name="chart-direction"]:checked').value;
      let code = `graph ${directionValue}\n`;
      
      // Calculate hierarchy levels
      const hierarchyLevels = calculateHierarchyLevels();
      
      // Find top-level nodes (managers with no managers above them)
      const topLevelPeople = people.filter(person => 
        !relationships.some(rel => rel.report === person.id)
      );
      
      // Create branch map to track which top-level person each node belongs to
      const branchMap = {};
      
      // Assign branch IDs to all top-level people
      topLevelPeople.forEach((person, index) => {
        branchMap[person.id] = index;
      });
      
      // Recursively assign branch IDs to all other nodes based on their manager's branch
      function assignBranchIds() {
        let changed = false;
        
        relationships.forEach(rel => {
          // If manager has a branch ID but report doesn't, assign report the same branch ID
          if (branchMap[rel.manager] !== undefined && branchMap[rel.report] === undefined) {
            branchMap[rel.report] = branchMap[rel.manager];
            changed = true;
          }
        });
        
        // Keep assigning until no more changes
        if (changed) {
          assignBranchIds();
        }
      }
      
      // Run the branch assignment
      assignBranchIds();
      
      // Add nodes with styling based on hierarchy level and branch
      // Ensure proper escaping for labels and add tooltips using click events
      people.forEach(person => {
        const level = hierarchyLevels[person.id] !== undefined ? hierarchyLevels[person.id] : 0;
        const branch = branchMap[person.id] !== undefined ? branchMap[person.id] % 6 : 0; // Mod 6 to limit to 6 distinct branch colors
        
        // Properly escape special characters in labels
        let name = escapeHtml(person.name);
        let role = person.role ? escapeHtml(person.role) : '';
        
        // Create the node label - properly escape for Mermaid 10.6.1
        // Using single quotes for the label to avoid issues with double quotes
        const label = role ? `${name}<br>${role}` : name;
        
        // Add node with proper class for styling - using simplified syntax for Mermaid 10.6.1
        // Make sure IDs don't have spaces or special characters
        const safeId = person.id.replace(/[^a-zA-Z0-9]/g, '_');
        code += `${safeId}[${label}]:::branch${branch}_level${level}\n`;
      });
      
      // Define color palettes for each branch with 4 point gradient
      const branchColors = [
        ['#3f51b5', '#5c6bc0', '#7986cb', '#9fa8da'], // Indigo
        ['#f44336', '#e57373', '#ef9a9a', '#ffcdd2'], // Red
        ['#4CAF50', '#66BB6A', '#81C784', '#A5D6A7'], // Green
        ['#FF9800', '#FFA726', '#FFCC80', '#FFE0B2'], // Orange
        ['#9C27B0', '#BA68C8', '#CE93D8', '#E1BEE7'], // Purple
        ['#00BCD4', '#4DD0E1', '#80DEEA', '#B2EBF2']  // Cyan
      ];
      
      // Add class definitions for styling with branch colors
      for (let branch = 0; branch < branchColors.length; branch++) {
        for (let level = 0; level < 4; level++) {
          const color = branchColors[branch][level];
          const strokeColor = level > 0 ? branchColors[branch][level-1] : color;
          code += `classDef branch${branch}_level${level} fill:${color},color:white,stroke:${strokeColor}\n`;
        }
      }
      
      // Enable HTML in labels
      code += "linkStyle default stroke:#333,stroke-width:2px\n";
      
      // Add blank line
      if (people.length > 0) {
        code += '\n';
      }
      
      // Helper function to escape HTML special characters
      function escapeHtml(text) {
        if (!text) return '';
        return text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }
      
      // Add relationships
      relationships.forEach(rel => {
        // Make sure we use safe IDs for relationships too
        const safeManager = rel.manager.replace(/[^a-zA-Z0-9]/g, '_');
        const safeReport = rel.report.replace(/[^a-zA-Z0-9]/g, '_');
        
        // Use different arrow style for dotted line relationships
        if (rel.type === 'dotted-line') {
          code += `${safeManager} -.-> ${safeReport}\n`;
        } else {
          code += `${safeManager} --> ${safeReport}\n`;
        }
      });
      
      // Update the hidden textarea
      document.getElementById('input').value = code;
      
      // Validate the Mermaid syntax before rendering
      try {
        // Simple validation to check for obvious syntax errors
        if (code.includes('undefined') || code.includes('null')) {
          console.warn('Potential invalid Mermaid syntax detected: code contains undefined or null values');
        }
        
        // Check for unbalanced brackets
        const openBrackets = (code.match(/\[/g) || []).length;
        const closeBrackets = (code.match(/\]/g) || []).length;
        if (openBrackets !== closeBrackets) {
          console.warn(`Unbalanced brackets detected: ${openBrackets} opening vs ${closeBrackets} closing`);
          // Try to fix unbalanced brackets
          if (openBrackets > closeBrackets) {
            for (let i = 0; i < openBrackets - closeBrackets; i++) {
              code += "]";
            }
          }
        }
        
        // Simplify code for better compatibility
        code = code.replace(/\\n/g, "<br>");
        
        // Log the generated code for debugging
        console.log('Generated Mermaid code:', code);
      } catch (e) {
        console.error('Error validating Mermaid code:', e);
      }
    }
    
    // Render the chart using Mermaid
    function renderChart() {
      try {
        const input = document.getElementById("input").value;
        const chartContainer = document.getElementById("chart");
        
        // If no people, show a message
        if (people.length === 0) {
          chartContainer.innerHTML = '<div class="instructions">Add people and relationships to see your organization chart here</div>';
          return;
        }
        
        // Clear the chart div and show loading indicator
        chartContainer.innerHTML = '<div class="loading">Generating chart</div>';
        
        // Create a new div with a unique ID for this render
        const renderContainerId = "mermaid-" + Date.now();
        const renderContainer = document.createElement("div");
        renderContainer.id = renderContainerId;
        renderContainer.style.display = "none"; // Hide until rendering is complete
        chartContainer.appendChild(renderContainer);
        
        // Use the modern Mermaid API with promises
        mermaid.render(renderContainerId, input)
          .then(result => {
            // Remove loading indicator and show the rendered chart
            chartContainer.innerHTML = '';
            
            // Create a container for the rendered SVG
            const svgContainer = document.createElement("div");
            svgContainer.innerHTML = result.svg;
            
            // Make sure SVG is responsive
            const svg = svgContainer.querySelector("svg");
            if (svg) {
              svg.setAttribute("width", "100%");
              svg.style.maxWidth = "100%";
              
              // Add title elements to nodes for better accessibility and tooltips
              people.forEach(person => {
                // Use safe ID for node selection
                const safeId = person.id.replace(/[^a-zA-Z0-9]/g, '_');
                try {
                  const nodeElement = svg.querySelector(`#${safeId}`);
                  if (nodeElement) {
                    // Add tooltip as title element
                    const titleElement = document.createElementNS("http://www.w3.org/2000/svg", "title");
                    const tooltipText = `${person.name}${person.role ? ` - ${person.role}` : ''}`;
                    titleElement.textContent = tooltipText;
                    
                    // Also add a custom data attribute for easier reference
                    nodeElement.setAttribute('data-person-id', person.id);
                    
                    // Add title element as first child of the node
                    if (nodeElement.firstChild) {
                      nodeElement.insertBefore(titleElement, nodeElement.firstChild);
                    } else {
                      nodeElement.appendChild(titleElement);
                    }
                  }
                } catch (err) {
                  console.log(`Couldn't add tooltip for ${person.name}: ${err.message}`);
                }
              });
            }
            
            chartContainer.appendChild(svgContainer);
            console.log('Chart rendered successfully');
          })
          .catch(error => {
            console.error("Mermaid rendering error:", error);
            const errorMessage = error.message || 'Invalid syntax';
            
            // Show more detailed error information to help debugging
            chartContainer.innerHTML = `
              <div class="error-message">
                <strong>Error rendering chart:</strong> ${errorMessage}
                <p>Please check your structure and try again.</p>
                <div style="margin-top: 10px; font-size: 12px; color: #666;">
                  <details>
                    <summary>Technical Details (for debugging)</summary>
                    <pre style="background: #f5f5f5; padding: 10px; overflow: auto; max-height: 200px;">${error.str || error.stack || 'No additional details available'}</pre>
                  </details>
                </div>
                <div style="margin-top: 10px;">
                  <button class="btn" onclick="attemptFallbackRender()">Try Simplified Chart</button>
                </div>
              </div>
            `;
          });
      } catch (error) {
        console.error("Error in renderChart function:", error);
        const chartContainer = document.getElementById("chart");
        chartContainer.innerHTML = `
          <div class="error-message">
            <strong>Unexpected error:</strong> ${error.message}
            <p>Please refresh the page and try again.</p>
            <div style="margin-top: 10px; font-size: 12px; color: #666;">
              <details>
                <summary>Technical Details (for debugging)</summary>
                <pre style="background: #f5f5f5; padding: 10px; overflow: auto; max-height: 200px;">${error.stack || 'No stack trace available'}</pre>
              </details>
            </div>
          </div>
        `;
      }
    }
    
    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Load organization templates
    function loadTemplate(templateType) {
      // Clear existing data
      people = [];
      relationships = [];
      
      // Show loading feedback toast
      const toast = document.createElement('div');
      toast.className = 'template-loaded-toast';
      toast.textContent = `Loading ${templateType.replace('-', ' ')} template...`;
      document.body.appendChild(toast);
      
      // Remove toast after animation completes
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
      
      switch(templateType) {
        case 'small-business':
          people = [
            { id: 'Owner', name: 'Owner', role: 'Owner/CEO', department: 'executive' },
            { id: 'Operations', name: 'Operations Manager', role: 'Operations Manager', department: 'operations' },
            { id: 'Sales', name: 'Sales Manager', role: 'Sales Manager', department: 'sales' },
            { id: 'Admin', name: 'Admin Assistant', role: 'Admin Assistant', department: 'operations' },
            { id: 'SalesRep1', name: 'Sales Rep 1', role: 'Sales Representative', department: 'sales' },
            { id: 'SalesRep2', name: 'Sales Rep 2', role: 'Sales Representative', department: 'sales' }
          ];
          relationships = [
            { manager: 'Owner', report: 'Operations', type: 'reports-to' },
            { manager: 'Owner', report: 'Sales', type: 'reports-to' },
            { manager: 'Operations', report: 'Admin', type: 'reports-to' },
            { manager: 'Sales', report: 'SalesRep1', type: 'reports-to' },
            { manager: 'Sales', report: 'SalesRep2', type: 'reports-to' }
          ];
          break;
        case 'corporate':
          people = [
            { id: 'CEO', name: 'CEO', role: 'Chief Executive Officer', department: 'executive' },
            { id: 'CTO', name: 'CTO', role: 'Chief Technology Officer', department: 'engineering' },
            { id: 'CFO', name: 'CFO', role: 'Chief Financial Officer', department: 'finance' },
            { id: 'COO', name: 'COO', role: 'Chief Operations Officer', department: 'operations' },
            { id: 'CMO', name: 'CMO', role: 'Chief Marketing Officer', department: 'marketing' },
            { id: 'VPEng', name: 'VP Engineering', role: 'VP Engineering', department: 'engineering' },
            { id: 'VPSales', name: 'VP Sales', role: 'VP Sales', department: 'sales' },
            { id: 'DevMgr', name: 'Dev Manager', role: 'Development Manager', department: 'engineering' },
            { id: 'QAMgr', name: 'QA Manager', role: 'QA Manager', department: 'engineering' },
            { id: 'Dev1', name: 'Developer 1', role: 'Developer', department: 'engineering' },
            { id: 'Dev2', name: 'Developer 2', role: 'Developer', department: 'engineering' }
          ];
          relationships = [
            { manager: 'CEO', report: 'CTO', type: 'reports-to' },
            { manager: 'CEO', report: 'CFO', type: 'reports-to' },
            { manager: 'CEO', report: 'COO', type: 'reports-to' },
            { manager: 'CEO', report: 'CMO', type: 'reports-to' },
            { manager: 'CTO', report: 'VPEng', type: 'reports-to' },
            { manager: 'CMO', report: 'VPSales', type: 'reports-to' },
            { manager: 'VPEng', report: 'DevMgr', type: 'reports-to' },
            { manager: 'VPEng', report: 'QAMgr', type: 'reports-to' },
            { manager: 'DevMgr', report: 'Dev1', type: 'reports-to' },
            { manager: 'DevMgr', report: 'Dev2', type: 'reports-to' }
          ];
          break;
        case 'startup':
          people = [
            { id: 'Founder', name: 'Founder', role: 'Founder/CEO', department: 'executive' },
            { id: 'CoFounder', name: 'Co-Founder', role: 'Co-Founder/CTO', department: 'engineering' },
            { id: 'ProductMgr', name: 'Product Manager', role: 'Product Manager', department: 'product' },
            { id: 'Designer', name: 'Designer', role: 'UX/UI Designer', department: 'design' },
            { id: 'Dev1', name: 'Developer 1', role: 'Full Stack Developer', department: 'engineering' },
            { id: 'Dev2', name: 'Developer 2', role: 'Backend Developer', department: 'engineering' },
            { id: 'Marketing', name: 'Marketing', role: 'Marketing Lead', department: 'marketing' }
          ];
          relationships = [
            { manager: 'Founder', report: 'CoFounder', type: 'reports-to' },
            { manager: 'Founder', report: 'Marketing', type: 'reports-to' },
            { manager: 'CoFounder', report: 'ProductMgr', type: 'reports-to' },
            { manager: 'CoFounder', report: 'Dev1', type: 'reports-to' },
            { manager: 'CoFounder', report: 'Dev2', type: 'reports-to' },
            { manager: 'ProductMgr', report: 'Designer', type: 'reports-to' },
            { manager: 'ProductMgr', report: 'Dev1', type: 'dotted-line' }
          ];
          break;
        case 'nonprofit':
          people = [
            { id: 'ExecDir', name: 'Executive Director', role: 'Executive Director', department: 'executive' },
            { id: 'ProgramDir', name: 'Program Director', role: 'Program Director', department: 'operations' },
            { id: 'DevDir', name: 'Development Director', role: 'Development Director', department: 'finance' },
            { id: 'VolunteerMgr', name: 'Volunteer Manager', role: 'Volunteer Manager', department: 'hr' },
            { id: 'CommMgr', name: 'Communications Manager', role: 'Communications Manager', department: 'marketing' },
            { id: 'ProgramCoord', name: 'Program Coordinator', role: 'Program Coordinator', department: 'operations' },
            { id: 'GrantWriter', name: 'Grant Writer', role: 'Grant Writer', department: 'finance' }
          ];
          relationships = [
            { manager: 'ExecDir', report: 'ProgramDir', type: 'reports-to' },
            { manager: 'ExecDir', report: 'DevDir', type: 'reports-to' },
            { manager: 'ExecDir', report: 'CommMgr', type: 'reports-to' },
            { manager: 'ProgramDir', report: 'ProgramCoord', type: 'reports-to' },
            { manager: 'ProgramDir', report: 'VolunteerMgr', type: 'reports-to' },
            { manager: 'DevDir', report: 'GrantWriter', type: 'reports-to' }
          ];
          break;
        case 'education':
          people = [
            { id: 'Principal', name: 'Principal', role: 'Principal', department: 'executive' },
            { id: 'VicePrincipal', name: 'Vice Principal', role: 'Vice Principal', department: 'executive' },
            { id: 'EnglishHead', name: 'English Dept Head', role: 'Department Head', department: 'english' },
            { id: 'MathHead', name: 'Math Dept Head', role: 'Department Head', department: 'math' },
            { id: 'ScienceHead', name: 'Science Dept Head', role: 'Department Head', department: 'science' },
            { id: 'EnglishTeacher', name: 'English Teacher', role: 'Teacher', department: 'english' },
            { id: 'MathTeacher', name: 'Math Teacher', role: 'Teacher', department: 'math' },
            { id: 'ScienceTeacher', name: 'Science Teacher', role: 'Teacher', department: 'science' },
            { id: 'Counselor', name: 'Counselor', role: 'Counselor', department: 'hr' }
          ];
          relationships = [
            { manager: 'Principal', report: 'VicePrincipal', type: 'reports-to' },
            { manager: 'Principal', report: 'Counselor', type: 'reports-to' },
            { manager: 'VicePrincipal', report: 'EnglishHead', type: 'reports-to' },
            { manager: 'VicePrincipal', report: 'MathHead', type: 'reports-to' },
            { manager: 'VicePrincipal', report: 'ScienceHead', type: 'reports-to' },
            { manager: 'EnglishHead', report: 'EnglishTeacher', type: 'reports-to' },
            { manager: 'MathHead', report: 'MathTeacher', type: 'reports-to' },
            { manager: 'ScienceHead', report: 'ScienceTeacher', type: 'reports-to' }
          ];
          break;
        default:
          loadSampleData();
          return;
      }
      
      // Update UI
      updateUI();
      
      // Reset any form inputs
      document.getElementById('personName').value = '';
      document.getElementById('personRole').value = '';
      document.getElementById('customRole').value = '';
      document.getElementById('customRole').style.display = 'none';
      document.getElementById('personDepartment').value = '';
      document.getElementById('manager').value = '';
      document.getElementById('report').value = '';
      
      // Clear any validation messages
      const validationElements = document.querySelectorAll('.validation-feedback');
      validationElements.forEach(el => {
        el.textContent = '';
      });
    }
    
    // Filter people based on search
    function filterPeople() {
      const searchText = document.getElementById('searchPeople').value.toLowerCase();
      const departmentFilter = document.getElementById('filterDepartment').value;
      const peopleItems = document.querySelectorAll('#peopleList .list-item');
      let hasVisibleItems = false;
      
      peopleItems.forEach(item => {
        const name = item.getAttribute('data-name') || '';
        const role = item.getAttribute('data-role') || '';
        const level = item.getAttribute('data-level') || '';
        const id = item.getAttribute('data-id') || '';
        
        // Find the person object to check department
        const person = people.find(p => p.id === id);
        const department = person ? person.department || '' : '';
        
        // Check if matches search text and department filter
        const matchesSearch = name.includes(searchText) || 
                             role.includes(searchText) || 
                             level === searchText || 
                             searchText === '';
                             
        const matchesDepartment = !departmentFilter || department === departmentFilter;
        
        if (matchesSearch && matchesDepartment) {
          item.style.display = '';
          hasVisibleItems = true;
        } else {
          item.style.display = 'none';
        }
      });
      
      // Show a message if no results
      const noResultsMessage = document.getElementById('noSearchResults');
      if (!hasVisibleItems && searchText !== '' && peopleItems.length > 0) {
        if (!noResultsMessage) {
          const message = document.createElement('div');
          message.id = 'noSearchResults';
          message.className = 'error-message';
          message.innerHTML = `No people match "${searchText}". Try a different search term.`;
          document.getElementById('peopleList').appendChild(message);
        }
      } else if (noResultsMessage) {
        noResultsMessage.remove();
      }
    }
    
    // Copy organization structure to clipboard
    function copyStructure() {
      let text = "Organization Structure:\n\n";
      
      // Add people
      text += "People:\n";
      people.forEach(person => {
        text += `- ${person.name}${person.role ? ` (${person.role})` : ''}\n`;
      });
      
      // Add relationships
      text += "\nReporting Structure:\n";
      relationships.forEach(rel => {
        const manager = people.find(p => p.id === rel.manager);
        const report = people.find(p => p.id === rel.report);
        if (manager && report) {
          text += `- ${report.name} reports to ${manager.name}\n`;
        }
      });
      
      // Create a temporary textarea to copy text
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        // Show success feedback
        const copyBtn = document.getElementById('copyBtn');
        copyBtn.classList.add('copy-success');
        copyBtn.textContent = 'Copied!';
        
        // Reset after 2 seconds
        setTimeout(() => {
          copyBtn.classList.remove('copy-success');
          copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy Structure
          `;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
      
      document.body.removeChild(textarea);
    }
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      // Alt+A for Add Person
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        addPerson();
      }
      
      // Alt+R for Add Relationship
      if (e.altKey && e.key === 'r') {
        e.preventDefault();
        addRelationship();
      }
    });
    
    // Show success notification
    function showSuccessToast(message) {
      const toast = document.createElement('div');
      toast.className = 'template-loaded-toast';
      toast.textContent = message;
      document.body.appendChild(toast);
      
      // Remove toast after animation completes
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 3000);
    }
    
    // Update relationship visual
    function updateRelationshipVisual() {
      const visual = document.getElementById('relationship-visual');
      const managerSelect = document.getElementById('manager');
      const reportSelect = document.getElementById('report');
      const relationshipType = document.querySelector('input[name="relationshipType"]:checked');
      
      // If both are selected, show the visual
      if (managerSelect.value && reportSelect.value) {
        const managerText = managerSelect.options[managerSelect.selectedIndex].text;
        const reportText = reportSelect.options[reportSelect.selectedIndex].text;
        const relationType = relationshipType ? relationshipType.value : 'reports-to';
        
        let relationshipIcon = '→';
        let relationshipDescription = 'Direct reporting relationship';
        
        if (relationType === 'dotted-line') {
          relationshipIcon = '⋯⋯⋯';
          relationshipDescription = 'Matrix/Indirect reporting relationship';
        }
        
        visual.innerHTML = `
          <div>
            <strong>${reportText}</strong>
            <span class="relationship-icon">${relationshipIcon}</span>
            <strong>${managerText}</strong>
          </div>
          <div style="font-size: 12px; color: #666; margin-top: 5px;">${relationshipDescription}</div>
        `;
      } else {
        visual.innerHTML = '<p>Select a Leader and Team Member to visualize the relationship</p>';
      }
    }
    
    // Set relationship template
    function setRelationshipTemplate(template) {
      // Get selects
      const managerSelect = document.getElementById('manager');
      const reportSelect = document.getElementById('report');
      
      // We need at least 2 people
      if (people.length < 2) {
        alert('Please add at least 2 people to use relationship templates');
        return;
      }
      
      // Get radio buttons
      const directRadio = document.querySelector('input[name="relationshipType"][value="reports-to"]');
      const dottedRadio = document.querySelector('input[name="relationshipType"][value="dotted-line"]');
      
      if (template === 'direct-report') {
        // Set to direct reporting
        directRadio.checked = true;
        
        // Try to find an executive and non-executive
        const executive = people.find(p => p.department === 'executive');
        const nonExecutive = people.find(p => p.department !== 'executive');
        
        if (executive && nonExecutive) {
          managerSelect.value = executive.id;
          reportSelect.value = nonExecutive.id;
        } else {
          // Just set first two people
          managerSelect.value = people[0].id;
          reportSelect.value = people[1].id;
        }
      } else if (template === 'matrix') {
        // Set to dotted line
        dottedRadio.checked = true;
        
        // Try to find two managers
        const managers = people.filter(p => p.role && (p.role.includes('Manager') || p.role.includes('Director')));
        
        if (managers.length >= 2) {
          managerSelect.value = managers[0].id;
          reportSelect.value = managers[1].id;
        } else {
          // Just set first two people
          managerSelect.value = people[0].id;
          reportSelect.value = people[1].id;
        }
      } else if (template === 'peer') {
        // Set to dotted line for peers
        dottedRadio.checked = true;
        
        // Try to find people at same level
        const hierarchyLevels = calculateHierarchyLevels();
        const level1People = people.filter(p => hierarchyLevels[p.id] === 1);
        
        if (level1People.length >= 2) {
          managerSelect.value = level1People[0].id;
          reportSelect.value = level1People[1].id;
        } else {
          // Just set first two people
          managerSelect.value = people[0].id;
          reportSelect.value = people[1].id;
        }
      }
      
      // Update the visual
      updateRelationshipVisual();
    }
    
    // Business-focused templates
    function loadBusinessTemplate(templateType) {
      // Clear existing data
      people = [];
      relationships = [];
      
      // Show loading feedback toast
      const toast = document.createElement('div');
      toast.className = 'template-loaded-toast';
      toast.textContent = `Loading ${templateType.replace('-', ' ')} template...`;
      document.body.appendChild(toast);
      
      // Remove toast after animation completes
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
      
      switch(templateType) {
        case 'matrix':
          people = [
            { id: 'CEO', name: 'CEO', role: 'Chief Executive Officer', department: 'executive' },
            { id: 'ProjectDir', name: 'Project Director', role: 'Project Director', department: 'operations' },
            { id: 'FuncDir', name: 'Functional Director', role: 'Functional Director', department: 'operations' },
            { id: 'PM1', name: 'Project Manager 1', role: 'Project Manager', department: 'operations' },
            { id: 'PM2', name: 'Project Manager 2', role: 'Project Manager', department: 'operations' },
            { id: 'EngMgr', name: 'Engineering Manager', role: 'Engineering Manager', department: 'engineering' },
            { id: 'MarketingMgr', name: 'Marketing Manager', role: 'Marketing Manager', department: 'marketing' },
            { id: 'Eng1', name: 'Engineer 1', role: 'Engineer', department: 'engineering' },
            { id: 'Eng2', name: 'Engineer 2', role: 'Engineer', department: 'engineering' },
            { id: 'Market1', name: 'Marketer 1', role: 'Marketing Specialist', department: 'marketing' }
          ];
          relationships = [
            { manager: 'CEO', report: 'ProjectDir', type: 'reports-to' },
            { manager: 'CEO', report: 'FuncDir', type: 'reports-to' },
            { manager: 'ProjectDir', report: 'PM1', type: 'reports-to' },
            { manager: 'ProjectDir', report: 'PM2', type: 'reports-to' },
            { manager: 'FuncDir', report: 'EngMgr', type: 'reports-to' },
            { manager: 'FuncDir', report: 'MarketingMgr', type: 'reports-to' },
            { manager: 'EngMgr', report: 'Eng1', type: 'reports-to' },
            { manager: 'EngMgr', report: 'Eng2', type: 'reports-to' },
            { manager: 'MarketingMgr', report: 'Market1', type: 'reports-to' },
            { manager: 'PM1', report: 'Eng1', type: 'dotted-line' },
            { manager: 'PM1', report: 'Market1', type: 'dotted-line' },
            { manager: 'PM2', report: 'Eng2', type: 'dotted-line' }
          ];
          break;
        case 'functional':
          people = [
            { id: 'CEO', name: 'CEO', role: 'Chief Executive Officer', department: 'executive' },
            { id: 'CFO', name: 'CFO', role: 'Chief Financial Officer', department: 'finance' },
            { id: 'CTO', name: 'CTO', role: 'Chief Technology Officer', department: 'engineering' },
            { id: 'CMO', name: 'CMO', role: 'Chief Marketing Officer', department: 'marketing' },
            { id: 'COO', name: 'COO', role: 'Chief Operations Officer', department: 'operations' },
            { id: 'FinMgr', name: 'Finance Manager', role: 'Finance Manager', department: 'finance' },
            { id: 'DevMgr', name: 'Development Manager', role: 'Development Manager', department: 'engineering' },
            { id: 'MarketMgr', name: 'Marketing Manager', role: 'Marketing Manager', department: 'marketing' },
            { id: 'OpsMgr', name: 'Operations Manager', role: 'Operations Manager', department: 'operations' },
            { id: 'Accountant', name: 'Accountant', role: 'Accountant', department: 'finance' },
            { id: 'Developer', name: 'Developer', role: 'Developer', department: 'engineering' },
            { id: 'Marketer', name: 'Marketer', role: 'Marketing Specialist', department: 'marketing' }
          ];
          relationships = [
            { manager: 'CEO', report: 'CFO', type: 'reports-to' },
            { manager: 'CEO', report: 'CTO', type: 'reports-to' },
            { manager: 'CEO', report: 'CMO', type: 'reports-to' },
            { manager: 'CEO', report: 'COO', type: 'reports-to' },
            { manager: 'CFO', report: 'FinMgr', type: 'reports-to' },
            { manager: 'CTO', report: 'DevMgr', type: 'reports-to' },
            { manager: 'CMO', report: 'MarketMgr', type: 'reports-to' },
            { manager: 'COO', report: 'OpsMgr', type: 'reports-to' },
            { manager: 'FinMgr', report: 'Accountant', type: 'reports-to' },
            { manager: 'DevMgr', report: 'Developer', type: 'reports-to' },
            { manager: 'MarketMgr', report: 'Marketer', type: 'reports-to' }
          ];
          break;
        case 'divisional':
          people = [
            { id: 'CEO', name: 'CEO', role: 'Chief Executive Officer', department: 'executive' },
            { id: 'DivA', name: 'Division A President', role: 'Division President', department: 'executive' },
            { id: 'DivB', name: 'Division B President', role: 'Division President', department: 'executive' },
            { id: 'DivC', name: 'Division C President', role: 'Division President', department: 'executive' },
            { id: 'FinA', name: 'Finance Dir A', role: 'Finance Director', department: 'finance' },
            { id: 'FinB', name: 'Finance Dir B', role: 'Finance Director', department: 'finance' },
            { id: 'FinC', name: 'Finance Dir C', role: 'Finance Director', department: 'finance' },
            { id: 'EngA', name: 'Engineering Dir A', role: 'Engineering Director', department: 'engineering' },
            { id: 'EngB', name: 'Engineering Dir B', role: 'Engineering Director', department: 'engineering' },
            { id: 'EngC', name: 'Engineering Dir C', role: 'Engineering Director', department: 'engineering' },
            { id: 'SalesA', name: 'Sales Dir A', role: 'Sales Director', department: 'sales' },
            { id: 'SalesB', name: 'Sales Dir B', role: 'Sales Director', department: 'sales' },
            { id: 'SalesC', name: 'Sales Dir C', role: 'Sales Director', department: 'sales' }
          ];
          relationships = [
            { manager: 'CEO', report: 'DivA', type: 'reports-to' },
            { manager: 'CEO', report: 'DivB', type: 'reports-to' },
            { manager: 'CEO', report: 'DivC', type: 'reports-to' },
            { manager: 'DivA', report: 'FinA', type: 'reports-to' },
            { manager: 'DivA', report: 'EngA', type: 'reports-to' },
            { manager: 'DivA', report: 'SalesA', type: 'reports-to' },
            { manager: 'DivB', report: 'FinB', type: 'reports-to' },
            { manager: 'DivB', report: 'EngB', type: 'reports-to' },
            { manager: 'DivB', report: 'SalesB', type: 'reports-to' },
            { manager: 'DivC', report: 'FinC', type: 'reports-to' },
            { manager: 'DivC', report: 'EngC', type: 'reports-to' },
            { manager: 'DivC', report: 'SalesC', type: 'reports-to' }
          ];
          break;
        case 'flat':
          people = [
            { id: 'CEO', name: 'CEO', role: 'Chief Executive Officer', department: 'executive' },
            { id: 'Dev1', name: 'Developer 1', role: 'Developer', department: 'engineering' },
            { id: 'Dev2', name: 'Developer 2', role: 'Developer', department: 'engineering' },
            { id: 'Dev3', name: 'Developer 3', role: 'Developer', department: 'engineering' },
            { id: 'Finance1', name: 'Finance 1', role: 'Finance Specialist', department: 'finance' },
            { id: 'Marketing1', name: 'Marketing 1', role: 'Marketing Specialist', department: 'marketing' },
            { id: 'Sales1', name: 'Sales 1', role: 'Sales Representative', department: 'sales' },
            { id: 'Sales2', name: 'Sales 2', role: 'Sales Representative', department: 'sales' },
            { id: 'Ops1', name: 'Operations 1', role: 'Operations Specialist', department: 'operations' }
          ];
          relationships = [
            { manager: 'CEO', report: 'Dev1', type: 'reports-to' },
            { manager: 'CEO', report: 'Dev2', type: 'reports-to' },
            { manager: 'CEO', report: 'Dev3', type: 'reports-to' },
            { manager: 'CEO', report: 'Finance1', type: 'reports-to' },
            { manager: 'CEO', report: 'Marketing1', type: 'reports-to' },
            { manager: 'CEO', report: 'Sales1', type: 'reports-to' },
            { manager: 'CEO', report: 'Sales2', type: 'reports-to' },
            { manager: 'CEO', report: 'Ops1', type: 'reports-to' }
          ];
          break;
      }
      
      // Update UI
      updateUI();
      
      // Reset any form inputs
      document.getElementById('personName').value = '';
      document.getElementById('personRole').value = '';
      document.getElementById('customRole').value = '';
      document.getElementById('customRole').style.display = 'none';
      document.getElementById('personDepartment').value = '';
      document.getElementById('manager').value = '';
      document.getElementById('report').value = '';
      
      // Clear any validation messages
      const validationElements = document.querySelectorAll('.validation-feedback');
      validationElements.forEach(el => {
        el.textContent = '';
      });
    }
    
    // --- Wizard Functions ---
    let wizardTemplate = 'functional';
    let wizardLeaders = [];
    let wizardTeams = [];
    let currentWizardStep = 1;
    
    function openWizard() {
      // Reset wizard state
      wizardTemplate = 'functional';
      wizardLeaders = [];
      wizardTeams = [];
      currentWizardStep = 1;
      
      // Reset form elements
      document.getElementById('wizard-leader-name').value = '';
      document.getElementById('wizard-custom-role').value = '';
      document.getElementById('wizard-custom-role-container').style.display = 'none';
      document.getElementById('wizard-leaders-list').innerHTML = '<li class="list-item">No leaders added yet</li>';
      
      // Reset active template
      document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('template-card-selected');
      });
      document.getElementById('template-functional').classList.add('template-card-selected');
      
      // Reset step indicators
      document.getElementById('step-indicator-1').className = 'step-indicator active';
      document.getElementById('step-indicator-2').className = 'step-indicator';
      document.getElementById('step-indicator-3').className = 'step-indicator';
      
      // Show the wizard
      document.getElementById('wizard-container').style.display = 'flex';
      
      // Show step 1, hide others
      document.getElementById('wizard-step-1').className = 'wizard-step active';
      document.getElementById('wizard-step-2').className = 'wizard-step';
      document.getElementById('wizard-step-3').className = 'wizard-step';
      
      // Setup buttons
      document.getElementById('wizard-prev').style.display = 'none';
      document.getElementById('wizard-next').style.display = 'inline-block';
      document.getElementById('wizard-finish').style.display = 'none';
    }
    
    function closeWizard() {
      document.getElementById('wizard-container').style.display = 'none';
    }
    
    function selectWizardTemplate(template) {
      wizardTemplate = template;
      
      // Highlight selected template
      document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('template-card-selected');
      });
      document.getElementById('template-' + template).classList.add('template-card-selected');
    }
    
    function addWizardLeader(role) {
      if (role === 'Custom') {
        document.getElementById('wizard-custom-role-container').style.display = 'block';
      } else {
        const name = document.getElementById('wizard-leader-name').value.trim();
        if (!name) {
          alert('Please enter a name for the leader');
          return;
        }
        
        // Add to wizard leaders
        wizardLeaders.push({
          name: name,
          role: role,
          department: 'executive'
        });
        
        // Update list
        updateWizardLeadersList();
        
        // Clear inputs
        document.getElementById('wizard-leader-name').value = '';
        document.getElementById('wizard-custom-role').value = '';
        document.getElementById('wizard-custom-role-container').style.display = 'none';
      }
    }
    
    function addWizardLeaderToList() {
      const name = document.getElementById('wizard-leader-name').value.trim();
      let role = '';
      
      if (document.getElementById('wizard-custom-role-container').style.display === 'block') {
        role = document.getElementById('wizard-custom-role').value.trim();
        if (!role) {
          alert('Please enter a custom role');
          return;
        }
      } else {
        alert('Please select a role or click "Custom..." to add a custom role');
        return;
      }
      
      if (!name) {
        alert('Please enter a name for the leader');
        return;
      }
      
      // Add to wizard leaders
      wizardLeaders.push({
        name: name,
        role: role,
        department: 'executive'
      });
      
      // Update list
      updateWizardLeadersList();
      
      // Clear inputs
      document.getElementById('wizard-leader-name').value = '';
      document.getElementById('wizard-custom-role').value = '';
      document.getElementById('wizard-custom-role-container').style.display = 'none';
    }
    
    function updateWizardLeadersList() {
      const list = document.getElementById('wizard-leaders-list');
      if (wizardLeaders.length === 0) {
        list.innerHTML = '<li class="list-item">No leaders added yet</li>';
        return;
      }
      
      list.innerHTML = '';
      wizardLeaders.forEach((leader, index) => {
        const li = document.createElement('li');
        li.className = 'list-item';
        li.innerHTML = `
          <span><strong>${leader.name}</strong> - ${leader.role}</span>
          <button class="btn btn-danger btn-sm" onclick="removeWizardLeader(${index})">Remove</button>
        `;
        list.appendChild(li);
      });
      
      // Update the leader select in step 3
      const leaderSelect = document.getElementById('wizard-relationship-leader');
      leaderSelect.innerHTML = '<option value="">Select a leader</option>';
      
      wizardLeaders.forEach((leader, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${leader.name} (${leader.role})`;
        leaderSelect.appendChild(option);
      });
    }
    
    function removeWizardLeader(index) {
      wizardLeaders.splice(index, 1);
      updateWizardLeadersList();
    }
    
    function addWizardTeamMember() {
      const leaderIndex = document.getElementById('wizard-relationship-leader').value;
      const name = document.getElementById('wizard-team-member-name').value.trim();
      const role = document.getElementById('wizard-team-member-role').value.trim();
      
      if (!leaderIndex) {
        alert('Please select a leader');
        return;
      }
      
      if (!name) {
        alert('Please enter a name for the team member');
        return;
      }
      
      // Add to wizard teams
      wizardTeams.push({
        leaderIndex: parseInt(leaderIndex),
        name: name,
        role: role
      });
      
      // Clear inputs
      document.getElementById('wizard-team-member-name').value = '';
      document.getElementById('wizard-team-member-role').value = '';
      
      // Update preview
      updateWizardPreview();
    }
    
    function updateWizardPreview() {
      const preview = document.getElementById('wizard-preview');
      
      if (wizardLeaders.length === 0) {
        preview.innerHTML = 'No leaders added yet';
        return;
      }
      
      let html = '<ul style="list-style-type: none; padding-left: 0;">';
      
      wizardLeaders.forEach((leader, index) => {
        html += `<li><strong>${leader.name}</strong> (${leader.role})`;
        
        const teamMembers = wizardTeams.filter(tm => tm.leaderIndex === index);
        if (teamMembers.length > 0) {
          html += '<ul style="padding-left: 20px;">';
          teamMembers.forEach(member => {
            html += `<li>${member.name}${member.role ? ` (${member.role})` : ''}</li>`;
          });
          html += '</ul>';
        }
        
        html += '</li>';
      });
      
      html += '</ul>';
      preview.innerHTML = html;
    }
    
    function nextWizardStep() {
      if (currentWizardStep === 1) {
        // Mark step 1 as completed
        document.getElementById('step-indicator-1').className = 'step-indicator completed';
        document.getElementById('step-indicator-2').className = 'step-indicator active';
        
        // Show step 2, hide others
        document.getElementById('wizard-step-1').className = 'wizard-step';
        document.getElementById('wizard-step-2').className = 'wizard-step active';
        document.getElementById('wizard-step-3').className = 'wizard-step';
        
        // Show previous button
        document.getElementById('wizard-prev').style.display = 'inline-block';
        
        currentWizardStep = 2;
      } else if (currentWizardStep === 2) {
        // Check if at least one leader is added
        if (wizardLeaders.length === 0) {
          alert('Please add at least one leader before proceeding');
          return;
        }
        
        // Mark step 2 as completed
        document.getElementById('step-indicator-2').className = 'step-indicator completed';
        document.getElementById('step-indicator-3').className = 'step-indicator active';
        
        // Show step 3, hide others
        document.getElementById('wizard-step-2').className = 'wizard-step';
        document.getElementById('wizard-step-3').className = 'wizard-step active';
        
        // Hide next button, show finish button
        document.getElementById('wizard-next').style.display = 'none';
        document.getElementById('wizard-finish').style.display = 'inline-block';
        
        // Update preview
        updateWizardPreview();
        
        currentWizardStep = 3;
      }
    }
    
    function prevWizardStep() {
      if (currentWizardStep === 2) {
        // Mark step 1 as active
        document.getElementById('step-indicator-1').className = 'step-indicator active';
        document.getElementById('step-indicator-2').className = 'step-indicator';
        
        // Show step 1, hide others
        document.getElementById('wizard-step-1').className = 'wizard-step active';
        document.getElementById('wizard-step-2').className = 'wizard-step';
        
        // Hide previous button
        document.getElementById('wizard-prev').style.display = 'none';
        
        currentWizardStep = 1;
      } else if (currentWizardStep === 3) {
        // Mark step 2 as active
        document.getElementById('step-indicator-2').className = 'step-indicator active';
        document.getElementById('step-indicator-3').className = 'step-indicator';
        
        // Show step 2, hide others
        document.getElementById('wizard-step-2').className = 'wizard-step active';
        document.getElementById('wizard-step-3').className = 'wizard-step';
        
        // Show next button, hide finish button
        document.getElementById('wizard-next').style.display = 'inline-block';
        document.getElementById('wizard-finish').style.display = 'none';
        
        currentWizardStep = 2;
      }
    }
    
    function finishWizard() {
      // Create people and relationships based on wizard selections
      people = [];
      relationships = [];
      
      // Add leaders
      wizardLeaders.forEach((leader, index) => {
        const id = generateId(leader.name);
        people.push({
          id: id,
          name: leader.name,
          role: leader.role,
          department: 'executive'
        });
      });
      
      // Add team members and relationships
      wizardTeams.forEach(member => {
        const leaderId = generateId(wizardLeaders[member.leaderIndex].name);
        const memberId = generateId(member.name);
        
        people.push({
          id: memberId,
          name: member.name,
          role: member.role,
          department: 'staff'
        });
        
        relationships.push({
          manager: leaderId,
          report: memberId,
          type: 'reports-to'
        });
      });
      
      // Close the wizard
      closeWizard();
      
      // Update UI
      updateUI();
      
      // Show success toast
      showSuccessToast('Organization created successfully!');
    }
    
    // Attempt to render a simplified version of the chart as a fallback
    function attemptFallbackRender() {
      try {
        const chartContainer = document.getElementById("chart");
        chartContainer.innerHTML = '<div class="loading">Generating simplified chart</div>';
        
        // Create a simplified version of the Mermaid code
        let simpleCode = 'graph TD\n';
        
        // Add simplified nodes without tooltips or complex formatting
        people.forEach(person => {
          // Use safe ID for node
          const safeId = person.id.replace(/[^a-zA-Z0-9]/g, '_');
          // Use plain text labels for maximum compatibility
          simpleCode += `${safeId}[${person.name}]\n`;
        });
        
        // Add simple relationships
        relationships.forEach(rel => {
          // Use safe IDs for relationships
          const safeManager = rel.manager.replace(/[^a-zA-Z0-9]/g, '_');
          const safeReport = rel.report.replace(/[^a-zA-Z0-9]/g, '_');
          simpleCode += `${safeManager} --> ${safeReport}\n`;
        });
        
        // Set the code to the input
        document.getElementById('input').value = simpleCode;
        
        // Render the simplified chart
        const renderContainerId = "mermaid-simple-" + Date.now();
        const renderContainer = document.createElement("div");
        renderContainer.id = renderContainerId;
        renderContainer.style.display = "none";
        chartContainer.appendChild(renderContainer);
        
        mermaid.render(renderContainerId, simpleCode)
          .then(result => {
            chartContainer.innerHTML = '';
            const svgContainer = document.createElement("div");
            svgContainer.innerHTML = result.svg;
            
            const svg = svgContainer.querySelector("svg");
            if (svg) {
              svg.setAttribute("width", "100%");
              svg.style.maxWidth = "100%";
            }
            
            chartContainer.appendChild(svgContainer);
            chartContainer.insertAdjacentHTML('beforeend', 
              '<div style="padding: 10px; background-color: #fff3cd; color: #856404; margin-top: 10px; border-radius: 4px;">⚠️ Showing simplified chart. Some formatting has been removed to improve compatibility.</div>'
            );
          })
          .catch(error => {
            console.error("Fallback rendering error:", error);
            chartContainer.innerHTML = `
              <div class="error-message">
                <strong>Unable to render chart:</strong> ${error.message || 'Unknown error'}
                <p>Please try adding your organization structure again with simpler names and fewer relationships.</p>
              </div>
            `;
          });
      } catch (error) {
        console.error("Error in fallback renderer:", error);
        const chartContainer = document.getElementById("chart");
        chartContainer.innerHTML = `
          <div class="error-message">
            <strong>Unable to render chart:</strong> ${error.message}
            <p>Please try refreshing the page.</p>
          </div>
        `;
      }
    }
    
    // On page load, initialize with sample data
    window.onload = function() {
      // Set up Mermaid with error handling FIRST before rendering anything
      try {
        // First, ensure mermaid is available
        if (typeof mermaid === 'undefined') {
          console.error('Mermaid library not loaded!');
          return;
        }
        
        // Initialize with proper configuration for Mermaid 10.6.1
        mermaid.initialize({ 
          startOnLoad: false,
          securityLevel: 'loose',
          theme: 'default',
          flowchart: {
            htmlLabels: true,
            useMaxWidth: true
          },
          logLevel: 5  // Set to 5 for error only
        });
        
        // Add event listeners for the direction toggle
        const directionRadios = document.querySelectorAll('input[name="chart-direction"]');
        directionRadios.forEach(radio => {
          radio.addEventListener('change', function() {
            generateMermaidCode();
            renderChart();
          });
        });
      
      // Wait a short time for Mermaid to initialize fully
      setTimeout(() => {
        // Initialize position type UI
        selectPositionType('executive');
        
        // Load sample data (this will call renderChart)
        loadSampleData();
      }, 100);
      
      console.log('Initialization complete');
      } catch (err) {
        console.error('Error during initialization:', err);
        alert('There was an error initializing the chart library. Please refresh the page and try again.');
      }
    };