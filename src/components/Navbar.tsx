import { User } from "firebase/auth";
import { LogIn, LogOut, Menu, User as UserIcon } from "lucide-react";
import { APP_NAME } from "../constants";
import { cn } from "../lib/utils";

interface NavbarProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onMenuClick: () => void;
}

export default function Navbar({ user, onLogin, onLogout, onMenuClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 flex items-center justify-between px-4 md:px-8 transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors md:hidden"
        >
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white dark:bg-black rounded-sm rotate-45" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{APP_NAME}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{user.displayName}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
            </div>
            <div className="relative group">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-10 h-10 rounded-full border-2 border-gray-100 dark:border-gray-800"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
              )}
              <button
                onClick={onLogout}
                className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg py-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
