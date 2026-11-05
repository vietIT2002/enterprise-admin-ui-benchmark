export type EquipmentStatus = "operational" | "maintenance" | "fault" | "offline"

export type Equipment = {
  id: string
  name: string
  type: string
  location: string
  status: EquipmentStatus
  lastService: string // ISO date
  nextInspection: string // ISO date
}

export const REFERENCE_DATE = "2026-11-05"

export const statusLabel: Record<EquipmentStatus, string> = {
  operational: "Operational",
  maintenance: "In maintenance",
  fault: "Fault",
  offline: "Offline",
}

export const equipment: Equipment[] = [
  { id: "EQ-1001", name: "CNC Milling Machine M-12", type: "CNC", location: "Plant 1 / Line A", status: "operational", lastService: "2026-09-18", nextInspection: "2026-12-18" },
  { id: "EQ-1002", name: "CNC Lathe L-04", type: "CNC", location: "Plant 1 / Line A", status: "operational", lastService: "2026-08-27", nextInspection: "2026-11-27" },
  { id: "EQ-1003", name: "Hydraulic Press HP-250", type: "Press", location: "Plant 1 / Line B", status: "fault", lastService: "2026-07-09", nextInspection: "2026-11-02" },
  { id: "EQ-1004", name: "Robotic Welding Cell W-03", type: "Welding", location: "Plant 1 / Line C", status: "operational", lastService: "2026-10-06", nextInspection: "2027-01-06" },
  { id: "EQ-1005", name: "Conveyor Belt CB-07", type: "Conveyor", location: "Plant 1 / Packaging", status: "maintenance", lastService: "2026-11-04", nextInspection: "2026-11-11" },
  { id: "EQ-1006", name: "Air Compressor AC-02", type: "Utility", location: "Plant 1 / Utility Room", status: "operational", lastService: "2026-10-14", nextInspection: "2026-11-14" },
  { id: "EQ-2001", name: "Injection Moulder IM-500", type: "Moulding", location: "Plant 2 / Hall 1", status: "operational", lastService: "2026-09-02", nextInspection: "2026-12-02" },
  { id: "EQ-2002", name: "Injection Moulder IM-320", type: "Moulding", location: "Plant 2 / Hall 1", status: "offline", lastService: "2026-05-21", nextInspection: "2026-10-30" },
  { id: "EQ-2003", name: "Industrial Chiller CH-01", type: "Utility", location: "Plant 2 / Roof", status: "operational", lastService: "2026-10-01", nextInspection: "2027-01-01" },
  { id: "EQ-2004", name: "Laser Cutter LC-6", type: "Cutting", location: "Plant 2 / Hall 2", status: "maintenance", lastService: "2026-11-03", nextInspection: "2026-11-10" },
  { id: "EQ-2005", name: "Paint Booth PB-2", type: "Finishing", location: "Plant 2 / Hall 2", status: "operational", lastService: "2026-08-12", nextInspection: "2026-11-12" },
  { id: "EQ-3001", name: "Forklift FL-14 (electric)", type: "Vehicle", location: "Warehouse / Dock 3", status: "operational", lastService: "2026-09-25", nextInspection: "2026-12-25" },
  { id: "EQ-3002", name: "Overhead Crane OC-5T", type: "Lifting", location: "Warehouse / Bay 2", status: "operational", lastService: "2026-06-30", nextInspection: "2026-11-30" },
  { id: "EQ-3003", name: "Pallet Wrapper PW-01", type: "Packaging", location: "Warehouse / Dock 1", status: "fault", lastService: "2026-10-20", nextInspection: "2026-11-08" },
  { id: "EQ-4001", name: "Coordinate Measuring Machine CMM-1", type: "Inspection", location: "Quality Lab", status: "operational", lastService: "2026-10-22", nextInspection: "2027-04-22" },
  { id: "EQ-4002", name: "Backup Generator GN-750", type: "Power", location: "Plant 1 / Yard", status: "operational", lastService: "2026-07-15", nextInspection: "2027-01-15" },
]
