import { HealthRecord, TimelineEvent, TrendSeries } from "./types";

export const mockRecords: HealthRecord[] = [
  {
    id: "rec1",
    title: "HbA1c Report",
    category: "lab",
    date: "Aug 12, 2025",
    source: "lab_delivered",
    labName: "Aarogya Diagnostics",
    fileName: "hba1c_aug_2025.pdf",
    verified: true,
    markers: [
      {
        name: "HbA1c",
        value: "7.4",
        unit: "%",
        referenceRange: "4.0 – 5.6%",
        status: "abnormal",
        plainLanguage:
          "Your 3-month average blood sugar is above the typical range. Levels between 5.7–6.4% suggest prediabetes; 6.5%+ is in the diabetes range.",
      },
      {
        name: "Estimated Avg Glucose",
        value: "166",
        unit: "mg/dL",
        referenceRange: "70 – 117 mg/dL",
        status: "abnormal",
        plainLanguage:
          "The day-to-day sugar level your HbA1c translates to. Higher than the typical range.",
      },
    ],
  },
  {
    id: "rec2",
    title: "Vitamin D (25-OH)",
    category: "lab",
    date: "Jun 03, 2025",
    source: "lab_delivered",
    labName: "Niramaya Wellness Labs",
    fileName: "vitd_jun_2025.pdf",
    verified: true,
    markers: [
      {
        name: "Vitamin D",
        value: "22",
        unit: "ng/mL",
        referenceRange: "30 – 100 ng/mL",
        status: "borderline",
        plainLanguage:
          "Slightly below the sufficient range, which is very common in urban India. Often improved with morning sunlight and supplements.",
      },
    ],
  },
  {
    id: "rec3",
    title: "Endocrinology Consultation",
    category: "consultation",
    date: "May 20, 2025",
    source: "ai_extracted",
    fileName: "consult_summary_may.pdf",
    verified: false,
  },
  {
    id: "rec4",
    title: "Metformin Prescription",
    category: "prescription",
    date: "May 20, 2025",
    source: "user_uploaded",
    fileName: "rx_metformin.pdf",
    verified: false,
  },
  {
    id: "rec5",
    title: "Chest X-Ray",
    category: "imaging",
    date: "Feb 11, 2025",
    source: "user_uploaded",
    fileName: "chest_xray_feb.png",
    verified: false,
  },
];

export const mockTrends: TrendSeries[] = [
  {
    id: "t1",
    name: "HbA1c",
    unit: "%",
    points: [
      { label: "Jan '24", value: 8.2 },
      { label: "Jun '24", value: 7.9 },
      { label: "Jan '25", value: 7.6 },
      { label: "Aug '25", value: 7.4 },
      { label: "Today", value: 6.8 },
    ],
    changePct: -17,
    direction: "improving",
    latestSummary: "6.8% vs 8.2% in 2024",
  },
  {
    id: "t2",
    name: "Vitamin D",
    unit: "ng/mL",
    points: [
      { label: "Jan '24", value: 18 },
      { label: "Jun '24", value: 19 },
      { label: "Jan '25", value: 21 },
      { label: "Today", value: 22 },
    ],
    changePct: 22,
    direction: "improving",
    latestSummary: "22 ng/mL (from 18)",
  },
  {
    id: "t3",
    name: "LDL Cholesterol",
    unit: "mg/dL",
    points: [
      { label: "Jan '24", value: 128 },
      { label: "Jan '25", value: 122 },
      { label: "Today", value: 124 },
    ],
    changePct: -3,
    direction: "stable",
    latestSummary: "124 mg/dL, broadly stable",
  },
];

export const mockTimeline: TimelineEvent[] = [
  { id: "tl1", type: "test", title: "HbA1c Report delivered", subtitle: "Aarogya Diagnostics", date: "Aug 12, 2025", recordId: "rec1" },
  { id: "tl2", type: "upload", title: "Vitamin D report uploaded", subtitle: "Self-upload · PDF", date: "Jun 03, 2025", recordId: "rec2" },
  { id: "tl3", type: "consultation", title: "Endocrinology consult", subtitle: "Dr. Anil Kulkarni · Video", date: "May 20, 2025", recordId: "rec3" },
  { id: "tl4", type: "reminder", title: "Metformin course started", subtitle: "Twice daily · 90 days", date: "May 21, 2025" },
  { id: "tl5", type: "test", title: "Chest X-Ray uploaded", subtitle: "Imaging record", date: "Feb 11, 2025", recordId: "rec5" },
];
