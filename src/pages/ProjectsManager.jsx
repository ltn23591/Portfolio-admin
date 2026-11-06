import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Save,
    RefreshCw,
    Trash,
    GripHorizontal,
    Trophy,
} from 'lucide-react';
import { SpotlightCard, BlurText, ShinyText } from '../components/reactbits';
import { API_URL } from '../lib/api';

const ProjectsManager = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState({
        id: null,
        isBest: false,
        title: '',
        description: '',
        highlightsText: '',
        category: 'fullstack',
        tech: '',
        github: '',
        live: '',
        images: [],
        repos: [],
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [draggedIndex, setDraggedIndex] = useState(null);

    const fetchProjects = async () => {
        setIsLoading(true);
        setErrorMsg('');
        try {
            const res = await fetch(`${API_URL}/api/portfolio/projects`);
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
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
                const res = await fetch(`${API_URL}/api/portfolio/projects`);
                if (res.ok && isMounted) {
                    const data = await res.json();
                    setProjects(data);
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
        setCurrentProject({
            id: null,
            isBest: false,
            title: '',
            description: '',
            highlightsText: '',
            category: 'fullstack',
            tech: '',
            github: '',
            live: '',
            images: [],
            repos: [],
        });
        setErrorMsg('');
        setModalOpen(true);
    };

    const openEditModal = (proj) => {
        setCurrentProject({
            ...proj,
            isBest: Boolean(proj.isBest),
            highlightsText: Array.isArray(proj.highlights)
                ? proj.highlights.join('\n')
                : proj.description || '',
            tech: Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech || '',
            images: Array.isArray(proj.images)
                ? proj.images
                : proj.images
                ? [proj.images]
                : [],
            repos: Array.isArray(proj.repos) ? proj.repos : [],
        });
        setErrorMsg('');
        setModalOpen(true);
    };

    const handleSetBestProject = async (proj) => {
        try {
            const payload = {
                ...proj,
                isBest: true,
                highlights: Array.isArray(proj.highlights) ? proj.highlights : [],
                tech: Array.isArray(proj.tech) ? proj.tech : [],
                images: Array.isArray(proj.images) ? proj.images : [],
                repos: Array.isArray(proj.repos) ? proj.repos : [],
            };
            const res = await fetch(`${API_URL}/api/portfolio/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                fetchProjects();
            } else {
                alert('Không thể đặt làm Best Project.');
            }
        } catch {
            alert('Lỗi kết nối máy chủ.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) return;
        try {
            const res = await fetch(`${API_URL}/api/portfolio/projects/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchProjects();
            } else {
                alert('Xóa dự án thất bại.');
            }
        } catch {
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
                const res = await fetch(`${API_URL}/api/upload`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                if (res.ok && data.url) {
                    uploadedUrls.push(data.url);
                } else {
                    setErrorMsg(data.message || 'Tải một số ảnh lên thất bại.');
                }
            }

            if (uploadedUrls.length > 0) {
                setCurrentProject((prev) => ({
                    ...prev,
                    images: [...(prev.images || []), ...uploadedUrls],
                }));
            }
        } catch {
            setErrorMsg('Lỗi kết nối khi tải ảnh lên.');
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (indexToRemove) => {
        setCurrentProject((prev) => ({
            ...prev,
            images: prev.images.filter((_, idx) => idx !== indexToRemove),
        }));
    };

    const handleDragStart = (idx) => {
        setDraggedIndex(idx);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (targetIndex) => {
        if (draggedIndex === null || draggedIndex === targetIndex) return;
        const updatedImages = [...currentProject.images];
        const [draggedImage] = updatedImages.splice(draggedIndex, 1);
        updatedImages.splice(targetIndex, 0, draggedImage);
        setCurrentProject((prev) => ({
            ...prev,
            images: updatedImages,
        }));
        setDraggedIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const addGithubRepo = () => {
        setCurrentProject((prev) => ({
            ...prev,
            repos: [...(prev.repos || []), { label: '', url: '' }],
        }));
    };

    const removeGithubRepo = (idx) => {
        setCurrentProject((prev) => ({
            ...prev,
            repos: prev.repos.filter((_, i) => i !== idx),
        }));
    };

    const handleGithubRepoChange = (idx, field, value) => {
        setCurrentProject((prev) => {
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
            ? currentProject.tech
                  .split(',')
                  .map((t) => t.trim())
                  .filter((t) => t.length > 0)
            : [];

        const highlightsArray = currentProject.highlightsText
            ? currentProject.highlightsText
                  .split('\n')
                  .map((h) => h.trim())
                  .filter((h) => h.length > 0)
            : [];

        const reposList = (currentProject.repos || [])
            .filter((r) => r.url.trim().length > 0)
            .map((r) => ({ label: r.label.trim() || 'Code', url: r.url.trim() }));

        const primaryGithub = reposList.length > 0 ? reposList[0].url : currentProject.github;

        const payload = {
            ...currentProject,
            highlights: highlightsArray,
            tech: techArray,
            images: currentProject.images,
            github: primaryGithub,
            repos: reposList,
        };

        try {
            const res = await fetch(`${API_URL}/api/portfolio/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setModalOpen(false);
                fetchProjects();
            } else {
                setErrorMsg('Không thể lưu thông tin dự án.');
            }
        } catch {
            setErrorMsg('Lỗi kết nối.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentProject((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-left">
                    <ShinyText
                        text="05, 06 & 07 // PROJECTS, DETAIL & BEST PROJECT"
                        speed={3}
                        className="text-xs font-orbitron font-bold uppercase tracking-widest mb-1"
                    />
                    <h1 className="text-3xl font-bold font-orbitron text-white">
                        <BlurText text="5-7. Quản Lý Dự Án & Best Project" />
                    </h1>
                    <p className="text-sm text-muted-foreground font-space mt-1">
                        Quản lý danh sách dự án, đánh dấu Best Project và các kết quả nổi bật nhất (Project Detail).
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all duration-300 cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Thêm Dự Án Mới
                </button>
            </div>

            {/* Project List Table */}
            <SpotlightCard className="overflow-hidden text-left">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/60 border-b border-white/5 text-xs font-orbitron font-bold uppercase tracking-wider text-muted-foreground">
                                <th className="px-6 py-4">Hình Ảnh & Tên Dự Án</th>
                                <th className="px-6 py-4">Phân Loại</th>
                                <th className="px-6 py-4">Công Nghệ</th>
                                <th className="px-6 py-4 text-right">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm text-slate-300 font-space">
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-8 text-center text-muted-foreground font-orbitron animate-pulse"
                                    >
                                        Đang tải danh sách dự án...
                                    </td>
                                </tr>
                            ) : projects.length > 0 ? (
                                projects.map((proj, idx) => (
                                    <tr
                                        key={idx}
                                        className="hover:bg-white/5 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        proj.images && proj.images.length > 0
                                                            ? proj.images[0]
                                                            : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100'
                                                    }
                                                    alt={proj.title}
                                                    className="w-14 h-9 rounded object-cover border border-white/10 shrink-0"
                                                />
                                                <div className="font-semibold text-white flex flex-col">
                                                    <span className="font-orbitron text-sm flex items-center gap-2">
                                                        {proj.title}
                                                        {proj.isBest && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px]">
                                                                <Trophy className="w-3 h-3" /> BEST
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="text-[11px] text-muted-foreground">
                                                        ({proj.images ? proj.images.length : 0} ảnh)
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded text-xs font-orbitron font-semibold bg-slate-900 border border-white/10 text-teal-400 uppercase">
                                                {proj.category === 'fullstack'
                                                    ? 'Fullstack'
                                                    : 'Backend API'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1.5 max-w-[260px]">
                                                {(proj.tech || []).map((t, tIdx) => (
                                                    <span
                                                        key={tIdx}
                                                        className="text-[10px] font-orbitron bg-white/5 px-2 py-0.5 rounded text-slate-300"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {!proj.isBest && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSetBestProject(proj)}
                                                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-orbitron font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                                        title="Đặt làm dự án nổi bật nhất (Best Project)"
                                                    >
                                                        <Trophy className="w-3.5 h-3.5" /> Đặt Best
                                                    </button>
                                                )}
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
                                    <td
                                        colSpan="4"
                                        className="px-6 py-8 text-center text-muted-foreground"
                                    >
                                        Chưa có dự án trong cơ sở dữ liệu. Đang hiển thị bộ dự án tiêu biểu mặc định trên trang chủ.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </SpotlightCard>

            {/* Add / Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="glass-panel max-w-2xl w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in-up text-left my-auto">
                        <div className="bg-slate-900/80 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                            <h3 className="font-bold text-white font-orbitron">
                                {currentProject.id ? 'Chỉnh Sửa Dự Án' : 'Thêm Dự Án Mới'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-muted-foreground hover:text-white cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="p-6 space-y-4 max-h-[82vh] overflow-y-auto font-space"
                        >
                            {errorMsg && (
                                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
                                    {errorMsg}
                                </div>
                            )}

                            {/* 7. Best Project Toggle */}
                            <label className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Trophy className="w-5 h-5 text-amber-400" />
                                    <div>
                                        <span className="text-xs font-orbitron font-bold text-amber-300 uppercase block">
                                            7. Đánh Dấu Là Best Project (Dự Án Nổi Bật Nhất)
                                        </span>
                                        <span className="text-xs text-slate-300">
                                            Hiển thị tại khung Featured lớn đầu mục Dự án kèm các chỉ số kết quả đột phá.
                                        </span>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    name="isBest"
                                    checked={Boolean(currentProject.isBest)}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 accent-teal-400 cursor-pointer"
                                />
                            </label>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-orbitron text-slate-300 block">
                                        Tên Dự Án
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={currentProject.title}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="DevFlow - Realtime Hub"
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-orbitron text-slate-300 block">
                                        Danh Mục
                                    </label>
                                    <select
                                        name="category"
                                        value={currentProject.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="fullstack">Fullstack</option>
                                        <option value="backend">Backend & API</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    Tóm Tắt Ngắn Gọn (1-2 câu trên thẻ dự án)
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    value={currentProject.description}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Hệ thống điều phối tác vụ ngầm và API chịu tải cao..."
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            {/* 6. Project Detail Highlights */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    6. Kết Quả Nổi Bật Trong Project Detail (Mỗi dòng 1 kết quả ngắn gọn)
                                </label>
                                <textarea
                                    name="highlightsText"
                                    value={currentProject.highlightsText}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder={`Xử lý 50,000+ requests/ngày với độ trễ < 80ms\nGiảm 60% tải Database nhờ Redis Cluster Caching\nTích hợp thanh toán Stripe & Webhook tự động`}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary resize-none"
                                />
                            </div>

                            {/* Multi-Image Upload */}
                            <div className="space-y-2">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    Hình Ảnh Dự Án
                                </label>
                                {currentProject.images && currentProject.images.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-2">
                                        {currentProject.images.map((imgUrl, idx) => (
                                            <div
                                                key={idx}
                                                draggable
                                                onDragStart={() => handleDragStart(idx)}
                                                onDragOver={handleDragOver}
                                                onDrop={() => handleDrop(idx)}
                                                onDragEnd={handleDragEnd}
                                                className={`relative group rounded-xl overflow-hidden border border-white/15 aspect-video bg-slate-900 cursor-grab ${
                                                    draggedIndex === idx ? 'opacity-40 scale-95' : ''
                                                }`}
                                            >
                                                <img
                                                    src={imgUrl}
                                                    alt={`Preview ${idx}`}
                                                    className="w-full h-full object-cover pointer-events-none"
                                                />
                                                <div className="absolute top-1.5 left-1.5 p-1 rounded bg-slate-950/60 text-white/70">
                                                    <GripHorizontal className="w-3.5 h-3.5" />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                >
                                                    <Trash className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="project-image-upload"
                                    />
                                    <label
                                        htmlFor="project-image-upload"
                                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-orbitron font-semibold text-primary flex items-center gap-2 cursor-pointer transition-all"
                                    >
                                        {isUploading ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" /> Đang tải...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4" /> Tải Ảnh Lên
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    Công Nghệ Sử Dụng (Phân tách bằng dấu phẩy)
                                </label>
                                <input
                                    type="text"
                                    name="tech"
                                    value={currentProject.tech}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="React.js, Node.js, NestJS, PostgreSQL, Redis"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            {/* Multi-Repo & Live Links */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-orbitron text-slate-300 block">
                                        Đường Dẫn Mã Nguồn (GitHub)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addGithubRepo}
                                        className="text-xs font-orbitron font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Thêm Repo
                                    </button>
                                </div>

                                {currentProject.repos &&
                                    currentProject.repos.map((repo, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="Nhãn (VD: Backend)"
                                                value={repo.label}
                                                onChange={(e) =>
                                                    handleGithubRepoChange(
                                                        idx,
                                                        'label',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-1/3 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                                            />
                                            <input
                                                type="url"
                                                placeholder="https://github.com/..."
                                                value={repo.url}
                                                onChange={(e) =>
                                                    handleGithubRepoChange(
                                                        idx,
                                                        'url',
                                                        e.target.value
                                                    )
                                                }
                                                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeGithubRepo(idx)}
                                                className="p-2 rounded-lg bg-rose-500/10 text-rose-400 cursor-pointer"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-orbitron text-slate-300 block">
                                    Đường Dẫn Live Demo
                                </label>
                                <input
                                    type="text"
                                    name="live"
                                    value={currentProject.live}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
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
                                    {isSaving ? 'Đang lưu...' : 'Lưu Dự Án'}
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
