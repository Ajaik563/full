// Shared Front-end controller, Navigation systems, and database initialization

// Define default database structure
const DEFAULT_DATABASE = {
    currentUser: {
        username: "priya.sharma@rplms.com",
        name: "Dr. Priya Sharma",
        role: "Lab Incharge",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
        status: "Online",
        location: "Main Lab Complex",
        timezone: "IST (UTC+5:30)",
        email: "priya.sharma@rplms.com",
        phone: "+91 98765 43210"
    },

    teams: [
        { id: "TEAM-001", name: "Solar Car Project", leader: "Anil Mehta", membersCount: 8, activeProjects: 2, status: "Active" },
        { id: "TEAM-002", name: "Drone Flight Tech", leader: "Vikas Pillai", membersCount: 5, activeProjects: 1, status: "Active" },
        { id: "TEAM-003", name: "Bio-Sensor Systems", leader: "Sarah Khan", membersCount: 6, activeProjects: 2, status: "Active" },
        { id: "TEAM-004", name: "Haptic Arm Development", leader: "John Doe", membersCount: 4, activeProjects: 1, status: "Suspended" },
        { id: "TEAM-005", name: "Smart Irrigation System", leader: "Rajesh Kumar", membersCount: 7, activeProjects: 2, status: "Active" },
        { id: "TEAM-006", name: "Eco Waste sorter", leader: "Deepa Nair", membersCount: 6, activeProjects: 1, status: "Active" },
        { id: "TEAM-007", name: "VTOL UAV Propulsion", leader: "Karan Johar", membersCount: 9, activeProjects: 3, status: "Active" },
        { id: "TEAM-008", name: "3D Prosthetic Hand", leader: "Aditi Rao", membersCount: 5, activeProjects: 1, status: "Active" },
        { id: "TEAM-009", name: "Autonomous AGV", leader: "Sanjay Dutt", membersCount: 6, activeProjects: 2, status: "Active" },
        { id: "TEAM-010", name: "Water Purifier IoT", leader: "Rita Sen", membersCount: 4, activeProjects: 1, status: "Active" },
        { id: "TEAM-011", name: "Robotics Arm Team", leader: "Preeti Zinta", membersCount: 7, activeProjects: 2, status: "Active" },
        { id: "TEAM-012", name: "Smart Traffic Guard", leader: "Amir Khan", membersCount: 5, activeProjects: 1, status: "Active" },
        { id: "TEAM-013", name: "Ocean Cleaner Probe", leader: "Shruti Roy", membersCount: 8, activeProjects: 2, status: "Active" },
        { id: "TEAM-014", name: "RFID Warehouse Robot", leader: "Abhay Singh", membersCount: 6, activeProjects: 1, status: "Active" },
        { id: "TEAM-015", name: "Waste Management",         leader: "Nikhil Joshi",    membersCount: 7, activeProjects: 1, status: "Active" },
        { id: "TEAM-016", name: "Exoskeleton Suit",          leader: "Meera Iyer",      membersCount: 6, activeProjects: 2, status: "Active" },
        { id: "TEAM-017", name: "Nano Filtration Unit",      leader: "Arjun Verma",     membersCount: 5, activeProjects: 1, status: "Active" },
        { id: "TEAM-018", name: "AI Crop Monitor",           leader: "Pooja Reddy",     membersCount: 7, activeProjects: 2, status: "Active" },
        { id: "TEAM-019", name: "Swarm Robotics Lab",        leader: "Farhan Qureshi",  membersCount: 8, activeProjects: 3, status: "Active" },
        { id: "TEAM-020", name: "EV Charging Station",       leader: "Kavya Menon",     membersCount: 6, activeProjects: 1, status: "Active" },
        { id: "TEAM-021", name: "Underwater ROV",            leader: "Rohan Desai",     membersCount: 5, activeProjects: 2, status: "Active" }
    ],

    inventory: [
        { id: "EQ-001", name: "3D Printer", type: "Equipment", manufacturer: "Creality", model: "Ender-3 V2", serial: "CRL-3DV2-2024-1125", location: "Mechanical Lab", status: "Available", dateAdded: "2025-06-15", description: "FDM 3D printer used for rapid prototyping and model making." },
        { id: "EQ-002", name: "Arduino Uno R3", type: "Component", manufacturer: "Arduino", model: "Uno Rev 3", serial: "ARD-UNO-99382", location: "Electronics Lab", status: "Available", dateAdded: "2025-01-10", description: "Microcontroller board based on the ATmega328P." },
        { id: "EQ-003", name: "Ultrasonic Sensor", type: "Component", manufacturer: "Elegoo", model: "HC-SR04", serial: "EL-HC-2092", location: "Electronics Lab", status: "Available", dateAdded: "2025-02-14", description: "Ultrasonic distance sensor module." },
        { id: "EQ-004", name: "Soil Moisture Sensor", type: "Component", manufacturer: "Generic", model: "YL-69", serial: "GEN-YL-77291", location: "Bio Lab", status: "Available", dateAdded: "2025-03-01", description: "Resistance-based soil moisture measurement probe." },
        { id: "EQ-005", name: "CNC Milling Machine", type: "Equipment", manufacturer: "SainSmart", model: "Genmitsu 3018-PRO", serial: "CNC-GEN-8827", location: "Mechanical Lab", status: "Maintenance", dateAdded: "2025-04-18", description: "Desktop CNC router for wood, acrylic, and PCB engraving." },
        { id: "EQ-006", name: "Digital Oscilloscope", type: "Equipment", manufacturer: "Rigol", model: "DS1202Z-E", serial: "RIG-DS-44932", location: "Electronics Lab", status: "Available", dateAdded: "2025-02-28", description: "200 MHz, 2-channel digital storage oscilloscope." },
        { id: "EQ-007", name: "DC Motor 12V", type: "Component", manufacturer: "Generic", model: "RS-555", serial: "GEN-DC-38291", location: "Mechanical Lab", status: "Available", dateAdded: "2025-05-02", description: "High torque 12V DC motor." },
        { id: "EQ-008", name: "16x2 LCD Display", type: "Component", manufacturer: "Generic", model: "HD44780", serial: "GEN-LCD-10293", location: "Electronics Lab", status: "Available", dateAdded: "2025-03-12", description: "Alpha-numeric display module with purple backlight." },
        { id: "EQ-009", name: "Li-ion Battery 18650", type: "Component", manufacturer: "Samsung", model: "25R 2500mAh", serial: "SAM-186-8291", location: "Electronics Lab", status: "Available", dateAdded: "2025-04-05", description: "High-discharge rechargeable lithium-ion cell." },
        { id: "EQ-010", name: "Laser Cutter", type: "Equipment", manufacturer: "Ortur", model: "Laser Master 2 Pro", serial: "ORT-LM2-88271", location: "Mechanical Lab", status: "Available", dateAdded: "2025-05-20", description: "Diode laser engraving and cutting machine." },
        { id: "EQ-011", name: "Raspberry Pi 4", type: "Component", manufacturer: "Raspberry Pi", model: "Model B 8GB", serial: "RPi4-8G-0029", location: "Electronics Lab", status: "Available", dateAdded: "2025-01-16", description: "Single board computer with 8GB RAM." },
        { id: "EQ-012", name: "Soldering Station", type: "Equipment", manufacturer: "Hakko", model: "FX-888D", serial: "HAK-FX-2023", location: "Electronics Lab", status: "Available", dateAdded: "2025-02-05", description: "Digital soldering station with temperature control." },
        { id: "EQ-013", name: "Bench Multimeter", type: "Equipment", manufacturer: "Fluke", model: "8808A", serial: "FLU-88-82910", location: "Electronics Lab", status: "Available", dateAdded: "2025-03-24", description: "5.5 digit precision benchtop digital multimeter." },
        { id: "EQ-014", name: "Bipolar NEMA 17", type: "Component", manufacturer: "Stepperonline", model: "17HS19", serial: "STEP-N17-3829", location: "Mechanical Lab", status: "Available", dateAdded: "2025-04-11", description: "High-torque stepper motor for CNC/3D Printers." },
        { id: "EQ-015", name: "LiPo Battery 11.1V", type: "Component", manufacturer: "Tattu", model: "2200mAh 3S 45C", serial: "TAT-LIPO-223", location: "Electronics Lab", status: "Available", dateAdded: "2025-05-30", description: "Lithium polymer pack for drones and RC vehicles." },
        { id: "EQ-016", name: "Hot Air Rework Station", type: "Equipment", manufacturer: "Quick", model: "861DW", serial: "QUI-861-9021", location: "Electronics Lab", status: "Available", dateAdded: "2025-02-12", description: "1000W professional lead-free hot air rework station." },
        { id: "EQ-017", name: "PIR Motion Sensor", type: "Component", manufacturer: "Adafruit", model: "HC-SR501", serial: "ADA-PIR-3329", location: "Electronics Lab", status: "Available", dateAdded: "2025-03-10", description: "Pyroelectric infrared motion detection module." },
        { id: "EQ-018", name: "Variable DC Power Supply", type: "Equipment", manufacturer: "Korado", model: "KA3005D", serial: "KOR-PWR-3829", location: "Electronics Lab", status: "Available", dateAdded: "2025-02-22", description: "Precision programmable DC linear power supply, 30V/5A." },
        { id: "EQ-019", name: "3D Scanner", type: "Equipment", manufacturer: "EinScan", model: "SE V2", serial: "EIN-SCAN-4822", location: "Mechanical Lab", status: "Available", dateAdded: "2025-06-02", description: "Desktop white light 3D scanner for modeling." },
        { id: "EQ-020", name: "Co2 Laser Tube", type: "Component", manufacturer: "RECI", model: "W2 90W", serial: "REC-CO2-9902", location: "Mechanical Lab", status: "Repairing", dateAdded: "2025-05-15", description: "CO2 glass laser tube replacement part." }
    ],

    materialRequests: [
        { id: "REQ-001", teamId: "TEAM-001", teamName: "Solar Car Project",       item: "Li-ion Battery 18650",      qty: 24, status: "Approved", date: "2025-07-02" },
        { id: "REQ-002", teamId: "TEAM-005", teamName: "Smart Irrigation System",  item: "Soil Moisture Sensor",      qty: 5,  status: "Pending",  date: "2025-07-03" },
        { id: "REQ-003", teamId: "TEAM-003", teamName: "Bio-Sensor Systems",       item: "Arduino Uno R3",            qty: 3,  status: "Approved", date: "2025-07-01" },
        { id: "REQ-004", teamId: "TEAM-011", teamName: "Robotics Arm Team",        item: "DC Motor 12V",              qty: 6,  status: "Rejected", date: "2025-06-30" },
        { id: "REQ-005", teamId: "TEAM-002", teamName: "Drone Flight Tech",        item: "LiPo Battery 11.1V",        qty: 4,  status: "Pending",  date: "2025-07-03" },
        { id: "REQ-006", teamId: "TEAM-008", teamName: "3D Prosthetic Hand",       item: "Bipolar NEMA 17",           qty: 10, status: "Approved", date: "2025-06-28" },
        { id: "REQ-007", teamId: "TEAM-009", teamName: "Autonomous AGV",           item: "Arduino Uno R3",            qty: 2,  status: "Pending",  date: "2025-07-04" },
        { id: "REQ-008", teamId: "TEAM-015", teamName: "Waste Management",         item: "Ultrasonic Sensor",         qty: 4,  status: "Approved", date: "2025-06-27" },
        { id: "REQ-009", teamId: "TEAM-001", teamName: "Solar Car Project",        item: "Raspberry Pi 4",            qty: 2,  status: "Pending",  date: "2025-07-05" },
        { id: "REQ-010", teamId: "TEAM-002", teamName: "Drone Flight Tech",        item: "PIR Motion Sensor",         qty: 6,  status: "Approved", date: "2025-06-29" },
        { id: "REQ-011", teamId: "TEAM-003", teamName: "Bio-Sensor Systems",       item: "16x2 LCD Display",          qty: 4,  status: "Pending",  date: "2025-07-05" },
        { id: "REQ-012", teamId: "TEAM-004", teamName: "Haptic Arm Development",   item: "Bipolar NEMA 17",           qty: 3,  status: "Rejected", date: "2025-06-26" },
        { id: "REQ-013", teamId: "TEAM-005", teamName: "Smart Irrigation System",  item: "Arduino Uno R3",            qty: 5,  status: "Approved", date: "2025-07-01" },
        { id: "REQ-014", teamId: "TEAM-006", teamName: "Eco Waste Sorter",         item: "Raspberry Pi 4",            qty: 1,  status: "Pending",  date: "2025-07-04" },
        { id: "REQ-015", teamId: "TEAM-006", teamName: "Eco Waste Sorter",         item: "Ultrasonic Sensor",         qty: 8,  status: "Approved", date: "2025-06-30" },
        { id: "REQ-016", teamId: "TEAM-007", teamName: "VTOL UAV Propulsion",      item: "LiPo Battery 11.1V",        qty: 6,  status: "Approved", date: "2025-07-02" },
        { id: "REQ-017", teamId: "TEAM-007", teamName: "VTOL UAV Propulsion",      item: "DC Motor 12V",              qty: 4,  status: "Pending",  date: "2025-07-05" },
        { id: "REQ-018", teamId: "TEAM-008", teamName: "3D Prosthetic Hand",       item: "Li-ion Battery 18650",      qty: 8,  status: "Pending",  date: "2025-07-04" },
        { id: "REQ-019", teamId: "TEAM-009", teamName: "Autonomous AGV",           item: "PIR Motion Sensor",         qty: 5,  status: "Approved", date: "2025-06-28" },
        { id: "REQ-020", teamId: "TEAM-010", teamName: "Water Purifier IoT",       item: "Soil Moisture Sensor",      qty: 6,  status: "Approved", date: "2025-07-01" },
        { id: "REQ-021", teamId: "TEAM-010", teamName: "Water Purifier IoT",       item: "Arduino Uno R3",            qty: 2,  status: "Pending",  date: "2025-07-05" },
        { id: "REQ-022", teamId: "TEAM-011", teamName: "Robotics Arm Team",        item: "Bipolar NEMA 17",           qty: 8,  status: "Approved", date: "2025-07-03" },
        { id: "REQ-023", teamId: "TEAM-012", teamName: "Smart Traffic Guard",      item: "Raspberry Pi 4",            qty: 2,  status: "Approved", date: "2025-06-29" },
        { id: "REQ-024", teamId: "TEAM-012", teamName: "Smart Traffic Guard",      item: "PIR Motion Sensor",         qty: 10, status: "Pending",  date: "2025-07-04" },
        { id: "REQ-025", teamId: "TEAM-013", teamName: "Ocean Cleaner Probe",      item: "DC Motor 12V",              qty: 3,  status: "Approved", date: "2025-07-02" },
        { id: "REQ-026", teamId: "TEAM-013", teamName: "Ocean Cleaner Probe",      item: "Li-ion Battery 18650",      qty: 12, status: "Pending",  date: "2025-07-05" },
        { id: "REQ-027", teamId: "TEAM-014", teamName: "RFID Warehouse Robot",     item: "Arduino Uno R3",            qty: 4,  status: "Approved", date: "2025-06-30" },
        { id: "REQ-028", teamId: "TEAM-014", teamName: "RFID Warehouse Robot",     item: "16x2 LCD Display",          qty: 6,  status: "Rejected", date: "2025-06-27" },
        { id: "REQ-029", teamId: "TEAM-015", teamName: "Waste Management",         item: "Soil Moisture Sensor",      qty: 5,  status: "Pending",  date: "2025-07-03" },
        { id: "REQ-030", teamId: "TEAM-004", teamName: "Haptic Arm Development",   item: "16x2 LCD Display",          qty: 2,  status: "Pending",  date: "2025-07-05" },
        { id: "REQ-031", teamId: "TEAM-016", teamName: "Exoskeleton Suit",          item: "Bipolar NEMA 17",           qty: 6,  status: "Approved", date: "2025-07-03" },
        { id: "REQ-032", teamId: "TEAM-016", teamName: "Exoskeleton Suit",          item: "Arduino Uno R3",            qty: 3,  status: "Pending",  date: "2025-07-06" },
        { id: "REQ-033", teamId: "TEAM-017", teamName: "Nano Filtration Unit",      item: "Soil Moisture Sensor",      qty: 8,  status: "Approved", date: "2025-07-02" },
        { id: "REQ-034", teamId: "TEAM-017", teamName: "Nano Filtration Unit",      item: "DC Motor 12V",              qty: 2,  status: "Pending",  date: "2025-07-06" },
        { id: "REQ-035", teamId: "TEAM-018", teamName: "AI Crop Monitor",           item: "Raspberry Pi 4",            qty: 3,  status: "Approved", date: "2025-07-04" },
        { id: "REQ-036", teamId: "TEAM-018", teamName: "AI Crop Monitor",           item: "PIR Motion Sensor",         qty: 6,  status: "Pending",  date: "2025-07-06" },
        { id: "REQ-037", teamId: "TEAM-019", teamName: "Swarm Robotics Lab",        item: "Arduino Uno R3",            qty: 8,  status: "Approved", date: "2025-07-03" },
        { id: "REQ-038", teamId: "TEAM-019", teamName: "Swarm Robotics Lab",        item: "LiPo Battery 11.1V",        qty: 5,  status: "Pending",  date: "2025-07-06" },
        { id: "REQ-039", teamId: "TEAM-020", teamName: "EV Charging Station",       item: "Li-ion Battery 18650",      qty: 20, status: "Approved", date: "2025-07-04" },
        { id: "REQ-040", teamId: "TEAM-020", teamName: "EV Charging Station",       item: "Variable DC Power Supply",  qty: 1,  status: "Pending",  date: "2025-07-06" },
        { id: "REQ-041", teamId: "TEAM-021", teamName: "Underwater ROV",            item: "DC Motor 12V",              qty: 4,  status: "Approved", date: "2025-07-03" },
        { id: "REQ-042", teamId: "TEAM-021", teamName: "Underwater ROV",            item: "Raspberry Pi 4",            qty: 2,  status: "Pending",  date: "2025-07-06" }
    ],

    materialReturns: [
        { id: "RET-001", teamId: "TEAM-001", teamName: "Solar Car Project",       item: "Digital Oscilloscope",       qty: 1, status: "Returned",  date: "2025-07-01" },
        { id: "RET-002", teamId: "TEAM-003", teamName: "Bio-Sensor Systems",       item: "Bench Multimeter",            qty: 1, status: "Overdue",   date: "2025-06-25" },
        { id: "RET-003", teamId: "TEAM-005", teamName: "Smart Irrigation System",  item: "Soldering Station",           qty: 2, status: "Assigned",  date: "2025-07-15" },
        { id: "RET-004", teamId: "TEAM-011", teamName: "Robotics Arm Team",        item: "Variable DC Power Supply",    qty: 1, status: "Assigned",  date: "2025-07-12" },
        { id: "RET-005", teamId: "TEAM-002", teamName: "Drone Flight Tech",        item: "Soldering Station",           qty: 1, status: "Returned",  date: "2025-07-02" },
        { id: "RET-006", teamId: "TEAM-013", teamName: "Ocean Cleaner Probe",      item: "Bench Multimeter",            qty: 1, status: "Assigned",  date: "2025-07-14" },
        { id: "RET-007", teamId: "TEAM-001", teamName: "Solar Car Project",        item: "Laser Cutter",                qty: 1, status: "Assigned",  date: "2025-07-13" },
        { id: "RET-008", teamId: "TEAM-001", teamName: "Solar Car Project",        item: "3D Printer",                  qty: 1, status: "Overdue",   date: "2025-06-28" },
        { id: "RET-009", teamId: "TEAM-002", teamName: "Drone Flight Tech",        item: "Digital Oscilloscope",        qty: 1, status: "Assigned",  date: "2025-07-11" },
        { id: "RET-010", teamId: "TEAM-002", teamName: "Drone Flight Tech",        item: "Hot Air Rework Station",      qty: 1, status: "Overdue",   date: "2025-06-24" },
        { id: "RET-011", teamId: "TEAM-003", teamName: "Bio-Sensor Systems",       item: "Soldering Station",           qty: 1, status: "Assigned",  date: "2025-07-10" },
        { id: "RET-012", teamId: "TEAM-003", teamName: "Bio-Sensor Systems",       item: "Variable DC Power Supply",    qty: 1, status: "Returned",  date: "2025-07-03" },
        { id: "RET-013", teamId: "TEAM-004", teamName: "Haptic Arm Development",   item: "Bench Multimeter",            qty: 1, status: "Overdue",   date: "2025-06-22" },
        { id: "RET-014", teamId: "TEAM-005", teamName: "Smart Irrigation System",  item: "Digital Oscilloscope",        qty: 1, status: "Returned",  date: "2025-07-04" },
        { id: "RET-015", teamId: "TEAM-005", teamName: "Smart Irrigation System",  item: "3D Printer",                  qty: 1, status: "Assigned",  date: "2025-07-16" },
        { id: "RET-016", teamId: "TEAM-006", teamName: "Eco Waste Sorter",         item: "Laser Cutter",                qty: 1, status: "Assigned",  date: "2025-07-09" },
        { id: "RET-017", teamId: "TEAM-006", teamName: "Eco Waste Sorter",         item: "Soldering Station",           qty: 1, status: "Overdue",   date: "2025-06-26" },
        { id: "RET-018", teamId: "TEAM-007", teamName: "VTOL UAV Propulsion",      item: "CNC Milling Machine",         qty: 1, status: "Assigned",  date: "2025-07-18" },
        { id: "RET-019", teamId: "TEAM-007", teamName: "VTOL UAV Propulsion",      item: "3D Scanner",                  qty: 1, status: "Returned",  date: "2025-07-05" },
        { id: "RET-020", teamId: "TEAM-007", teamName: "VTOL UAV Propulsion",      item: "Hot Air Rework Station",      qty: 1, status: "Overdue",   date: "2025-06-23" },
        { id: "RET-021", teamId: "TEAM-008", teamName: "3D Prosthetic Hand",       item: "3D Printer",                  qty: 1, status: "Assigned",  date: "2025-07-10" },
        { id: "RET-022", teamId: "TEAM-008", teamName: "3D Prosthetic Hand",       item: "Soldering Station",           qty: 1, status: "Returned",  date: "2025-07-01" },
        { id: "RET-023", teamId: "TEAM-009", teamName: "Autonomous AGV",           item: "Laser Cutter",                qty: 1, status: "Assigned",  date: "2025-07-12" },
        { id: "RET-024", teamId: "TEAM-009", teamName: "Autonomous AGV",           item: "Variable DC Power Supply",    qty: 1, status: "Overdue",   date: "2025-06-27" },
        { id: "RET-025", teamId: "TEAM-010", teamName: "Water Purifier IoT",       item: "Bench Multimeter",            qty: 1, status: "Assigned",  date: "2025-07-11" },
        { id: "RET-026", teamId: "TEAM-010", teamName: "Water Purifier IoT",       item: "Soldering Station",           qty: 1, status: "Returned",  date: "2025-07-02" },
        { id: "RET-027", teamId: "TEAM-011", teamName: "Robotics Arm Team",        item: "Digital Oscilloscope",        qty: 1, status: "Overdue",   date: "2025-06-29" },
        { id: "RET-028", teamId: "TEAM-012", teamName: "Smart Traffic Guard",      item: "3D Printer",                  qty: 1, status: "Assigned",  date: "2025-07-14" },
        { id: "RET-029", teamId: "TEAM-012", teamName: "Smart Traffic Guard",      item: "Bench Multimeter",            qty: 1, status: "Returned",  date: "2025-07-03" },
        { id: "RET-030", teamId: "TEAM-013", teamName: "Ocean Cleaner Probe",      item: "Laser Cutter",                qty: 1, status: "Overdue",   date: "2025-06-30" },
        { id: "RET-031", teamId: "TEAM-014", teamName: "RFID Warehouse Robot",     item: "Variable DC Power Supply",    qty: 1, status: "Assigned",  date: "2025-07-13" },
        { id: "RET-032", teamId: "TEAM-014", teamName: "RFID Warehouse Robot",     item: "Digital Oscilloscope",        qty: 1, status: "Returned",  date: "2025-07-04" },
        { id: "RET-033", teamId: "TEAM-015", teamName: "Waste Management",         item: "Soldering Station",           qty: 1, status: "Assigned",  date: "2025-07-15" },
        { id: "RET-034", teamId: "TEAM-015", teamName: "Waste Management",         item: "Hot Air Rework Station",      qty: 1, status: "Overdue",   date: "2025-06-25" },
        { id: "RET-035", teamId: "TEAM-016", teamName: "Exoskeleton Suit",          item: "Variable DC Power Supply",    qty: 1, status: "Assigned",  date: "2025-07-16" },
        { id: "RET-036", teamId: "TEAM-016", teamName: "Exoskeleton Suit",          item: "Soldering Station",           qty: 1, status: "Overdue",   date: "2025-06-28" },
        { id: "RET-037", teamId: "TEAM-017", teamName: "Nano Filtration Unit",      item: "Bench Multimeter",            qty: 1, status: "Assigned",  date: "2025-07-14" },
        { id: "RET-038", teamId: "TEAM-017", teamName: "Nano Filtration Unit",      item: "Digital Oscilloscope",        qty: 1, status: "Returned",  date: "2025-07-03" },
        { id: "RET-039", teamId: "TEAM-018", teamName: "AI Crop Monitor",           item: "3D Printer",                  qty: 1, status: "Assigned",  date: "2025-07-17" },
        { id: "RET-040", teamId: "TEAM-018", teamName: "AI Crop Monitor",           item: "Laser Cutter",                qty: 1, status: "Overdue",   date: "2025-06-27" },
        { id: "RET-041", teamId: "TEAM-019", teamName: "Swarm Robotics Lab",        item: "Soldering Station",           qty: 1, status: "Assigned",  date: "2025-07-15" },
        { id: "RET-042", teamId: "TEAM-019", teamName: "Swarm Robotics Lab",        item: "Hot Air Rework Station",      qty: 1, status: "Overdue",   date: "2025-06-26" },
        { id: "RET-043", teamId: "TEAM-020", teamName: "EV Charging Station",       item: "Variable DC Power Supply",    qty: 1, status: "Assigned",  date: "2025-07-13" },
        { id: "RET-044", teamId: "TEAM-020", teamName: "EV Charging Station",       item: "Bench Multimeter",            qty: 1, status: "Returned",  date: "2025-07-04" },
        { id: "RET-045", teamId: "TEAM-021", teamName: "Underwater ROV",            item: "Digital Oscilloscope",        qty: 1, status: "Assigned",  date: "2025-07-16" },
        { id: "RET-046", teamId: "TEAM-021", teamName: "Underwater ROV",            item: "Soldering Station",           qty: 1, status: "Overdue",   date: "2025-06-29" }
    ],

    tickets: [
        {
            id: "TKT-001", type: "Procurement", assignedTo: "Administrator", subject: "Low Stock Components", priority: "High", date: "04 Jul 2025", status: "Open", assigneeRole: "System Admin", raisedBy: "Dr. Priya Sharma", time: "10:15 AM", reason: "Multiple inventory components have reached the minimum stock level. Procurement approval is requested to maintain smooth lab operations.", items: [
                { name: "Arduino Uno R3", qty: "05", min: "10" },
                { name: "Soil Moisture Sensor", qty: "02", min: "05" },
                { name: "16x2 LCD Display", qty: "03", min: "05" },
                { name: "DC Motor 12V", qty: "01", min: "03" },
                { name: "Li-ion Battery 18650", qty: "04", min: "10" }
            ], adminResponse: ""
        },

        { id: "TKT-002", type: "Damage", assignedTo: "TEAM-005", subject: "Arduino Uno R3 Damaged", priority: "Medium", date: "03 Jul 2025", status: "Pending", teamName: "Smart Irrigation System", equipmentName: "Arduino Uno R3", raisedBy: "Lab Incharge", time: "02:15 PM", damageDescription: "USB port is physically damaged during project testing.", fineAmount: "500", dueDate: "10 Jul 2025", remarks: "Fine to be paid by the team before next material issue.", teamResponse: "", lastUpdated: "03 Jul 2025, 02:15 PM" },

        { id: "TKT-003", type: "Damage", assignedTo: "TEAM-011", subject: "DC Motor 12V Broken", priority: "High", date: "02 Jul 2025", status: "In Progress", teamName: "Robotics Arm", equipmentName: "DC Motor 12V", raisedBy: "Lab Incharge", time: "11:30 AM", damageDescription: "Motor coil burned out due to overloading.", fineAmount: "300", dueDate: "09 Jul 2025", remarks: "Replacement motor cost.", teamResponse: "We have received the notice. Discussing with team leader.", lastUpdated: "02 Jul 2025, 03:00 PM" },

        {
            id: "TKT-004", type: "Procurement", assignedTo: "Administrator", subject: "Request for Additional Sensors", priority: "Medium", date: "01 Jul 2025", status: "In Progress", assigneeRole: "System Admin", raisedBy: "Dr. Priya Sharma", time: "09:45 AM", reason: "Additional sensors needed for upcoming workshop.", items: [
                { name: "Ultrasonic Sensor", qty: "15", min: "05" },
                { name: "PIR Motion Sensor", qty: "20", min: "05" }
            ], adminResponse: "Quotation requested from vendor."
        },

        { id: "TKT-005", type: "Damage", assignedTo: "TEAM-008", subject: "16x2 LCD Display Cracked", priority: "Low", date: "30 Jun 2025", status: "Resolved", teamName: "3D Prosthetic Hand", equipmentName: "16x2 LCD Display", raisedBy: "Lab Incharge", time: "04:00 PM", damageDescription: "Screen cracked during mechanical assembly mounting.", fineAmount: "150", dueDate: "07 Jul 2025", remarks: "Standard replacement fine.", teamResponse: "Fine paid. Receipt number #88271.", lastUpdated: "01 Jul 2025, 10:20 AM" },

        {
            id: "TKT-006", type: "Procurement", assignedTo: "Administrator", subject: "Low Stock - Batteries", priority: "High", date: "29 Jun 2025", status: "Resolved", assigneeRole: "System Admin", raisedBy: "Dr. Priya Sharma", time: "11:20 AM", reason: "Li-ion Battery stock critically low.", items: [
                { name: "Li-ion Battery 18650", qty: "02", min: "10" }
            ], adminResponse: "PO Issued. Delivery expected by next week."
        },

        { id: "TKT-007", type: "Damage", assignedTo: "TEAM-015", subject: "Soil Moisture Sensor Damaged", priority: "Medium", date: "28 Jun 2025", status: "Open", teamName: "Waste Management", equipmentName: "Soil Moisture Sensor", raisedBy: "Lab Incharge", time: "10:00 AM", damageDescription: "Corrosion due to extended water immersion test without waterproofing cover.", fineAmount: "200", dueDate: "05 Jul 2025", remarks: "Cost of sensor replacement.", teamResponse: "", lastUpdated: "28 Jun 2025, 10:00 AM" }
    ]
};

