export interface Plan {
  id: string;
  name: string;
  layout?: any;
  createdAt: string;
}

export type RoomSetupType = {
  [roomType: string]: number;
};

export type Point = {
  lat: number;
  lng: number;
};
