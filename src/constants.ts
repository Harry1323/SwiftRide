import { Vehicle } from "./types";
import { Bike, CarFront, Car, Crown } from "lucide-react";

export const VEHICLES: Vehicle[] = [
  {
    id: 'bike',
    name: 'Bike / Scooty',
    pricePerKm: 10,
    icon: Bike,
    description: 'Fast and affordable, perfect for solo travel.'
  },
  {
    id: 'auto',
    name: 'Auto',
    pricePerKm: 12,
    icon: CarFront,
    description: 'The classic city ride, great for short trips.'
  },
  {
    id: 'car',
    name: 'Car',
    pricePerKm: 14,
    icon: Car,
    description: 'Comfortable and reliable for any distance.',
    seaters: [4, 6, 12]
  },
  {
    id: 'premium',
    name: 'Premium',
    pricePerKm: 40,
    icon: Crown,
    description: 'Luxury travel with top-rated drivers.'
  }
];

export const PRICING = {
  BASE_KM: 10,
  CAR_4_SEATER: 14,
  CAR_6_SEATER: 17,
  CAR_12_SEATER: 24,
  WOMEN_DISCOUNT: 0.02,
  COIN_REWARD_KM: 50,
  COIN_REWARD_AMOUNT: 1,
  COIN_DISCOUNT_THRESHOLD: 50,
  COIN_DISCOUNT_PERCENT: 0.5
};

export const APP_NAME = "SwiftRide";
