import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, GraduationCap } from 'lucide-react';
import { SpotlightCard, BlurText, ShinyText } from '../components/reactbits';

const AboutManager = () => {
    const [aboutData, setAboutData] = useState({
        id: null,
        title: 'Nền Tảng Học Vấn & Thế Mạnh Cốt Lõi',
        bio1: 'Tôi là Lập trình viên Backend & Fullstack có kinh nghiệm thực chiến phát triển các hệ thống ERP doanh nghiệp (Quản lý Kho, Đơn hàng, Kiểm kê) và nền tảng F&B / E-Commerce thời gian thực với Node.js, Express, NestJS, React, PostgreSQL, MongoDB và Redis.',
        bio2: 'Cử Nhân Công Nghệ Thông Tin (Kỹ Thuật Phần Mềm) — Đại Học Văn Hiến (VHU)',
        philosophy:
            'Code sạch không chỉ để máy chạy, mà để đồng đội dễ dàng phát triển tiếp. Hệ thống tốt là hệ thống dữ liệu chính xác và vận hành ổn định.',
        statExp: '6+ Tháng',
        statProjects: '5+ Hệ thống',
        statSatisfaction: '< 100ms',
        statOpenSource: '99.95% Uptime',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchAbout = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('http://localhost:3000/api/portfolio/about');
                if (res.ok) {
                    const data = await res.json();
                    if (data) setAboutData((prev) => ({ ...prev, ...data }));
                }
            } catch {
                // Keep default values when offline
            } finally {
                setIsLoading(false);
            }
        };
        fetchAbout();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAboutData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMsg('');
        setErrorMsg('');
        try {
            const res = await fetch(
                `http://localhost:3000/api/portfolio/about/${aboutData.id || 1}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(aboutData),
                }
            );
            if (res.ok) {
                const data = await res.json();
                setAboutData(data);
                setSuccessMsg('Lưu Học vấn & Kỹ năng thành công!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                setErrorMsg('Không thể cập nhật cấu hình.');
            }
        } catch {
            setErrorMsg('Lỗi kết nối máy chủ.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="text-muted-foreground font-orbitron animate-pulse text-left">
                Đang tải...
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="text-left">
                <ShinyText
                    text="02 & 03 // EDUCATION & PERSONAL SKILLS"
                    speed={3}
                    className="text-xs font-orbitron font-bold uppercase tracking-widest mb-1"
                />
                <h1 className="text-3xl font-bold font-orbitron text-white">
                    <BlurText text="2 & 3. Học Vấn & Kỹ Năng Cá Nhân" />
                </h1>
                <p className="text-sm text-muted-foreground font-space mt-1">
                    Quản lý thông tin học vấn, điểm mạnh bản thân và triết lý kỹ thuật.
                </p>
            </div>

            <form onSubmit={handleSave} className="grid lg:grid-cols-12 gap-6 max-w-5xl text-left">
                <div className="lg:col-span-8 space-y-6">
                    <SpotlightCard className="p-6 md:p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-orbitron text-slate-300 uppercase tracking-wide block">
                                Tiêu Đề Khối Học Vấn & Kỹ Năng
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={aboutData.title}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-orbitron text-slate-300 uppercase tracking-wide block">
                                Tóm Tắt Năng Lực & Điểm Mạnh Cốt Lõi
                            </label>
                            <textarea
                                name="bio1"
                                value={aboutData.bio1}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-orbitron text-slate-300 uppercase tracking-wide flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-primary" /> Học Vấn Chính Quy & Chứng Chỉ
                            </label>
                            <textarea
                                name="bio2"
                                value={aboutData.bio2}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-orbitron text-slate-300 uppercase tracking-wide block">
                                Triết Lý Làm Việc / Kỹ Thuật
                            </label>
                            <textarea
                                name="philosophy"
                                value={aboutData.philosophy}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
                            />
                        </div>
                    </SpotlightCard>

                    <SpotlightCard className="p-6 md:p-8 space-y-4">
                        <h3 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider">
                            Chỉ Số Năng Lực Nổi Bật (Hiển Thị Ở Hero & Học Vấn)
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-orbitron text-slate-400 block">
                                    Kinh Nghiệm Thực Chiến (statExp)
                                </label>
                                <input
                                    type="text"
                                    name="statExp"
                                    value={aboutData.statExp}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-orbitron text-slate-400 block">
                                    Dự Án Hoàn Thành (statProjects)
                                </label>
                                <input
                                    type="text"
                                    name="statProjects"
                                    value={aboutData.statProjects}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-orbitron text-slate-400 block">
                                    Độ Trễ API / Phản Hồi (statSatisfaction)
                                </label>
                                <input
                                    type="text"
                                    name="statSatisfaction"
                                    value={aboutData.statSatisfaction}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-orbitron text-slate-400 block">
                                    Độ Ổn Định / Uptime (statOpenSource)
                                </label>
                                <input
                                    type="text"
                                    name="statOpenSource"
                                    value={aboutData.statOpenSource}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                    </SpotlightCard>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <SpotlightCard className="p-6 space-y-5">
                        <h4 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider">
                            Lưu Thay Đổi
                        </h4>
                        <p className="text-xs text-muted-foreground font-space leading-relaxed">
                            Cập nhật trực tiếp vào mục Học vấn & Kỹ năng cá nhân trên trang chủ.
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

export default AboutManager;
