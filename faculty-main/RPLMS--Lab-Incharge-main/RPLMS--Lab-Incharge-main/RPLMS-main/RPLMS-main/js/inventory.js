// Inventory Page Logic (pagination, filtering, sorting, delete)

document.addEventListener("DOMContentLoaded", () => {
    let db = getDB();

    // State
    let currentFilters = {
        type: "All",
        search: ""
    };
    let sortField = "id";
    let sortOrder = "asc";
    let currentPage = 1;
    const itemsPerPage = 5;

    // DOM Elements
    const tableBody = document.getElementById("inventoryTableBody");
    const tableInfo = document.getElementById("inventoryTableInfo");
    const paginationContainer = document.getElementById("inventoryPagination");
    const searchInput = document.getElementById("searchInventoryInput");
    const filterTabs = document.querySelectorAll(".filter-tab");

    // KPI Elements
    const kpiTotal = document.getElementById("kpiTotalInventory");
    const kpiAvailable = document.getElementById("kpiAvailableInventory");
    const kpiMaintenance = document.getElementById("kpiMaintenanceInventory");

    function updateKPIs() {
        const list = db.inventory;
        kpiTotal.textContent = String(list.length).padStart(2, '0');
        kpiAvailable.textContent = String(list.filter(item => item.status === "Available").length).padStart(2, '0');
        kpiMaintenance.textContent = String(list.filter(item => item.status === "Maintenance" || item.status === "Repairing").length).padStart(2, '0');
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
                const matchesType = currentFilters.type === "All" || item.type === currentFilters.type;
                const matchesSearch = item.name.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                    item.id.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                    item.manufacturer.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                    item.location.toLowerCase().includes(currentFilters.search.toLowerCase());
                return matchesType && matchesSearch;
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
                <span class="empty-state-icon">&#10065;</span>
                <span class="empty-state-title">No Inventory Items Found</span>
                <p class="empty-state-desc">Try widening your search query or choosing a different filter tab.</p>
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
                if (item.status === "Maintenance" || item.status === "Repairing") badgeClass = "status-pending"; // Warning
                if (item.status === "Borrowed") badgeClass = "status-in-progress";

                return `
          <tr>
            <td style="font-weight: 700;">${item.id}</td>
            <td style="font-weight: 600;">${item.name}</td>
            <td>${item.type}</td>
            <td>${item.manufacturer}</td>
            <td>${item.location}</td>
            <td><span class="badge ${badgeClass}">${item.status}</span></td>
            <td>
              <div style="display: flex; gap: 8px;">
                <a href="inventory-edit.html?id=${item.id}" class="btn-view" style="font-weight:600;">Edit</a>
                <button class="btn-view" style="color: #EF4444; border-color: var(--border-color); font-weight:600;" onclick="deleteEquipment('${item.id}', '${item.name}')">Delete</button>
              </div>
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

    // --- Deletion Dialog ---
    window.deleteEquipment = function (id, name) {
        createConfirmationModal(
            "Confirm Equipment Deletion",
            `Are you sure you want to delete <strong>${name} (${id})</strong> from the inventory system? This action is permanent and cannot be undone.`,
            () => {
                db.inventory = db.inventory.filter(item => item.id !== id);
                setDB(db); // Save to LocalStorage
                showToast(`Item ${id} deleted successfully`, "success");
                updateKPIs();
                renderTable();
            },
            "Delete Item",
            true
        );
    };

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
            currentFilters.type = tab.dataset.type;
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
