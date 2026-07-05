
// Update faculty name in UI
document.addEventListener("DOMContentLoaded", () => {
    const headerNameNode = document.querySelector(".header-right h4");
    if (headerNameNode && session) {
        headerNameNode.textContent = session.name;
    }
});

const role = document.body.dataset.role;

const stages = [
    "Problem Statement",
    "Ideation & Concept Development",
    "Design Phase",
    "Product Development",
    "Testing & Validation",
    "Iteration & Improvement",
    "Advanced Prototype & MVP",
    "Evaluation & Demonstration",
    "Documentation",
    "Deployment"
];

const defaultTeams = [
    {
        id: "PRJ-2025-01",
        name: "Team Alpha",
        project: "AI-Powered Inventory Management System",
        leader: "Arun Kumar",
        leaderId: "22BCS001",
        faculty: "Dr. Faculty Name",
        department: "AI & DS",
        created: "May 15, 2025",
        started: "May 16, 2025",
        deadline: "July 15, 2025",
        description: "The system will automate inventory tracking, stock alerts, and reporting using AI/ML models.",
        members: [
            ["Team Leader", "Arun Kumar", "22BCS001", "AI & DS", "arun@example.com"],
            ["Member", "Priya Sharma", "22BCS002", "AI & DS", "priya@example.com"],
            ["Member", "Rohan Mehta", "22BCS003", "AI & DS", "rohan@example.com"],
            ["Member", "Sneha P", "22BCS004", "AI & DS", "sneha@example.com"],
            ["Member", "Vikram S", "22BCS005", "AI & DS", "vikram@example.com"]
        ]
    },
    {
        id: "PRJ-2025-02",
        name: "Team Beta",
        project: "Smart Attendance Monitoring System",
        leader: "Kavin Raj",
        leaderId: "22BCS011",
        faculty: "Dr. Faculty Name",
        department: "CSE",
        created: "May 18, 2025",
        started: "May 19, 2025",
        deadline: "July 20, 2025",
        description: "A web-based system for automated attendance tracking and report generation.",
        members: [
            ["Team Leader", "Kavin Raj", "22BCS011", "CSE", "kavin@example.com"],
            ["Member", "Nila S", "22BCS012", "CSE", "nila@example.com"],
            ["Member", "Arjun V", "22BCS013", "CSE", "arjun@example.com"],
            ["Member", "Divya R", "22BCS014", "CSE", "divya@example.com"],
            ["Member", "Hari P", "22BCS015", "CSE", "hari@example.com"]
        ]
    },
    {
        id: "PRJ-2025-03",
        name: "Team Gamma",
        project: "IoT Based Energy Monitoring System",
        leader: "Ramesh M",
        leaderId: "22BCS021",
        faculty: "Dr. Faculty Name",
        department: "ECE",
        created: "May 20, 2025",
        started: "May 21, 2025",
        deadline: "July 25, 2025",
        description: "This project monitors energy usage using IoT sensors and provides real-time analytics.",
        members: [
            ["Team Leader", "Ramesh M", "22BCS021", "ECE", "ramesh@example.com"],
            ["Member", "Anitha K", "22BCS022", "ECE", "anitha@example.com"],
            ["Member", "Bala C", "22BCS023", "ECE", "bala@example.com"],
            ["Member", "Deepak N", "22BCS024", "ECE", "deepak@example.com"],
            ["Member", "Meera G", "22BCS025", "ECE", "meera@example.com"]
        ]
    },
    {
        id: "PRJ-2025-04",
        name: "Team Delta",
        project: "Online Complaint Management Portal",
        leader: "Sanjay T",
        leaderId: "22BCS031",
        faculty: "Dr. Faculty Name",
        department: "IT",
        created: "May 22, 2025",
        started: "May 23, 2025",
        deadline: "July 30, 2025",
        description: "A portal for students and staff to register complaints and track resolution progress.",
        members: [
            ["Team Leader", "Sanjay T", "22BCS031", "IT", "sanjay@example.com"],
            ["Member", "Lavanya P", "22BCS032", "IT", "lavanya@example.com"],
            ["Member", "Naveen R", "22BCS033", "IT", "naveen@example.com"],
            ["Member", "Ritika J", "22BCS034", "IT", "ritika@example.com"],
            ["Member", "Suresh L", "22BCS035", "IT", "suresh@example.com"]
        ]
    },
    {
        id: "PRJ-2025-05",
        name: "Team Epsilon",
        project: "Smart Library Book Tracking System",
        leader: "Manoj K",
        leaderId: "22BCS041",
        faculty: "Dr. Faculty Name",
        department: "CSE",
        created: "May 25, 2025",
        started: "May 26, 2025",
        deadline: "August 02, 2025",
        description: "A digital library tracking system that manages book issue, return, availability, and reports.",
        members: [
            ["Team Leader", "Manoj K", "22BCS041", "CSE", "manoj@example.com"],
            ["Member", "Ishwarya S", "22BCS042", "CSE", "ishwarya@example.com"],
            ["Member", "Gokul V", "22BCS043", "CSE", "gokul@example.com"],
            ["Member", "Janani R", "22BCS044", "CSE", "janani@example.com"],
            ["Member", "Varun B", "22BCS045", "CSE", "varun@example.com"]
        ]
    }
];

let appData = JSON.parse(localStorage.getItem("facultyReviewSeparateData"));

if (appData && appData.teams && appData.teams.length > 0 && !appData.teams[0].hasOwnProperty("approvalStatus")) {
    appData = null;
    localStorage.removeItem("facultyReviewSeparateData");
}

if (!appData) {
    appData = {
        teams: defaultTeams.map((team) => {
            let appStatus = "Pending";
            if (team.id === "PRJ-2025-01" || team.id === "PRJ-2025-02") {
                appStatus = "Approved";
            }
            return {
                ...team,
                approvalStatus: appStatus,
                studentUnlockedStage: 1,
                stages: stages.map((stageName, index) => {
                    let status = "Locked";

                    if (index === 0) {
                        status = "Submitted";
                    }

                    return {
                        stageNo: index + 1,
                        name: stageName,
                        documentName: index === 0 ? `${stageName.replaceAll(" ", "-")}-${team.name}.pdf` : "-",
                        fileType: index === 0 ? "PDF" : "-",
                        uploadedOn: index === 0 ? "01 Jun 2025" : "-",
                        uploadedBy: index === 0 ? team.leader : "-",
                        version: 1,
                        status: status,
                        reviewer: "-",
                        reviewedOn: "-",
                        comment: "",
                        history: index === 0
                            ? [
                                {
                                    version: 1,
                                    submittedDate: "01 Jun 2025",
                                    reviewedDate: "-",
                                    reviewer: "-",
                                    status: "Submitted"
                                }
                            ]
                            : []
                    };
                })
            };
        })
    };

    saveData();
}

