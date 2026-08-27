import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, RefreshCw, FolderGit2 } from 'lucide-react';

const ProjectsManager = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState({
        id: null,
        title: '',
        description: '',
        category: 'fullstack',
        tech: '',
        github: '',
        live: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchProjects = async () => {
        setIsLoading(true);
        setErrorMsg('');
        try {
            const res = await fetch('http://localhost:3000/api/portfolio/projects');
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (err) {
            setErrorMsg('Không thể kết nối đến máy chủ.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const openAddModal = () => {
        setCurrentProject({
            id: null,
            title: '',
            description: '',
            category: 'fullstack',
            tech: '',
            github: '',
            live: ''
        });
        setErrorMsg('');
        setModalOpen(true);
    };

    const openEditModal = (proj) => {
        setCurrentProject({
            ...proj,
            tech: Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech
        });
        setErrorMsg('');
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) return;
        try {
            const res = await fetch(`http://localhost:3000/api/portfolio/projects/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchProjects();
            } else {
                alert('Xóa dự án thất bại.');
            }
        } catch (err) {
            alert('Lỗi kết nối.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMsg('');
        
        // Parse Tech comma separated string to array
        const techArray = currentProject.tech
            ? currentProject.tech.split(',').map(t => t.trim()).filter(t => t.length > 0)
            : [];

        const payload = {
            ...currentProject,
            tech: techArray
        };

        try {
            const res = await fetch('http://localhost:3000/api/portfolio/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setModalOpen(false);
                fetchProjects();
            } else {
                setErrorMsg('Không thể lưu thông tin dự án.');
            }
        } catch (err) {
            setErrorMsg('Lỗi kết nối.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProject(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-left">
                    <h1 className="text-3xl font-bold font-outfit text-white">Quản Lý Dự Án</h1>
                    <p className="text-sm text-muted-foreground mt-1">Thêm, chỉnh sửa hoặc xóa danh sách các dự án hiển thị trên portfolio.</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center gap-2 hover:shadow-[0_0_15px_rgba(20,184,166,0.25)] transition-all duration-300 cursor-pointer"
                >
                    <Plus className="w-5 h-5" /> Thêm Dự Án Mới
                </button>
            </div>

            {/* Project List Table */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 text-left">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/40 border-b border-white/5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                <th className="px-6 py-4">Tên Dự Án</th>
                                <th className="px-6 py-4">Phân Loại</th>
                                <th className="px-6 py-4">Công Nghệ</th>
                                <th className="px-6 py-4 text-right">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground animate-pulse">Đang tải danh sách dự án...</td>
                                </tr>
                            ) : projects.length > 0 ? (
                                projects.map((proj, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white flex items-center gap-2">
                                                <FolderGit2 className="w-4 h-4 text-primary" /> {proj.title}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-900 border border-white/5 text-teal-400 capitalize">
                                                {proj.category === 'fullstack' ? 'Fullstack' : proj.category === 'backend' ? 'Backend API' : 'Frontend UI'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                                                {proj.tech.map((t, tIdx) => (
                                                    <span key={tIdx} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400">{t}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => openEditModal(proj)}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(proj.id)}
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
                                    <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">Không tìm thấy dự án nào. Vui lòng thêm mới.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Modal Overlay */}
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel max-w-lg w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in-up text-left">
                        {/* Header */}
                        <div className="bg-slate-900/60 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="font-bold text-white font-outfit">
                                {currentProject.id ? 'Chỉnh Sửa Dự Án' : 'Thêm Dự Án Mới'}
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

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-300">Tiêu Đề Dự Án</label>
                                <input 
                                    type="text" 
                                    name="title"
                                    value={currentProject.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                                    placeholder="Ví dụ: Portfolio CMS"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">Phân Loại</label>
                                    <select 
                                        name="category"
                                        value={currentProject.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                                    >
                                        <option value="fullstack">Fullstack</option>
                                        <option value="backend">Backend API</option>
                                        <option value="frontend">Frontend UI</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">Công Nghệ (Phân tách bằng dấu phẩy)</label>
                                    <input 
                                        type="text" 
                                        name="tech"
                                        value={currentProject.tech}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                                        placeholder="React, Node.js, Express"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-300">Mô Tả Dự Án</label>
                                <textarea 
                                    name="description"
                                    value={currentProject.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">Đường Dẫn GitHub</label>
                                    <input 
                                        type="text" 
                                        name="github"
                                        value={currentProject.github}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">Đường Dẫn Demo Trực Tiếp</label>
                                    <input 
                                        type="text" 
                                        name="live"
                                        value={currentProject.live}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                                        placeholder="https://example.com"
                                    />
                                </div>
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

export default ProjectsManager;
