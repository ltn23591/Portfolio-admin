import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Briefcase } from 'lucide-react';

const ExperienceManager = () => {
    const [experiences, setExperiences] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentExp, setCurrentExp] = useState({
        id: null,
        role: '',
        company: '',
        period: '',
        description: '',
        skills: ''
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
        } catch (err) {
            setErrorMsg('Không thể kết nối đến máy chủ.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const openAddModal = () => {
        setCurrentExp({
            id: null,
            role: '',
            company: '',
            period: '',
            description: '',
            skills: ''
        });
        setErrorMsg('');
        setModalOpen(true);
    };

    const openEditModal = (exp) => {
        setCurrentExp({
            ...exp,
            description: Array.isArray(exp.description) ? exp.description.join('\n') : exp.description,
            skills: Array.isArray(exp.skills) ? exp.skills.join(', ') : exp.skills
        });
        setErrorMsg('');
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa mục kinh nghiệm này?')) return;
        try {
            const res = await fetch(`http://localhost:3000/api/portfolio/experience/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchExperiences();
            } else {
                alert('Xóa thất bại.');
            }
        } catch (err) {
            alert('Lỗi kết nối.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMsg('');
        
        // Parse bullets split by newline
        const descArray = currentExp.description
            ? currentExp.description.split('\n').map(d => d.trim()).filter(d => d.length > 0)
            : [];
        // Parse skills comma separated
        const skillsArray = currentExp.skills
            ? currentExp.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
            : [];

        const payload = {
            ...currentExp,
            description: descArray,
            skills: skillsArray
        };

        try {
            const res = await fetch('http://localhost:3000/api/portfolio/experience', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setModalOpen(false);
                fetchExperiences();
            } else {
                setErrorMsg('Không thể lưu thông tin kinh nghiệm.');
            }
        } catch (err) {
            setErrorMsg('Lỗi kết nối.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentExp(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-left">
                    <h1 className="text-3xl font-bold font-outfit text-white">Quản Lý Kinh Nghiệm</h1>
                    <p className="text-sm text-muted-foreground mt-1">Thêm, chỉnh sửa hoặc xóa lịch sử làm việc/công tác.</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center gap-2 hover:shadow-[0_0_15px_rgba(20,184,166,0.25)] transition-all duration-300 cursor-pointer"
                >
                    <Plus className="w-5 h-5" /> Thêm Kinh Nghiệm
                </button>
            </div>

            {/* Experience list table */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 text-left">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/40 border-b border-white/5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                <th className="px-6 py-4">Vị Trí & Công Ty</th>
                                <th className="px-6 py-4">Thời Gian</th>
                                <th className="px-6 py-4">Kỹ Năng</th>
                                <th className="px-6 py-4 text-right">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground animate-pulse">Đang tải dữ liệu...</td>
                                </tr>
                            ) : experiences.length > 0 ? (
                                experiences.map((exp, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-primary" /> {exp.role}
                                            </div>
                                            <div className="text-xs text-teal-400 mt-0.5">{exp.company}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono text-muted-foreground">{exp.period}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {exp.skills.map((s, sIdx) => (
                                                    <span key={sIdx} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400">{s}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => openEditModal(exp)}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(exp.id)}
                                                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">Chưa có thông tin kinh nghiệm nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Dialog */}
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel max-w-lg w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in-up text-left">
                        {/* Header */}
                        <div className="bg-slate-900/60 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="font-bold text-white font-outfit">
                                {currentExp.id ? 'Chỉnh Sửa Kinh Nghiệm' : 'Thêm Kinh Nghiệm Mới'}
                            </h3>
                            <button 
                                onClick={() => setModalOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {errorMsg && (
                                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl">
                                    {errorMsg}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">Chức Vụ / Vị Trí</label>
                                    <input 
                                        type="text" 
                                        name="role"
                                        value={currentExp.role}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                                        placeholder="Ví dụ: Kỹ sư Backend"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">Tên Công Ty</label>
                                    <input 
                                        type="text" 
                                        name="company"
                                        value={currentExp.company}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                                        placeholder="Ví dụ: TechVibe"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">Thời Gian Làm Việc</label>
                                    <input 
                                        type="text" 
                                        name="period"
                                        value={currentExp.period}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                                        placeholder="Ví dụ: 2024 - Hiện tại"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">Kỹ Năng (Phân tách bằng dấu phẩy)</label>
                                    <input 
                                        type="text" 
                                        name="skills"
                                        value={currentExp.skills}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                                        placeholder="NestJS, TypeORM, Postgres"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-300">Mô Tả Công Việc (Mỗi ý một dòng)</label>
                                <textarea 
                                    name="description"
                                    value={currentExp.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white resize-none"
                                    placeholder="Ví dụ: Dẫn dắt đội ngũ 4 lập trình viên&#10;Tối ưu hóa cơ sở dữ liệu"
                                />
                            </div>

                            <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded-lg font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSaving}
                                    className="px-5 py-2 rounded-lg font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[0_0_10px_rgba(20,184,166,0.2)] transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4 inline mr-1.5" /> {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
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