function initNewMockDB() {
    // 1. Component Requests Mock Data
    if (!localStorage.getItem("facultyComponentRequests")) {
        const initialCompRequests = [
            { id: "CRQ-2025-001", team: "Team Alpha", component: "Raspberry Pi 4 Model B", quantity: 2, purpose: "For IoT gateway development", status: "Pending", requestedOn: "15 May 2025", deadline: "15 Jul 2025 (60 days left)" },
            { id: "CRQ-2025-002", team: "Team Beta", component: "Arduino Mega 2560", quantity: 3, purpose: "For hardware interfacing", status: "Approved", requestedOn: "10 May 2025", deadline: "10 Jun 2025 (Completed)" },
            { id: "CRQ-2025-003", team: "Team Gamma", component: "ESP32 Dev Kit", quantity: 5, purpose: "For wireless communication", status: "Pending", requestedOn: "18 May 2025", deadline: "20 Jul 2025 (65 days left)" },
            { id: "CRQ-2025-004", team: "Team Delta", component: "Camera Module (Pi Cam)", quantity: 1, purpose: "For image processing", status: "Rejected", requestedOn: "12 May 2025", deadline: "25 Jul 2025 (70 days left)" },
            { id: "CRQ-2025-005", team: "Team Alpha", component: "Jumper Wires Set", quantity: 2, purpose: "For prototyping", status: "Approved", requestedOn: "16 May 2025", deadline: "15 Jul 2025 (60 days left)" },
            { id: "CRQ-2025-006", team: "Team Beta", component: "LCD Display 16x2", quantity: 2, purpose: "For user interface", status: "Fulfilled", requestedOn: "08 May 2025", deadline: "08 Jun 2025 (Completed)" },
            { id: "CRQ-2025-007", team: "Team Omega", component: "Nvidia Jetson Nano", quantity: 1, purpose: "AI processing at the edge", status: "Pending", requestedOn: "20 May 2025", deadline: "30 Aug 2025 (90 days left)" }
        ];
        localStorage.setItem("facultyComponentRequests", JSON.stringify(initialCompRequests));
    }

    // 2. Tickets Mock Data
    if (!localStorage.getItem("facultyTickets")) {
        const initialTickets = [
            { id: "TCK-001", team: "Team Alpha", student: "Arun Kumar", question: "How do we configure the MQTT broker for our IoT gateway?", status: "Pending", reply: "", date: "12 Jun 2025" },
            { id: "TCK-002", team: "Team Beta", student: "Priya Sharma", question: "Is there any template for Stage 2 Ideation report?", status: "Answered", reply: "Yes, please download it from the Knowledge Base document section.", date: "10 Jun 2025" }
        ];
        localStorage.setItem("facultyTickets", JSON.stringify(initialTickets));
    }

    // 3. Knowledge Base Documents Mock Data
    if (!localStorage.getItem("facultyKBDocuments")) {
        const initialKBDocs = [
            { title: "AI Inventory System - Final Report.pdf", category: "Reports", type: "Final Report", team: "Team Alpha", uploadedBy: "Dr. Faculty Name", uploadedOn: "06 Jun 2025", size: "2.48 MB" },
            { title: "System Architecture - Final.docx", category: "Technical", type: "Architecture Document", team: "Team Beta", uploadedBy: "Dr. Faculty Name", uploadedOn: "05 Jun 2025", size: "1.32 MB" },
            { title: "Presentation - Final.pptx", category: "Presentations", type: "Presentation", team: "Team Gamma", uploadedBy: "Dr. Faculty Name", uploadedOn: "04 Jun 2025", size: "5.18 MB" },
            { title: "User Manual - Final.pdf", category: "Design", type: "User Manual", team: "Team Delta", uploadedBy: "Dr. Faculty Name", uploadedOn: "03 Jun 2025", size: "3.09 MB" },
            { title: "Dataset - Inventory Data.xlsx", category: "Technical", type: "Dataset", team: "Team Beta", uploadedBy: "Dr. Faculty Name", uploadedOn: "02 Jun 2025", size: "1.25 MB" }
        ];
        localStorage.setItem("facultyKBDocuments", JSON.stringify(initialKBDocs));
    }
}

initNewMockDB();

/* =====================
   ELEMENTS
===================== */

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelectorAll(".sidebar-menu a");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("pageTitle");

const dashboardTeamList = document.getElementById("dashboardTeamList");
const teamsContainer = document.getElementById("teamsContainer");
const documentsTable = document.getElementById("documentsTable");
const reviewTable = document.getElementById("reviewTable");
const historyTable = document.getElementById("historyTable");

const totalTeams = document.getElementById("totalTeams");
const approvedCount = document.getElementById("approvedCount");
const pendingCount = document.getElementById("pendingCount");
const rejectedCount = document.getElementById("rejectedCount");

const completedTeamsCount = document.getElementById("completedTeamsCount");
const inProgressTeamsCount = document.getElementById("inProgressTeamsCount");
const notStartedTeamsCount = document.getElementById("notStartedTeamsCount");

const projectSearch = document.getElementById("projectSearch");
const searchBtn = document.getElementById("searchBtn");
const backToAllTeamsBtn = document.getElementById("backToAllTeamsBtn");

const documentSearch = document.getElementById("documentSearch");
const teamFilter = document.getElementById("teamFilter");
const statusFilter = document.getElementById("statusFilter");
const clearFilterBtn = document.getElementById("clearFilterBtn");


const reviewDonut = document.getElementById("reviewDonut");
const donutTotal = document.getElementById("donutTotal");
const legendApproved = document.getElementById("legendApproved");
const legendPending = document.getElementById("legendPending");
const legendRejected = document.getElementById("legendRejected");

const analyticsTotalDocs = document.getElementById("analyticsTotalDocs");
const analyticsApprovedDocs = document.getElementById("analyticsApprovedDocs");
const analyticsPendingDocs = document.getElementById("analyticsPendingDocs");
const analyticsRejectedDocs = document.getElementById("analyticsRejectedDocs");

const reviewModal = document.getElementById("reviewModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalTitle = document.getElementById("modalTitle");
const modalSubTitle = document.getElementById("modalSubTitle");
const modalBody = document.getElementById("modalBody");

const toast = document.getElementById("toast");

// Components Request selectors
const compTotalRequests = document.getElementById("compTotalRequests");
const compPendingRequests = document.getElementById("compPendingRequests");
const compApprovedRequests = document.getElementById("compApprovedRequests");
const compRejectedRequests = document.getElementById("compRejectedRequests");
const compSearch = document.getElementById("compSearch");
const compTeamFilter = document.getElementById("compTeamFilter");
const compStatusFilter = document.getElementById("compStatusFilter");
const compClearFilterBtn = document.getElementById("compClearFilterBtn");
const componentsRequestsTable = document.getElementById("componentsRequestsTable");

// Ticket Management selectors
const ticketTeam = document.getElementById("ticketTeam");
const ticketStudentName = document.getElementById("ticketStudentName");
const ticketStudentNameError = document.getElementById("ticketStudentNameError");
const ticketQuestion = document.getElementById("ticketQuestion");
const ticketQuestionError = document.getElementById("ticketQuestionError");
const studentTicketForm = document.getElementById("studentTicketForm");
const ticketsListContainer = document.getElementById("ticketsListContainer");

// Knowledge Base selectors
const kbTotalDocs = document.getElementById("kbTotalDocs");
const kbDesignDocs = document.getElementById("kbDesignDocs");
const kbTechDocs = document.getElementById("kbTechDocs");
const kbReports = document.getElementById("kbReports");
const kbSearch = document.getElementById("kbSearch");
const kbCategoryFilter = document.getElementById("kbCategoryFilter");
const kbClearFilterBtn = document.getElementById("kbClearFilterBtn");
const kbDocumentsTable = document.getElementById("kbDocumentsTable");

// Profile selectors
const profileForm = document.getElementById("profileForm");
const profileName = document.getElementById("profileName");
const profileNameError = document.getElementById("profileNameError");
const profileEmail = document.getElementById("profileEmail");
const profileEmailError = document.getElementById("profileEmailError");
const profileCurrentPassword = document.getElementById("profileCurrentPassword");
const profileCurrentPasswordError = document.getElementById("profileCurrentPasswordError");
const profileNewPassword = document.getElementById("profileNewPassword");
const profileNewPasswordError = document.getElementById("profileNewPasswordError");
const profileConfirmNewPassword = document.getElementById("profileConfirmNewPassword");
const profileConfirmNewPasswordError = document.getElementById("profileConfirmNewPasswordError");
const logoutLink = document.getElementById("logoutLink");

if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("faculty_session");
        window.location.href = "../login1.html";
    });
}

/* =====================
   HELPERS
===================== */