// Generate dummy data up to 32 items for tickets
function fillRemainingTickets() {
    const types = ["Procurement", "Damage"];
    const priorities = ["High", "Medium", "Low"];
    const statuses = ["Open", "Pending", "In Progress", "Resolved"];
    const asignees = [
        { name: "TEAM-006", desc: "Eco Waste sorter" },
        { name: "TEAM-001", desc: "Solar Car Project" },
        { name: "Administrator", desc: "System Admin" },
        { name: "TEAM-002", desc: "Drone Flight Tech" },
        { name: "TEAM-003", desc: "Bio-Sensor Systems" }
    ];
    const equipment = ["Arduino Uno R3", "3D Printer", "CNC Milling Machine", "Digital Oscilloscope", "Raspberry Pi 4"];
    const dates = ["27 Jun 2025", "26 Jun 2025", "25 Jun 2025", "24 Jun 2025", "23 Jun 2025", "22 Jun 2025", "21 Jun 2025", "20 Jun 2025"];

    let baseId = 8;
    while (DEFAULT_DATABASE.tickets.length < 32) {
        const type = types[Math.floor(Math.random() * types.length)];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const date = dates[Math.floor(Math.random() * dates.length)];
        const id = `TKT-${String(baseId).padStart(3, '0')}`;
        baseId++;

        if (type === "Procurement") {
            DEFAULT_DATABASE.tickets.push({
                id,
                type,
                assignedTo: "Administrator",
                subject: `Refocking ${equipment[Math.floor(Math.random() * equipment.length)]}s`,
                priority,
                date,
                status,
                assigneeRole: "System Admin",
                raisedBy: "Dr. Priya Sharma",
                time: "02:00 PM",
                reason: "Stock replenishment request.",
                items: [
                    { name: "Item Replacements", qty: "02", min: "05" }
                ],
                adminResponse: status === "Resolved" ? "Request processed." : ""
            });
        } else {
            const teamIdx = Math.floor(Math.random() * asignees.length);
            DEFAULT_DATABASE.tickets.push({
                id,
                type,
                assignedTo: asignees[teamIdx].name,
                subject: `${equipment[Math.floor(Math.random() * equipment.length)]} Damaged`,
                priority,
                date,
                status,
                teamName: asignees[teamIdx].desc,
                equipmentName: equipment[Math.floor(Math.random() * equipment.length)],
                raisedBy: "Lab Incharge",
                time: "11:00 AM",
                damageDescription: "Physical structural damage observed post usage.",
                fineAmount: "450",
                dueDate: "12 Jul 2025",
                remarks: "Please deposit the replacement fine.",
                teamResponse: status === "Resolved" ? "Fine cleared." : "",
                lastUpdated: `${date}, 11:30 AM`
            });
        }
    }
}
fillRemainingTickets();

