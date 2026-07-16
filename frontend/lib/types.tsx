export type User = {
  id: string;
  clerkId: string;
  name?: string;
  email: string;
  role: string;
  createdAt: string;
};

export interface Plan {
  id: string;
  name: string;
  layout?: {
    rooms?: any[];
    doors?: any[];
    windows?: any[];
  };
  area: number;
  createdAt: string;
  status: string;
  roomsCount: number;
};

export type RoomSetupType = {
  [roomType: string]: number;
};

export type Point = {
  lat: number;
  lng: number;
};

// admin components props
export type DashboardProps = {
  totalUsers: number;
  totalPlans: number;
  generatedPlans: number;
  finalizedPlans: number;
};

export type UserManagementProps = {
  users: User[];
};

export type PlanManagementProps = {
  plans: Plan[];
};

export type HealthResponse = {
  status: string;
  api: string;
  database: string;
  ai: string;
};
//