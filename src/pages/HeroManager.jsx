import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Upload, Image as ImageIcon, Trash2, RefreshCw } from 'lucide-react';
import { SpotlightCard, BlurText, ShinyText } from '../components/reactbits';

const HeroManager = () => {
    const [heroData, setHeroData] = useState({
        id: null,
        tagline: 'Software Engineer & Backend Specialist',
        title: 'LÊ TRUNG NGHĨA',
        description:
            'Kỹ sư phần mềm chuyên sâu về thiết kế RESTful APIs, Microservices, tối ưu hóa cơ sở dữ liệu và phát triển ứng dụng Fullstack hiện đại với Node.js, NestJS, Laravel và React.',
        githubUrl: 'https://github.com',
        linkedinUrl: 'https://linkedin.com',
        emailUrl: 'mailto:letrungnghia.dev@gmail.com',
        avatarUrl: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchHero = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('http://localhost:3000/api/portfolio/hero');
                if (res.ok) {
                    const data = await res.json();
                    if (data) setHeroData((prev) => ({ ...prev, ...data }));
                }
            } catch {
                // Keep default values when offline
            } finally {
                setIsLoading(false);
            }
        };
        fetchHero();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHeroData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setErrorMsg('');
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('http://localhost:3000/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok && data.url) {
                setHeroData((prev) => ({ ...prev, avatarUrl: data.url }));
                setSuccessMsg('Tải ảnh đại diện lên thành công! Nhớ bấm "Lưu Introduce" để áp dụng.');
                setTimeout(() => setSuccessMsg(''), 4000);
            } else {
                setErrorMsg(data.message || 'Không thể tải ảnh lên.');
            }
        } catch {
            setErrorMsg('Lỗi kết nối khi tải ảnh lên.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMsg('');
        setErrorMsg('');
        try {
            const res = await fetch(
                `http://localhost:3000/api/portfolio/hero/${heroData.id || 1}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(heroData),
                }
            );
            if (res.ok) {
                const data = await res.json();
                setHeroData(data);
                setSuccessMsg('Lưu cấu hình Introduce (Hero) thành công!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                setErrorMsg('Không thể cập nhật cấu hình Introduce.');
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
                Đang tải dữ liệu...
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="text-left">
                <ShinyText
                    text="01 // INTRODUCE SECTION"
                    speed={3}
                    className="text-xs font-orbitron font-bold uppercase tracking-widest mb-1"
                />
                <h1 className="text-3xl font-bold font-orbitron text-white">
                    <BlurText text="1. Cấu Hình Introduce (Hero)" />
                </h1>
                <p className="text-sm text-muted-foreground font-space mt-1">
                    Quản lý Title, nhãn chuyên môn, giới thiệu ngắn bản thân và các liên kết cá nhân.
                </p>
            </div>

            <form onSubmit={handleSave} className="grid lg:grid-cols-12 gap-6 max-w-5xl text-left">
                <div className="lg:col-span-8 space-y-6">
                    <SpotlightCard className="p-6 md:p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-orbitron text-slate-300 uppercase tracking-wide block">
                                Nhãn Chuyên Môn (Tagline)
                            </label>
                            <input
                                type="text"
                                name="tagline"
                                value={heroData.tagline}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-orbitron text-slate-300 uppercase tracking-wide block">
                                Tiêu Đề Chính (Title / Họ Tên)
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={heroData.title}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-orbitron text-slate-300 uppercase tracking-wide block">
                                Giới Thiệu Ngắn Bản Thân
                            </label>
                            <textarea
                                name="description"
                                value={heroData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
                            />
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                            <div className="space-y-2">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    GitHub URL
                                </label>
                                <input
                                    type="text"
                                    name="githubUrl"
                                    value={heroData.githubUrl}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    LinkedIn URL
                                </label>
                                <input
                                    type="text"
                                    name="linkedinUrl"
                                    value={heroData.linkedinUrl}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    Email Liên Hệ
                                </label>
                                <input
                                    type="text"
                                    name="emailUrl"
                                    value={heroData.emailUrl}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                    </SpotlightCard>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <SpotlightCard className="p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-primary" /> Ảnh Đại Diện (Hero)
                            </h4>
                            {heroData.avatarUrl && (
                                <button
                                    type="button"
                                    onClick={() => setHeroData((prev) => ({ ...prev, avatarUrl: '' }))}
                                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
                                    title="Khôi phục về ảnh mặc định"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Khôi phục
                                </button>
                            )}
                        </div>

                        {/* Preview Frame */}
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/4.5] bg-slate-950 border border-white/10 flex items-center justify-center group shadow-inner">
                            {heroData.avatarUrl ? (
                                <img
                                    src={heroData.avatarUrl}
                                    alt="Avatar Preview"
                                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="text-center p-6 space-y-2">
                                    <div className="w-14 h-14 mx-auto rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                        <ImageIcon className="w-7 h-7" />
                                    </div>
                                    <p className="text-xs font-orbitron text-slate-300">Đang dùng ảnh mặc định</p>
                                    <p className="text-[11px] font-space text-muted-foreground">
                                        (Avatar.jpg trên trang Portfolio)
                                    </p>
                                </div>
                            )}

                            {isUploading && (
                                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20">
                                    <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                                    <span className="text-xs font-orbitron text-primary tracking-wider">Đang tải ảnh lên...</span>
                                </div>
                            )}
                        </div>

                        {/* Upload & URL Input */}
                        <div className="space-y-3">
                            <label className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary hover:border-primary font-orbitron text-xs font-semibold cursor-pointer transition-all">
                                <Upload className="w-4 h-4" />
                                <span>{isUploading ? 'Đang xử lý...' : 'Tải Ảnh Mới Lên'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={isUploading}
                                    className="hidden"
                                />
                            </label>

                            <div className="space-y-1">
                                <label className="text-[11px] font-orbitron text-slate-400 block">
                                    Hoặc dán URL ảnh trực tiếp:
                                </label>
                                <input
                                    type="text"
                                    name="avatarUrl"
                                    value={heroData.avatarUrl || ''}
                                    onChange={handleChange}
                                    placeholder="https://... hoặc /images/..."
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono"
                                />
                            </div>
                        </div>
                    </SpotlightCard>

                    <SpotlightCard className="p-6 space-y-5">
                        <h4 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider">
                            Xuất Bản Introduce
                        </h4>
                        <p className="text-xs text-muted-foreground font-space leading-relaxed">
                            Mục Introduce hiển thị ngay đầu trang cùng khung ảnh cá nhân 3D và nút tải CV.
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
                            <Save className="w-4 h-4" /> {isSaving ? 'Đang lưu...' : 'Lưu Introduce'}
                        </button>
                    </SpotlightCard>
                </div>
            </form>
        </div>
    );
};

export default HeroManager;
