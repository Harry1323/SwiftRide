import { Clock, MapPin, Navigation, Star, ChevronRight, CheckCircle2, XCircle, History } from "lucide-react";
import { Ride } from "../types";
import { cn } from "../lib/utils";

interface RideHistoryProps {
  rides: Ride[];
}

export default function RideHistory({ rides }: RideHistoryProps) {
  if (rides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <History className="w-10 h-10 text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No rides yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
          Your ride history will appear here once you start booking with SwiftRide.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ride History</h2>
        <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {rides.length} Rides
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rides.map((ride) => (
          <div
            key={ride.id}
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  ride.status === 'completed' ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-800"
                )}>
                  {ride.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm capitalize text-gray-900 dark:text-white">{ride.vehicleType} Ride</p>
                  <p className="text-[10px] font-medium text-gray-400">
                    {new Date(ride.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900 dark:text-white">₹{ride.price}</p>
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  ride.status === 'completed' ? "text-green-500" : "text-red-500"
                )}>
                  {ride.status}
                </p>
              </div>
            </div>

            <div className="space-y-4 relative">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0" />
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">{ride.pickup}</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-black dark:bg-white rounded-full mt-1.5 shrink-0" />
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">{ride.dropoff}</p>
              </div>
              <div className="absolute left-[3px] top-3 bottom-3 w-0.5 bg-gray-100 dark:bg-gray-800 border-dashed border-l" />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-[10px] font-bold text-gray-400 ml-1">5.0</span>
              </div>
              <button className="flex items-center gap-1 text-[10px] font-bold text-gray-900 dark:text-white hover:gap-2 transition-all">
                View Receipt
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
