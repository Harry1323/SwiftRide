import { useState, useEffect } from "react";
import { MapPin, Navigation, Search, Clock, CreditCard, ChevronRight, Star, ShieldCheck, User, Users, Coins, Banknote } from "lucide-react";
import { VEHICLES, PRICING } from "../constants";
import { VehicleType, PaymentMethod } from "../types";
import { cn } from "../lib/utils";

interface RideBookingProps {
  onBook: (data: {
    pickup: string;
    dropoff: string;
    vehicleType: VehicleType;
    seaterCapacity?: number;
    paymentMethod: PaymentMethod;
    isWomenPreferable: boolean;
    userAge: number;
    price: number;
    distance: number;
  }) => void;
  initialPickup?: string;
  initialDropoff?: string;
  userCoins?: number;
}

export default function RideBooking({ onBook, initialPickup = "", initialDropoff = "", userCoins = 0 }: RideBookingProps) {
  const [pickup, setPickup] = useState(initialPickup);
  const [dropoff, setDropoff] = useState(initialDropoff);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('car');
  const [seaterCapacity, setSeaterCapacity] = useState<number>(4);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isWomenPreferable, setIsWomenPreferable] = useState(false);
  const [userAge, setUserAge] = useState<number>(25);
  const [userGender, setUserGender] = useState<'male' | 'female' | 'other'>('male');
  const [useCoins, setUseCoins] = useState(false);

  useEffect(() => {
    setPickup(initialPickup);
  }, [initialPickup]);

  useEffect(() => {
    setDropoff(initialDropoff);
  }, [initialDropoff]);

  // Calculate distance based on pickup/dropoff length (simulated)
  const calculateDistance = () => {
    if (!pickup || !dropoff) return 0;
    const combinedLength = pickup.length + dropoff.length;
    return Math.max(1, Math.floor(combinedLength / 5)); // Minimum 1 KM
  };

  const simulatedDistance = calculateDistance();

  // Calculate price
  const calculatePrice = () => {
    if (!pickup || !dropoff) return { total: 0, distance: 0 };
    
    const distance = simulatedDistance;
    let rate = PRICING.BASE_KM;
    
    if (selectedVehicle === 'car') {
      if (seaterCapacity === 4) rate = PRICING.CAR_4_SEATER;
      else if (seaterCapacity === 6) rate = PRICING.CAR_6_SEATER;
      else if (seaterCapacity === 12) rate = PRICING.CAR_12_SEATER;
    } else {
      const vehicle = VEHICLES.find(v => v.id === selectedVehicle);
      rate = vehicle?.pricePerKm || PRICING.BASE_KM;
    }

    let total = distance * rate;

    // Women discount
    if (userGender === 'female' && isWomenPreferable) {
      total *= (1 - PRICING.WOMEN_DISCOUNT);
    }

    // Coin discount
    if (useCoins && userCoins >= PRICING.COIN_DISCOUNT_THRESHOLD) {
      total *= (1 - PRICING.COIN_DISCOUNT_PERCENT);
    }

    return { total, distance };
  };

  const { total: totalPrice, distance: totalDistance } = calculatePrice();
  const isReady = pickup.length > 3 && dropoff.length > 3;

  const handleBook = () => {
    if (pickup && dropoff) {
      onBook({
        pickup,
        dropoff,
        vehicleType: selectedVehicle,
        seaterCapacity: selectedVehicle === 'car' ? seaterCapacity : undefined,
        paymentMethod: useCoins ? 'coins' : paymentMethod,
        isWomenPreferable,
        userAge,
        price: totalPrice,
        distance: totalDistance
      });
    }
  };

  // Age based preference
  useEffect(() => {
    if (userAge > 45) {
      if (selectedVehicle === 'premium') {
        setSelectedVehicle('car');
      }
    }
  }, [userAge]);

  return (
    <div className="bg-white dark:bg-black rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col h-full max-h-[90vh] transition-colors">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Where to?</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Book your SwiftRide in seconds.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Step 1: User Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Age</label>
            <input
              type="number"
              value={userAge}
              onChange={(e) => setUserAge(parseInt(e.target.value) || 0)}
              className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Gender</label>
            <select
              value={userGender}
              onChange={(e) => setUserGender(e.target.value as any)}
              className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Step 2: Location Selection */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full" />
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Pickup Location"
              className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl py-4 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-white transition-all"
            />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-black dark:bg-white rounded-full" />
            <input
              type="text"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="Dropoff Location"
              className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl py-4 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-white transition-all"
            />
          </div>
        </div>

        {/* Step 3: Vehicle Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Select Ride</h3>
            {userAge > 45 && <span className="text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">Age Preference Active</span>}
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {VEHICLES.filter(v => userAge <= 45 || ['bike', 'auto', 'car'].includes(v.id)).map((vehicle) => {
              const Icon = vehicle.icon;
              return (
                <div key={vehicle.id} className="space-y-2">
                  <button
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left group",
                      selectedVehicle === vehicle.id
                        ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10"
                        : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                        selectedVehicle === vehicle.id ? "bg-white/10 dark:bg-black/10" : "bg-gray-100 dark:bg-gray-800"
                      )}>
                        <Icon className={cn("w-6 h-6", selectedVehicle === vehicle.id ? "text-white dark:text-black" : "text-gray-600 dark:text-gray-400")} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{vehicle.name}</p>
                        <p className={cn("text-[10px] font-medium", selectedVehicle === vehicle.id ? "text-white/60 dark:text-black/60" : "text-gray-500 dark:text-gray-400")}>
                          {vehicle.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">₹{(simulatedDistance * (selectedVehicle === 'car' ? (seaterCapacity === 4 ? PRICING.CAR_4_SEATER : seaterCapacity === 6 ? PRICING.CAR_6_SEATER : PRICING.CAR_12_SEATER) : vehicle.pricePerKm)).toFixed(0)}</p>
                    </div>
                  </button>

                  {/* Seater Selection for Car */}
                  {selectedVehicle === 'car' && vehicle.id === 'car' && (
                    <div className="flex gap-2 px-2 animate-in slide-in-from-top-2 duration-300">
                      {vehicle.seaters?.map(s => (
                        <button
                          key={s}
                          onClick={() => setSeaterCapacity(s)}
                          className={cn(
                            "flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all",
                            seaterCapacity === s 
                              ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" 
                              : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                          )}
                        >
                          {s} Seater
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Preferences</h3>
          <button
            onClick={() => setIsWomenPreferable(!isWomenPreferable)}
            className={cn(
              "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
              isWomenPreferable ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20" : "border-gray-100 dark:border-gray-800"
            )}
          >
            <div className="flex items-center gap-3">
              <Users className={cn("w-5 h-5", isWomenPreferable ? "text-pink-500" : "text-gray-400 dark:text-gray-500")} />
              <div className="text-left">
                <p className={cn("text-sm font-bold", isWomenPreferable ? "text-pink-900 dark:text-pink-100" : "text-gray-900 dark:text-white")}>Women Preferable</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">2% discount for women bookings</p>
              </div>
            </div>
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
              isWomenPreferable ? "border-pink-500 bg-pink-500" : "border-gray-200 dark:border-gray-700"
            )}>
              {isWomenPreferable && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </button>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Payment</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('card')}
              className={cn(
                "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                paymentMethod === 'card' && !useCoins ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black" : "border-gray-100 dark:border-gray-800"
              )}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-xs font-bold">Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod('cash')}
              className={cn(
                "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                paymentMethod === 'cash' && !useCoins ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black" : "border-gray-100 dark:border-gray-800"
              )}
            >
              <Banknote className="w-5 h-5" />
              <span className="text-xs font-bold">Cash</span>
            </button>
          </div>

          {/* Coin Coupon */}
          {userCoins >= PRICING.COIN_DISCOUNT_THRESHOLD && (
            <button
              onClick={() => setUseCoins(!useCoins)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl border-2 border-dashed transition-all mt-2",
                useCoins ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" : "border-yellow-200 dark:border-yellow-900/20 bg-yellow-50/50 dark:bg-yellow-900/10"
              )}
            >
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <div className="text-left">
                  <p className="text-sm font-bold text-yellow-900 dark:text-yellow-100">Use 50 Coins</p>
                  <p className="text-[10px] text-yellow-700 dark:text-yellow-300">Get 50% OFF on this ride</p>
                </div>
              </div>
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                useCoins ? "border-yellow-500 bg-yellow-500" : "border-yellow-200 dark:border-yellow-800"
              )}>
                {useCoins && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-6 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 shrink-0">
        {isReady ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estimated Price</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-black text-gray-900 dark:text-white">₹{totalPrice.toFixed(2)}</p>
                  {useCoins && <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">50% OFF</span>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Distance</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{totalDistance} KM</p>
              </div>
            </div>
            <button
              onClick={handleBook}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center justify-center gap-2"
            >
              Book {VEHICLES.find(v => v.id === selectedVehicle)?.name}
              <ChevronRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">Real-time rate fixed based on distance & vehicle</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm font-bold text-gray-400 dark:text-gray-500">Complete pickup & dropoff to see rates</p>
            <div className="flex justify-center gap-1 mt-2">
              <div className={cn("w-2 h-2 rounded-full transition-colors", pickup.length > 3 ? "bg-green-500" : "bg-gray-200 dark:bg-gray-800")} />
              <div className={cn("w-2 h-2 rounded-full transition-colors", dropoff.length > 3 ? "bg-black dark:bg-white" : "bg-gray-200 dark:bg-gray-800")} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

