import { User, Address } from "./types";

export const mockUser: User = {
  id: "u1",
  name: "Arjun Mehta",
  firstName: "Arjun",
  phone: "+91 98200 12345",
  email: "arjun.mehta@example.com",
  avatarInitials: "AM",
  profileCompletion: 85,
  dob: "12 Mar 1988",
  gender: "Male",
  bloodGroup: "O+",
  heightCm: 175,
  weightKg: 72,
};

export const mockAddresses: Address[] = [
  {
    id: "addr1",
    label: "Home",
    line1: "A-404, Shanti Heights, Veera Desai Road",
    line2: "Andheri West, Mumbai, Maharashtra 400053",
    serviceable: true,
    instructions: "Ring bell at A-404, 4th floor",
  },
  {
    id: "addr2",
    label: "Work",
    line1: "Tower B, 12th Floor, Synergy Business Park",
    line2: "Bandra Kurla Complex, Mumbai 400051",
    serviceable: true,
  },
  {
    id: "addr3",
    label: "Other",
    line1: "Hill View Cottage, Tungarli Lake Road",
    line2: "Lonavala, Maharashtra 410401",
    serviceable: false,
  },
];
