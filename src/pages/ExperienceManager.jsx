import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Briefcase, TrendingUp } from 'lucide-react';
import { SpotlightCard, BlurText, ShinyText } from '../components/reactbits';

const ExperienceManager = () => {
    const [experiences, setExperiences] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentExp, setCurrentExp] = useState({
        id: null,
        role: '',
        company: '',
        period: '',
        achievements: '',
        description: '',
        skills: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchExperiences = async () => {
        setIsLoading(true);
        setErrorMsg('');
        try {
            const res = await fetch('http://localhost:3000/api/portfolio/experience');
            if (res.ok) {
                const data = await res.json();
                setExperiences(data);
            }
        } catch {
            setErrorMsg('Không thể kết nối đến máy chủ.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/portfolio/experience');
                if (res.ok && isMounted) {
                    const data = await res.json();
                    setExperiences(data);
                }
            } catch {
                if (isMounted) setErrorMsg('Không thể kết nối đến máy chủ.');
            }
        };
        init();
        return () => {
            isMounted = false;
        };
    }, []);

    const openAddModal = () => {
        setCurrentExp({
            id: null,
            role: '',
            company: '',
            period: '',
            achievements: '',
            description: '',
            skills: '',
        });
        setErrorMsg('');
        setModalOpen(true);
    };

    const openEditModal = (exp) => {
        setCurrentExp({
            ...exp,
            achievements: Array.isArray(exp.achievements)
                ? exp.achievements.join(', ')
                : exp.achievements || '',
            description: Array.isArray(exp.description)
                ? exp.description.join('\n')
                : exp.description || '',
            skills: Array.isArray(exp.skills) ? exp.skills.join(', ') : exp.skills || '',
        });
        setErrorMsg('');
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa mục kinh nghiệm này?')) return;
        try {
            const res = await fetch(`http://localhost:3000/api/portfolio/experience/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchExperiences();
            } else {
                alert('Xóa thất bại.');
            }
        } catch {
            alert('Lỗi kết nối.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMsg('');

        const descArray = currentExp.description
            ? currentExp.description
                  .split('\n')
                  .map((d) => d.trim())
                  .filter((d) => d.length > 0)
            : [];
        const skillsArray = currentExp.skills
            ? currentExp.skills
                  .split(',')
                  .map((s) => s.trim())
                  .filter((s) => s.length > 0)
            : [];
        const achArray = currentExp.achievements
            ? currentExp.achievements
                  .split(',')
                  .map((a) => a.trim())
                  .filter((a) => a.length > 0)
            : [];

        const payload = {
            ...currentExp,
            achievements: achArray,
            description: descArray,
            skills: skillsArray,
        };

        try {
            const res = await fetch('http://localhost:3000/api/portfolio/experience', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setModalOpen(false);
                fetchExperiences();
            } else {
                setErrorMsg('Không thể lưu thông tin kinh nghiệm.');
            }
        } catch {
            setErrorMsg('Lỗi kết nối.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentExp((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-left">
                    <ShinyText
                        text="04 // WORK EXPERIENCE & ACHIEVEMENTS"
                        speed={3}
                        className="text-xs font-orbitron font-bold uppercase tracking-widest mb-1"
                    />
                    <h1 className="text-3xl font-bold font-orbitron text-white">
                        <BlurText text="4. Quản Lý Kinh Nghiệm & Thành Tựu" />
                    </h1>
                    <p className="text-sm text-muted-foreground font-space mt-1">
                        Tổng hợp kinh nghiệm làm việc ngành nghề liên quan và thành tựu ngắn gọn, súc tích.
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all duration-300 cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Thêm Kinh Nghiệm
                </button>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="text-muted-foreground font-orbitron animate-pulse text-left">
                    Đang tải danh sách kinh nghiệm...
                </div>
            ) : (
                <div className="space-y-6">
                    {experiences.map((exp) => (
                        <SpotlightCard key={exp.id} className="p-6 text-left">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="space-y-3 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <Briefcase className="w-5 h-5" />
                                        </span>
                                        <div>
                                            <h3 className="text-lg font-bold text-white font-orbitron">
                                                {exp.role}
                                            </h3>
                                            <p className="text-sm font-semibold text-teal-400 font-space">
                                                {exp.company} •{' '}
                                                <span className="text-xs text-muted-foreground font-mono">
                                                    {exp.period}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {exp.achievements.map((ach, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-space font-semibold"
                                                >
                                                    <TrendingUp className="w-3 h-3" /> {ach}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <ul className="list-disc list-inside text-xs text-muted-foreground font-space space-y-1 pl-2">
                                        {Array.isArray(exp.description) ? (
                                            exp.description.map((b, i) => <li key={i}>{b}</li>)
                                        ) : (
                                            <li>{exp.description}</li>
                                        )}
                                    </ul>

                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                        {Array.isArray(exp.skills) &&
                                            exp.skills.map((s, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-[10px] font-orbitron font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300"
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                    </div>
                                </div>

                                <div className="flex md:flex-col items-center gap-2 self-end md:self-center shrink-0">
                                    <button
                                        onClick={() => openEditModal(exp)}
                                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-orbitron font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                        <Edit2 className="w-3.5 h-3.5 text-primary" /> Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(exp.id)}
                                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-xs font-orbitron font-semibold text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Xóa
                                    </button>
                                </div>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel max-w-xl w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in-up text-left">
                        <div className="bg-slate-900/60 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="font-bold text-white font-orbitron">
                                {currentExp.id ? 'Chỉnh Sửa Kinh Nghiệm' : 'Thêm Kinh Nghiệm Mới'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-muted-foreground hover:text-white cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {errorMsg && (
                                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
                                    {errorMsg}
                                </div>
                            )}

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-orbitron text-slate-300 block">
                                        Chức Danh / Vị Trí
                                    </label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={currentExp.role}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Senior Backend Engineer"
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-orbitron text-slate-300 block">
                                        Tên Công Ty
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={currentExp.company}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="TechVibe Solutions"
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    Thời Gian Làm Việc
                                </label>
                                <input
                                    type="text"
                                    name="period"
                                    value={currentExp.period}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="2024 - Hiện tại"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    Thành Tựu Nổi Bật (Phân tách bằng dấu phẩy)
                                </label>
                                <input
                                    type="text"
                                    name="achievements"
                                    value={currentExp.achievements}
                                    onChange={handleInputChange}
                                    placeholder="Tăng 40% tốc độ, Latency < 120ms, 99.95% Uptime"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    Chi Tiết Công Việc Ngắn Gọn (Mỗi dòng 1 ý)
                                </label>
                                <textarea
                                    name="description"
                                    value={currentExp.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    placeholder={`Thiết kế kiến trúc Microservices...\nTối ưu hóa truy vấn SQL và Redis...`}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary resize-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    Kỹ Năng Áp Dụng (Phân tách bằng dấu phẩy)
                                </label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={currentExp.skills}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="NestJS, TypeScript, PostgreSQL, Redis"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-white/5 text-xs font-orbitron font-semibold text-slate-300 cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-5 py-2 rounded-xl bg-primary text-slate-950 text-xs font-orbitron font-bold flex items-center gap-1.5 hover:bg-primary/90 cursor-pointer disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />{' '}
                                    {isSaving ? 'Đang lưu...' : 'Lưu Kinh Nghiệm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExperienceManager;