function saveData() {
    localStorage.setItem("facultyReviewSeparateData", JSON.stringify(appData));
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function todayDate() {
    return new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function getAllDocuments() {
    const docs = [];

    appData.teams.filter(t => t.approvalStatus === "Approved").forEach(team => {
        team.stages.forEach(stage => {
            docs.push({
                teamId: team.id,
                teamName: team.name,
                projectName: team.project,
                leader: team.leader,
                stageNo: stage.stageNo,
                stageName: stage.name,
                documentName: stage.documentName,
                version: stage.version,
                status: stage.status,
                uploadedOn: stage.uploadedOn,
                uploadedBy: stage.uploadedBy,
                reviewer: stage.reviewer,
                reviewedOn: stage.reviewedOn,
                comment: stage.comment
            });
        });
    });

    return docs;
}

function getStatusClass(status) {
    if (status === "Approved") return "status-pill status-approved";
    if (status === "Rejected") return "status-pill status-rejected";
    if (status === "Rework Required") return "status-pill status-rework";
    if (status === "Under Review") return "status-pill status-review";
    if (status === "Submitted") return "status-pill status-submitted";
    if (status === "Locked") return "status-pill status-locked";
    return "status-pill status-draft";
}

function getTeamProgress(team) {
    const approved = team.stages.filter(stage => stage.status === "Approved").length;
    return Math.round((approved / team.stages.length) * 100);
}

/* =====================
   STUDENT UNLOCK LOGIC
===================== */

function updateStudentUnlockedStage(team) {
    let unlockedStage = 1;

    team.stages.forEach(stage => {
        if (stage.status === "Approved") {
            unlockedStage = stage.stageNo + 1;
        }
    });

    if (unlockedStage > team.stages.length + 1) {
        unlockedStage = team.stages.length + 1;
    }

    team.studentUnlockedStage = unlockedStage;

    team.stages.forEach(stage => {
        if (stage.stageNo > unlockedStage && stage.status === "Locked") {
            stage.status = "Locked";
        }

        if (stage.stageNo === unlockedStage && stage.status === "Locked") {
            stage.status = "Draft";
            stage.documentName = "-";
            stage.fileType = "-";
            stage.uploadedOn = "-";
            stage.uploadedBy = "-";
        }
    });
}

/*
    Student page can read this value:
    localStorage.getItem("facultyReviewSeparateData")
    team.studentUnlockedStage tells which stage student can submit.
*/

/* =====================
   NAVIGATION
===================== */

navLinks.forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        const page = this.dataset.page;

        navLinks.forEach(item => item.classList.remove("active"));
        this.classList.add("active");

        pages.forEach(section => section.classList.remove("active-page"));

        const selectedPage = document.getElementById(`${page}Page`);

        if (selectedPage) {
            selectedPage.classList.add("active-page");
        }

        pageTitle.textContent = this.textContent.trim();

        if (window.innerWidth <= 768) {
            sidebar.classList.remove("show");
        }
    });
});

menuBtn.addEventListener("click", function () {
    sidebar.classList.toggle("show");
});

/* =====================
   DASHBOARD
===================== */

function renderDashboard() {
    const docs = getAllDocuments();

    const approved = docs.filter(doc => doc.status === "Approved").length;
    const pending = docs.filter(doc =>
        doc.status === "Submitted" ||
        doc.status === "Under Review" ||
        doc.status === "Draft"
    ).length;
    const rejected = docs.filter(doc =>
        doc.status === "Rejected" ||
        doc.status === "Rework Required"
    ).length;

    totalTeams.textContent = appData.teams.filter(t => t.approvalStatus === "Approved").length;
    approvedCount.textContent = approved;
    pendingCount.textContent = pending;
    rejectedCount.textContent = rejected;

    dashboardTeamList.innerHTML = "";

    appData.teams.filter(t => t.approvalStatus === "Approved").forEach(team => {
        const progress = getTeamProgress(team);

        const card = document.createElement("div");
        card.className = "team-small-card";

        card.innerHTML = `
            <div>
                <h4>${team.name}</h4>
                <p>${team.project}</p>
                <p><b>${team.id}</b> • ${progress}% completed • Student unlocked stage: ${team.studentUnlockedStage}</p>
            </div>

            <button class="btn-secondary" onclick="openTeamFromDashboard('${team.id}')">
                View
            </button>
        `;

        dashboardTeamList.appendChild(card);
    });
}

function openTeamFromDashboard(teamId) {
    navLinks.forEach(item => item.classList.remove("active"));

    const teamsLink = document.querySelector('[data-page="teams"]');

    if (teamsLink) {
        teamsLink.classList.add("active");
    }

    pages.forEach(section => section.classList.remove("active-page"));
    document.getElementById("teamsPage").classList.add("active-page");

    pageTitle.textContent = role === "faculty" ? "My Teams" : "All Teams";

    projectSearch.value = teamId;

    if (backToAllTeamsBtn) {
        backToAllTeamsBtn.style.display = "inline-block";
    }

    renderTeams(teamId);
}

/* =====================
   TEAM FILTER
===================== */

function renderTeamFilterOptions() {
    if (!teamFilter) return;

    teamFilter.innerHTML = `<option value="all">All Teams</option>`;

    appData.teams.filter(t => t.approvalStatus === "Approved").forEach(team => {
        const option = document.createElement("option");
        option.value = team.name;
        option.textContent = team.name;
        teamFilter.appendChild(option);
    });
}

/* =====================
   TEAMS
===================== */

function renderTeams(searchValue = "") {
    teamsContainer.innerHTML = "";

    const filteredTeams = appData.teams.filter(team => {
        if (team.approvalStatus !== "Approved") return false;

        const query = searchValue.toLowerCase();

        return (
            team.id.toLowerCase().includes(query) ||
            team.name.toLowerCase().includes(query) ||
            team.project.toLowerCase().includes(query)
        );
    });

    let completedTeams = 0;
    let notStartedTeams = 0;

    filteredTeams.forEach(team => {
        const progress = getTeamProgress(team);

        if (progress === 100) completedTeams++;
        if (progress === 0) notStartedTeams++;

        const teamCard = document.createElement("div");
        teamCard.className = "team-card";


        const stageCards = team.stages.map(stage => {
            const isLocked = stage.status === "Locked";

            const facultyActions = isLocked
                ? `<button class="disabled-btn">Locked</button>`
                : `
                    <button class="view-btn" onclick="openReviewModal('${team.id}', ${stage.stageNo}, 'view')">View</button>
                    <button class="review-btn" onclick="openReviewModal('${team.id}', ${stage.stageNo}, 'review')">Review</button>
                `;

            const seniorActions = `
                <button class="disabled-btn" onclick="openReviewModal('${team.id}', ${stage.stageNo}, 'status')">Status Only</button>
            `;

            return `
                <div class="stage-card ${isLocked ? "locked" : ""}">
                    <h4>Stage ${stage.stageNo}</h4>
                    <p>${stage.name}</p>
                    <span class="${getStatusClass(stage.status)}">${stage.status}</span>

                    <div class="stage-actions">
                        ${role === "faculty" ? facultyActions : seniorActions}
                    </div>
                </div>
            `;
        }).join("");

        const membersRows = team.members.map(member => {
            return `
                <tr>
                    <td>${member[0]}</td>
                    <td>${member[1]}</td>
                    <td>${member[2]}</td>
                    <td>${member[3]}</td>
                    <td>${member[4]}</td>
                </tr>
            `;
        }).join("");

        teamCard.innerHTML = `
            <div class="team-card-header">
                <div>
                    <h2>${team.id}</h2>
                    <p>${team.name} • ${team.project}</p>
                </div>

                <span class="status-pill status-review">Student Unlocked Stage ${team.studentUnlockedStage}</span>
            </div>

            <div class="team-detail-grid">
                <div class="project-detail-card">
                    <div class="info-row">
                        <span>Project Title</span><b>:</b><b>${team.project}</b>
                    </div>

                    <div class="info-row">
                        <span>Team Leader</span><b>:</b><b>${team.leader} (${team.leaderId})</b>
                    </div>

                    <div class="info-row">
                        <span>Technical Staff</span><b>:</b><b>${team.faculty}</b>
                    </div>

                    <div class="info-row">
                        <span>Created On</span><b>:</b><b>${team.created}</b>
                    </div>

                    <div class="info-row">
                        <span>Started On</span><b>:</b><b>${team.started}</b>
                    </div>

                    <div class="info-row">
                        <span>Deadline</span><b>:</b><b>${team.deadline}</b>
                    </div>

                    <div class="info-row">
                        <span>Project Description</span><b>:</b>
                        <div class="description-box">${team.description}</div>
                    </div>
                </div>

                <div class="progress-card">
                    <h3>Project Progress</h3>

                    <div class="progress-circle" style="background: conic-gradient(#4b16f8 ${progress * 3.6}deg, #e5e7eb ${progress * 3.6}deg);">
                        <div>
                            <h2>${progress}%</h2>
                            <p>Completed</p>
                        </div>
                    </div>

                    <p class="muted">${progress}% stage documents approved.</p>
                </div>
            </div>

            <h3 style="margin-top:25px;color:#003366;">Stage Documents</h3>

            ${role === "senior" ? `<div class="senior-lock">Senior Faculty can view status only. Document access is restricted.</div>` : ""}

            <div class="stage-grid">
                ${stageCards}
            </div>

            <h3 style="margin-top:25px;color:#003366;">Team Members</h3>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Name</th>
                            <th>ID</th>
                            <th>Department</th>
                            <th>Email</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${membersRows}
                    </tbody>
                </table>
            </div>
        `;

        teamsContainer.appendChild(teamCard);
    });

    completedTeamsCount.textContent = completedTeams;
    notStartedTeamsCount.textContent = notStartedTeams;
    inProgressTeamsCount.textContent = filteredTeams.length - completedTeams - notStartedTeams;
}

