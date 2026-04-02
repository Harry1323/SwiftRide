import { LucideIcon } from "lucide-react";

export type VehicleType = 'bike' | 'auto' | 'car' | 'premium';
export type PaymentMethod = 'card' | 'cash' | 'coins';

export interface Vehicle {
  id: VehicleType;
  name: string;
  pricePerKm: number;
  icon: LucideIcon;
  description: string;
  seaters?: number[];
}

export interface Ride {
  id: string;
  userId: string;
  pickup: string;
  dropoff: string;
  vehicleType: VehicleType;
  seaterCapacity?: number;
  status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
  price: number;
  distance: number;
  paymentMethod: PaymentMethod;
  isWomenPreferable: boolean;
  userAge: number;
  createdAt: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'driver' | 'admin';
  gender?: 'male' | 'female' | 'other';
  age?: number;
  coins: number;
  totalDistance: number;
  paymentMethod?: PaymentMethod;
}
