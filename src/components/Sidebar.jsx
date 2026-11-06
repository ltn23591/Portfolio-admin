import React from 'react';
import { NavLink } from 'react-router';
import {
    LayoutDashboard,
    MessageSquare,
    Settings,
    ShieldAlert,
    LogOut,
    Home,
    GraduationCap,
    FolderGit2,
    Briefcase,
    Sliders,
} from 'lucide-react';
import { ShinyText } from './reactbits';

const Sidebar = () => {
    const menuItems = [
        { path: '/', label: 'Bảng Điều Khiển', icon: <LayoutDashboard className="w-5 h-5" /> },
        { path: '/landing', label: 'Bố Cục & Liên Hệ', icon: <Sliders className="w-5 h-5" /> },
        { path: '/hero', label: '1. Introduce (Hero)', icon: <Home className="w-5 h-5" /> },
        { path: '/about', label: '2 & 3. Học Vấn & Kỹ Năng', icon: <GraduationCap className="w-5 h-5" /> },
        { path: '/experience', label: '4. Kinh Nghiệm', icon: <Briefcase className="w-5 h-5" /> },
        { path: '/projects', label: '5-7. Dự Án & Best Project', icon: <FolderGit2 className="w-5 h-5" /> },
        { path: '/messages', label: '8. Hộp Thư Liên Hệ', icon: <MessageSquare className="w-5 h-5" /> },
        { path: '/settings', label: 'Cài Đặt Hệ Thống', icon: <Settings className="w-5 h-5" /> },
    ];

    return (
        <aside className="w-68 glass-panel border-r border-white/5 h-screen sticky top-0 flex flex-col justify-between p-6 z-30 shrink-0">
            <div className="space-y-8">
                {/* Brand Logo Header */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                        <ShieldAlert className="w-5 h-5 text-slate-950" />
                    </div>
                    <div className="text-left">
                        <h2 className="text-sm font-bold font-orbitron tracking-wider text-white uppercase">
                            NGHĨA PORTAL
                        </h2>
                        <ShinyText
                            text="ADMIN CONTROL v2.0"
                            speed={3}
                            className="text-[10px] font-orbitron font-bold uppercase tracking-widest"
                        />
                    </div>
                </div>

                {/* Nav Menu items */}
                <nav className="flex flex-col gap-1.5">
                    {menuItems.map((item, idx) => (
                        <NavLink
                            key={idx}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-orbitron font-semibold tracking-wide transition-all duration-300 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-primary/15 to-secondary/15 text-primary border border-primary/30 shadow-md'
                                        : 'text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent'
                                }`
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Logout actions */}
            <div className="border-t border-white/5 pt-5">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-xs font-orbitron font-semibold text-rose-400 hover:text-white hover:bg-rose-500/10 border border-transparent transition-all duration-300 cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    Đăng Xuất
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
