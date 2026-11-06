import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { usePortfolioStore } from '../stores/portfolioStore';
import { SpotlightCard, BlurText, ShinyText } from '../components/reactbits';

const LandingManager = () => {
    const { settings, isLoading, fetchSettings, updateSettings } = usePortfolioStore();
    const [formData, setFormData] = useState({
        id: null,
        logoText: 'LE TRUNG NGHIA',
        footerText: '© 2026 Le Trung Nghia. All rights reserved.',
        resumeUrl: '/CV-Le-Trung-Nghia.pdf',
        showHero: true,
        showAbout: true,
        showExperience: true,
        showProjects: true,
        showContact: true,
        themeMode: 'obsidian-teal',
        contactEmail: 'ltn23591@gmail.com',
        contactPhone: '0326405864',
        contactAddress: 'Quận Bình Tân, TP. Hồ Chí Minh',
        githubUrl: 'https://github.com/ltn23591',
        linkedinUrl: 'https://linkedin.com',
        telegramUrl: 'https://t.me/example',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const load = async () => {
            await fetchSettings();
            const currentSettings = usePortfolioStore.getState().settings;
            if (currentSettings) {
                setFormData((prev) => ({
                    ...prev,
                    ...currentSettings,
                }));
            }
        };
        load();
    }, [fetchSettings]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleChange = (name) => {
        setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMsg('');
        setErrorMsg('');
        try {
            await updateSettings(formData.id || 1, formData);
            setSuccessMsg('Cập nhật cấu hình Landing & Liên hệ thành công!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch {
            setErrorMsg('Cập nhật cấu hình thất bại.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && !settings) {
        return (
            <div className="text-muted-foreground font-orbitron animate-pulse text-left">
                Đang tải cấu hình bố cục...
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="text-left">
                <ShinyText
                    text="LAYOUT & CONTACT // SETTINGS"
                    speed={3}
                    className="text-xs font-orbitron font-bold uppercase tracking-widest mb-1"
                />
                <h1 className="text-3xl font-bold font-orbitron text-white">
                    <BlurText text="Cấu Hình Bố Cục & Thông Tin Liên Hệ" />
                </h1>
                <p className="text-sm text-muted-foreground font-space mt-1">
                    Quản lý thương hiệu, Số điện thoại, Email, Social links và ẩn/hiện các phần chính.
                </p>
            </div>

            <form onSubmit={handleSave} className="grid lg:grid-cols-12 gap-6 max-w-5xl text-left">
                <div className="lg:col-span-8 space-y-6">
                    {/* Brand configs */}
                    <SpotlightCard className="p-6 md:p-8 space-y-4">
                        <h3 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider">
                            Thông Tin Thương Hiệu & CV
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    Tên Logo / Thương Hiệu
                                </label>
                                <input
                                    type="text"
                                    name="logoText"
                                    value={formData.logoText}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    Đường Dẫn File CV (PDF)
                                </label>
                                <input
                                    type="text"
                                    name="resumeUrl"
                                    value={formData.resumeUrl || ''}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-orbitron text-slate-300 block">
                                Dòng Chữ Bản Quyền Chân Trang (Footer)
                            </label>
                            <input
                                type="text"
                                name="footerText"
                                value={formData.footerText}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                    </SpotlightCard>

                    {/* Contact Details Configs (Mục 8: Contact) */}
                    <SpotlightCard className="p-6 md:p-8 space-y-4">
                        <h3 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider">
                            8. Thông Tin Liên Hệ Công Việc (SĐT & Social)
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    Số Điện Thoại / Zalo
                                </label>
                                <input
                                    type="text"
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    Email Công Việc
                                </label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-orbitron text-slate-300 block">
                                Khu Vực Làm Việc
                            </label>
                            <input
                                type="text"
                                name="contactAddress"
                                value={formData.contactAddress}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4 pt-2">
                            <div className="space-y-2">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    GitHub URL
                                </label>
                                <input
                                    type="text"
                                    name="githubUrl"
                                    value={formData.githubUrl}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    LinkedIn URL
                                </label>
                                <input
                                    type="text"
                                    name="linkedinUrl"
                                    value={formData.linkedinUrl}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    Telegram URL
                                </label>
                                <input
                                    type="text"
                                    name="telegramUrl"
                                    value={formData.telegramUrl}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                    </SpotlightCard>

                    {/* Section Visibility */}
                    <SpotlightCard className="p-6 md:p-8 space-y-4">
                        <h3 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider">
                            Tắt / Bật Hiển Thị Các Mục Chuẩn
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { name: 'showHero', label: '1. Introduce (Banner & Ảnh cá nhân)' },
                                { name: 'showAbout', label: '2 & 3. Học vấn & Kỹ năng cá nhân' },
                                { name: 'showExperience', label: '4. Kinh nghiệm & Thành tựu' },
                                { name: 'showProjects', label: '5-7. Dự án & Best Project' },
                                { name: 'showContact', label: '8. Thông tin Liên hệ' },
                            ].map((sec) => (
                                <div
                                    key={sec.name}
                                    onClick={() => handleToggleChange(sec.name)}
                                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-300 ${
                                        formData[sec.name]
                                            ? 'bg-primary/10 border-primary/40 text-white'
                                            : 'bg-slate-900/40 border-white/5 text-muted-foreground'
                                    }`}
                                >
                                    <span className="text-xs font-orbitron font-semibold">
                                        {sec.label}
                                    </span>
                                    {formData[sec.name] ? (
                                        <Eye className="w-5 h-5 text-primary shrink-0" />
                                    ) : (
                                        <EyeOff className="w-5 h-5 text-slate-500 shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </SpotlightCard>
                </div>

                {/* Actions Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <SpotlightCard className="p-6 space-y-6">
                        <h4 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider">
                            Chủ Đề Giao Diện
                        </h4>

                        <div className="space-y-2">
                            <label className="text-xs font-orbitron text-slate-300 block">
                                Màu Sắc Chủ Đạo
                            </label>
                            <select
                                name="themeMode"
                                value={formData.themeMode}
                                onChange={handleInputChange}
                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
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
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all duration-300 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" /> {isSaving ? 'Đang lưu...' : 'Lưu Cấu Hình'}
                        </button>
                    </SpotlightCard>
                </div>
            </form>
        </div>
    );
};

export default LandingManager;