// Initialize LocalStorage database
const DB_VERSION = 6;
function initLocalStorageDB() {
    const storedVersion = parseInt(localStorage.getItem("rplms_db_version") || "0");
    if (storedVersion < DB_VERSION) {
        localStorage.setItem("rplms_db", JSON.stringify(DEFAULT_DATABASE));
        localStorage.setItem("rplms_db_version", String(DB_VERSION));
    }
}
initLocalStorageDB();

// Read DB helper
function getDB() {
    return JSON.parse(localStorage.getItem("rplms_db")) || DEFAULT_DATABASE;
}

// Write DB helper
function setDB(db) {
    localStorage.setItem("rplms_db", JSON.stringify(db));
}

// Check logged in state (Bypassed to keep user auto-logged in)
function checkAuth() {
    if (!localStorage.getItem("rplms_logged_in")) {
        localStorage.setItem("rplms_logged_in", "true");
    }
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "login.html") {
        window.location.href = "index.html";
    }
}
checkAuth();

// --- Sidebar & Layout Builder ---
function renderBaseLayout(activeMenu) {
    const db = getDB();
    const user = db.currentUser;

    // RENDER SIDEBAR
    const sidebarEl = document.querySelector(".sidebar");
    if (sidebarEl) {
        sidebarEl.innerHTML = `
      <div class="sidebar-top">
        <div class="logo-container">
          <div class="logo-icon">&#11021;</div>
          <div class="logo-text">
            <span class="logo-title">RPLMS</span>
            <span class="logo-subtitle">Lab Incharge</span>
          </div>
        </div>
        <ul class="nav-links">
          <li class="nav-item ${activeMenu === 'dashboard' ? 'active' : ''}"><a href="index.html"><span class="icon">&#8862;</span> Dashboard</a></li>
          <li class="nav-item ${activeMenu === 'teams' ? 'active' : ''}"><a href="teams.html"><span class="icon">&#9750;</span> Lab Workspaces</a></li>
          <li class="nav-item ${activeMenu === 'inventory' ? 'active' : ''}"><a href="inventory.html"><span class="icon">&#10065;</span> Inventory Management</a></li>
          <li class="nav-item ${activeMenu === 'material-requests' ? 'active' : ''}"><a href="material-requests.html"><span class="icon">&#9998;</span> Component Requests</a></li>
          <li class="nav-item ${activeMenu === 'material-returns' ? 'active' : ''}"><a href="material-returns.html"><span class="icon">&#8635;</span> Component Returns</a></li>
          <li class="nav-item ${activeMenu === 'equipment-tracking' ? 'active' : ''}"><a href="equipment-tracking.html"><span class="icon">&#10034;</span> Equipment Tracking</a></li>
          <li class="nav-item ${activeMenu === 'tickets' ? 'active' : ''}"><a href="tickets.html"><span class="icon">&#9993;</span> Tickets</a></li>
          <li class="nav-item ${activeMenu === 'profile' ? 'active' : ''}"><a href="profile.html"><span class="icon">&#9786;</span> Profile</a></li>
        </ul>
      </div>
      <div class="sidebar-bottom">
        <a class="user-profile-widget" href="profile.html">
          <div class="user-profile-details">
            <img class="user-avatar" src="${user.avatar}" alt="Avatar">
            <div class="user-info">
              <span class="user-name">${user.name}</span>
              <span class="user-role">${user.role}</span>
              <span class="user-status"><span class="user-status-dot"></span> Online</span>
            </div>
          </div>
          <span class="profile-arrow">&#9662;</span>
        </a>
        <ul class="logout-nav">
          <li class="nav-item"><a href="#" id="sidebarLogoutLink"><span class="icon">&#10150;</span> Logout</a></li>
        </ul>
        <div class="weather-widget">
          <div class="weather-icon">&#9729;</div>
          <div class="weather-info">
            <span class="weather-temp">Rainy days ahead</span>
            <span class="weather-desc">27&deg;C</span>
          </div>
        </div>
      </div>
    `;

        // Attach logout click
        const logoutBtn = document.getElementById("sidebarLogoutLink");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function (e) {
                e.preventDefault();
                showLogoutConfirmation();
            });
        }
    }

    // RENDER HEADER ELEMENTS (Optional dynamically if elements present)
    // Let's dynamically insert current date and notification badge count if elements exist
    const dateWidget = document.querySelector(".header-date-widget");
    if (dateWidget) {
        // Current date format: 02 Jul 2025
        const today = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedDate = `${String(today.getDate()).padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`;
        dateWidget.innerHTML = `&#128197; &nbsp; ${formattedDate}`;
    }
}