searchBtn.addEventListener("click", function () {
    const value = projectSearch.value.trim();

    if (backToAllTeamsBtn) {
        backToAllTeamsBtn.style.display = value ? "inline-block" : "none";
    }

    renderTeams(value);
});

projectSearch.addEventListener("input", function () {
    const value = this.value.trim();

    if (backToAllTeamsBtn) {
        backToAllTeamsBtn.style.display = value ? "inline-block" : "none";
    }

    renderTeams(value);
});

if (backToAllTeamsBtn) {
    backToAllTeamsBtn.addEventListener("click", function () {
        projectSearch.value = "";
        backToAllTeamsBtn.style.display = "none";
        renderTeams("");
    });
}

/* =====================
   DOCUMENTS
===================== */

function renderDocuments() {
    if (!documentsTable) return;

    const docs = getAllDocuments();

    const query = documentSearch.value.toLowerCase();
    const selectedTeam = teamFilter.value;
    const selectedStatus = statusFilter.value;

    const filteredDocs = docs.filter(doc => {
        const matchesSearch =
            doc.documentName.toLowerCase().includes(query) ||
            doc.teamName.toLowerCase().includes(query) ||
            doc.stageName.toLowerCase().includes(query) ||
            doc.teamId.toLowerCase().includes(query);

        const matchesTeam = selectedTeam === "all" || doc.teamName === selectedTeam;
        const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;

        return matchesSearch && matchesTeam && matchesStatus;
    });

    documentsTable.innerHTML = "";

    filteredDocs.forEach(doc => {
        const row = document.createElement("tr");

        const isLocked = doc.status === "Locked";

        const actionHtml = role === "faculty"
            ? isLocked
                ? `<button class="disabled-btn">Locked</button>`
                : `
                    <button class="view-btn" onclick="openReviewModal('${doc.teamId}', ${doc.stageNo}, 'view')">View</button>
                    <button class="review-btn" onclick="openReviewModal('${doc.teamId}', ${doc.stageNo}, 'review')">Review</button>
                `
            : `<button class="disabled-btn" onclick="openReviewModal('${doc.teamId}', ${doc.stageNo}, 'status')">Status Only</button>`;

        const documentHtml = role === "faculty"
            ? `<span class="doc-name">${doc.documentName}</span>`
            : `<span class="muted">Document Hidden</span>`;

        row.innerHTML = `
            <td>${doc.teamId}</td>
            <td>${doc.teamName}</td>
            <td>Stage ${doc.stageNo} - ${doc.stageName}</td>
            <td>${documentHtml}</td>
            <td>V${doc.version}</td>
            <td><span class="${getStatusClass(doc.status)}">${doc.status}</span></td>
            <td>${doc.uploadedOn}</td>
            <td>${actionHtml}</td>
        `;

        documentsTable.appendChild(row);
    });

    renderDocumentOverview(filteredDocs);
}

function renderDocumentOverview(docs) {
    const total = docs.length;
    const approved = docs.filter(doc => doc.status === "Approved").length;
  const pending = docs.filter(doc =>
        doc.status === "Submitted" ||
        doc.status === "Under Review" ||
        doc.status === "Draft"
    ).length;
    const rejected = docs.filter(doc =>
        doc.status === "Rejected" ||
        doc.status === "Rework Required"
    ).length;

    donutTotal.textContent = total;
    legendApproved.textContent = approved;
    legendPending.textContent = pending;
    legendRejected.textContent = rejected;

    const approvedDeg = total ? (approved / total) * 360 : 0;
    const pendingDeg = total ? approvedDeg + (pending / total) * 360 : approvedDeg;
    const rejectedDeg = total ? pendingDeg + (rejected / total) * 360 : pendingDeg;

    reviewDonut.style.background = `
        conic-gradient(
            #16a34a 0deg ${approvedDeg}deg,
            #f97316 ${approvedDeg}deg ${pendingDeg}deg,
            #ef4444 ${pendingDeg}deg ${rejectedDeg}deg,
            #e5e7eb ${rejectedDeg}deg 360deg
        )
    `;
}

documentSearch.addEventListener("input", renderDocuments);
teamFilter.addEventListener("change", renderDocuments);
statusFilter.addEventListener("change", renderDocuments);

clearFilterBtn.addEventListener("click", function () {
    documentSearch.value = "";
    teamFilter.value = "all";
    statusFilter.value = "all";
    renderDocuments();
});

/* =====================
   REVIEWS
===================== */

function renderReviews() {
    if (!reviewTable) return;

    const docs = getAllDocuments().filter(doc => {
        return doc.status === "Submitted" ||
               doc.status === "Under Review" ||
               doc.status === "Rework Required";
    });

    reviewTable.innerHTML = "";

    docs.forEach(doc => {
        const row = document.createElement("tr");

        const action = role === "faculty"
            ? `<button class="review-btn" onclick="openReviewModal('${doc.teamId}', ${doc.stageNo}, 'review')">Review</button>`
            : `<button class="disabled-btn">Status Only</button>`;

        row.innerHTML = `
            <td>${doc.teamName}</td>
            <td>${doc.teamId}</td>
            <td>Stage ${doc.stageNo} - ${doc.stageName}</td>
            <td><span class="${getStatusClass(doc.status)}">${doc.status}</span></td>
            <td>${action}</td>
        `;

        reviewTable.appendChild(row);
    });
}

/* =====================
   HISTORY
===================== */

