
export interface HomeCategory {
  code: string;
  name: string;
  count: number;
}

export interface HomePro {
  name: string;
  initials: string;
  skill: string;
  area: string;
  bio: string;
  rating: number;
  reviews: number;
  experienceYrs: number;
  hourlyRate: number;
  verified: boolean;
}

export const bdt = (amount: number) => `\u09F3${amount.toLocaleString("en-IN")}`;


export const tickerItems = [
  "Plumbing",
  "Electrical",
  "AC & Cooling",
  "Cleaning",
  "Carpentry",
  "Painting",
  "Appliance Repair",
  "Pest Control",
  "Gas Stove Repair",
  "Water Heater",
];

