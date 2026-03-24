import { NavLink } from 'react-router-dom';
import {
  RiDashboardLine, RiExchangeDollarLine, RiAddCircleLine,
  RiPieChartLine, RiBarChartLine, RiCloseLine,
} from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

const NAV = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/transactions', icon: RiExchangeDollarLine, label: 'Transactions' },
  { to: '/transactions/new', icon: RiAddCircleLine, label: 'Add Transaction' },
  { to: '/budget', icon: RiPieChartLine, label: 'Budget' },
  { to: '/analytics', icon: RiBarChartLine, label: 'Analytics' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar sidebar-desktop">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <motion.aside
            className="sidebar sidebar-mobile"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <button className="sidebar-close btn btn-ghost" onClick={onClose}>
              <RiCloseLine size={22} />
            </button>
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent() {
  return (
    <div className="sidebar-inner">
      <div className="sidebar-logo">
        <div className="logo-icon">💰</div>
        <div>
          <div className="logo-name">FinanceIQ</div>
          <div className="logo-sub">Personal Finance</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">Menu</div>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/transactions/new' ? false : true}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-tip">
          <div className="tip-icon">💡</div>
          <div>
            <div className="tip-title">Pro Tip</div>
            <div className="tip-text">Track recurring expenses to spot savings opportunities.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
