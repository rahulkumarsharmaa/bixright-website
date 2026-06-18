export interface Address {
  addressLine1?: string;
  addressLine2?: string;
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
}

export interface BankDetail {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: "Saving" | "Current";
  branch?: string;
  country: string;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: Address;
  shippingAddress?: Address;
  bankDetails?: BankDetail[];
}
