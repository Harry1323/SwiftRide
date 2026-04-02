import { Home, MapPin, History, User, Settings, HelpCircle, X } from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MENU_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'rides', label: 'My Rides', icon: History },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
];

export default function Sidebar({ isOpen, onClose, activeTab, onTabChange }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 z-50 transition-transform duration-300 transform md:translate-x-0 md:top-16",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 md:hidden">
            <span className="text-xl font-bold text-gray-900 dark:text-white">SwiftRide</span>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                    isActive
                      ? "bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/20"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-white dark:text-black" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300")} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-6 border-t border-gray-100 dark:border-gray-800">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Promotions</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Get 50% OFF</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">On your first 3 rides with SwiftRide.</p>
              <button className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white py-2 rounded-lg text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
