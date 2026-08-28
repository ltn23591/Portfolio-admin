import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { usePortfolioStore } from '../stores/portfolioStore';

const LandingManager = () => {
    const { settings, isLoading, fetchSettings, updateSettings } = usePortfolioStore();
    const [formData, setFormData] = useState({
        id: null,
        logoText: '',
        footerText: '',
        resumeUrl: '',
        showHero: true,
        showAbout: true,
        showProjects: true,
        showExperience: true,
        showTestimonials: true,
        showContact: true,
        themeMode: 'obsidian-teal',
        contactEmail: '',
        contactPhone: '',
        contactAddress: '',
        githubUrl: '',
        linkedinUrl: '',
        telegramUrl: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        if (settings) {
            setFormData(prev => ({
                ...prev,
                ...settings
            }));
        }
    }, [settings]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleChange = (name) => {
        setFormData(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMsg('');
        setErrorMsg('');
        try {
            await updateSettings(formData.id || 1, formData);
            setSuccessMsg('Cập nhật cấu hình Landing Page thành công!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setErrorMsg('Cập nhật cấu hình thất bại.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && !settings) return <div className="text-muted-foreground animate-pulse text-left">Đang tải cấu hình bố cục...</div>;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="text-left">
                <h1 className="text-3xl font-bold font-outfit text-white">Cấu Hình Trang Landing</h1>
                <p className="text-sm text-muted-foreground mt-1">Cấu hình logo, chân trang, file CV và quản lý ẩn/hiện các phần hiển thị.</p>
            </div>

            <form onSubmit={handleSave} className="grid lg:grid-cols-12 gap-6 max-w-4xl text-left">
                <div className="lg:col-span-8 space-y-6">
                    {/* Brand configs */}
                    <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Thông Tin Thương Hiệu</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300 block">Tên Logo / Thương Hiệu</label>
                                <input 
                                    type="text" 
                                    name="logoText"
                                    value={formData.logoText}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300 block">Đường Dẫn File CV (PDF)</label>
                                <input 
                                    type="text" 
                                    name="resumeUrl"
                                    value={formData.resumeUrl || ''}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 block">Dòng Chữ Bản Quyền Chân Trang (Footer)</label>
                            <input 
                                type="text" 
                                name="footerText"
                                value={formData.footerText}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Contact Details Configs */}
                    <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Thông Tin Liên Hệ</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300 block">Email Liên Hệ</label>
                                <input 
                                    type="email" 
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300 block">Điện Thoại / Zalo</label>
                                <input 
                                    type="text" 
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 block">Địa Chỉ Hiện Tại</label>
                            <input 
                                type="text" 
                                name="contactAddress"
                                value={formData.contactAddress}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Social Media Details */}
                    <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Liên Kết Mạng Xã Hội (Chân Trang)</h3>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300 block">GitHub</label>
                                <input 
                                    type="text" 
                                    name="githubUrl"
                                    value={formData.githubUrl}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300 block">LinkedIn</label>
                                <input 
                                    type="text" 
                                    name="linkedinUrl"
                                    value={formData.linkedinUrl}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300 block">Telegram</label>
                                <input 
                                    type="text" 
                                    name="telegramUrl"
                                    value={formData.telegramUrl}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section Visibility */}
                    <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tắt/Bật Hiển Thị Các Phần Giao Diện</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { name: 'showHero', label: 'Phần Banner chính (Hero)' },
                                { name: 'showAbout', label: 'Phần Giới thiệu & Kỹ năng' },
                                { name: 'showProjects', label: 'Phần Danh sách Dự án' },
                                { name: 'showExperience', label: 'Phần Kinh nghiệm làm việc' },
                                { name: 'showTestimonials', label: 'Phần Đánh giá từ đối tác' },
                                { name: 'showContact', label: 'Phần Biểu mẫu Liên hệ' }
                            ].map((sec) => (
                                <div 
                                    key={sec.name}
                                    onClick={() => handleToggleChange(sec.name)}
                                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-300 ${
                                        formData[sec.name] 
                                            ? 'bg-primary/5 border-primary/30 text-white' 
                                            : 'bg-slate-900/40 border-white/5 text-muted-foreground'
                                    }`}
                                >
                                    <span className="text-sm font-semibold">{sec.label}</span>
                                    {formData[sec.name] ? (
                                        <Eye className="w-5 h-5 text-primary shrink-0" />
                                    ) : (
                                        <EyeOff className="w-5 h-5 text-slate-500 shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Chủ Đề Giao Diện</h4>
                        
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 block">Màu Sắc Giao Diện Kích Hoạt</label>
                            <select 
                                name="themeMode"
                                value={formData.themeMode}
                                onChange={handleInputChange}
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                            >
                                <option value="obsidian-teal">Obsidian Teal (Mặc định)</option>
                                <option value="midnight-purple">Midnight Purple (Tím)</option>
                                <option value="charcoal-emerald">Charcoal Emerald (Xanh Lá)</option>
                                <option value="cyberpunk-neon">Cyberpunk Neon (Hồng/Xanh)</option>
                                <option value="minimalist-clean">Minimalist Clean (Trắng/Sáng)</option>
                            </select>
                        </div>

                        {successMsg && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 shrink-0" /> {successMsg}
                            </div>
                        )}
                        {errorMsg && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl">
                                {errorMsg}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(20,184,166,0.25)] transition-all duration-300 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" /> {isSaving ? 'Đang lưu...' : 'Lưu Cấu Hình'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LandingManager;