// Custom Toast notification loader
function showToast(message, type = "success") {
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let icon = "&#10003;";
    if (type === "error") icon = "&#9888;";
    if (type === "warn") icon = "&#9757;";
    if (type === "info") icon = "&#8505;";

    toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    </div>
    <button class="toast-close">&times;</button>
  `;

    container.appendChild(toast);

    // Trigger show layout
    setTimeout(() => toast.classList.add("show"), 10);

    // Auto remove after 4 seconds
    const autoClose = setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 4000);

    // Close button trigger
    toast.querySelector(".toast-close").addEventListener("click", () => {
        clearTimeout(autoClose);
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    });
}

// Confirmation Popups Setup
function createConfirmationModal(title, bodyText, confirmCallback, confirmText = "Confirm", isDanger = false) {
    // Check if confirmation modal backdrop already exists
    let backdrop = document.getElementById("confirmModalBackdrop");
    if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.id = "confirmModalBackdrop";
        backdrop.className = "modal-backdrop";
        document.body.appendChild(backdrop);
    }

    backdrop.innerHTML = `
    <div class="modal-container" style="max-width: 420px;">
      <div class="modal-header" style="padding: 20px 24px;">
        <div class="modal-header-left">
          <div class="circle-icon-wrapper ${isDanger ? 'red-alert' : 'blue-info'}" style="width: 40px; height: 40px; font-size: 16px;">
            ${isDanger ? '&#9888;' : '&#8505;'}
          </div>
          <div class="card-header-text">
            <span class="card-title">${title}</span>
          </div>
        </div>
        <button class="modal-close-btn" id="confirmModalClose">&times;</button>
      </div>
      <div class="modal-body" style="padding: 20px 24px; font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
        ${bodyText}
      </div>
      <div class="modal-footer" style="padding: 12px 24px;">
        <button class="btn btn-secondary" id="confirmCancelBtn" style="padding: 8px 16px; font-size: 12px;">Cancel</button>
        <button class="btn ${isDanger ? 'btn-danger' : 'btn-primary'}" id="confirmConfirmBtn" style="padding: 8px 16px; font-size: 12px;">${confirmText}</button>
      </div>
    </div>
  `;

    // Escape key handler
    const escapeHandler = function (e) {
        if (e.key === "Escape") {
            closeConfirm();
        }
    };

    function openConfirm() {
        backdrop.classList.add("show");
        document.addEventListener("keydown", escapeHandler);
    }

    function closeConfirm() {
        backdrop.classList.remove("show");
        document.removeEventListener("keydown", escapeHandler);
        setTimeout(() => backdrop.remove(), 300);
    }

    // Bind cancel actions
    backdrop.querySelector("#confirmModalClose").addEventListener("click", closeConfirm);
    backdrop.querySelector("#confirmCancelBtn").addEventListener("click", closeConfirm);
    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeConfirm();
    });

    // Bind confirm action
    backdrop.querySelector("#confirmConfirmBtn").addEventListener("click", () => {
        confirmCallback();
        closeConfirm();
    });

    openConfirm();
}

// Show standard logout confirmation modal
function showLogoutConfirmation() {
    createConfirmationModal(
        "Confirm Logout",
        "Are you sure you want to sign out of the system?",
        () => {
            localStorage.removeItem("rplms_logged_in");
            showToast("Logged out successfully (redirecting to login...)", "info");
            setTimeout(() => {
                window.location.href = "../../../login1.html";
            }, 1000);
        },
        "Logout",
        true
    );
}

// Debounce search inputs helper
function debounce(func, delay = 300) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Escape inputs to prevent XSS
function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>"']/g, function (match) {
        switch (match) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#39;';
        }
    });
}

// Basic SQL injection keyword check
function hasSqlInfectionRisk(str) {
    if (typeof str !== 'string') return false;
    const sqlRegex = /\b(select|insert|update|delete|drop|alter|union|where|exec|truncate)\b/gi;
    return sqlRegex.test(str);
}
