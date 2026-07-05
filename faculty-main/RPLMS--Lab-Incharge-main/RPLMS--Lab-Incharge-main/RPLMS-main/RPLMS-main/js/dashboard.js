document.addEventListener("DOMContentLoaded", () => {
    const db = getDB();

    // ── Banner ────────────────────────────────────────────────────────────
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    document.getElementById("bannerGreeting").textContent = greeting;
    document.getElementById("bannerName").textContent = db.currentUser.name;

    const activeTeams  = db.teams.filter(t => t.status === "Active").length;
    const pendingReqs  = db.materialRequests.filter(r => r.status === "Pending").length;
    const overdueRets  = db.materialReturns.filter(r => r.status === "Overdue").length;
    const openTickets  = db.tickets.filter(t => t.status !== "Resolved").length;

    document.getElementById("pillTeams").textContent   = activeTeams;
    document.getElementById("pillPending").textContent = pendingReqs;
    document.getElementById("pillOverdue").textContent = overdueRets;
    document.getElementById("pillTickets").textContent = openTickets;

    // ── KPI Cards (all unique, none repeated from banner) ─────────────────
    const totalInventory  = db.inventory.length;
    const unavailable     = db.inventory.filter(i => i.status === "Maintenance" || i.status === "Repairing").length;
    const available       = db.inventory.filter(i => i.status === "Available").length;
    const reqsThisMonth   = db.materialRequests.length;
    const approvedReqs    = db.materialRequests.filter(r => r.status === "Approved").length;
    const resolvedTickets = db.tickets.filter(t => t.status === "Resolved").length;
    const totalTickets    = db.tickets.length;

    document.getElementById("kpiInventory").textContent   = String(totalInventory).padStart(2, "0");
    document.getElementById("kpiUnavailable").textContent = String(unavailable).padStart(2, "0");
    document.getElementById("kpiReqMonth").textContent    = String(reqsThisMonth).padStart(2, "0");
    document.getElementById("kpiResolved").textContent    = String(resolvedTickets).padStart(2, "0");

    document.getElementById("kpiBadge1").textContent = `${available} Available`;
    document.getElementById("kpiBadge2").textContent = `${unavailable} Items`;
    document.getElementById("kpiBadge3").textContent = `${approvedReqs} Approved`;
    document.getElementById("kpiBadge4").textContent = `${totalTickets} Total`;

    // ── Overdue Returns Table ─────────────────────────────────────────────
    const today = new Date();
    const overdueList = db.materialReturns.filter(r => r.status === "Overdue").slice(0, 6);
    const overdueBody = document.getElementById("overdueTable");
    overdueBody.innerHTML = overdueList.length ? overdueList.map(r => {
        const due = new Date(r.date);
        const daysLate = Math.max(0, Math.floor((today - due) / 86400000));
        return `<tr>
            <td style="font-weight:600;color:var(--primary-color);">${r.id}</td>
            <td><a href="teams.html" class="team-link">${r.teamName}</a></td>
            <td>${r.item}</td>
            <td style="color:var(--text-secondary);font-size:12px;">${r.date}</td>
            <td><span class="days-overdue">${daysLate}d late</span></td>
        </tr>`;
    }).join("") :
    `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text-secondary);">No overdue returns</td></tr>`;

    // ── Inventory Attention Table ─────────────────────────────────────────
    const attentionItems = db.inventory.filter(i => i.status === "Maintenance" || i.status === "Repairing");
    const attentionBody  = document.getElementById("attentionTable");
    const statusCls = { Maintenance: "priority-medium", Repairing: "priority-high" };
    const dotCls    = { Maintenance: "dot-maintenance", Repairing: "dot-repairing" };
    attentionBody.innerHTML = attentionItems.length ? attentionItems.map(i => `
        <tr>
            <td style="font-weight:600;color:var(--primary-color);">${i.id}</td>
            <td style="font-weight:600;">${i.name}</td>
            <td style="color:var(--text-secondary);font-size:12px;">${i.location}</td>
            <td><span class="badge ${statusCls[i.status] || ''}">
                <span class="inv-status-dot ${dotCls[i.status] || ''}"></span>${i.status}
            </span></td>
        </tr>`).join("") :
    `<tr><td colspan="4" style="text-align:center;padding:32px;color:var(--text-secondary);">All items available</td></tr>`;
});