function renderHistory() {
    historyTable.innerHTML = "";

    appData.teams.forEach(team => {
        team.stages.forEach(stage => {
            stage.history.forEach(item => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${team.name}</td>
                    <td>Stage ${stage.stageNo} - ${stage.name}</td>
                    <td>V${item.version}</td>
                    <td>${item.submittedDate}</td>
                    <td>${item.reviewedDate}</td>
                    <td>${item.reviewer}</td>
                    <td><span class="${getStatusClass(item.status)}">${item.status}</span></td>
                `;

                historyTable.appendChild(row);
            });
        });
    });
}

/* =====================
   ANALYTICS
===================== */

function renderAnalytics() {
    const docs = getAllDocuments();

    const approved = docs.filter(doc => doc.status === "Approved").length;
    const pending = docs.filter(doc =>
        doc.status === "Submitted" ||
        doc.status === "Under Review" ||
        doc.status === "Draft"
    ).length;
    const rejected = docs.filter(doc =>
        doc.status === "Rejected" ||
        doc.status === "Rework Required"
    ).length;

    analyticsTotalDocs.textContent = docs.length;
    analyticsApprovedDocs.textContent = approved;
    analyticsPendingDocs.textContent = pending;
    analyticsRejectedDocs.textContent = rejected;
}

/* =====================
   MODAL
===================== */

function openReviewModal(teamId, stageNo, mode) {
    const team = appData.teams.find(item => item.id === teamId);
    const stage = team.stages.find(item => item.stageNo === stageNo);

    modalTitle.textContent = `${team.name} - Stage ${stage.stageNo}`;
    modalSubTitle.textContent = `${stage.name} • ${team.project}`;

    if (role === "senior") {
        modalBody.innerHTML = `
            <div class="senior-lock">
                Senior Faculty can view submission status only. Document access and review actions are restricted.
            </div>

            <div class="modal-grid">
                <div class="project-detail-card">
                    <h3>Status Details</h3>

                    <div class="info-row">
                        <span>Team</span><b>:</b><b>${team.name}</b>
                    </div>

                    <div class="info-row">
                        <span>Project ID</span><b>:</b><b>${team.id}</b>
                    </div>

                    <div class="info-row">
                        <span>Stage</span><b>:</b><b>${stage.name}</b>
                    </div>

                    <div class="info-row">
                        <span>Status</span><b>:</b><b>${stage.status}</b>
                    </div>

                    <div class="info-row">
                        <span>Version</span><b>:</b><b>V${stage.version}</b>
                    </div>
                </div>

                <div class="project-detail-card">
                    <h3>Review Summary</h3>
                    <p class="muted">Reviewer: ${stage.reviewer}</p>
                    <p class="muted">Reviewed On: ${stage.reviewedOn}</p>
                    <p class="muted">Comment: ${stage.comment || "No comment available."}</p>
                </div>
            </div>
        `;

        reviewModal.classList.add("show");
        return;
    }

    if (stage.status === "Locked") {
        showToast("This stage is locked. Student must wait for previous approval.");
        return;
    }

    const historyHtml = stage.history.length
        ? stage.history.map(item => {
            return `
                <div class="version-item">
                    <b>Version ${item.version}</b>
                    <p>Submitted: ${item.submittedDate}</p>
                    <p>Reviewed: ${item.reviewedDate}</p>
                    <p>Reviewer: ${item.reviewer}</p>
                    <p>Status: ${item.status}</p>
                </div>
            `;
        }).join("")
        : `<p class="muted">No submission history.</p>`;

    const reviewActions = mode === "review"
        ? `
            <div class="comment-box">
                <label><b>Faculty Comment</b></label>
                <textarea id="facultyComment" placeholder="Enter review comment, correction, suggestion, or mandatory change...">${stage.comment || ""}</textarea>
            </div>

            <div class="review-actions">
                <button class="approve-btn" onclick="reviewSubmission('${team.id}', ${stage.stageNo}, 'Approved')">Approve</button>
                <button class="reject-btn" onclick="reviewSubmission('${team.id}', ${stage.stageNo}, 'Rejected')">Reject</button>
                <button class="rework-btn" onclick="reviewSubmission('${team.id}', ${stage.stageNo}, 'Rework Required')">Request Rework</button>
            </div>
        `
        : `<p class="muted">Open review mode to approve, reject, or request rework.</p>`;

    modalBody.innerHTML = `
        <div class="modal-grid">
            <div>
                <div class="document-preview">
                    <h3>Document Preview</h3>
                    <p class="doc-name">${stage.documentName}</p>
                    <p>File Type: ${stage.fileType}</p>
                    <p>Uploaded By: ${stage.uploadedBy}</p>
                    <p>Uploaded On: ${stage.uploadedOn}</p>
                    <p>Version: V${stage.version}</p>

                    <button class="btn-primary" onclick="fakeDownload('${stage.documentName}')">
                        Download Document
 </button>
                </div>

                <div style="margin-top:20px;">
                    <h3 style="color:#003366;margin-bottom:10px;">Submission Details</h3>

                    <div class="info-row">
                        <span>Project ID</span><b>:</b><b>${team.id}</b>
                    </div>

                    <div class="info-row">
                        <span>Team</span><b>:</b><b>${team.name}</b>
                    </div>

                    <div class="info-row">
                        <span>Stage</span><b>:</b><b>${stage.name}</b>
                    </div>

                    <div class="info-row">
                        <span>Status</span><b>:</b><b>${stage.status}</b>
                    </div>
                </div>
            </div>

            <div>
                <h3 style="color:#003366;margin-bottom:10px;">Submission Version History</h3>

                <div class="version-list">
                    ${historyHtml}
                </div>

                <div style="margin-top:20px;">
                    ${reviewActions}
                </div>
            </div>
        </div>
    `;

    reviewModal.classList.add("show");
}

function reviewSubmission(teamId, stageNo, newStatus) {
    const team = appData.teams.find(item => item.id === teamId);
    const stage = team.stages.find(item => item.stageNo === stageNo);
    const commentInput = document.getElementById("facultyComment");

    const comment = commentInput ? commentInput.value.trim() : "";

    const reviewedDate = todayDate();

    stage.status = newStatus;
    stage.reviewer = "Dr. Faculty Name";
    stage.reviewedOn = reviewedDate;
    stage.comment = comment || "-";

    stage.history.push({
        version: stage.version,
        submittedDate: stage.uploadedOn,
        reviewedDate: reviewedDate,
        reviewer: "Dr. Faculty Name",
        status: newStatus
    });

    if (newStatus === "Rejected" || newStatus === "Rework Required") {
        stage.version += 1;
    }

    if (newStatus === "Approved") {
        updateStudentUnlockedStage(team);
    }

    saveData();
    renderAll();

    reviewModal.classList.remove("show");

    if (newStatus === "Approved") {
        showToast(`Stage ${stageNo} approved. Student can now submit Stage ${stageNo + 1}.`);
    } else if (newStatus === "Rejected") {
        showToast(`Stage ${stageNo} rejected. Student must resubmit.`);
    } else {
        showToast(`Stage ${stageNo} marked for rework.`);
    }
}

function fakeDownload(fileName) {
    showToast(`${fileName} opened for download.`);
}

closeModalBtn.addEventListener("click", function () {
    reviewModal.classList.remove("show");
});

reviewModal.addEventListener("click", function (event) {
    if (event.target === reviewModal) {
        reviewModal.classList.remove("show");
    }
});

/* ====================================
   COMPONENT REQUEST PAGE LOGIC
   ==================================== */

function renderCompTeamFilterOptions() {
    if (!compTeamFilter) return;
    const currentVal = compTeamFilter.value;
    compTeamFilter.innerHTML = `<option value="all">All Teams</option>`;
    
    const requests = JSON.parse(localStorage.getItem("facultyComponentRequests")) || [];
    const uniqueTeams = [...new Set(requests.map(r => r.team))];
    
    uniqueTeams.forEach(team => {
        const option = document.createElement("option");
        option.value = team;
        option.textContent = team;
        compTeamFilter.appendChild(option);
    });
    
    compTeamFilter.value = currentVal || "all";
}

function renderComponentsRequest() {
    if (!componentsRequestsTable) return;
    const requests = JSON.parse(localStorage.getItem("facultyComponentRequests")) || [];
    
    const query = compSearch.value.toLowerCase();
    const selectedTeam = compTeamFilter.value;
    const selectedStatus = compStatusFilter.value;
    
    const filtered = requests.filter(req => {
        const matchesSearch = req.component.toLowerCase().includes(query) ||
                              req.team.toLowerCase().includes(query) ||
                              req.id.toLowerCase().includes(query);
        const matchesTeam = selectedTeam === "all" || req.team === selectedTeam;
        const matchesStatus = selectedStatus === "all" || req.status === selectedStatus;
        return matchesSearch && matchesTeam && matchesStatus;
    });
    
    componentsRequestsTable.innerHTML = "";
    
    // Calc stats
    const total = filtered.length;
    const pending = filtered.filter(r => r.status === "Pending").length;
    const approved = filtered.filter(r => r.status === "Approved").length;
    const rejected = filtered.filter(r => r.status === "Rejected").length;
    
    if (compTotalRequests) compTotalRequests.textContent = total;
    if (compPendingRequests) compPendingRequests.textContent = pending;
    if (compApprovedRequests) compApprovedRequests.textContent = approved;
    if (compRejectedRequests) compRejectedRequests.textContent = rejected;
    
    filtered.forEach(req => {
        const row = document.createElement("tr");
        
        let badgeClass = "status-pill status-draft";
        if (req.status === "Pending") badgeClass = "status-pill status-review";
        if (req.status === "Approved") badgeClass = "status-pill status-approved";
        if (req.status === "Rejected") badgeClass = "status-pill status-rejected";
        if (req.status === "Fulfilled") badgeClass = "status-pill status-approved";
        
        let actionsHtml = "";
        if (req.status === "Pending") {
            actionsHtml = `
                <button class="review-btn" onclick="actionComponentRequest('${req.id}', 'Approved')" style="background:#16a34a; margin-right:5px;">Accept</button>
                <button class="reject-btn" onclick="actionComponentRequest('${req.id}', 'Rejected')" style="background:#dc2626; padding: 8px 10px; border-radius: 7px; color: white; border: none; cursor: pointer; font-size: 12px; font-weight: 800;">Reject</button>
            `;
        } else {
            actionsHtml = `<span class="muted" style="font-size:12px;">No Actions</span>`;
        }
        
        row.innerHTML = `
            <td><b>${req.id}</b></td>
            <td>${req.team}</td>
            <td>${req.component}</td>
            <td>${req.quantity}</td>
            <td>${req.purpose}</td>
            <td><span class="${badgeClass}">${req.status}</span></td>
            <td>${req.requestedOn}</td>
            <td>${req.deadline}</td>
            <td>${actionsHtml}</td>
        `;
        
        componentsRequestsTable.appendChild(row);
    });
}

function actionComponentRequest(reqId, newStatus) {
    const requests = JSON.parse(localStorage.getItem("facultyComponentRequests")) || [];
    const reqIndex = requests.findIndex(r => r.id === reqId);
    if (reqIndex === -1) return;
    
    const req = requests[reqIndex];
    
    // Check if team is assigned to the current faculty
    const isAssigned = appData.teams.some(t => t.name.toLowerCase() === req.team.toLowerCase());
    
    if (!isAssigned) {
        showToast(`Permission Denied: ${req.team} is not assigned to you.`);
        return;
    }
    
    requests[reqIndex].status = newStatus;
    localStorage.setItem("facultyComponentRequests", JSON.stringify(requests));
    showToast(`Component request ${reqId} has been ${newStatus.toLowerCase()}.`);
    renderComponentsRequest();
}

window.actionComponentRequest = actionComponentRequest;

if (compSearch) compSearch.addEventListener("input", renderComponentsRequest);
if (compTeamFilter) compTeamFilter.addEventListener("change", renderComponentsRequest);
if (compStatusFilter) compStatusFilter.addEventListener("change", renderComponentsRequest);
if (compClearFilterBtn) {
    compClearFilterBtn.addEventListener("click", () => {
        compSearch.value = "";
        compTeamFilter.value = "all";
        compStatusFilter.value = "all";
        renderComponentsRequest();
    });
}

/* ====================================
   TICKET MANAGEMENT PAGE LOGIC
   ==================================== */

function renderTickets() {
    if (!ticketsListContainer) return;
    const tickets = JSON.parse(localStorage.getItem("facultyTickets")) || [];
    
    // Populate simulated teams dropdown in simulator form
    if (ticketTeam) {
        const currentSelected = ticketTeam.value;
        ticketTeam.innerHTML = "";
        appData.teams.filter(t => t.approvalStatus === "Approved").forEach(t => {
            const opt = document.createElement("option");
            opt.value = t.name;
            opt.textContent = t.name;
            ticketTeam.appendChild(opt);
        });
        if (currentSelected) {
            ticketTeam.value = currentSelected;
        }
    }
    
    ticketsListContainer.innerHTML = "";
    
    if (tickets.length === 0) {
        ticketsListContainer.innerHTML = `<p class="muted" style="text-align:center; padding:20px;">No tickets raised yet.</p>`;
        return;
    }
    
    tickets.forEach(tck => {
        const div = document.createElement("div");
        div.className = `ticket-card ${tck.status === "Answered" ? "answered" : ""}`;
        
        let badgeClass = "status-pill status-review";
        if (tck.status === "Answered") badgeClass = "status-pill status-approved";
        
        let replyFormHtml = "";
        let replyViewHtml = "";
        
        if (tck.status === "Pending") {
            replyFormHtml = `
                <div class="ticket-action-row">
                    <button class="review-btn" onclick="toggleReplyBox('${tck.id}')">Reply</button>
                </div>
                <div class="ticket-reply-box" id="replyBox-${tck.id}">
                    <textarea id="replyText-${tck.id}" class="form-control" placeholder="Write feedback/reply..." style="width:100%; min-height:80px; margin: 10px 0; resize:vertical;"></textarea>
                    <div class="ticket-action-row">
                        <button class="btn-primary" onclick="submitTicketReply('${tck.id}')">Send Feedback</button>
                    </div>
                </div>
            `;
        } else {
            replyViewHtml = `
                <div class="ticket-feedback">
                    <strong>Faculty Feedback:</strong>
                    <p>${tck.reply}</p>
                </div>
            `;
        }
        
        div.innerHTML = `
            <div class="ticket-header">
                <span class="ticket-title">${tck.id} - ${tck.team}</span>
                <span class="${badgeClass}">${tck.status}</span>
            </div>
            <div class="ticket-meta">Raised by: <b>${tck.student}</b> | Date: ${tck.date}</div>
            <div class="ticket-question">${tck.question}</div>
            ${replyViewHtml}
            ${replyFormHtml}
        `;
        
        ticketsListContainer.appendChild(div);
    });
}

function toggleReplyBox(tckId) {
    const box = document.getElementById(`replyBox-${tckId}`);
    if (box) {
        box.classList.toggle("show");
    }
}

function submitTicketReply(tckId) {
    const replyInput = document.getElementById(`replyText-${tckId}`);
    if (!replyInput) return;
    
    const replyText = replyInput.value.trim();
    if (!replyText) {
        replyInput.classList.add("invalid");
        return;
    }
    replyInput.classList.remove("invalid");
    
    const tickets = JSON.parse(localStorage.getItem("facultyTickets")) || [];
    const tckIndex = tickets.findIndex(t => t.id === tckId);
    if (tckIndex === -1) return;
    
    tickets[tckIndex].status = "Answered";
    tickets[tckIndex].reply = replyText;
    
    localStorage.setItem("facultyTickets", JSON.stringify(tickets));
    showToast(`Feedback sent to ${tickets[tckIndex].student}.`);
    renderTickets();
}

if (studentTicketForm) {
    studentTicketForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        let isValid = true;
        ticketStudentNameError.style.display = "none";
        ticketQuestionError.style.display = "none";
        ticketStudentName.classList.remove("invalid");
        ticketQuestion.classList.remove("invalid");
        
        if (!ticketStudentName.value.trim()) {
            ticketStudentNameError.style.display = "block";
            ticketStudentName.classList.add("invalid");
            isValid = false;
        }
        
        if (!ticketQuestion.value.trim()) {
            ticketQuestionError.style.display = "block";
            ticketQuestion.classList.add("invalid");
            isValid = false;
        }
        
        if (isValid) {
            const tickets = JSON.parse(localStorage.getItem("facultyTickets")) || [];
            const newId = `TCK-${String(tickets.length + 1).padStart(3, '0')}`;
            
            const newTicket = {
                id: newId,
                team: ticketTeam.value,
                student: ticketStudentName.value.trim(),
                question: ticketQuestion.value.trim(),
                status: "Pending",
                reply: "",
                date: todayDate()
            };
            
            tickets.push(newTicket);
            localStorage.setItem("facultyTickets", JSON.stringify(tickets));
            
            ticketStudentName.value = "";
            ticketQuestion.value = "";
            
            showToast(`Ticket ${newId} submitted successfully.`);
            renderTickets();
        }
    });
}

window.toggleReplyBox = toggleReplyBox;
window.submitTicketReply = submitTicketReply;

/* ====================================
   KNOWLEDGE BASE PAGE LOGIC
   ==================================== */

function renderKBDocuments() {
    if (!kbDocumentsTable) return;
    const docs = JSON.parse(localStorage.getItem("facultyKBDocuments")) || [];
    
    const query = kbSearch.value.toLowerCase();
    const selectedCat = kbCategoryFilter.value;
    
    const filtered = docs.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(query) ||
                              doc.team.toLowerCase().includes(query) ||
                              doc.uploadedBy.toLowerCase().includes(query);
        const matchesCat = selectedCat === "all" || doc.category === selectedCat;
        return matchesSearch && matchesCat;
    });
    
    kbDocumentsTable.innerHTML = "";
    
    // Stats
    if (kbTotalDocs) kbTotalDocs.textContent = docs.length;
    if (kbDesignDocs) kbDesignDocs.textContent = docs.filter(d => d.category === "Design").length;
    if (kbTechDocs) kbTechDocs.textContent = docs.filter(d => d.category === "Technical").length;
    if (kbReports) kbReports.textContent = docs.filter(d => d.category === "Reports").length;
    
    filtered.forEach(doc => {
        const row = document.createElement("tr");
        
        row.innerHTML = `
            <td><span class="doc-name">${doc.title}</span></td>
            <td><span class="status-pill status-draft">${doc.category}</span></td>
            <td>${doc.team}</td>
            <td>${doc.uploadedBy}</td>
            <td>${doc.uploadedOn}</td>
            <td>${doc.size}</td>
            <td>
                <button class="view-btn" onclick="fakeDownload('${doc.title}')" style="padding: 6px 10px;">View</button>
            </td>
        `;
        
        kbDocumentsTable.appendChild(row);
    });
}

if (kbSearch) kbSearch.addEventListener("input", renderKBDocuments);
if (kbCategoryFilter) kbCategoryFilter.addEventListener("change", renderKBDocuments);
if (kbClearFilterBtn) {
    kbClearFilterBtn.addEventListener("click", () => {
        kbSearch.value = "";
        kbCategoryFilter.value = "all";
        renderKBDocuments();
    });
}

/* ====================================
   PROFILE PAGE LOGIC
   ==================================== */

function loadProfileData() {
    if (!profileForm) return;
    const profile = JSON.parse(localStorage.getItem("facultyProfile"));
    if (profile) {
        profileName.value = profile.name;
        profileEmail.value = profile.email;
        profileCurrentPassword.value = "";
        profileNewPassword.value = "";
        profileConfirmNewPassword.value = "";
    }
}

if (profileForm) {
    profileForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Clear errors
        [profileNameError, profileEmailError, profileCurrentPasswordError, profileNewPasswordError, profileConfirmNewPasswordError].forEach(el => {
            if (el) { el.classList.remove("show"); el.style.display = ""; }
        });
        
        profileName.classList.remove("invalid");
        profileEmail.classList.remove("invalid");
        profileCurrentPassword.classList.remove("invalid");
        profileNewPassword.classList.remove("invalid");
        profileConfirmNewPassword.classList.remove("invalid");
        
        const profile = JSON.parse(localStorage.getItem("facultyProfile"));
        
        if (!profileName.value.trim()) {
            profileNameError.classList.add("show");
            profileName.classList.add("invalid");
            isValid = false;
        }
        
        if (!profileEmail.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileEmail.value)) {
            profileEmailError.classList.add("show");
            profileEmail.classList.add("invalid");
            isValid = false;
        }
        
        if (profileCurrentPassword.value !== profile.password) {
            profileCurrentPasswordError.classList.add("show");
            profileCurrentPassword.classList.add("invalid");
            isValid = false;
        }
        
        if (profileNewPassword.value) {
            if (profileNewPassword.value.length < 6) {
                profileNewPasswordError.classList.add("show");
                profileNewPassword.classList.add("invalid");
                isValid = false;
            }
            
            if (profileNewPassword.value !== profileConfirmNewPassword.value) {
                profileConfirmNewPasswordError.classList.add("show");
                profileConfirmNewPassword.classList.add("invalid");
                isValid = false;
            }
        }
        
        if (isValid) {
            profile.name = profileName.value.trim();
            profile.email = profileEmail.value.trim();
            
            let passwordChanged = false;
            if (profileNewPassword.value) {
                profile.password = profileNewPassword.value;
                passwordChanged = true;
            }
            
            localStorage.setItem("facultyProfile", JSON.stringify(profile));
            
            // Update session
            const activeSession = JSON.parse(localStorage.getItem("faculty_session"));
            if (activeSession) {
                activeSession.name = profile.name;
                activeSession.email = profile.email;
                localStorage.setItem("faculty_session", JSON.stringify(activeSession));
            }
            
            const headerNameNode = document.querySelector(".header-right h4");
            if (headerNameNode) {
                headerNameNode.textContent = profile.name;
            }
            
            if (passwordChanged) {
                alert("Password changed successfully! Please log in again.");
                localStorage.removeItem("faculty_session");
                window.location.href = "../login1.html";
            } else {
                showToast("Profile details updated successfully.");
                loadProfileData();
            }
        }
    });
}


/* ====================================
   TEAM APPROVAL PAGE LOGIC
   ==================================== */

const approvalPendingCount = document.getElementById("approvalPendingCount");
const approvalApprovedCount = document.getElementById("approvalApprovedCount");
const approvalRejectedCount = document.getElementById("approvalRejectedCount");
const teamApprovalListContainer = document.getElementById("teamApprovalListContainer");

function renderTeamApproval() {
    if (!teamApprovalListContainer) return;
    
    // Stats calculation
    const pending = appData.teams.filter(t => t.approvalStatus === "Pending").length;
    const approved = appData.teams.filter(t => t.approvalStatus === "Approved").length;
    const rejected = appData.teams.filter(t => t.approvalStatus === "Rejected").length;
    
    if (approvalPendingCount) approvalPendingCount.textContent = pending;
    if (approvalApprovedCount) approvalApprovedCount.textContent = approved;
    if (approvalRejectedCount) approvalRejectedCount.textContent = rejected;
    
    teamApprovalListContainer.innerHTML = "";
    
    const pendingTeams = appData.teams.filter(t => t.approvalStatus === "Pending");
    
    if (pendingTeams.length === 0) {
        teamApprovalListContainer.innerHTML = `<p class="muted" style="text-align:center; padding:20px; font-weight: 600;">No pending team registration requests.</p>`;
        return;
    }
    
    pendingTeams.forEach(team => {
        const card = document.createElement("div");
        card.className = "approval-card";
        
        const membersRows = team.members.map(member => {
            return `
                <tr>
                    <td>${member[0]}</td>
                    <td>${member[1]}</td>
                    <td>${member[2]}</td>
                    <td>${member[3]}</td>
                    <td>${member[4]}</td>
                </tr>
            `;
        }).join("");
        
        card.innerHTML = `
            <div class="approval-card-header">
                <div>
                    <h3>${team.name}</h3>
                    <p>Project ID: <b>${team.id}</b></p>
                </div>
                <span class="status-pill status-review">Awaiting Approval</span>
            </div>
            
            <div class="approval-meta-grid">
                <div class="approval-meta-item">
                    <strong>Project Title</strong>
                    <span>${team.project}</span>
                </div>
                <div class="approval-meta-item">
                    <strong>Team Leader</strong>
                    <span>${team.leader} (${team.leaderId})</span>
                </div>
                <div class="approval-meta-item" style="grid-column: span 2;">
                    <strong>Project Description</strong>
                    <span>${team.description}</span>
                </div>
            </div>
            
            <h4 style="margin-top:15px; margin-bottom:10px; color:#003366;">Team Members</h4>
            <div class="table-wrapper" style="margin-bottom: 15px;">
                <table>
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Name</th>
                            <th>ID</th>
                            <th>Department</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${membersRows}
                    </tbody>
                </table>
            </div>
            
            <div class="approval-actions-row">
                <button class="review-btn" onclick="approveTeam('${team.id}')" style="background:#16a34a; padding: 11px 18px; border-radius: 8px; font-weight: 800; color: white; border: none; cursor: pointer;">Approve & Assign</button>
                <button class="reject-btn" onclick="rejectTeam('${team.id}')" style="background:#dc2626; padding: 11px 18px; border-radius: 8px; font-weight: 800; color: white; border: none; cursor: pointer;">Reject</button>
            </div>
        `;
        
        teamApprovalListContainer.appendChild(card);
    });
}

function approveTeam(teamId) {
    const teamIndex = appData.teams.findIndex(t => t.id === teamId);
    if (teamIndex === -1) return;
    
    appData.teams[teamIndex].approvalStatus = "Approved";
    showToast(`Team ${appData.teams[teamIndex].name} approved and assigned.`);
    
    saveData();
    renderAll();
}

function rejectTeam(teamId) {
    const teamIndex = appData.teams.findIndex(t => t.id === teamId);
    if (teamIndex === -1) return;
    
    appData.teams[teamIndex].approvalStatus = "Rejected";
    showToast(`Team registration request rejected.`);
    
    saveData();
    renderAll();
}

window.approveTeam = approveTeam;
window.rejectTeam = rejectTeam;

/* ====================================
   NOTIFICATION SYSTEM
   ==================================== */

const notificationBell    = document.getElementById("notificationBell");
const notifDropdown       = document.getElementById("notifDropdown");
const notifList           = document.getElementById("notifList");
const notifBadge          = document.getElementById("notifBadge");
const markAllReadBtn      = document.getElementById("markAllReadBtn");

// Notification store key
const NOTIF_KEY = "facultyNotifications";

function getNotifications() {
    return JSON.parse(localStorage.getItem(NOTIF_KEY)) || [];
}

function saveNotifications(notifs) {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
}

function timeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

function iconForType(type) {
    const icons = {
        "approval":  "📋",
        "submit":    "📄",
        "approved":  "✅",
        "rejected":  "❌",
        "ticket":    "🎫",
        "component": "📦"
    };
    return icons[type] || "🔔";
}

// Generate fresh notifications from current appData & localStorage
function generateNotifications() {
    const existing = getNotifications();
    const existingIds = new Set(existing.map(n => n.id));
    const newNotifs = [];

    // 1. Pending team approvals
    appData.teams.filter(t => t.approvalStatus === "Pending").forEach(team => {
        const id = `approval-${team.id}`;
        if (!existingIds.has(id)) {
            newNotifs.push({
                id,
                type: "approval",
                title: "Team Registration Pending",
                desc: `${team.name} — "${team.project}" awaits your approval.`,
                timestamp: Date.now() - Math.floor(Math.random() * 3600000),
                read: false,
                page: "teamApproval"
            });
        }
    });

    // 2. Teams that were approved
    appData.teams.filter(t => t.approvalStatus === "Approved").forEach(team => {
        const id = `approved-team-${team.id}`;
        if (!existingIds.has(id)) {
            newNotifs.push({
                id,
                type: "approved",
                title: "Team Approved & Assigned",
                desc: `${team.name} has been approved and added to My Teams.`,
                timestamp: Date.now() - Math.floor(Math.random() * 7200000),
                read: false,
                page: "teams"
            });
        }
    });

    // 3. Teams that were rejected
    appData.teams.filter(t => t.approvalStatus === "Rejected").forEach(team => {
        const id = `rejected-team-${team.id}`;
        if (!existingIds.has(id)) {
            newNotifs.push({
                id,
                type: "rejected",
                title: "Team Registration Rejected",
                desc: `${team.name}'s registration request was rejected.`,
                timestamp: Date.now() - Math.floor(Math.random() * 7200000),
                read: false,
                page: "teamApproval"
            });
        }
    });

    // 4. Submitted stage documents (status = "Submitted")
    appData.teams.filter(t => t.approvalStatus === "Approved").forEach(team => {
        team.stages.filter(s => s.status === "Submitted").forEach(stage => {
            const id = `submit-${team.id}-stage${stage.stageNo}`;
            if (!existingIds.has(id)) {
                newNotifs.push({
                    id,
                    type: "submit",
                    title: "Stage Document Submitted",
                    desc: `${team.name} submitted Stage ${stage.stageNo}: ${stage.name}.`,
                    timestamp: Date.now() - Math.floor(Math.random() * 86400000),
                    read: false,
                    page: "documents"
                });
            }
        });
    });

    // 5. Pending tickets
    const tickets = JSON.parse(localStorage.getItem("facultyTickets")) || [];
    tickets.filter(t => t.status === "Pending").forEach(tck => {
        const id = `ticket-${tck.id}`;
        if (!existingIds.has(id)) {
            newNotifs.push({
                id,
                type: "ticket",
                title: "Student Question Raised",
                desc: `${tck.student} (${tck.team}): "${tck.question.substring(0, 60)}..."`,
                timestamp: Date.now() - Math.floor(Math.random() * 3600000),
                read: false,
                page: "ticketManagement"
            });
        }
    });

    // 6. Pending component requests
    const compReqs = JSON.parse(localStorage.getItem("facultyComponentRequests")) || [];
    compReqs.filter(r => r.status === "Pending").forEach(req => {
        const id = `comp-${req.id}`;
        if (!existingIds.has(id)) {
            newNotifs.push({
                id,
                type: "component",
                title: "Component Request Pending",
                desc: `${req.team} requested ${req.quantity}x ${req.component}.`,
                timestamp: Date.now() - Math.floor(Math.random() * 86400000),
                read: false,
                page: "componentsRequest"
            });
        }
    });

    if (newNotifs.length > 0) {
        const merged = [...newNotifs, ...existing].slice(0, 40);
        saveNotifications(merged);
    }
}

