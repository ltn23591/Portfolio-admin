import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, RefreshCw, FolderGit2, Trash, GripHorizontal } from 'lucide-react';

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
        live: '',
        images: [],
        repos: []
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [draggedIndex, setDraggedIndex] = useState(null);

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
            live: '',
            images: [],
            repos: []
        });
        setErrorMsg('');
        setModalOpen(true);
    };

    const openEditModal = (proj) => {
        setCurrentProject({
            ...proj,
            tech: Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech,
            images: Array.isArray(proj.images) ? proj.images : (proj.images ? [proj.images] : []),
            repos: Array.isArray(proj.repos) ? proj.repos : []
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

    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setErrorMsg('');

        try {
            const uploadedUrls = [];
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append('file', files[i]);
                const res = await fetch('http://localhost:3000/api/upload', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (res.ok && data.url) {
                    uploadedUrls.push(data.url);
                } else {
                    setErrorMsg(data.message || 'Tải một số ảnh lên thất bại.');
                }
            }

            if (uploadedUrls.length > 0) {
                setCurrentProject(prev => ({
                    ...prev,
                    images: [...(prev.images || []), ...uploadedUrls]
                }));
            }
        } catch (err) {
            setErrorMsg('Lỗi kết nối khi tải ảnh lên.');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const removeImage = (indexToRemove) => {
        setCurrentProject(prev => ({
            ...prev,
            images: prev.images.filter((_, idx) => idx !== indexToRemove)
        }));
    };

    // HTML5 Drag & Drop handlers for sorting images
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === targetIndex) return;

        const updatedImages = [...currentProject.images];
        const draggedImage = updatedImages[draggedIndex];
        
        // Remove from original position
        updatedImages.splice(draggedIndex, 1);
        // Insert into target position
        updatedImages.splice(targetIndex, 0, draggedImage);

        setCurrentProject(prev => ({
            ...prev,
            images: updatedImages
        }));
        setDraggedIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const addGithubRepo = () => {
        setCurrentProject(prev => ({
            ...prev,
            repos: [...(prev.repos || []), { label: '', url: '' }]
        }));
    };

    const removeGithubRepo = (idx) => {
        setCurrentProject(prev => ({
            ...prev,
            repos: prev.repos.filter((_, i) => i !== idx)
        }));
    };

    const handleGithubRepoChange = (idx, field, value) => {
        setCurrentProject(prev => {
            const updated = [...prev.repos];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, repos: updated };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMsg('');
        
        const techArray = currentProject.tech
            ? currentProject.tech.split(',').map(t => t.trim()).filter(t => t.length > 0)
            : [];

        const reposList = (currentProject.repos || [])
            .filter(r => r.url.trim().length > 0)
            .map(r => ({ label: r.label.trim() || 'Code', url: r.url.trim() }));

        const primaryGithub = reposList.length > 0 ? reposList[0].url : '';

        const payload = {
            ...currentProject,
            tech: techArray,
            images: currentProject.images,
            github: primaryGithub,
            repos: reposList
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
                                <th className="px-6 py-4">Hình Ảnh & Tên Dự Án</th>
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
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={(proj.images && proj.images.length > 0) ? proj.images[0] : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100'} 
                                                    alt={proj.title}
                                                    className="w-14 h-9 rounded object-cover border border-white/10 shrink-0"
                                                />
                                                <div className="font-semibold text-white flex flex-col">
                                                    <span>{proj.title}</span>
                                                    <span className="text-[11px] text-muted-foreground">({proj.images ? proj.images.length : 0} ảnh)</span>
                                                </div>
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
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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

                            {/* Images Grid Manager */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <label className="text-xs font-bold text-slate-300">Album Hình Ảnh Dự Án ({currentProject.images ? currentProject.images.length : 0} ảnh)</label>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">Kéo thả các ảnh để thay đổi thứ tự. Ảnh đầu tiên sẽ là ảnh đại diện chính.</p>
                                    </div>
                                    <div>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            multiple
                                            onChange={handleFileUpload} 
                                            className="hidden" 
                                            id="project-image-files" 
                                        />
                                        <label 
                                            htmlFor="project-image-files"
                                            className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-bold text-primary hover:bg-primary/20 hover:text-white transition-all cursor-pointer block"
                                        >
                                            {isUploading ? 'Đang tải...' : '+ Thêm Ảnh'}
                                        </label>
                                    </div>
                                </div>

                                {/* Thumbnail previews */}
                                {currentProject.images && currentProject.images.length > 0 ? (
                                    <div className="grid grid-cols-4 gap-2 p-2.5 bg-slate-900/40 border border-white/5 rounded-xl">
                                        {currentProject.images.map((imgUrl, index) => (
                                            <div 
                                                key={index} 
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, index)}
                                                onDragOver={(e) => handleDragOver(e, index)}
                                                onDrop={(e) => handleDrop(e, index)}
                                                onDragEnd={handleDragEnd}
                                                className={`relative group/thumb aspect-video rounded-lg overflow-hidden border transition-all duration-300 cursor-grab active:cursor-grabbing ${
                                                    index === 0 
                                                        ? 'border-primary ring-1 ring-primary/45 shadow-[0_0_12px_rgba(20,184,166,0.15)]' 
                                                        : 'border-white/10 hover:border-white/30'
                                                } ${draggedIndex === index ? 'opacity-40 scale-95' : 'opacity-100'}`}
                                            >
                                                <img 
                                                    src={imgUrl} 
                                                    alt={`preview-${index}`} 
                                                    className="w-full h-full object-cover select-none"
                                                />
                                                
                                                {/* Cover Badge for index 0 */}
                                                {index === 0 && (
                                                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-primary text-[8px] font-extrabold text-slate-950 shadow-md pointer-events-none select-none uppercase tracking-wider">
                                                        Ảnh chính
                                                    </span>
                                                )}

                                                {/* Drag handle helper icon */}
                                                <div className="absolute top-1.5 right-1.5 p-1 rounded bg-black/60 text-slate-300 pointer-events-none opacity-50 group-hover/thumb:opacity-100 transition-opacity">
                                                    <GripHorizontal className="w-3 h-3" />
                                                </div>

                                                {/* Hover reorder text */}
                                                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                    <span className="text-[9px] text-white font-medium bg-black/80 px-1.5 py-0.5 rounded">Kéo thả</span>
                                                </div>

                                                {/* Delete Button */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage(index);
                                                    }}
                                                    className="absolute bottom-1.5 right-1.5 p-1 rounded bg-rose-600 hover:bg-rose-500 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 cursor-pointer shadow-md"
                                                    title="Xóa ảnh"
                                                >
                                                    <Trash className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-slate-900/20 border border-dashed border-white/10 rounded-xl text-xs text-muted-foreground">
                                        Chưa có hình ảnh nào. Hãy thêm ảnh để hiển thị Slider ngoài Landing Page.
                                    </div>
                                )}
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

                            {/* GitHub Repos Dynamic List */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-slate-300">Danh sách Repositories GitHub</label>
                                    <button
                                        type="button"
                                        onClick={addGithubRepo}
                                        className="px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary hover:bg-primary/20 hover:text-white transition-all cursor-pointer"
                                    >
                                        + Thêm Repo
                                    </button>
                                </div>
                                
                                {currentProject.repos && currentProject.repos.length > 0 ? (
                                    <div className="space-y-2 p-2.5 bg-slate-900/40 border border-white/5 rounded-xl">
                                        {currentProject.repos.map((repo, idx) => (
                                            <div key={idx} className="flex gap-2 items-center">
                                                <input 
                                                    type="text"
                                                    value={repo.label}
                                                    onChange={(e) => handleGithubRepoChange(idx, 'label', e.target.value)}
                                                    className="w-1/4 bg-slate-900/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                                                    placeholder="FE, BE, Admin..."
                                                />
                                                <input 
                                                    type="text"
                                                    value={repo.url}
                                                    onChange={(e) => handleGithubRepoChange(idx, 'url', e.target.value)}
                                                    className="w-2/3 bg-slate-900/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                                                    placeholder="https://github.com/..."
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeGithubRepo(idx)}
                                                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                                                >
                                                    <Trash className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-3 bg-slate-900/20 border border-dashed border-white/10 rounded-xl text-[11px] text-muted-foreground">
                                        Chưa có repository nào. Hãy bấm + Thêm Repo.
                                    </div>
                                )}
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
                                    disabled={isSaving || isUploading}
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
