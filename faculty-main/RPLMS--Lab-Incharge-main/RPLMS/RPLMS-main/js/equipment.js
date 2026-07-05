// Equipment Tracking Page Logic & Raise Damage Ticket Modal Controller

document.addEventListener("DOMContentLoaded", () => {
    let db = getDB();

    // State
    let currentFilters = {
        status: "All",
        search: ""
    };
    let sortField = "id";
    let sortOrder = "asc";
    let currentPage = 1;
    const itemsPerPage = 20;

    // DOM Elements
    const tableBody = document.getElementById("trackingTableBody");
    const tableInfo = document.getElementById("trackingTableInfo");
    const paginationContainer = document.getElementById("trackingPagination");
    const searchInput = document.getElementById("searchTrackingInput");
    const filterTabs = document.querySelectorAll(".filter-tab");

    // KPI Elements
    const kpiTotal = document.getElementById("kpiTotalTracked");
    const kpiDamage = document.getElementById("kpiReportedDamage");
    const kpiOperational = document.getElementById("kpiOperational");

    // Modal Elements
    const modalBackdrop = document.getElementById("damageTicketModalBackdrop");
    const closeBtn = document.getElementById("closeDamageModalBtn");
    const cancelBtn = document.getElementById("cancelDamageModalBtn");
    const teamDropdown = document.getElementById("teamId");
    const equipmentNameInput = document.getElementById("equipmentName");
    const damageForm = document.getElementById("damageTicketForm");

    function updateKPIs() {
        const list = db.inventory;
        kpiTotal.textContent = String(list.length).padStart(2, '0');
        // Count damaged tickets (pending or in-progress)
        const activeDamageTickets = db.tickets.filter(t => t.type === "Damage" && t.status !== "Resolved");
        kpiDamage.textContent = String(activeDamageTickets.length).padStart(2, '0');
        kpiOperational.textContent = String(list.filter(item => item.status === "Available").length).padStart(2, '0');
    }

    function renderTable() {
        tableBody.innerHTML = `
      <tr>
        <td class="skeleton" style="height: 48px; border-bottom: 8px solid white;"></td>
        <td class="skeleton" style="height: 48px; border-bottom: 8px solid white;"></td>
        <td class="skeleton" style="height: 48px; border-bottom: 8px solid white;"></td>
        <td class="skeleton" style="height: 48px; border-bottom: 8px solid white;"></td>
        <td class="skeleton" style="height: 48px; border-bottom: 8px solid white;"></td>
        <td class="skeleton" style="height: 48px; border-bottom: 8px solid white;"></td>
        <td class="skeleton" style="height: 48px; border-bottom: 8px solid white;"></td>
      </tr>
    `;

        setTimeout(() => {
            // 1. FILTERING
            let filteredData = db.inventory.filter(item => {
                const matchesStatus = currentFilters.status === "All" || item.status === currentFilters.status;
                const matchesSearch = item.name.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                    item.id.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                    item.serial.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                    item.location.toLowerCase().includes(currentFilters.search.toLowerCase());
                return matchesStatus && matchesSearch;
            });

            // 2. SORTING
            filteredData.sort((a, b) => {
                let valA = String(a[sortField]).toLowerCase();
                let valB = String(b[sortField]).toLowerCase();

                if (valA < valB) return sortOrder === "asc" ? -1 : 1;
                if (valA > valB) return sortOrder === "asc" ? 1 : -1;
                return 0;
            });

            // 3. PAGINATION
            const totalItems = filteredData.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

            if (currentPage > totalPages) currentPage = totalPages;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
            const paginatedData = filteredData.slice(startIndex, endIndex);

            // Render Rows
            if (paginatedData.length === 0) {
                tableBody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 48px 16px;">
              <div class="empty-state">
                <span class="empty-state-icon">&#10034;</span>
                <span class="empty-state-title">No Equipment Found</span>
                <p class="empty-state-desc">Try search keywords or alternative status categories.</p>
              </div>
            </td>
          </tr>
        `;
                tableInfo.textContent = "Showing 0 to 0 of 0 entries";
                renderPagination(1, 1);
                return;
            }

            tableBody.innerHTML = paginatedData.map(item => {
                let badgeClass = "status-resolved"; // Available
                if (item.status === "Maintenance" || item.status === "Repairing") badgeClass = "status-pending";
                if (item.status === "Borrowed") badgeClass = "status-in-progress";

                return `
          <tr>
            <td style="font-weight: 700;">${item.id}</td>
            <td style="font-weight: 600;">${item.name}</td>
            <td>${item.type}</td>
            <td>${item.serial || 'N/A'}</td>
            <td>${item.location}</td>
            <td><span class="badge ${badgeClass}">${item.status}</span></td>
            <td>
              <button class="btn btn-action-outline damage-action" onclick="openRaiseDamageModal('${item.name}', '${item.id}')">
                &#9888; Raise Ticket
              </button>
            </td>
          </tr>
        `;
            }).join("");

            tableInfo.textContent = `Showing ${totalItems === 0 ? 0 : startIndex + 1} to ${endIndex} of ${totalItems} entries`;
            renderPagination(currentPage, totalPages);
        }, 200);
    }

    function renderPagination(current, total) {
        paginationContainer.innerHTML = "";

        // Prev
        const prevItem = document.createElement("li");
        prevItem.className = `page-item ${current === 1 ? 'disabled' : ''}`;
        prevItem.innerHTML = `<button class="page-link" ${current === 1 ? 'disabled' : ''}>&lt;</button>`;
        if (current > 1) {
            prevItem.querySelector("button").addEventListener("click", () => {
                currentPage--;
                renderTable();
            });
        }
        paginationContainer.appendChild(prevItem);

        // Pages
        for (let i = 1; i <= total; i++) {
            const pageItem = document.createElement("li");
            pageItem.className = `page-item ${current === i ? 'active' : ''}`;
            pageItem.innerHTML = `<button class="page-link">${i}</button>`;
            pageItem.querySelector("button").addEventListener("click", () => {
                currentPage = i;
                renderTable();
            });
            paginationContainer.appendChild(pageItem);
        }

        // Next
        const nextItem = document.createElement("li");
        nextItem.className = `page-item ${current === total ? 'disabled' : ''}`;
        nextItem.innerHTML = `<button class="page-link" ${current === total ? 'disabled' : ''}>&gt;</button>`;
        if (current < total) {
            nextItem.querySelector("button").addEventListener("click", () => {
                currentPage++;
                renderTable();
            });
        }
        paginationContainer.appendChild(nextItem);
    }

    // --- Modal Logic ---
    let activeEquipmentId = null;

    // Load team list into select box
    function loadTeamsDropdown() {
        teamDropdown.innerHTML = `<option value="">Select team responsible</option>` +
            db.teams.map(t => `<option value="${t.id}">${t.id} - ${t.name}</option>`).join("");
    }

    window.openRaiseDamageModal = function (name, id) {
        activeEquipmentId = id;
        equipmentNameInput.value = name;

        // Reset inputs
        teamDropdown.value = "";
        document.getElementById("damageDescription").value = "";
        document.getElementById("fineAmount").value = "500"; // default

        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        document.getElementById("dueDate").value = nextWeek.toISOString().split('T')[0]; // Default 7 days future
        document.getElementById("remarks").value = "";

        loadTeamsDropdown();

        // Show Modal
        modalBackdrop.classList.add("show");

        // Bind Escape key click
        document.addEventListener("keydown", escKeyModalHandler);

        // Reset dirty checker state
        validator.isDirty = false;
        validator.setupCharCounters();
    };

    function closeModal() {
        modalBackdrop.classList.remove("show");
        document.removeEventListener("keydown", escKeyModalHandler);
        activeEquipmentId = null;
    }

    function escKeyModalHandler(e) {
        if (e.key === "Escape") {
            closeModalWithConfirm();
        }
    }

    function closeModalWithConfirm() {
        if (validator.isDirty) {
            createConfirmationModal(
                "Discard Ticket Draft?",
                "Are you sure you want to discard this ticket draft? Any inputs will be lost.",
                () => {
                    validator.isDirty = false;
                    closeModal();
                },
                "Discard",
                true
            );
        } else {
            closeModal();
        }
    }

    closeBtn.addEventListener("click", closeModalWithConfirm);
    cancelBtn.addEventListener("click", closeModalWithConfirm);
    modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) {
            closeModalWithConfirm();
        }
    });

    // Modal form validator schema
    const schema = {
        teamId: { required: true },
        equipmentName: { required: true, noOnlyNumbers: true },
        damageDescription: { required: true, charLimit: 500 },
        fineAmount: { required: true, type: "numeric", min: 0 },
        dueDate: { required: true, dateType: "future" },
        remarks: { charLimit: 250 }
    };

    // Construct validation
    const validator = new RPLMSFormValidator("damageTicketForm", schema, (formData) => {
        // Generate new ticket
        const ticketIdNum = db.tickets.length + 1;
        const newTktId = `TKT-${String(ticketIdNum).padStart(3, '0')}`;

        const teamObj = db.teams.find(t => t.id === formData.teamId);
        const today = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedDate = `${String(today.getDate()).padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`;
        const formattedTime = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Format Due date: "10 Jul 2025"
        let rawDue = new Date(formData.dueDate);
        const formattedDue = `${String(rawDue.getDate()).padStart(2, '0')} ${months[rawDue.getMonth()]} ${rawDue.getFullYear()}`;

        const newTicket = {
            id: newTktId,
            type: "Damage",
            assignedTo: formData.teamId,
            teamName: teamObj ? teamObj.name : "Smart Irrigation System",
            subject: `${formData.equipmentName} Damaged`,
            priority: Number(formData.fineAmount) > 400 ? "High" : "Medium",
            date: formattedDate,
            time: formattedTime,
            status: "Pending",
            equipmentName: formData.equipmentName,
            raisedBy: "Lab Incharge",
            damageDescription: formData.damageDescription,
            fineAmount: formData.fineAmount,
            dueDate: formattedDue,
            remarks: formData.remarks || "",
            teamResponse: "",
            lastUpdated: `${formattedDate}, ${formattedTime}`
        };

        // Update equipment status in inventory to "Repairing"
        const equipIdx = db.inventory.findIndex(item => item.id === activeEquipmentId);
        if (equipIdx > -1) {
            db.inventory[equipIdx].status = "Repairing";
        }

        db.tickets.push(newTicket);
        setDB(db); // Save to LocalStorage DB

        closeModal();
        showToast(`Damage Ticket ${newTktId} raised successfully!`, "success");

        // Refresh Table and KPI
        db = getDB();
        updateKPIs();
        renderTable();
    }, "rplms_draft_damage_ticket");

    // --- Search input listener ---
    searchInput.addEventListener("input", debounce((e) => {
        currentFilters.search = e.target.value.trim();
        currentPage = 1;
        renderTable();
    }, 250));

    // --- Tabs filters selection ---
    filterTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            filterTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentFilters.status = tab.dataset.status;
            currentPage = 1;
            renderTable();
        });
    });

    // --- Sorting headers setup ---
    document.querySelectorAll(".sortable").forEach(header => {
        header.addEventListener("click", () => {
            const field = header.dataset.sort;
            if (sortField === field) {
                sortOrder = (sortOrder === "asc") ? "desc" : "asc";
            } else {
                sortField = field;
                sortOrder = "asc";
            }
            renderTable();
        });
    });

    // Initial load
    updateKPIs();
    renderTable();
});
