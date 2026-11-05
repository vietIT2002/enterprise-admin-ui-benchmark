export type MachineStatus = "operational" | "idle" | "maintenance" | "down"

export type Machine = {
  id: string
  name: string
  area: string
  bay: string
  status: MachineStatus
  /** Calendar day, YYYY-MM-DD */
  lastService: string
  /** Calendar day, YYYY-MM-DD */
  nextInspection: string
}

/** Reference day for the mock data (calendar day, UTC). */
export const TODAY = "2026-11-05"
export const DUE_SOON_DAYS = 14

export const STATUS_LABEL: Record<MachineStatus, string> = {
  operational: "Operational",
  idle: "Idle",
  maintenance: "Under maintenance",
  down: "Down",
}

export const STATUS_ORDER: MachineStatus[] = ["operational", "idle", "maintenance", "down"]

export const AREAS = [
  "Press shop",
  "CNC hall",
  "Assembly",
  "Paint shop",
  "Packaging",
  "Utilities",
  "Warehouse",
] as const

type Row = [string, string, string, string, MachineStatus, string, string]

const rows: Row[] = [
  ["EQ-1001", "Hydraulic press HP-400", "Press shop", "Bay 1", "operational", "2026-09-14", "2026-12-14"],
  ["EQ-1002", "Hydraulic press HP-400", "Press shop", "Bay 2", "down", "2026-08-02", "2026-10-28"],
  ["EQ-1003", "Stamping press SP-250", "Press shop", "Bay 3", "operational", "2026-10-06", "2027-01-06"],
  ["EQ-1004", "Stamping press SP-250", "Press shop", "Bay 4", "maintenance", "2026-11-04", "2026-11-18"],
  ["EQ-1005", "Coil feeder CF-12", "Press shop", "Bay 1", "operational", "2026-07-21", "2026-11-09"],
  ["EQ-1006", "Overhead crane OC-5T", "Press shop", "Gantry", "operational", "2026-06-30", "2026-10-30"],
  ["EQ-1010", "CNC mill DMG 5X", "CNC hall", "Cell 1", "operational", "2026-10-12", "2027-01-12"],
  ["EQ-1011", "CNC mill DMG 5X", "CNC hall", "Cell 2", "operational", "2026-09-28", "2026-12-28"],
  ["EQ-1012", "CNC lathe Mazak QT-250", "CNC hall", "Cell 3", "operational", "2026-08-19", "2026-11-19"],
  ["EQ-1013", "CNC lathe Mazak QT-250", "CNC hall", "Cell 4", "idle", "2026-07-08", "2026-11-08"],
  ["EQ-1014", "Surface grinder Okamoto 63", "CNC hall", "Cell 5", "operational", "2026-10-20", "2027-04-20"],
  ["EQ-1015", "Coordinate measuring machine", "CNC hall", "Metrology", "operational", "2026-10-01", "2026-12-01"],
  ["EQ-1016", "Wire EDM Sodick AG600", "CNC hall", "Cell 6", "maintenance", "2026-11-03", "2026-11-24"],
  ["EQ-1020", "Robotic welder Fanuc R-2000", "Assembly", "Line 1, station 2", "operational", "2026-10-15", "2027-01-15"],
  ["EQ-1021", "Robotic welder Fanuc R-2000", "Assembly", "Line 1, station 3", "operational", "2026-09-02", "2026-11-02"],
  ["EQ-1022", "Conveyor CV-A1", "Assembly", "Line 1", "operational", "2026-08-30", "2026-11-30"],
  ["EQ-1023", "Torque station TS-40", "Assembly", "Line 1", "operational", "2026-10-27", "2027-01-27"],
  ["EQ-1024", "Robotic welder Fanuc R-2000", "Assembly", "Line 2, station 1", "down", "2026-09-09", "2026-11-11"],
  ["EQ-1025", "Conveyor CV-B1", "Assembly", "Line 2", "operational", "2026-07-17", "2026-10-17"],
  ["EQ-1026", "Leak test bench LT-3", "Assembly", "Line 2", "operational", "2026-10-08", "2027-04-08"],
  ["EQ-1027", "Screwdriving robot Epson T6", "Assembly", "Line 2", "idle", "2026-06-12", "2026-12-12"],
  ["EQ-1030", "Powder coat booth PC-2", "Paint shop", "Booth 2", "operational", "2026-09-22", "2026-12-22"],
  ["EQ-1031", "Curing oven CO-6", "Paint shop", "Oven hall", "operational", "2026-10-03", "2026-11-17"],
  ["EQ-1032", "Pre-treatment line", "Paint shop", "Tank hall", "maintenance", "2026-11-02", "2026-11-12"],
  ["EQ-1033", "Spray robot ABB IRB 5500", "Paint shop", "Booth 1", "operational", "2026-08-11", "2026-11-06"],
  ["EQ-1040", "Case erector CE-30", "Packaging", "Line P1", "operational", "2026-10-14", "2027-01-14"],
  ["EQ-1041", "Shrink wrapper SW-8", "Packaging", "Line P1", "operational", "2026-09-19", "2026-12-19"],
  ["EQ-1042", "Palletiser PLT-2", "Packaging", "Line P2", "down", "2026-10-10", "2026-11-05"],
  ["EQ-1043", "Labeller Krones Contiroll", "Packaging", "Line P2", "operational", "2026-10-29", "2027-01-29"],
  ["EQ-1044", "Strapping machine SM-4", "Packaging", "Line P2", "idle", "2026-05-22", "2026-11-22"],
  ["EQ-1050", "Air compressor GA 90", "Utilities", "Compressor room", "operational", "2026-10-09", "2027-01-09"],
  ["EQ-1051", "Air compressor GA 90", "Utilities", "Compressor room", "operational", "2026-08-25", "2026-11-25"],
  ["EQ-1052", "Chiller Trane CGAM 300", "Utilities", "Plant room", "operational", "2026-09-03", "2026-12-03"],
  ["EQ-1053", "Steam boiler Cochran 4T", "Utilities", "Boiler house", "operational", "2026-07-03", "2026-10-03"],
  ["EQ-1054", "Backup generator 500 kVA", "Utilities", "Generator yard", "operational", "2026-10-22", "2027-04-22"],
  ["EQ-1055", "Dust collector DC-12", "Utilities", "Plant room", "maintenance", "2026-11-01", "2026-11-15"],
  ["EQ-1060", "Forklift Toyota 8FG25", "Warehouse", "Dock 1", "operational", "2026-09-30", "2026-12-30"],
  ["EQ-1061", "Forklift Toyota 8FG25", "Warehouse", "Dock 2", "operational", "2026-08-14", "2026-11-14"],
  ["EQ-1062", "Reach truck Linde R20", "Warehouse", "Aisle 4", "down", "2026-07-29", "2026-10-29"],
  ["EQ-1063", "Dock leveller DL-3", "Warehouse", "Dock 3", "operational", "2026-10-16", "2027-04-16"],
]

export const EQUIPMENT: Machine[] = rows.map(
  ([id, name, area, bay, status, lastService, nextInspection]) => ({
    id,
    name,
    area,
    bay,
    status,
    lastService,
    nextInspection,
  })
)

const DAY = 86_400_000

/** Whole days from TODAY to the given calendar day (negative when past). */
export function daysUntil(day: string): number {
  return Math.round((Date.parse(day) - Date.parse(TODAY)) / DAY)
}

export type Urgency = "overdue" | "soon" | "scheduled"

export function urgencyOf(m: Machine): Urgency {
  const d = daysUntil(m.nextInspection)
  if (d < 0) return "overdue"
  if (d <= DUE_SOON_DAYS) return "soon"
  return "scheduled"
}

export const URGENCY_RANK: Record<Urgency, number> = { overdue: 0, soon: 1, scheduled: 2 }
