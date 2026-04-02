import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Map from "./components/Map";
import RideBooking from "./components/RideBooking";
import RideHistory from "./components/RideHistory";
import UserProfile from "./components/UserProfile";
import AIAssistant from "./components/AIAssistant";
import Login from "./components/Login";
import { Ride, UserProfile as UserProfileType, VehicleType, PaymentMethod } from "./types";
import { VEHICLES, PRICING, APP_NAME } from "./constants";
import { LogOut, ChevronRight, X, Sparkles } from "lucide-react";
import { cn } from "./lib/utils";
import { User } from "@supabase/supabase-js";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [rides, setRides] = useState<Ride[]>([]);
  const [bookingLocations, setBookingLocations] = useState<{pickup: string, dropoff: string} | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [configError, setConfigError] = useState<string | null>(null);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete your account? This action is permanent.")) {
      try {
        // Mark user as deleted in Supabase Profiles table
        await supabase
          .from('profiles')
          .update({ deleted: true })
          .eq('id', user.id);
        
        // Sign out
        await supabase.auth.signOut();
        setUser(null);
        setUserProfile(null);
      } catch (error) {
        console.error("Account deletion failed:", error);
        alert("Failed to delete account.");
      }
    }
  };

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      setConfigError("Supabase URL and Anon Key are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Settings menu to enable the backend.");
      setIsAuthReady(true);
      return;
    }

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setUserProfile(null);
      }
      setIsAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const newProfile: UserProfileType = {
          uid: user.id,
          displayName: user.user_metadata.full_name || 'User',
          email: user.email || '',
          photoURL: user.user_metadata.avatar_url || '',
          role: 'user',
          coins: 0,
          totalDistance: 0,
          gender: 'other',
          age: 25,
          paymentMethod: 'card'
        };
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            display_name: newProfile.displayName,
            email: newProfile.email,
            photo_url: newProfile.photoURL,
            role: newProfile.role,
            coins: newProfile.coins,
            total_distance: newProfile.totalDistance,
            gender: newProfile.gender,
            age: newProfile.age,
            payment_method: newProfile.paymentMethod
          }]);
        
        if (!insertError) setUserProfile(newProfile);
      }
    } else if (data) {
      setUserProfile({
        uid: data.id,
        displayName: data.display_name,
        email: data.email,
        photoURL: data.photo_url,
        role: data.role,
        coins: data.coins,
        totalDistance: data.total_distance,
        gender: data.gender,
        age: data.age,
        paymentMethod: data.payment_method
      });
    }
  };

  useEffect(() => {
    if (!user) return;

    // Subscribe to rides
    const fetchRides = async () => {
      const { data } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (data) {
        setRides(data.map(r => ({
          id: r.id,
          userId: r.user_id,
          pickup: r.pickup,
          dropoff: r.dropoff,
          vehicleType: r.vehicle_type,
          seaterCapacity: r.seater_capacity,
          paymentMethod: r.payment_method,
          isWomenPreferable: r.is_women_preferable,
          userAge: r.user_age,
          status: r.status,
          price: r.price,
          distance: r.distance,
          createdAt: new Date(r.created_at)
        })));
      }
    };

    fetchRides();

    const channel = supabase
      .channel('rides_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'rides',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchRides();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setActiveTab('home');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleBookRide = async (data: {
    pickup: string;
    dropoff: string;
    vehicleType: VehicleType;
    seaterCapacity?: number;
    paymentMethod: PaymentMethod;
    isWomenPreferable: boolean;
    userAge: number;
    price: number;
    distance: number;
  }) => {
    if (!user) return;

    try {
      const { error: rideError } = await supabase
        .from('rides')
        .insert([{
          user_id: user.id,
          pickup: data.pickup,
          dropoff: data.dropoff,
          vehicle_type: data.vehicleType,
          seater_capacity: data.seaterCapacity,
          payment_method: data.paymentMethod,
          is_women_preferable: data.isWomenPreferable,
          user_age: data.userAge,
          status: 'pending',
          price: data.price,
          distance: data.distance
        }]);

      if (rideError) throw rideError;

      // Update user stats and rewards
      const currentTotalDistance = userProfile?.totalDistance || 0;
      const newTotalDistance = currentTotalDistance + data.distance;
      
      // Award coins for every 50km
      const oldCoinsAwarded = Math.floor(currentTotalDistance / PRICING.COIN_REWARD_KM);
      const newCoinsAwarded = Math.floor(newTotalDistance / PRICING.COIN_REWARD_KM);
      const coinsToGain = (newCoinsAwarded - oldCoinsAwarded) * PRICING.COIN_REWARD_AMOUNT;

      // Deduct coins if used
      const coinsToDeduct = data.paymentMethod === 'coins' ? PRICING.COIN_DISCOUNT_THRESHOLD : 0;
      const newCoins = (userProfile?.coins || 0) + coinsToGain - coinsToDeduct;

      await supabase
        .from('profiles')
        .update({
          total_distance: newTotalDistance,
          coins: newCoins
        })
        .eq('id', user.id);

      // Refresh local profile state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          totalDistance: newTotalDistance,
          coins: newCoins
        });
      }

      setActiveTab('rides');
      setBookingLocations(null);
    } catch (error) {
      console.error("Booking Error:", error);
    }
  };

  const handleUpdateProfile = async (updates: Partial<UserProfileType>) => {
    if (!user) return;

    try {
      const supabaseUpdates: any = {};
      if (updates.displayName !== undefined) supabaseUpdates.display_name = updates.displayName;
      if (updates.email !== undefined) supabaseUpdates.email = updates.email;
      if (updates.photoURL !== undefined) supabaseUpdates.photo_url = updates.photoURL;
      if (updates.role !== undefined) supabaseUpdates.role = updates.role;
      if (updates.coins !== undefined) supabaseUpdates.coins = updates.coins;
      if (updates.totalDistance !== undefined) supabaseUpdates.total_distance = updates.totalDistance;
      if (updates.gender !== undefined) supabaseUpdates.gender = updates.gender;
      if (updates.age !== undefined) supabaseUpdates.age = updates.age;
      if (updates.paymentMethod !== undefined) supabaseUpdates.payment_method = updates.paymentMethod;

      const { error } = await supabase
        .from('profiles')
        .update(supabaseUpdates)
        .eq('id', user.id);

      if (error) throw error;

      if (userProfile) {
        setUserProfile({ ...userProfile, ...updates });
      }
    } catch (error) {
      console.error("Profile Update Error:", error);
    }
  };

  const handleAIBooking = (pickup: string, dropoff: string) => {
    setBookingLocations({ pickup, dropoff });
    setActiveTab('home');
  };

  const handleLocationSelect = (location: string) => {
    if (!bookingLocations?.pickup) {
      setBookingLocations({ pickup: location, dropoff: "" });
    } else if (!bookingLocations?.dropoff) {
      setBookingLocations({ ...bookingLocations, dropoff: location });
    } else {
      setBookingLocations({ pickup: location, dropoff: "" });
    }
    setActiveTab('home');
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (configError) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
          <X className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-4">Configuration Required</h2>
        <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
          {configError}
        </p>
        <div className="bg-gray-50 p-4 rounded-2xl text-left w-full max-w-md border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Required Variables:</p>
          <code className="text-xs block bg-white p-2 rounded border border-gray-100 mb-2">VITE_SUPABASE_URL</code>
          <code className="text-xs block bg-white p-2 rounded border border-gray-100">VITE_SUPABASE_ANON_KEY</code>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <div className="flex-1 flex pt-16 relative">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className="flex-1 md:ml-72 relative overflow-hidden">
          {activeTab === 'home' && (
            <div className="h-full flex flex-col md:flex-row">
              <div className="w-full md:w-[450px] p-4 md:p-8 z-10 order-2 md:order-1 overflow-y-auto">
                <RideBooking 
                  onBook={handleBookRide} 
                  initialPickup={bookingLocations?.pickup}
                  initialDropoff={bookingLocations?.dropoff}
                  userCoins={userProfile?.coins || 0}
                />
              </div>
              <div className="flex-1 h-[400px] md:h-full order-1 md:order-2">
                <Map 
                  pickup={bookingLocations?.pickup} 
                  dropoff={bookingLocations?.dropoff} 
                  onLocationSelect={handleLocationSelect}
                />
              </div>
            </div>
          )}

          {activeTab === 'rides' && (
            <div className="h-full overflow-y-auto bg-white">
              <RideHistory rides={rides} />
            </div>
          )}

          {activeTab === 'profile' && userProfile && (
            <div className="h-full overflow-y-auto bg-white">
              <UserProfile 
                profile={userProfile} 
                onLogout={handleLogout} 
                onUpdate={handleUpdateProfile}
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="flex-1 p-6 overflow-y-auto max-w-2xl mx-auto w-full space-y-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Settings</h2>
              </div>

              {/* Theme Selection */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Appearance</h4>
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                        {theme === 'light' ? <Sparkles className="w-6 h-6 text-yellow-500" /> : <Sparkles className="w-6 h-6 text-blue-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Dark Mode</p>
                        <p className="text-[10px] text-gray-500">Switch between light and dark themes</p>
                      </div>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={cn(
                        "w-14 h-8 rounded-full transition-all relative p-1",
                        theme === 'dark' ? "bg-black border border-gray-800" : "bg-gray-200"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full bg-white shadow-sm transition-all",
                        theme === 'dark' ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">About</h4>
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 shadow-sm text-center space-y-4">
                  <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                    <div className="w-10 h-10 bg-white rounded-lg rotate-45" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">{APP_NAME}</h3>
                    <p className="text-xs text-gray-500 mt-1">Version 2.4.0 (Stable)</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    SwiftRide is a next-generation urban mobility platform powered by AI. 
                    We provide fast, reliable, and affordable rides for everyone, everywhere.
                  </p>
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <button className="text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors">Terms</button>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <button className="text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors">Privacy</button>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <button className="text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors">Licenses</button>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Account Actions</h4>
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] overflow-hidden shadow-sm">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">
                        <LogOut className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Logout</p>
                        <p className="text-[10px] text-gray-500">Sign out of your account</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full flex items-center justify-between p-5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center group-hover:bg-white dark:group-hover:bg-red-900/40 transition-colors">
                        <X className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-red-600">Delete Account</p>
                        <p className="text-[10px] text-red-400">Permanently remove your data</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-red-200 group-hover:text-red-600 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="p-8 flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Help Center</h2>
              <p className="text-gray-500">Need help? Contact our support team at support@swiftride.com</p>
            </div>
          )}
        </main>
      </div>

      <AIAssistant onBookRide={handleAIBooking} />
    </div>
  );
}

