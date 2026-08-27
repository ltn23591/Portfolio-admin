import React, { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';

const HeroManager = () => {
    const [heroData, setHeroData] = useState({
        id: null,
        tagline: '',
        title: '',
        description: '',
        githubUrl: '',
        linkedinUrl: '',
        emailUrl: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const fetchHero = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/portfolio/hero');
            if (res.ok) {
                const data = await res.json();
                if (data) setHeroData(data);
            }
        } catch (err) {
            setErrorMsg('Không thể tải cấu hình Banner.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHero();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHeroData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMsg('');
        setErrorMsg('');
        try {
            const res = await fetch(`http://localhost:3000/api/portfolio/hero/${heroData.id || 1}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(heroData)
            });
            if (res.ok) {
                const data = await res.json();
                setHeroData(data);
                setSuccessMsg('Lưu cấu hình Banner thành công!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                setErrorMsg('Không thể cập nhật cấu hình Banner.');
            }
        } catch (err) {
            setErrorMsg('Lỗi kết nối máy chủ.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="text-muted-foreground animate-pulse text-left">Đang tải dữ liệu...</div>;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="text-left">
                <h1 className="text-3xl font-bold font-outfit text-white">Cấu Hình Banner (Hero)</h1>
                <p className="text-sm text-muted-foreground mt-1">Quản lý nhãn phụ, tiêu đề chính, dòng giới thiệu ngắn và các liên kết xã hội.</p>
            </div>

            <form onSubmit={handleSave} className="grid lg:grid-cols-12 gap-6 max-w-4xl text-left">
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-6">
                        {/* Tagline */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block">Nhãn Tagline Phụ</label>
                            <input 
                                type="text" 
                                name="tagline"
                                value={heroData.tagline}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all duration-300"
                                placeholder="Kỹ sư Phần mềm & Chuyên gia Backend"
                            />
                        </div>

                        {/* Heading */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block">Tiêu Đề Chính (Headline)</label>
                            <textarea 
                                name="title"
                                value={heroData.title}
                                onChange={handleChange}
                                required
                                rows={2}
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all duration-300 resize-none"
                                placeholder="Xây dựng giải pháp hệ thống hiệu năng cao"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block">Dòng Giới Thiệu Ngắn</label>
                            <textarea 
                                name="description"
                                value={heroData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all duration-300 resize-none"
                                placeholder="Giới thiệu ngắn về ngăn xếp công nghệ của bạn..."
                            />
                        </div>
                    </div>

                    {/* Social URLs */}
                    <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Liên Kết Mạng Xã Hội</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">Tài Khoản GitHub</label>
                                <input 
                                    type="text" 
                                    name="githubUrl"
                                    value={heroData.githubUrl}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">Đường Dẫn LinkedIn</label>
                                <input 
                                    type="text" 
                                    name="linkedinUrl"
                                    value={heroData.linkedinUrl}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">Email Nhận Liên Hệ</label>
                            <input 
                                type="text" 
                                name="emailUrl"
                                value={heroData.emailUrl}
                                onChange={handleChange}
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Save block */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Bảng Hành Động</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Các thay đổi sẽ lập tức cập nhật lên banner trang Landing Page chính.
                        </p>

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

export default HeroManager;