function renderNotifications() {
    if (!notifList) return;

    generateNotifications();
    const notifs = getNotifications();
    const unreadCount = notifs.filter(n => !n.read).length;

    // Update badge
    if (notifBadge) {
        if (unreadCount > 0) {
            notifBadge.textContent = unreadCount > 9 ? "9+" : unreadCount;
            notifBadge.classList.remove("hidden");
        } else {
            notifBadge.classList.add("hidden");
        }
    }

    notifList.innerHTML = "";

    if (notifs.length === 0) {
        notifList.innerHTML = `
            <div class="notif-empty">
                <span class="notif-empty-icon">🔕</span>
                All caught up! No notifications.
            </div>`;
        return;
    }

    notifs.forEach(n => {
        const item = document.createElement("div");
        item.className = `notif-item${n.read ? "" : " unread"}`;
        item.dataset.id = n.id;

        item.innerHTML = `
            <div class="notif-icon type-${n.type}">${iconForType(n.type)}</div>
            <div class="notif-body">
                <div class="notif-title">${n.title}</div>
                <div class="notif-desc">${n.desc}</div>
                <div class="notif-time">${timeAgo(n.timestamp)}</div>
            </div>
        `;

        item.addEventListener("click", (e) => {
            e.stopPropagation();
            // Mark as read
            const all = getNotifications();
            const idx = all.findIndex(x => x.id === n.id);
            if (idx !== -1) { all[idx].read = true; saveNotifications(all); }

            // Navigate to the relevant page
            if (n.page) {
                const targetLink = document.querySelector(`[data-page="${n.page}"]`);
                if (targetLink) targetLink.click();
            }

            closeNotifDropdown();
            renderNotifications();
        });

        notifList.appendChild(item);
    });
}

