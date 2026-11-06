import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Server, ShieldCheck } from 'lucide-react';
import { SpotlightCard, BlurText, ShinyText } from '../components/reactbits';

const Settings = () => {
    const [settings, setSettings] = useState({
        apiUrl: 'http://localhost:3000',
        enableNotifications: true,
        enableAutoRefresh: false,
        themeMode: 'dark',
        maxLogsLimit: 100,
    });
    const [savedAlert, setSavedAlert] = useState(false);

    const handleToggle = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleTextChange = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setSavedAlert(true);
        setTimeout(() => setSavedAlert(false), 3000);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="text-left">
                <ShinyText
                    text="SYSTEM CONFIGURATION // PORTAL"
                    speed={3}
                    className="text-xs font-orbitron font-bold uppercase tracking-widest mb-1"
                />
                <h1 className="text-3xl font-bold font-orbitron text-white">
                    <BlurText text="Cài Đặt Hệ Thống Quản Trị" />
                </h1>
                <p className="text-sm text-muted-foreground font-space mt-1">
                    Cấu hình kết nối cổng API NestJS, thông báo thời gian thực và bảo mật.
                </p>
            </div>

            <form onSubmit={handleSave} className="grid lg:grid-cols-12 gap-6 max-w-5xl text-left">
                <div className="lg:col-span-8 space-y-6">
                    <SpotlightCard className="p-6 md:p-8 space-y-6">
                        <h3 className="text-base font-bold text-white font-orbitron flex items-center gap-2.5">
                            <Server className="w-5 h-5 text-primary" /> Cấu Hình Môi Trường API
                        </h3>

                        <div className="space-y-2">
                            <label className="text-xs font-orbitron text-slate-300 uppercase tracking-wide block">
                                Đường Dẫn NestJS Server
                            </label>
                            <input
                                type="text"
                                value={settings.apiUrl}
                                onChange={(e) => handleTextChange('apiUrl', e.target.value)}
                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                placeholder="http://localhost:3000"
                            />
                            <span className="text-[11px] text-muted-foreground font-space mt-1 block">
                                Địa chỉ API cốt lõi đồng bộ dữ liệu giữa trang Portfolio và Admin Portal.
                            </span>
                        </div>
                    </SpotlightCard>

                    <SpotlightCard className="p-6 md:p-8 space-y-6">
                        <h3 className="text-base font-bold text-white font-orbitron flex items-center gap-2.5">
                            <SettingsIcon className="w-5 h-5 text-secondary" /> Tùy Chọn Bảng Quản Trị
                        </h3>

                        <div className="space-y-4 font-space">
                            {[
                                {
                                    key: 'enableNotifications',
                                    title: 'Thông báo WebSocket thời gian thực',
                                    desc: 'Hiển thị thông báo ngay khi có thư liên hệ mới gửi từ trang Portfolio.',
                                },
                                {
                                    key: 'enableAutoRefresh',
                                    title: 'Tự động làm mới dữ liệu',
                                    desc: 'Tự động đồng bộ danh sách hộp thư liên hệ sau mỗi 30 giây.',
                                },
                            ].map((item) => (
                                <div
                                    key={item.key}
                                    className="flex items-start justify-between gap-4"
                                >
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-orbitron font-semibold text-white">
                                            {item.title}
                                        </p>
                                        <span className="text-xs text-muted-foreground leading-relaxed block">
                                            {item.desc}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(item.key)}
                                        className={`w-11 h-6 rounded-full transition-colors duration-300 relative shrink-0 cursor-pointer ${
                                            settings[item.key] ? 'bg-primary' : 'bg-slate-800'
                                        }`}
                                    >
                                        <span
                                            className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 ${
                                                settings[item.key] ? 'left-6' : 'left-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </SpotlightCard>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <SpotlightCard className="p-6 space-y-6">
                        <h4 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider">
                            Lưu Thay Đổi
                        </h4>
                        <p className="text-xs text-muted-foreground font-space leading-relaxed">
                            Cấu hình cài đặt được áp dụng ngay lập tức vào phiên hoạt động hiện tại.
                        </p>

                        {savedAlert && (
                            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-fade-in-up">
                                Lưu cài đặt thành công!
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all duration-300 cursor-pointer active:scale-95"
                        >
                            <Save className="w-4 h-4" /> Lưu Cấu Hình
                        </button>
                    </SpotlightCard>

                    <SpotlightCard className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 shrink-0">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="text-left text-xs">
                                <p className="font-bold font-orbitron text-white">
                                    Bảo Mật Hệ Thống
                                </p>
                                <p className="text-muted-foreground font-space mt-0.5">
                                    Kết nối an toàn đang hoạt động.
                                </p>
                            </div>
                        </div>
                    </SpotlightCard>
                </div>
            </form>
        </div>
    );
};

export default Settings;
