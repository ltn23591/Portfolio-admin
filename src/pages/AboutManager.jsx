import React, { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';

const AboutManager = () => {
    const [aboutData, setAboutData] = useState({
        id: null,
        title: '',
        bio1: '',
        bio2: '',
        philosophy: '',
        statExp: '',
        statProjects: '',
        statSatisfaction: '',
        statOpenSource: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const fetchAbout = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/portfolio/about');
            if (res.ok) {
                const data = await res.json();
                if (data) setAboutData(data);
            }
        } catch (err) {
            setErrorMsg('Không thể tải dữ liệu Giới thiệu.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAbout();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAboutData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMsg('');
        setErrorMsg('');
        try {
            const res = await fetch(`http://localhost:3000/api/portfolio/about/${aboutData.id || 1}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aboutData)
            });
            if (res.ok) {
                const data = await res.json();
                setAboutData(data);
                setSuccessMsg('Lưu nội dung Giới thiệu thành công!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                setErrorMsg('Không thể cập nhật cấu hình Giới thiệu.');
            }
        } catch (err) {
            setErrorMsg('Lỗi kết nối máy chủ.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="text-muted-foreground animate-pulse text-left">Đang tải...</div>;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="text-left">
                <h1 className="text-3xl font-bold font-outfit text-white">Cấu Hình Giới Thiệu & Chỉ Số</h1>
                <p className="text-sm text-muted-foreground mt-1">Quản lý các ô chỉ số đo lường, tiểu sử và triết lý làm việc.</p>
            </div>

            <form onSubmit={handleSave} className="grid lg:grid-cols-12 gap-6 max-w-4xl text-left">
                <div className="lg:col-span-8 space-y-6">
                    {/* Bio settings */}
                    <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block">Tiêu Đề Khối Tiểu Sử</label>
                            <input 
                                type="text" 
                                name="title"
                                value={aboutData.title}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all duration-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block">Đoạn Tiểu Sử 1</label>
                            <textarea 
                                name="bio1"
                                value={aboutData.bio1}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all duration-300 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block">Đoạn Tiểu Sử 2 (Không bắt buộc)</label>
                            <textarea 
                                name="bio2"
                                value={aboutData.bio2}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all duration-300 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block">Triết Lý Làm Việc / Thiết Kế</label>
                            <textarea 
                                name="philosophy"
                                value={aboutData.philosophy}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all duration-300 resize-none"
                            />
                        </div>
                    </div>

                    {/* Stats counters */}
                    <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Các Chỉ Số Thống Kê</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">Năm Kinh Nghiệm</label>
                                <input 
                                    type="text" 
                                    name="statExp"
                                    value={aboutData.statExp}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">Số Dự Án Hoàn Thành</label>
                                <input 
                                    type="text" 
                                    name="statProjects"
                                    value={aboutData.statProjects}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">Mức Độ Hài Lòng</label>
                                <input 
                                    type="text" 
                                    name="statSatisfaction"
                                    value={aboutData.statSatisfaction}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">Dự Án Mã Nguồn Mở</label>
                                <input 
                                    type="text" 
                                    name="statOpenSource"
                                    value={aboutData.statOpenSource}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hành Động</h4>
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

export default AboutManager;
