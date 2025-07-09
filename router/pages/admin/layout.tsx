import { Outlet, useLocation } from 'react-router-dom';
import { Shield, ChevronLeft, ChevronRight, X, BarChart3, Users, FileText, UserCheck, Award, Banknote, History, MessageSquare, Download, Settings, ChevronsUpDownIcon, User as UserIcon, Bell as BellIcon, LogOut as LogOutIcon } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState, useAuthActions } from '@/lib/auth-context';
import ReactDOM from 'react-dom';

const ADMIN_SIDEBAR_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' },
  { key: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
  { key: 'nda', label: 'NDA Documents', icon: FileText, path: '/admin/nda' },
  { key: 'kyc', label: 'KYC Approvals', icon: UserCheck, path: '/admin/kyc' },
  { key: 'certificates', label: 'Share Certificates', icon: Award, path: '/admin/certificates' },
  { key: 'funds', label: 'Fund Management', icon: Banknote, path: '/admin/funds' },
  { key: 'transactions', label: 'Transaction History', icon: History, path: '/admin/transactions' },
  { key: 'feedback', label: 'User Feedback', icon: MessageSquare, path: '/admin/feedback' },
  { key: 'reports', label: 'Reports', icon: Download, path: '/admin/reports' },
  { key: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

function SidebarProfileMenu() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { user } = useAuthState();
  const { logout } = useAuthActions();

  // Fallbacks for missing user
  const name = user?.full_name || user?.email || 'User';
  const email = user?.email || '';
  // Get initials from full name or email
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Position the profile card outside the sidebar
  const [cardPos, setCardPos] = useState<{ top: number; left: number } | null>(null);

  // Calculate position on open
  const handleOpen = () => {
    setOpen((v) => {
      if (!v && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const cardWidth = 320; // w-80 for more space
        const offset = 8; // tighter to sidebar
        // Align card top with button top for perfect horizontal alignment
        let top = rect.top + window.scrollY;
        // Clamp top to viewport
        if (top + 220 > window.innerHeight - 8) {
          top = window.innerHeight - 220 - 8;
        }
        if (top < 8) top = 8;
        // Place card so its left aligns with sidebar's right, but clamp to viewport
        let left = rect.left + rect.width + offset;
        if (left + cardWidth > window.innerWidth - 8) {
          left = window.innerWidth - cardWidth - 8;
        }
        if (left < rect.left + rect.width) left = rect.left + rect.width + offset;
        setCardPos({ top, left });
      }
      return !v;
    });
  };

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        document.getElementById('sidebar-profile-card') &&
        !(document.getElementById('sidebar-profile-card') as HTMLElement).contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Add navigation to /admin/profile when Account is clicked
  const handleAccountClick = () => {
    setOpen(false);
    window.history.pushState({}, '', '/admin/profile');
    // Optionally trigger a navigation event if using react-router
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 focus:outline-none"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm border border-gray-300">
          {initials}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-sm font-semibold text-gray-900 truncate">{name}</div>
          <div className="text-xs text-gray-500 truncate">{email}</div>
        </div>
        <ChevronsUpDownIcon className="h-4 w-4 text-gray-400 ml-auto" />
      </button>
      {open && cardPos && typeof window !== 'undefined'
        ? (
          // Use portal to render outside sidebar
          typeof document !== 'undefined' && document.body
            ? ReactDOM.createPortal(
                <div
                  id="sidebar-profile-card"
                  style={{
                    position: 'fixed',
                    top: cardPos.top,
                    left: cardPos.left,
                    zIndex: 1000,
                    width: 320,
                    minWidth: 256,
                    maxWidth: 360,
                    maxHeight: '90vh',
                    overflow: 'auto',
                    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
                  }}
                  className="bg-white rounded-xl border border-gray-200 animate-fade-in"
                >
                  <div className="flex items-center gap-3 px-4 py-3 border-b">
                    <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg border border-gray-300">
                      {initials}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{name}</div>
                      <div className="text-xs text-gray-500">{email}</div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button onClick={handleAccountClick} className="w-full flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100 transition text-base">
                      <UserIcon className="h-5 w-5" /> Account
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100 transition text-base">
                      <BellIcon className="h-5 w-5" /> Notifications
                    </button>
                  </div>
                  <div className="border-t">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition text-base">
                      <LogOutIcon className="h-5 w-5" /> Log out
                    </button>
                  </div>
                </div>,
                document.body
              )
            : null
        ) : null}
    </>
  );
}

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} fixed lg:relative lg:translate-x-0 z-30 h-screen flex flex-col`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-xs text-gray-600">Spora One Trust</p>
                </div>
              </div>
            )}
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:flex p-1 h-8 w-8">
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-1 h-8 w-8">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {ADMIN_SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'} ${sidebarCollapsed ? 'justify-center' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <SidebarProfileMenu />
      </div>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
