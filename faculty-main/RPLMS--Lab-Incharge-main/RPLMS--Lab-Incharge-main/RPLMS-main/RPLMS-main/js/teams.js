// Team Workspace - Full Logic

document.addEventListener("DOMContentLoaded", () => {

    // ── Extended dummy data per team ──────────────────────────────────────────
    const TEAM_EXTRA = {
        "TEAM-001": { project: "Solar EV Prototype 2025", bookings: [
            { eq: "3D Printer",        eqId: "EQ-001", date: "2025-07-10", slot: "09:00–11:00", purpose: "Chassis part printing" },
            { eq: "Laser Cutter",      eqId: "EQ-010", date: "2025-07-12", slot: "14:00–16:00", purpose: "Panel cutting" }
        ]},
        "TEAM-002": { project: "Autonomous Drone v3", bookings: [
            { eq: "Digital Oscilloscope", eqId: "EQ-006", date: "2025-07-09", slot: "10:00–12:00", purpose: "Signal testing" }
        ]},
        "TEAM-003": { project: "Wearable Bio Monitor", bookings: [
            { eq: "Soldering Station", eqId: "EQ-012", date: "2025-07-08", slot: "13:00–15:00", purpose: "PCB assembly" },
            { eq: "Bench Multimeter",  eqId: "EQ-013", date: "2025-07-11", slot: "09:00–10:00", purpose: "Resistance check" }
        ]},
        "TEAM-004": { project: "Haptic Feedback Glove", bookings: [] },
        "TEAM-005": { project: "Smart Farm IoT System", bookings: [
            { eq: "3D Printer",        eqId: "EQ-001", date: "2025-07-13", slot: "11:00–13:00", purpose: "Sensor housing" }
        ]},
        "TEAM-006": { project: "Eco Waste Classifier", bookings: [
            { eq: "Raspberry Pi 4",    eqId: "EQ-011", date: "2025-07-09", slot: "15:00–17:00", purpose: "ML model testing" }
        ]},
        "TEAM-007": { project: "VTOL UAV Mk-II", bookings: [
            { eq: "CNC Milling Machine", eqId: "EQ-005", date: "2025-07-14", slot: "09:00–12:00", purpose: "Frame milling" },
            { eq: "3D Scanner",          eqId: "EQ-019", date: "2025-07-15", slot: "13:00–14:00", purpose: "Part inspection" }
        ]},
        "TEAM-008": { project: "Prosthetic Hand v2", bookings: [
            { eq: "3D Printer",        eqId: "EQ-001", date: "2025-07-10", slot: "13:00–15:00", purpose: "Finger joint print" }
        ]},
        "TEAM-009": { project: "AGV Navigation System", bookings: [
            { eq: "Laser Cutter",      eqId: "EQ-010", date: "2025-07-11", slot: "10:00–12:00", purpose: "Chassis cutting" }
        ]},
        "TEAM-010": { project: "IoT Water Purifier", bookings: [
            { eq: "Soldering Station", eqId: "EQ-012", date: "2025-07-08", slot: "09:00–11:00", purpose: "Sensor wiring" }
        ]},
        "TEAM-011": { project: "6-DOF Robotic Arm", bookings: [
            { eq: "Variable DC Power Supply", eqId: "EQ-018", date: "2025-07-09", slot: "14:00–16:00", purpose: "Motor calibration" }
        ]},
        "TEAM-012": { project: "AI Traffic Controller", bookings: [
            { eq: "Raspberry Pi 4",    eqId: "EQ-011", date: "2025-07-12", slot: "10:00–12:00", purpose: "Camera feed test" }
        ]},
        "TEAM-013": { project: "Ocean Debris Collector", bookings: [
            { eq: "3D Printer",        eqId: "EQ-001", date: "2025-07-13", slot: "09:00–11:00", purpose: "Hull prototype" }
        ]},
        "TEAM-014": { project: "RFID Smart Warehouse", bookings: [
            { eq: "Bench Multimeter",  eqId: "EQ-013", date: "2025-07-10", slot: "11:00–12:00", purpose: "Circuit testing" }
        ]},
        "TEAM-015": { project: "Smart Waste Sorter", bookings: [
            { eq: "Soldering Station", eqId: "EQ-012", date: "2025-07-11", slot: "13:00–15:00", purpose: "Sensor integration" }
        ]},
        "TEAM-016": { project: "Exoskeleton Mk-I", bookings: [
            { eq: "Variable DC Power Supply", eqId: "EQ-018", date: "2025-07-10", slot: "09:00–11:00", purpose: "Actuator testing" },
            { eq: "3D Printer",               eqId: "EQ-001", date: "2025-07-14", slot: "13:00–15:00", purpose: "Joint bracket print" }
        ]},
        "TEAM-017": { project: "Nano Filter Prototype", bookings: [
            { eq: "Bench Multimeter",  eqId: "EQ-013", date: "2025-07-09", slot: "10:00–12:00", purpose: "Conductivity check" }
        ]},
        "TEAM-018": { project: "Smart Crop AI v2", bookings: [
            { eq: "Raspberry Pi 4",    eqId: "EQ-011", date: "2025-07-11", slot: "14:00–16:00", purpose: "Model inference test" },
            { eq: "3D Printer",        eqId: "EQ-001", date: "2025-07-15", slot: "09:00–11:00", purpose: "Enclosure print" }
        ]},
        "TEAM-019": { project: "Swarm Bot Fleet", bookings: [
            { eq: "Soldering Station", eqId: "EQ-012", date: "2025-07-10", slot: "11:00–13:00", purpose: "PCB soldering" },
            { eq: "Laser Cutter",      eqId: "EQ-010", date: "2025-07-13", slot: "14:00–16:00", purpose: "Chassis cutting" }
        ]},
        "TEAM-020": { project: "EV Fast Charger", bookings: [
            { eq: "Variable DC Power Supply", eqId: "EQ-018", date: "2025-07-12", slot: "09:00–11:00", purpose: "Charging curve test" }
        ]},
        "TEAM-021": { project: "Deep Sea ROV v1", bookings: [
            { eq: "Digital Oscilloscope", eqId: "EQ-006", date: "2025-07-09", slot: "13:00–15:00", purpose: "Motor driver signal check" },
            { eq: "3D Printer",           eqId: "EQ-001", date: "2025-07-14", slot: "10:00–12:00", purpose: "Thruster housing print" }
        ]}
    };

    // Extended material returns with bookDate + slot
    const EQ_EXTENDED = {
        "RET-001": { bookDate: "2025-06-25", slot: "09:00–11:00", eqId: "EQ-006" },
        "RET-002": { bookDate: "2025-06-18", slot: "14:00–16:00", eqId: "EQ-013" },
        "RET-003": { bookDate: "2025-06-14", slot: "10:00–12:00", eqId: "EQ-012" },
        "RET-004": { bookDate: "2025-06-22", slot: "13:00–15:00", eqId: "EQ-018" },
        "RET-005": { bookDate: "2025-06-28", slot: "09:00–11:00", eqId: "EQ-012" },
        "RET-006": { bookDate: "2025-06-27", slot: "11:00–13:00", eqId: "EQ-013" },
        "RET-007": { bookDate: "2025-07-07", slot: "14:00–16:00", eqId: "EQ-010" },
        "RET-008": { bookDate: "2025-06-20", slot: "09:00–11:00", eqId: "EQ-001" },
        "RET-009": { bookDate: "2025-07-05", slot: "10:00–12:00", eqId: "EQ-006" },
        "RET-010": { bookDate: "2025-06-18", slot: "13:00–15:00", eqId: "EQ-016" },
        "RET-011": { bookDate: "2025-07-04", slot: "09:00–11:00", eqId: "EQ-012" },
        "RET-012": { bookDate: "2025-06-26", slot: "14:00–16:00", eqId: "EQ-018" },
        "RET-013": { bookDate: "2025-06-15", slot: "10:00–12:00", eqId: "EQ-013" },
        "RET-014": { bookDate: "2025-06-28", slot: "11:00–13:00", eqId: "EQ-006" },
        "RET-015": { bookDate: "2025-07-10", slot: "09:00–11:00", eqId: "EQ-001" },
        "RET-016": { bookDate: "2025-07-03", slot: "14:00–16:00", eqId: "EQ-010" },
        "RET-017": { bookDate: "2025-06-20", slot: "10:00–12:00", eqId: "EQ-012" },
        "RET-018": { bookDate: "2025-07-12", slot: "09:00–12:00", eqId: "EQ-005" },
        "RET-019": { bookDate: "2025-06-29", slot: "13:00–14:00", eqId: "EQ-019" },
        "RET-020": { bookDate: "2025-06-17", slot: "14:00–16:00", eqId: "EQ-016" },
        "RET-021": { bookDate: "2025-07-04", slot: "13:00–15:00", eqId: "EQ-001" },
        "RET-022": { bookDate: "2025-06-25", slot: "09:00–11:00", eqId: "EQ-012" },
        "RET-023": { bookDate: "2025-07-06", slot: "10:00–12:00", eqId: "EQ-010" },
        "RET-024": { bookDate: "2025-06-21", slot: "13:00–15:00", eqId: "EQ-018" },
        "RET-025": { bookDate: "2025-07-05", slot: "09:00–11:00", eqId: "EQ-013" },
        "RET-026": { bookDate: "2025-06-26", slot: "14:00–16:00", eqId: "EQ-012" },
        "RET-027": { bookDate: "2025-06-23", slot: "10:00–12:00", eqId: "EQ-006" },
        "RET-028": { bookDate: "2025-07-08", slot: "09:00–11:00", eqId: "EQ-001" },
        "RET-029": { bookDate: "2025-06-27", slot: "11:00–13:00", eqId: "EQ-013" },
        "RET-030": { bookDate: "2025-06-24", slot: "14:00–16:00", eqId: "EQ-010" },
        "RET-031": { bookDate: "2025-07-07", slot: "10:00–12:00", eqId: "EQ-018" },
        "RET-032": { bookDate: "2025-06-28", slot: "13:00–15:00", eqId: "EQ-006" },
        "RET-033": { bookDate: "2025-07-09", slot: "09:00–11:00", eqId: "EQ-012" },
        "RET-034": { bookDate: "2025-06-19", slot: "14:00–16:00", eqId: "EQ-016" },
        "RET-035": { bookDate: "2025-07-10", slot: "09:00–11:00", eqId: "EQ-018" },
        "RET-036": { bookDate: "2025-06-22", slot: "13:00–15:00", eqId: "EQ-012" },
        "RET-037": { bookDate: "2025-07-08", slot: "10:00–12:00", eqId: "EQ-013" },
        "RET-038": { bookDate: "2025-06-27", slot: "14:00–16:00", eqId: "EQ-006" },
        "RET-039": { bookDate: "2025-07-11", slot: "09:00–11:00", eqId: "EQ-001" },
        "RET-040": { bookDate: "2025-06-21", slot: "14:00–16:00", eqId: "EQ-010" },
        "RET-041": { bookDate: "2025-07-09", slot: "11:00–13:00", eqId: "EQ-012" },
        "RET-042": { bookDate: "2025-06-20", slot: "09:00–11:00", eqId: "EQ-016" },
        "RET-043": { bookDate: "2025-07-07", slot: "09:00–11:00", eqId: "EQ-018" },
        "RET-044": { bookDate: "2025-06-28", slot: "13:00–15:00", eqId: "EQ-013" },
        "RET-045": { bookDate: "2025-07-10", slot: "13:00–15:00", eqId: "EQ-006" },
        "RET-046": { bookDate: "2025-06-23", slot: "10:00–12:00", eqId: "EQ-012" }
    };

    // ── State ─────────────────────────────────────────────────────────────────
    let currentTeamId = null;
    let lastSearchId  = null;

    let eqData = [], eqFiltered = [], eqPage = 1, eqSort = { field: "returnDate", dir: "asc" };
    let reqData = [], reqFiltered = [], reqPage = 1;
    const PER_PAGE = 5;

    // ── DOM refs ──────────────────────────────────────────────────────────────
    const searchInput  = document.getElementById("teamSearchInput");
    const searchBtn    = document.getElementById("searchBtn");
    const resetBtn     = document.getElementById("resetBtn");
    const searchError  = document.getElementById("searchError");
    const emptyState   = document.getElementById("emptyState");
    const workspace    = document.getElementById("workspaceContent");

    // ── Quick Access Table ─────────────────────────────────────────────────
    let quickPage = 1;
    const QUICK_PER_PAGE = 5;

    function renderQuickTable() {
        const db = getDB();
        const active = db.teams.filter(t => t.status === "Active");
        document.getElementById("activeTeamCount").textContent = active.length + " Active";

        const total = active.length;
        const pages = Math.ceil(total / QUICK_PER_PAGE) || 1;
        if (quickPage > pages) quickPage = pages;
        const start = (quickPage - 1) * QUICK_PER_PAGE;
        const slice = active.slice(start, start + QUICK_PER_PAGE);

        const tbody = document.getElementById("quickTeamsBody");
        tbody.innerHTML = slice.map(t => {
            const overdue = db.materialReturns.filter(r => r.teamId === t.id && r.status === "Overdue").length;
            const overdueTag = overdue > 0
                ? `<span style="margin-left:8px;font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;background:#FEE2E2;color:#DC2626;">${overdue} Overdue</span>`
                : "";
            return `<tr>
                <td style="font-weight:700;color:var(--primary-color);">${t.id}</td>
                <td style="font-weight:600;">${t.name}${overdueTag}</td>
                <td style="font-weight:600;">${String(t.activeProjects).padStart(2,"0")}</td>
                <td><span class="badge status-resolved">Active</span></td>
                <td><button class="btn-view" onclick="quickLoad('${t.id}')">View</button></td>
            </tr>`;
        }).join("");

        document.getElementById("quickTableInfo").textContent =
            `Showing ${start + 1}–${Math.min(start + QUICK_PER_PAGE, total)} of ${total} teams`;
        renderPagination("quickPagination", quickPage, pages, p => { quickPage = p; renderQuickTable(); });
    }

    window.quickLoad = function(teamId) {
        searchInput.value = teamId;
        clearError();
        lastSearchId = null; // allow reload
        const db   = getDB();
        const team = db.teams.find(t => t.id === teamId);
        if (!team) return;
        lastSearchId  = teamId;
        currentTeamId = teamId;
        loadWorkspace(team, db);
        showToast(`Workspace loaded for ${team.name}`, "success");
        workspace.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    function validateInput(val) {
        val = val.trim();
        if (!val) return "Team ID is required.";
        if (!/^[A-Za-z0-9\-]+$/.test(val)) return "Only alphanumeric characters and hyphens allowed.";
        if (val.length > 20) return "Team ID too long (max 20 characters).";
        return null;
    }

    function showError(msg) {
        searchInput.classList.add("is-invalid");
        searchError.textContent = msg;
        searchError.style.display = "block";
    }

    function clearError() {
        searchInput.classList.remove("is-invalid");
        searchError.style.display = "none";
    }

    // ── Search ────────────────────────────────────────────────────────────────
    function doSearch() {
        const raw = searchInput.value.trim().toUpperCase();
        const err = validateInput(raw);
        if (err) { showError(err); return; }
        clearError();

        if (raw === lastSearchId) {
            showToast("Already viewing this team workspace.", "info");
            return;
        }

        // Spinner
        searchBtn.disabled = true;
        searchBtn.innerHTML = "Searching...";

        setTimeout(() => {
            searchBtn.disabled = false;
            searchBtn.innerHTML = "Search";

            const db   = getDB();
            const team = db.teams.find(t =>
                t.id.toUpperCase() === raw ||
                t.id.toUpperCase().includes(raw) ||
                t.name.toUpperCase().includes(raw)
            );

            if (!team) {
                showError(`Team "${raw}" not found. Please check the ID.`);
                showToast(`Team "${raw}" not found.`, "error");
                return;
            }

            lastSearchId   = raw;
            currentTeamId  = raw;
            loadWorkspace(team, db);
            showToast(`Workspace loaded for ${team.name}`, "success");
        }, 400);
    }

    searchBtn.addEventListener("click", doSearch);
    searchInput.addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });
    searchInput.addEventListener("input", debounce(() => {
        if (searchInput.classList.contains("is-invalid")) clearError();
    }, 200));

    resetBtn.addEventListener("click", () => {
        searchInput.value = "";
        clearError();
        lastSearchId  = null;
        currentTeamId = null;
        workspace.style.display = "none";
        emptyState.style.display = "";
    });

    // ── Load full workspace ───────────────────────────────────────────────────
    function loadWorkspace(team, db) {
        emptyState.style.display = "none";
        workspace.style.display  = "flex";

        const extra = TEAM_EXTRA[team.id] || { project: team.name + " Project", bookings: [] };

        // Team info
        document.getElementById("wsTeamName").textContent = team.name;
        document.getElementById("wsTeamId").textContent   = team.id;
        document.getElementById("wsProject").textContent  = extra.project;

        const badge = document.getElementById("wsStatusBadge");
        badge.textContent  = team.status;
        badge.className    = "badge " + (team.status === "Active" ? "status-resolved" : "status-pending");

        // KPIs
        const returns  = db.materialReturns.filter(r => r.teamId === team.id);
        const requests = db.materialRequests.filter(r => r.teamId === team.id);
        const today    = new Date(); today.setHours(0,0,0,0);
        const in7      = new Date(today); in7.setDate(in7.getDate() + 7);

        const borrowed = returns.filter(r => r.status === "Assigned").length;
        const pending  = requests.filter(r => r.status === "Pending").length;
        const overdue  = returns.filter(r => r.status === "Overdue").length;
        const dueSoon  = returns.filter(r => {
            if (r.status !== "Assigned") return false;
            const d = new Date(r.date); d.setHours(0,0,0,0);
            return d >= today && d <= in7;
        }).length;

        document.getElementById("kpiBorrowed").textContent = String(borrowed).padStart(2,"0");
        document.getElementById("kpiPending").textContent  = String(pending).padStart(2,"0");
        document.getElementById("kpiDueSoon").textContent  = String(dueSoon).padStart(2,"0");
        document.getElementById("kpiOverdue").textContent  = String(overdue).padStart(2,"0");

        // Tables
        eqData  = returns.map(r => ({ ...r, ...(EQ_EXTENDED[r.id] || { bookDate: "2025-06-01", slot: "09:00–11:00", eqId: "EQ-001" }) }));
        reqData = requests;

        eqPage  = 1; reqPage = 1;
        document.getElementById("eqStatusFilter").value  = "All";
        document.getElementById("eqSearch").value        = "";
        document.getElementById("reqStatusFilter").value = "All";

        applyEqFilters();
        applyReqFilters();
        renderTimeline(team.id, db, extra.project);
    }

    // ── Borrowed Equipment Table ──────────────────────────────────────────────
    function applyEqFilters() {
        const status = document.getElementById("eqStatusFilter").value;
        const q      = document.getElementById("eqSearch").value.toLowerCase().trim();

        eqFiltered = eqData.filter(r => {
            const matchStatus = status === "All" || r.status === status;
            const matchQ      = !q || r.item.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
            return matchStatus && matchQ;
        });

        eqFiltered.sort((a, b) => {
            const vA = a[eqSort.field === "bookDate" ? "bookDate" : "date"] || "";
            const vB = b[eqSort.field === "bookDate" ? "bookDate" : "date"] || "";
            return eqSort.dir === "asc" ? vA.localeCompare(vB) : vB.localeCompare(vA);
        });

        eqPage = 1;
        renderEqTable();
    }

    function renderEqTable() {
        const tbody = document.getElementById("eqTableBody");
        const total = eqFiltered.length;
        const pages = Math.ceil(total / PER_PAGE) || 1;
        if (eqPage > pages) eqPage = pages;
        const start = (eqPage - 1) * PER_PAGE;
        const slice = eqFiltered.slice(start, start + PER_PAGE);

        if (!slice.length) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-secondary);">No records found</td></tr>`;
            document.getElementById("eqInfo").textContent = "Showing 0 entries";
            renderPagination("eqPagination", eqPage, pages, p => { eqPage = p; renderEqTable(); });
            return;
        }

        const statusMap = {
            "Assigned": { cls: "status-in-progress", label: "With Team" },
            "Overdue":  { cls: "status-open",        label: "Overdue"   },
            "Returned": { cls: "status-resolved",    label: "Returned"  }
        };

        tbody.innerHTML = slice.map(r => {
            const s   = statusMap[r.status] || { cls: "status-pending", label: r.status };
            const row = r.status === "Overdue" ? "style=\"background:#FFF5F5;\"" : "";
            return `<tr ${row}>
                <td style="font-weight:700;color:var(--primary-color);">${r.eqId}</td>
                <td style="font-weight:600;">${r.item}</td>
                <td>${r.bookDate}</td>
                <td>${r.date}${r.status === "Overdue" ? ' <span style="font-size:10px;color:#DC2626;font-weight:700;">⚠</span>' : ""}</td>
                <td style="font-size:12px;color:var(--text-secondary);">${r.slot}</td>
                <td><span class="badge ${s.cls}">${s.label}</span></td>
            </tr>`;
        }).join("");

        document.getElementById("eqInfo").textContent = `Showing ${start + 1}–${Math.min(start + PER_PAGE, total)} of ${total} entries`;
        renderPagination("eqPagination", eqPage, pages, p => { eqPage = p; renderEqTable(); });
    }

    document.getElementById("eqStatusFilter").addEventListener("change", applyEqFilters);
    document.getElementById("eqSearch").addEventListener("input", debounce(applyEqFilters, 300));

    document.querySelectorAll("[data-eq-sort]").forEach(th => {
        th.addEventListener("click", () => {
            const f = th.dataset.eqSort;
            eqSort.dir = eqSort.field === f ? (eqSort.dir === "asc" ? "desc" : "asc") : "asc";
            eqSort.field = f;
            renderEqTable();
        });
    });

    // ── Material Requests Table ───────────────────────────────────────────────
    function applyReqFilters() {
        const status = document.getElementById("reqStatusFilter").value;
        reqFiltered = reqData.filter(r => status === "All" || r.status === status);
        reqPage = 1;
        renderReqTable();
    }

    function renderReqTable() {
        const tbody = document.getElementById("reqTableBody");
        const total = reqFiltered.length;
        const pages = Math.ceil(total / PER_PAGE) || 1;
        if (reqPage > pages) reqPage = pages;
        const start = (reqPage - 1) * PER_PAGE;
        const slice = reqFiltered.slice(start, start + PER_PAGE);

        if (!slice.length) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text-secondary);">No requests found</td></tr>`;
            document.getElementById("reqInfo").textContent = "Showing 0 entries";
            renderPagination("reqPagination", reqPage, pages, p => { reqPage = p; renderReqTable(); });
            return;
        }

        const statusMap = {
            "Pending":  "status-pending",
            "Approved": "status-resolved",
            "Rejected": "status-open",
            "Issued":   "status-in-progress",
            "Returned": "status-resolved"
        };

        tbody.innerHTML = slice.map(r => `
            <tr>
                <td style="font-weight:700;color:var(--primary-color);">${r.id}</td>
                <td style="font-weight:600;">${r.item}</td>
                <td style="font-weight:600;">${r.qty}</td>
                <td>${r.date}</td>
                <td><span class="badge ${statusMap[r.status] || "status-pending"}">${r.status}</span></td>
            </tr>`).join("");

        document.getElementById("reqInfo").textContent = `Showing ${start + 1}–${Math.min(start + PER_PAGE, total)} of ${total} entries`;
        renderPagination("reqPagination", reqPage, pages, p => { reqPage = p; renderReqTable(); });
    }

    document.getElementById("reqStatusFilter").addEventListener("change", applyReqFilters);

    // ── Activity Timeline ─────────────────────────────────────────────────────
    function renderTimeline(teamId, db, project) {
        const container = document.getElementById("timelineContainer");
        const events = [];

        db.materialReturns.filter(r => r.teamId === teamId).forEach(r => {
            const icons = { "Returned": { icon: "&#10003;", color: "#16A34A", bg: "#DCFCE7" }, "Overdue": { icon: "&#9888;", color: "#DC2626", bg: "#FEE2E2" }, "Assigned": { icon: "&#128230;", color: "#2563EB", bg: "#DBEAFE" } };
            const s = icons[r.status] || { icon: "&#8635;", color: "#64748B", bg: "#F1F5F9" };
            const labels = { "Returned": "Equipment Returned", "Overdue": "Return Overdue", "Assigned": "Equipment Borrowed" };
            events.push({ date: r.date, icon: s.icon, color: s.color, bg: s.bg, title: labels[r.status] || r.status, desc: r.item });
        });

        db.materialRequests.filter(r => r.teamId === teamId).forEach(r => {
            const icons = { "Approved": { icon: "&#10003;", color: "#16A34A", bg: "#DCFCE7" }, "Pending": { icon: "&#9998;", color: "#D97706", bg: "#FEF3C7" }, "Rejected": { icon: "&#10005;", color: "#EF4444", bg: "#FEE2E2" } };
            const s = icons[r.status] || { icon: "&#9998;", color: "#64748B", bg: "#F1F5F9" };
            events.push({ date: r.date, icon: s.icon, color: s.color, bg: s.bg, title: "Component Requested", desc: `${r.item} × ${r.qty} — ${r.status}` });
        });

        db.tickets.filter(t => t.assignedTo === teamId).forEach(t => {
            events.push({ date: t.date.replace(/ /g, "-"), icon: "&#9993;", color: "#7C3AED", bg: "#EDE9FE", title: "Ticket Raised", desc: t.subject });
        });

        // Sort newest first
        events.sort((a, b) => b.date.localeCompare(a.date));

        if (!events.length) {
            container.innerHTML = `<div style="text-align:center;padding:32px;color:var(--text-secondary);font-size:13px;">No activity recorded yet.</div>`;
            return;
        }

        container.innerHTML = events.map((e, i) => `
            <div style="display:flex;gap:12px;padding-bottom:${i < events.length - 1 ? "16px" : "0"};">
                <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;">
                    <div style="width:32px;height:32px;border-radius:50%;background:${e.bg};color:${e.color};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;">${e.icon}</div>
                    ${i < events.length - 1 ? `<div style="width:2px;flex:1;background:var(--border-color);margin-top:4px;"></div>` : ""}
                </div>
                <div style="padding-top:4px;padding-bottom:${i < events.length - 1 ? "0" : "0"};">
                    <div style="font-size:12px;font-weight:700;color:var(--text-primary);">${e.title}</div>
                    <div style="font-size:11px;color:var(--text-secondary);margin-top:1px;">${e.desc}</div>
                    <div style="font-size:10px;color:var(--text-secondary);margin-top:3px;">&#128197; ${e.date}</div>
                </div>
            </div>`).join("");
    }

    // ── Pagination helper ─────────────────────────────────────────────────────
    function renderPagination(containerId, current, total, onPage) {
        const ul = document.getElementById(containerId);
        ul.innerHTML = "";

        const prev = document.createElement("li");
        prev.className = `page-item ${current === 1 ? "disabled" : ""}`;
        prev.innerHTML = `<button class="page-link" ${current === 1 ? "disabled" : ""}>&lt;</button>`;
        if (current > 1) prev.querySelector("button").addEventListener("click", () => onPage(current - 1));
        ul.appendChild(prev);

        for (let i = 1; i <= total; i++) {
            const li = document.createElement("li");
            li.className = `page-item ${i === current ? "active" : ""}`;
            li.innerHTML = `<button class="page-link">${i}</button>`;
            li.querySelector("button").addEventListener("click", () => onPage(i));
            ul.appendChild(li);
        }

        const next = document.createElement("li");
        next.className = `page-item ${current === total ? "disabled" : ""}`;
        next.innerHTML = `<button class="page-link" ${current === total ? "disabled" : ""}>&gt;</button>`;
        if (current < total) next.querySelector("button").addEventListener("click", () => onPage(current + 1));
        ul.appendChild(next);
    }

    renderQuickTable();

    // ── Quick Actions ─────────────────────────────────────────────────────────
    document.getElementById("btnRaiseTicket").addEventListener("click", () => {
        if (!currentTeamId) return;
        createConfirmationModal(
            "Raise Ticket",
            `Raise a new damage/issue ticket for team <strong>${currentTeamId}</strong>? You will be redirected to the Tickets page.`,
            () => { window.location.href = "tickets.html"; },
            "Go to Tickets",
            false
        );
    });

    document.getElementById("btnPrint").addEventListener("click", () => {
        if (!currentTeamId) return;
        createConfirmationModal(
            "Print Team Summary",
            `Print the full workspace summary for team <strong>${currentTeamId}</strong>?`,
            () => { window.print(); },
            "Print",
            false
        );
    });

});
