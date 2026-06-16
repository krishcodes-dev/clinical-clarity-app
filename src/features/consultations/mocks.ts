import {
  Appointment,
  ChatMessage,
  Doctor,
  Prescription,
  Specialty,
} from "./types";

export const mockSpecialties: Specialty[] = [
  { id: "gp", name: "General Physician", icon: "stethoscope", doctorCount: 124 },
  { id: "cardio", name: "Cardiology", icon: "favorite", doctorCount: 48 },
  { id: "endo", name: "Endocrinology", icon: "monitor_heart", doctorCount: 31 },
  { id: "neuro", name: "Neurology", icon: "psychology", doctorCount: 27 },
  { id: "peds", name: "Paediatrics", icon: "child_care", doctorCount: 56 },
  { id: "derma", name: "Dermatology", icon: "face", doctorCount: 39 },
  { id: "dental", name: "Dentistry", icon: "dentistry", doctorCount: 44 },
  { id: "ophthal", name: "Ophthalmology", icon: "visibility", doctorCount: 22 },
];

export const mockDoctors: Doctor[] = [
  {
    id: "doc1",
    name: "Dr. Anil Kulkarni",
    specialtyId: "endo",
    specialty: "Endocrinology",
    yearsExp: 14,
    rating: 4.9,
    reviews: 1412,
    fee: 599,
    languages: ["English", "Hindi", "Marathi"],
    about:
      "MD (Medicine), DM (Endocrinology) from KEM Hospital, Mumbai. Specialist in diabetes management and metabolic health with practical, food-first lifestyle plans.",
    nextSlots: ["09:00 AM", "11:30 AM", "02:00 PM"],
    modes: ["video"],
  },
  {
    id: "doc2",
    name: "Dr. Priya Sharma",
    specialtyId: "cardio",
    specialty: "Cardiology",
    yearsExp: 16,
    rating: 5.0,
    reviews: 2289,
    fee: 799,
    languages: ["English", "Hindi"],
    about:
      "MD, DM (Cardiology) from AIIMS Delhi. Preventive cardiology and cardiac risk assessment. Believes early screening is the best medicine.",
    nextSlots: ["Tomorrow", "Wed 10:00"],
    modes: ["video"],
  },
  {
    id: "doc3",
    name: "Dr. Karan Malhotra",
    specialtyId: "neuro",
    specialty: "Neurology",
    yearsExp: 22,
    rating: 4.8,
    reviews: 1530,
    fee: 899,
    languages: ["English", "Hindi", "Punjabi"],
    about: "DM (Neurology) from NIMHANS Bengaluru. Neurological diagnostics with a patient-first explanation style.",
    nextSlots: ["Today 17:00"],
    modes: ["video"],
  },
  {
    id: "doc4",
    name: "Dr. Sneha Patil",
    specialtyId: "gp",
    specialty: "General Physician",
    yearsExp: 9,
    rating: 4.7,
    reviews: 987,
    fee: 399,
    languages: ["English", "Hindi", "Marathi"],
    about: "MBBS, MD. Primary care, preventive screening, and chronic condition follow-ups.",
    nextSlots: ["Tomorrow 10:30 AM"],
    modes: ["video"],
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "apt1",
    doctorId: "doc4",
    doctorName: "Dr. Sneha Patil",
    specialty: "General Consultation",
    mode: "video",
    date: "Tomorrow",
    time: "10:30 AM",
    status: "upcoming",
    fee: 399,
  },
  {
    id: "apt2",
    doctorId: "doc1",
    doctorName: "Dr. Anil Kulkarni",
    specialty: "Endocrinology",
    mode: "video",
    date: "May 20, 2025",
    time: "02:00 PM",
    status: "completed",
    fee: 599,
    prescriptionId: "rx1",
  },
];

export const mockPrescriptions: Prescription[] = [
  {
    id: "rx1",
    appointmentId: "apt2",
    doctorName: "Dr. Anil Kulkarni",
    specialty: "Endocrinology",
    date: "May 20, 2025",
    diagnosisNote:
      "Type 2 diabetes with suboptimal glycaemic control. Begin metformin, recheck HbA1c in 3 months.",
    medications: [
      {
        name: "Metformin",
        dose: "500 mg",
        frequency: "1-0-1",
        durationDays: 90,
        timing: ["08:00 AM", "08:00 PM"],
        withFood: true,
      },
      {
        name: "Vitamin D3",
        dose: "60,000 IU (weekly sachet)",
        frequency: "1-0-0",
        durationDays: 56,
        timing: ["08:00 AM"],
        withFood: true,
      },
    ],
    followUpDays: 90,
  },
];

export const mockChat: ChatMessage[] = [
  { id: "c1", from: "system", text: "Consultation started. This chat is end-to-end encrypted.", time: "10:30 AM" },
  { id: "c2", from: "doctor", text: "Namaste Arjun, I've reviewed the HbA1c report you shared. How have you been feeling?", time: "10:31 AM" },
  { id: "c3", from: "user", text: "Mostly fine doctor, a bit more tired in the afternoons.", time: "10:32 AM" },
  { id: "c4", from: "doctor", text: "That can relate to sugar fluctuations. Let's talk about your meal timing, especially lunch.", time: "10:33 AM" },
];