function openNotifDropdown() {
    if (notifDropdown) notifDropdown.classList.add("open");
}

function closeNotifDropdown() {
    if (notifDropdown) notifDropdown.classList.remove("open");
}

// Toggle dropdown on bell click
if (notificationBell) {
    notificationBell.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = notifDropdown.classList.contains("open");
        if (isOpen) {
            closeNotifDropdown();
        } else {
            renderNotifications();
            openNotifDropdown();
        }
    });
}

// Close dropdown on outside click
document.addEventListener("click", (e) => {
    if (notifDropdown && !notifDropdown.contains(e.target) && e.target !== notificationBell) {
        closeNotifDropdown();
    }
});

// Stop dropdown from closing when clicking inside it
if (notifDropdown) {
    notifDropdown.addEventListener("click", (e) => e.stopPropagation());
}

// Mark all as read
if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const all = getNotifications().map(n => ({ ...n, read: true }));
        saveNotifications(all);
        renderNotifications();
    });
}

/* =====================
   RENDER ALL
   ===================== */

function renderAll() {
    appData.teams.forEach(team => updateStudentUnlockedStage(team));

    renderDashboard();
    renderTeamFilterOptions();
    renderTeams(projectSearch.value.trim());
    renderDocuments();
    renderReviews();
    renderHistory();
    renderAnalytics();

    // Custom views
    renderTeamApproval();
    renderCompTeamFilterOptions();
    renderComponentsRequest();
    renderTickets();
    renderKBDocuments();
    loadProfileData();

    // Refresh notification badge count after data updates
    renderNotifications();

    saveData();
}

renderAll();
