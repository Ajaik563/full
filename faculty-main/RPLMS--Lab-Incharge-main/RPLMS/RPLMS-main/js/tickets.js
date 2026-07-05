// Tickets Management Logic (table list, filters tabs, pagination, details modals)

document.addEventListener("DOMContentLoaded", () => {
    let db = getDB();

    // State
    let currentFilters = {
        type: "All", // "All", "Procurement", "Damage"
        search: ""
    };
    let sortField = "id";
    let sortOrder = "desc"; // Default sorting is Raised Date (descending) in screenshot, let's sort ID or Date
    let currentPage = 1;
    const itemsPerPage = 7; // Matches screenshot showing 7 items per page

    // DOM Elements
    const tableBody = document.getElementById("ticketsTableBody");
    const tableInfo = document.getElementById("ticketsTableInfo");
    const paginationContainer = document.getElementById("ticketsPagination");
    const searchInput = document.getElementById("searchTicketsInput");
    const filterTabs = document.querySelectorAll(".filter-tab");

    // KPI Elements
    const kpiTotal = document.getElementById("kpiTotalTickets");
    const kpiOpen = document.getElementById("kpiOpenTickets");
    const kpiProgress = document.getElementById("kpiProgressTickets");
    const kpiResolved = document.getElementById("kpiResolvedTickets");

    // Modal backdrop
    const modalBackdrop = document.getElementById("ticketDetailsModalBackdrop");
    const modalContainer = document.getElementById("ticketDetailsModalContainer");

    function updateKPIs() {
        const list = db.tickets;
        kpiTotal.textContent = String(list.length).padStart(2, '0');
        kpiOpen.textContent = String(list.filter(t => t.status === "Open").length).padStart(2, '0');
        kpiProgress.textContent = String(list.filter(t => t.status === "In Progress" || t.status === "Pending").length).padStart(2, '0');
        kpiResolved.textContent = String(list.filter(t => t.status === "Resolved").length).padStart(2, '0');
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
        <td class="skeleton" style="height: 48px; border-bottom: 8px solid white;"></td>
      </tr>
    `;

        setTimeout(() => {
            // 1. FILTERING
            let filteredData = db.tickets.filter(item => {
                const matchesType = currentFilters.type === "All" || item.type === currentFilters.type;
                const matchesSearch = item.subject.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                    item.id.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                    item.assignedTo.toLowerCase().includes(currentFilters.search.toLowerCase());
                return matchesType && matchesSearch;
            });

            // 2. SORTING (Raised date or ID)
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
            <td colspan="8" style="text-align: center; padding: 48px 16px;">
              <div class="empty-state">
                <span class="empty-state-icon">&#9993;</span>
                <span class="empty-state-title">No Tickets Found</span>
                <p class="empty-state-desc">No entries matching the current filter parameters.</p>
              </div>
            </td>
          </tr>
        `;
                tableInfo.textContent = "Showing 0 to 0 of 0 tickets";
                renderPagination(1, 1);
                return;
            }

            tableBody.innerHTML = paginatedData.map(t => {
                let typePill = t.type === "Procurement"
                    ? `<span class="type-pill type-procurement"><span style="font-size:10px;">&#128722;</span> ${t.type}</span>`
                    : `<span class="type-pill type-damage"><span style="font-size:10px;">&#128295;</span> ${t.type}</span>`;

                let prioClass = `priority-${t.priority.toLowerCase()}`;

                let statClass = "status-open";
                if (t.status === "Pending") statClass = "status-pending";
                if (t.status === "In Progress") statClass = "status-in-progress";
                if (t.status === "Resolved") statClass = "status-resolved";

                const showAssigned = t.type === "Damage"
                    ? `<a href="teams.html" class="team-link">${t.assignedTo}</a><br><span style="font-size:10px; color:var(--text-secondary);">${t.teamName || ''}</span>`
                    : `${t.assignedTo}<br><span style="font-size:10px; color:var(--text-secondary);">${t.assigneeRole || ''}</span>`;

                return `
          <tr>
            <td style="font-weight: 700;">${t.id}</td>
            <td>${typePill}</td>
            <td>${showAssigned}</td>
            <td style="font-weight: 600;">${t.subject}</td>
            <td><span class="badge ${prioClass}">${t.priority}</span></td>
            <td>${t.date}</td>
            <td><span class="badge ${statClass}">${t.status}</span></td>
            <td>
              <button class="btn-view" onclick="viewTicketDetails('${t.id}')">View</button>
            </td>
          </tr>
        `;
            }).join("");

            tableInfo.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} tickets`;
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

    // --- Modal Detail Views ---
    window.viewTicketDetails = function (ticketId) {
        const t = db.tickets.find(item => item.id === ticketId);
        if (!t) return;

        if (t.type === "Damage") {
            // Screenshot 2 details format
            const statusLabelClass = t.status === "Pending" ? "status-pending" : (t.status === "Resolved" ? "status-resolved" : "status-in-progress");
            const waitingMessage = t.teamResponse
                ? `<div style="font-size:12px; color:var(--text-primary); font-weight:500; font-family:inherit; padding: 4px 6px;">${t.teamResponse}</div>`
                : `<div class="info-message-box">
             <span style="font-size:14px;">&#8505;</span>
             <span>Waiting for team response</span>
           </div>`;

            modalContainer.style.width = "720px";
            modalContainer.innerHTML = `
        <div class="modal-header">
          <div class="modal-header-left">
            <div class="circle-icon-wrapper red-alert" style="width: 48px; height: 48px; border-radius: 12px; font-size:20px;">
              &#128295;
            </div>
            <div class="card-header-text">
              <span class="card-title">Damage Ticket Details</span>
              <span class="card-subtitle">View damage ticket raised for equipment</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <span class="badge ${statusLabelClass}" style="padding: 6px 12px; font-size:11px; text-transform:uppercase;">&#128337; ${t.status}</span>
            <button class="modal-close-btn" id="closeDetailsModalBtn">&times;</button>
          </div>
        </div>

        <div class="modal-body">
          
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Ticket ID</span>
              <span class="detail-value text-danger">${t.id}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Date Raised</span>
              <span class="detail-value">${t.date}, ${t.time}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Team ID</span>
              <span class="detail-value"><a href="teams.html" class="team-link">${t.assignedTo}</a></span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Priority</span>
              <span class="badge priority-${t.priority.toLowerCase()}" style="width:fit-content; border-radius:4px; padding:3px 8px; font-size:11px;">${t.priority}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Equipment Name</span>
              <span class="detail-value">${t.equipmentName}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Status</span>
              <span class="badge ${statusLabelClass}" style="width:fit-content; border-radius:4px; padding:3px 8px; font-size:11px;">${t.status}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Raised By</span>
              <span class="detail-value">${t.raisedBy}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Last Updated</span>
              <span class="detail-value">${t.lastUpdated}</span>
            </div>
          </div>

          <div class="form-group">
            <span class="section-title-sm"><span style="font-size:14px; margin-right:4px;">&#128442;</span> Damage Description</span>
            <div class="warn-message-box" style="margin-top:6px;">
              ${t.damageDescription}
            </div>
          </div>

          <!-- Grid for cards at bottom -->
          <div class="detail-bottom-grid">
            <div class="detail-bottom-card">
              <div class="detail-bottom-icon fee">&#8377;</div>
              <div class="detail-bottom-details">
                <span class="detail-bottom-label">Fine Amount</span>
                <span class="detail-bottom-val">&#8377; ${t.fineAmount}</span>
              </div>
            </div>

            <div class="detail-bottom-card">
              <div class="detail-bottom-icon date">&#128197;</div>
              <div class="detail-bottom-details">
                <span class="detail-bottom-label">Due Date</span>
                <span class="detail-bottom-val">${t.dueDate}</span>
              </div>
            </div>

            <div class="detail-bottom-card">
              <div class="detail-bottom-icon remarks">&#128172;</div>
              <div class="detail-bottom-details">
                <span class="detail-bottom-label">Remarks</span>
                <span class="detail-bottom-val" style="font-size: 10px; font-weight: 500; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:130px;" title="${t.remarks}">${t.remarks || 'None'}</span>
              </div>
            </div>
          </div>

          <!-- Team response box -->
          <div class="form-group">
            <span class="section-title-sm"><span style="font-size:14px; margin-right:4px;">&#128100;</span> Team Response</span>
            <div style="margin-top: 6px; border:1px solid var(--border-color); border-radius:8px; padding:12px;">
              ${waitingMessage}
            </div>
          </div>

        </div>

        <div class="modal-footer" style="background-color:#FFFFFF;">
          <!-- Close button -->
          <button type="button" class="btn btn-secondary" id="closeDetailsFooterBtn">Close</button>
        </div>
      `;
        } else {
            // Screenshot 4 layout (Procurement Ticket Details)
            // Headers: #, Item Name, Available Qty, Minimum Level
            const itemsListHtml = t.items.map((it, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td style="font-weight:600;">${it.name}</td>
          <td class="text-danger">${it.qty}</td>
          <td>${it.min}</td>
        </tr>
      `).join("");

            const adminMessage = t.adminResponse
                ? `<div style="font-size:12px; color:var(--text-primary); font-weight:500;">${t.adminResponse}</div>`
                : `<div class="info-message-box" style="background-color:#F8FAFC; border-color:var(--border-color); color:var(--text-secondary);">
             <span style="font-size:14px;">&#8505;</span>
             <span>No response yet from administrator.</span>
           </div>`;

            modalContainer.style.width = "720px";
            modalContainer.innerHTML = `
        <div class="modal-header">
          <div class="modal-header-left">
            <div class="circle-icon-wrapper blue-info" style="width: 48px; height: 48px; border-radius: 12px; font-size:20px; background-color:#EFF6FF; color:#2563EB;">
              &#128722;
            </div>
            <div class="card-header-text">
              <span class="card-title">Ticket Details</span>
              <span class="badge type-procurement" style="width:fit-content; font-size:10px; margin-top:2px;">Procurement Ticket</span>
            </div>
          </div>
          <button class="modal-close-btn" id="closeDetailsModalBtn">&times;</button>
        </div>

        <div class="modal-body">
          
          <!-- Details top grid -->
          <div class="details-grid" style="grid-template-columns: repeat(2, 1fr); border: none; padding: 0 0 16px 0; border-bottom: 1px solid var(--border-color); border-radius:0;">
            
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div style="display:flex; align-items:center; gap:36px;">
                <span class="detail-label" style="width:80px;">Ticket ID</span>
                <span class="detail-value">${t.id}</span>
              </div>
              <div style="display:flex; align-items:center; gap:36px;">
                <span class="detail-label" style="width:80px;">Raised By</span>
                <span class="detail-value">${t.raisedBy}</span>
              </div>
              <div style="display:flex; align-items:center; gap:36px;">
                <span class="detail-label" style="width:80px;">Assigned To</span>
                <span class="detail-value">${t.assignedTo}</span>
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:12px;">
              <div style="display:flex; align-items:center; gap:36px;">
                <span class="detail-label" style="width:80px;">Date Raised</span>
                <span class="detail-value">${t.date}, ${t.time}</span>
              </div>
              <div style="display:flex; align-items:center; gap:36px;">
                <span class="detail-label" style="width:80px;">Status</span>
                <span class="badge status-open" style="border-radius:4px; font-weight:600; padding:2px 8px; font-size:11px;">${t.status}</span>
              </div>
              <div style="display:flex; align-items:center; gap:36px;">
                <span class="detail-label" style="width:80px;">Priority</span>
                <span class="badge priority-${t.priority.toLowerCase()}" style="border-radius:4px; font-weight:600; padding:2px 8px; font-size:11px;">${t.priority}</span>
              </div>
            </div>

          </div>

          <!-- Components Sub-Table -->
          <div class="form-group">
            <span class="section-title-sm">Affected Components (Below Minimum Stock Level)</span>
            <div class="detail-table-card" style="margin-top:8px;">
              <table class="detail-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item Name</th>
                    <th>Available Qty</th>
                    <th>Minimum Level</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsListHtml}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Reason box -->
          <div class="form-group">
            <span class="section-title-sm">Reason for Ticket</span>
            <div style="background-color: #EFF6FF; border:1px solid #DBEAFE; border-radius:8px; padding:12px; color:#1E40AF; font-size:12px; font-weight:500; margin-top:8px; line-height:1.5;">
              ${t.reason}
            </div>
          </div>

          <!-- Administrator Response -->
          <div class="form-group">
            <span class="section-title-sm">Admin Response</span>
            <div style="margin-top: 8px; border:1px solid var(--border-color); border-radius:8px; padding:12px;">
              ${adminMessage}
            </div>
          </div>

        </div>

        <div class="modal-footer" style="background-color:#FFFFFF;">
          <button type="button" class="btn btn-secondary" id="closeDetailsFooterBtn">Close</button>
        </div>
      `;
        }

        // Show modal
        modalBackdrop.classList.add("show");

        // Close logic binders
        const closeModal = () => {
            modalBackdrop.classList.remove("show");
            document.removeEventListener("keydown", escDetailsModal);
        };

        const escDetailsModal = (e) => {
            if (e.key === "Escape") closeModal();
        };

        document.getElementById("closeDetailsModalBtn").addEventListener("click", closeModal);
        document.getElementById("closeDetailsFooterBtn").addEventListener("click", closeModal);
        document.addEventListener("keydown", escDetailsModal);

        modalBackdrop.addEventListener("click", (e) => {
            if (e.target === modalBackdrop) closeModal();
        });
    };

    // --- Raise Ticket Modal ---
    document.getElementById("raiseTicketBtn").addEventListener("click", () => {
        const db2 = getDB();
        const teamOptions = db2.teams.map(t =>
            `<option value="${t.id}">${t.id} \u2014 ${t.name}</option>`
        ).join("");

        // Derive low stock items: inventory items that have pending material requests
        const pendingReqs = db2.materialRequests.filter(r => r.status === "Pending");
        const lowStockMap = {};
        pendingReqs.forEach(r => {
            if (!lowStockMap[r.item]) lowStockMap[r.item] = { totalQty: 0, teams: 0 };
            lowStockMap[r.item].totalQty += r.qty;
            lowStockMap[r.item].teams++;
        });
        // Also include inventory items in Maintenance/Repairing
        db2.inventory.filter(i => i.status === "Maintenance" || i.status === "Repairing").forEach(i => {
            if (!lowStockMap[i.name]) lowStockMap[i.name] = { totalQty: 0, teams: 0 };
        });

        const lowStockItems = Object.entries(lowStockMap).map(([name, v]) => ({ name, qty: v.totalQty, min: 5 }));

        const lowStockTableRows = lowStockItems.length
            ? lowStockItems.map((it, i) => `
                <tr>
                    <td style="padding:8px 10px;font-size:12px;">${i + 1}</td>
                    <td style="padding:8px 10px;font-size:12px;font-weight:600;">${it.name}</td>
                    <td style="padding:8px 10px;font-size:12px;color:#DC2626;font-weight:700;">${it.qty}</td>
                    <td style="padding:8px 10px;font-size:12px;">${it.min}</td>
                    <td style="padding:8px 10px;">
                        <input type="checkbox" class="ls-check" data-name="${escapeHtml(it.name)}" data-qty="${it.qty}" data-min="${it.min}" checked style="width:15px;height:15px;cursor:pointer;">
                    </td>
                </tr>`).join("")
            : `<tr><td colspan="5" style="text-align:center;padding:16px;font-size:12px;color:var(--text-secondary);">No low stock items detected.</td></tr>`;

        modalContainer.style.width = "660px";
        modalContainer.innerHTML = `
            <div class="modal-header">
                <div class="modal-header-left">
                    <div class="circle-icon-wrapper blue-info" style="width:48px;height:48px;border-radius:12px;font-size:20px;">&#9993;</div>
                    <div class="card-header-text">
                        <span class="card-title">Raise New Ticket</span>
                        <span class="card-subtitle">Submit a damage or procurement ticket</span>
                    </div>
                </div>
                <button class="modal-close-btn" id="closeRaiseModalBtn">&times;</button>
            </div>
            <div class="modal-body">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
                    <div class="form-group" style="margin-bottom:0;">
                        <label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px;">Ticket Type</label>
                        <select id="rtType" class="form-control" style="font-size:13px;">
                            <option value="Damage">Damage</option>
                            <option value="Procurement">Procurement</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px;">Priority</label>
                        <select id="rtPriority" class="form-control" style="font-size:13px;">
                            <option value="High">High</option>
                            <option value="Medium" selected>Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                </div>
                <div class="form-group" id="rtTeamGroup" style="margin-bottom:14px;">
                    <label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px;">Assign To Team</label>
                    <select id="rtTeam" class="form-control" style="font-size:13px;">${teamOptions}</select>
                </div>
                <div class="form-group" style="margin-bottom:14px;">
                    <label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px;">Subject</label>
                    <input type="text" id="rtSubject" class="form-control" placeholder="Enter ticket subject" style="font-size:13px;">
                </div>
                <div class="form-group" style="margin-bottom:14px;">
                    <label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px;">Description / Reason</label>
                    <textarea id="rtDesc" class="form-control" rows="2" placeholder="Describe the issue or reason..." style="font-size:13px;resize:vertical;"></textarea>
                </div>
                <div id="rtLowStockSection" style="display:none;">
                    <div style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-bottom:6px;">&#9888; Low Stock Items (select to include in ticket)</div>
                    <div style="border:1px solid var(--border-color);border-radius:8px;overflow:hidden;">
                        <table style="width:100%;border-collapse:collapse;">
                            <thead style="background:var(--bg-primary);">
                                <tr>
                                    <th style="padding:8px 10px;font-size:11px;font-weight:600;color:var(--text-secondary);text-align:left;">#</th>
                                    <th style="padding:8px 10px;font-size:11px;font-weight:600;color:var(--text-secondary);text-align:left;">Item Name</th>
                                    <th style="padding:8px 10px;font-size:11px;font-weight:600;color:var(--text-secondary);text-align:left;">Requested Qty</th>
                                    <th style="padding:8px 10px;font-size:11px;font-weight:600;color:var(--text-secondary);text-align:left;">Min Level</th>
                                    <th style="padding:8px 10px;font-size:11px;font-weight:600;color:var(--text-secondary);text-align:left;">Include</th>
                                </tr>
                            </thead>
                            <tbody>${lowStockTableRows}</tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="background:#fff;">
                <button class="btn btn-secondary" id="cancelRaiseBtn">Cancel</button>
                <button class="btn btn-primary" id="submitRaiseBtn">Submit Ticket</button>
            </div>
        `;

        modalBackdrop.classList.add("show");

        const closeRaise = () => {
            modalBackdrop.classList.remove("show");
            document.removeEventListener("keydown", escRaise);
        };
        const escRaise = e => { if (e.key === "Escape") closeRaise(); };

        document.getElementById("closeRaiseModalBtn").addEventListener("click", closeRaise);
        document.getElementById("cancelRaiseBtn").addEventListener("click", closeRaise);
        modalBackdrop.addEventListener("click", e => { if (e.target === modalBackdrop) closeRaise(); });
        document.addEventListener("keydown", escRaise);

        document.getElementById("rtType").addEventListener("change", function () {
            const isProcurement = this.value === "Procurement";
            document.getElementById("rtTeamGroup").style.display = isProcurement ? "none" : "";
            document.getElementById("rtLowStockSection").style.display = isProcurement ? "" : "none";
        });

        function showRtFieldError(inputEl, msg) {
            inputEl.style.borderColor = "#EF4444";
            let err = inputEl.parentElement.querySelector(".rt-field-error");
            if (!err) {
                err = document.createElement("span");
                err.className = "rt-field-error";
                err.style.cssText = "color:#EF4444;font-size:11px;font-weight:500;display:block;margin-top:4px;";
                inputEl.parentElement.appendChild(err);
            }
            err.textContent = msg;
        }

        function clearRtFieldError(inputEl) {
            inputEl.style.borderColor = "";
            const err = inputEl.parentElement.querySelector(".rt-field-error");
            if (err) err.remove();
        }

        function validateRtText(value) {
            if (!value) return "This field is required";
            if (!/[a-zA-Z]/.test(value)) return "Must contain at least one letter";
            return null;
        }

        const rtSubjectEl = document.getElementById("rtSubject");
        const rtDescEl    = document.getElementById("rtDesc");
        rtSubjectEl.addEventListener("input", () => clearRtFieldError(rtSubjectEl));
        rtDescEl.addEventListener("input",    () => clearRtFieldError(rtDescEl));

        document.getElementById("submitRaiseBtn").addEventListener("click", () => {
            const type     = document.getElementById("rtType").value;
            const subject  = rtSubjectEl.value.trim();
            const priority = document.getElementById("rtPriority").value;
            const desc     = rtDescEl.value.trim();
            const teamSel  = document.getElementById("rtTeam");
            const teamId   = type === "Damage" ? teamSel.value : "Administrator";
            const teamName = type === "Damage" ? teamSel.options[teamSel.selectedIndex].text.split(" \u2014 ")[1] : "";

            const subjectErr = validateRtText(subject);
            const descErr    = validateRtText(desc);

            if (subjectErr) { showRtFieldError(rtSubjectEl, subjectErr); }
            if (descErr)    { showRtFieldError(rtDescEl, descErr); }
            if (subjectErr || descErr) { showToast("Please fix the highlighted errors.", "error"); return; }

            const selectedItems = [];
            if (type === "Procurement") {
                document.querySelectorAll(".ls-check:checked").forEach(cb => {
                    selectedItems.push({ name: cb.dataset.name, qty: cb.dataset.qty, min: cb.dataset.min });
                });
            }

            const freshDb = getDB();
            const nextNum = freshDb.tickets.length + 1;
            const newId   = `TKT-${String(nextNum).padStart(3, "0")}`;
            const today   = new Date();
            const months  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            const dateStr = `${String(today.getDate()).padStart(2,"0")} ${months[today.getMonth()]} ${today.getFullYear()}`;
            const timeStr = today.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

            const newTicket = type === "Damage" ? {
                id: newId, type, assignedTo: teamId, subject, priority,
                date: dateStr, status: "Open", teamName, equipmentName: subject,
                raisedBy: "Lab Incharge", time: timeStr,
                damageDescription: desc, fineAmount: "0", dueDate: "", remarks: "",
                teamResponse: "", lastUpdated: `${dateStr}, ${timeStr}`
            } : {
                id: newId, type, assignedTo: "Administrator", subject, priority,
                date: dateStr, status: "Open", assigneeRole: "System Admin",
                raisedBy: "Lab Incharge", time: timeStr,
                reason: desc, items: selectedItems, adminResponse: ""
            };

            freshDb.tickets.push(newTicket);
            setDB(freshDb);
            db = freshDb;
            updateKPIs();
            renderTable();
            closeRaise();
            showToast(`Ticket ${newId} raised successfully.`, "success");
        });
    });

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
