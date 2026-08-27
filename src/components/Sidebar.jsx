import React from 'react';
import { NavLink } from 'react-router';
import { 
    LayoutDashboard, MessageSquare, Settings, ShieldAlert, LogOut,
    Home, User, FolderGit2, Briefcase, Star, Sliders 
} from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { path: '/', label: 'Bảng Điều Khiển', icon: <LayoutDashboard className="w-5 h-5" /> },
        { path: '/landing', label: 'Bố Cục Landing', icon: <Sliders className="w-5 h-5" /> },
        { path: '/hero', label: 'Cấu Hình Banner', icon: <Home className="w-5 h-5" /> },
        { path: '/about', label: 'Thông Tin Bio', icon: <User className="w-5 h-5" /> },
        { path: '/projects', label: 'Quản Lý Dự Án', icon: <FolderGit2 className="w-5 h-5" /> },
        { path: '/experience', label: 'Kinh Nghiệm', icon: <Briefcase className="w-5 h-5" /> },
        { path: '/testimonials', label: 'Đánh Giá', icon: <Star className="w-5 h-5" /> },
        { path: '/messages', label: 'Hộp Thư', icon: <MessageSquare className="w-5 h-5" /> },
        { path: '/settings', label: 'Cài Đặt', icon: <Settings className="w-5 h-5" /> }
    ];

    return (
        <aside className="w-64 glass-panel border-r border-white/5 h-screen sticky top-0 flex flex-col justify-between p-6 z-30">
            <div className="space-y-10">
                {/* Brand Logo Header */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                        <ShieldAlert className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                        <h2 className="text-sm font-bold tracking-wider text-white uppercase">Nghĩa Portal</h2>
                        <span className="text-[10px] text-primary font-semibold uppercase tracking-widest">Admin Pro</span>
                    </div>
                </div>

                {/* Nav Menu items */}
                <nav className="flex flex-col gap-2">
                    {menuItems.map((item, idx) => (
                        <NavLink
                            key={idx}
                            to={item.path}
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 shadow-md'
                                        : 'text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent'
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Logout actions */}
            <div className="border-t border-white/5 pt-6">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-rose-400 hover:text-white hover:bg-rose-500/10 border border-transparent transition-all duration-300 cursor-pointer">
                    <LogOut className="w-5 h-5" />
                    Đăng Xuất
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
