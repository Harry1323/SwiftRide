import { User, Mail, Phone, MapPin, Shield, CreditCard, Bell, ChevronRight, LogOut, Coins, Navigation } from "lucide-react";
import { UserProfile as UserProfileType } from "../types";
import { cn } from "../lib/utils";

interface UserProfileProps {
  profile: UserProfileType;
  onLogout: () => void;
  onUpdate?: (updates: Partial<UserProfileType>) => void;
}

export default function UserProfile({ profile, onLogout, onUpdate }: UserProfileProps) {
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-black dark:bg-gray-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5 dark:border-gray-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="relative shrink-0">
            {profile.photoURL ? (
              <img
                src={profile.photoURL}
                alt={profile.displayName}
                className="w-32 h-32 rounded-3xl border-4 border-white/10 shadow-xl object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-32 h-32 rounded-3xl bg-white/10 flex items-center justify-center border-4 border-white/10">
                <User className="w-16 h-16 text-white/40" />
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-black dark:border-gray-900 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-black mb-2 tracking-tight">{profile.displayName}</h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/60 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {profile.email}
              </div>
              <div className="w-1 h-1 bg-white/20 rounded-full" />
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-widest text-[10px] font-black text-white/40">Member Since</span>
                <span className="text-white">2024</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-1">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Swift Coins</span>
                </div>
                <p className="text-2xl font-black">{profile.coins || 0}</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-1">
                  <Navigation className="w-5 h-5 text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Distance</span>
                </div>
                <p className="text-2xl font-black">{(profile.totalDistance || 0).toFixed(1)} KM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Personal Details</h4>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Age</label>
              <input
                type="number"
                value={profile.age || 25}
                onChange={(e) => onUpdate?.({ age: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-white transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
              <select
                value={profile.gender || 'other'}
                onChange={(e) => onUpdate?.({ gender: e.target.value as any })}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-white transition-all"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Account Settings</h4>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] overflow-hidden shadow-sm">
            {[
              { icon: CreditCard, label: 'Payment Methods', sub: 'Visa •••• 4242' },
              { icon: MapPin, label: 'Saved Places', sub: 'Home, Work, Gym' },
              { icon: Bell, label: 'Notifications', sub: 'Push, Email, SMS' },
              { icon: Shield, label: 'Privacy & Safety', sub: 'Data sharing, Security' },
            ].map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b last:border-none border-gray-50 dark:border-gray-800 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">
                    <item.icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{item.sub}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

