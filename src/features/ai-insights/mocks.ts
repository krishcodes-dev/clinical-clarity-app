import { Finding, NextStep } from "./types";

export const mockFindings: Finding[] = [
  {
    id: "f1",
    title: "Elevated average blood sugar",
    severity: "critical",
    markerName: "HbA1c",
    value: "7.4%",
    referenceRange: "4.0 – 5.6%",
    summary:
      "Your HbA1c indicates blood sugar has been above target for ~3 months. This range is associated with diabetes and benefits from clinical management.",
    recordId: "rec1",
  },
  {
    id: "f2",
    title: "Vitamin D slightly low",
    severity: "attention",
    markerName: "Vitamin D",
    value: "22 ng/mL",
    referenceRange: "30 – 100 ng/mL",
    summary:
      "Mild insufficiency, very common in urban India. Usually improved with 20 minutes of morning sunlight or a prescribed supplement.",
    recordId: "rec2",
  },
  {
    id: "f3",
    title: "Blood counts within range",
    severity: "normal",
    markerName: "CBC panel",
    value: "21/21 in range",
    referenceRange: "-",
    summary: "All red cell, white cell and platelet markers are within reference ranges.",
    recordId: "rec1",
  },
];

export const mockNextSteps: NextStep[] = [
  {
    id: "n1",
    title: "Consult an endocrinologist",
    description: "Discuss your HbA1c trend and management plan with a specialist.",
    action: "consult_doctor",
    urgency: "soon",
  },
  {
    id: "n2",
    title: "Re-test HbA1c in 3 months",
    description: "Track whether lifestyle and medication changes are working.",
    action: "book_test",
    urgency: "routine",
  },
  {
    id: "n3",
    title: "Daily Vitamin D reminder",
    description: "Consistent supplementation resolved your 2024 deficiency. Keep it up.",
    action: "set_reminder",
    urgency: "routine",
  },
];
