export interface IBooking {
  id: number;
  userId: number;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
}

export interface GroupedData {
  [userId: number]: {
    userId: number;
    userName: string;
    bookings: Array<{ id: number; startTime: string; endTime: string }>;
  };
}
