export const departments = ["Engineering", "Finance", "People & Culture", "Sales", "Operations", "Customer Support"];
export const locations = ["Berlin HQ", "London Office", "Remote (Germany)", "Remote (UK)"];
export const managers = ["Hannah Meyer", "Daniel Okafor", "Priya Raman", "Lucas Brandt", "Sofia Marchetti"];
export const contractTypes = ["Permanent", "Fixed-term", "Part-time", "Contractor"];
export const payFrequencies = ["Monthly", "Bi-weekly"];
export const relationships = ["Spouse or partner", "Parent", "Sibling", "Child", "Friend", "Other"];
export const taxClasses = ["Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI"];

export const documentTypes = [
  { id: "id", label: "Government ID or passport", hint: "Both sides for ID cards. PDF, JPG or PNG, up to 10 MB.", required: true },
  { id: "work-permit", label: "Work permit or visa", hint: "Only for non-EU citizens.", required: false },
  { id: "contract", label: "Signed employment contract", hint: "Countersigned copy from the e-signature tool.", required: true },
  { id: "tax", label: "Tax ID confirmation letter", hint: "Letter from the tax office showing the tax ID.", required: true },
  { id: "insurance", label: "Health insurance certificate", hint: "Proof of statutory or private cover.", required: true },
  { id: "diploma", label: "Degree or training certificates", hint: "Optional, kept in the personnel file.", required: false },
];

export const nextEmployeeId = "EMP-2047";
