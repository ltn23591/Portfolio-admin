import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, BookOpen, Terminal, Code2, Database, Search, Filter, Sparkles } from 'lucide-react';

const LibrariesManager = () => {
    const [libraries, setLibraries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentLib, setCurrentLib] = useState({
        id: null,
        name: '',
        filename: '',
        language: 'TypeScript',
        category: 'frontend',
        desc: '',
        install: '',
        codeTs: '',
        codeJs: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Admin filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const fetchLibraries = async () => {
        setIsLoading(true);
        setErrorMsg('');
        try {
            const res = await fetch('http://localhost:3000/api/portfolio/libraries');
            if (res.ok) {
                const data = await res.json();
                setLibraries(data);
            }
        } catch (err) {
            setErrorMsg('Không thể kết nối đến máy chủ API.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLibraries();
    }, []);

    const openAddModal = () => {
        setCurrentLib({
            id: null,
            name: '',
            filename: '',
            language: 'TypeScript',
            category: 'frontend',
            desc: '',
            install: '',
            codeTs: '',
            codeJs: ''
        });
        setErrorMsg('');
        setModalOpen(true);
    };

    const openEditModal = (lib) => {
        setCurrentLib({ ...lib });
        setErrorMsg('');
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa thư viện này?')) return;
        try {
            const res = await fetch(`http://localhost:3000/api/portfolio/libraries/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchLibraries();
            } else {
                alert('Xóa thư viện thất bại.');
            }
        } catch (err) {
            alert('Lỗi kết nối.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMsg('');

        try {
            const res = await fetch('http://localhost:3000/api/portfolio/libraries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentLib)
            });
            if (res.ok) {
                setModalOpen(false);
                fetchLibraries();
            } else {
                setErrorMsg('Không thể lưu thông tin thư viện.');
            }
        } catch (err) {
            setErrorMsg('Lỗi kết nối.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentLib(prev => ({ ...prev, [name]: value }));
    };

    // AI Generation Handler
    const generateWithAI = async () => {
        if (!currentLib.name) {
            alert('Vui lòng nhập Tên Thư Viện trước để AI có thể làm việc!');
            return;
        }
        setIsGeneratingAI(true);
        setErrorMsg('');
        try {
            const res = await fetch('http://localhost:3000/api/portfolio/libraries/generate-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: currentLib.name,
                    category: currentLib.category
                })
            });
            if (res.ok) {
                const data = await res.json();
                setCurrentLib(prev => ({
                    ...prev,
                    filename: data.filename || prev.filename || `${prev.name.toLowerCase().replace(/\s+/g, '')}.ts — Integration`,
                    install: data.install || prev.install || `npm install ${prev.name.toLowerCase().replace(/\s+/g, '-')}`,
                    desc: data.desc || prev.desc,
                    codeTs: data.codeTs || prev.codeTs,
                    codeJs: data.codeJs || prev.codeJs
                }));
            } else {
                setErrorMsg('Không thể tạo dữ liệu bằng AI. Vui lòng kiểm tra lại API Key ở backend.');
            }
        } catch (err) {
            setErrorMsg('Lỗi kết nối đến dịch vụ AI ở backend.');
        } finally {
            setIsGeneratingAI(false);
        }
    };

    // Boilerplate Generator
    const applyTemplate = (type) => {
        if (type === 'ts') {
            setCurrentLib(prev => ({
                ...prev,
                codeTs: `import React from 'react';\n\ninterface Props {\n  title: string;\n}\n\nexport const MyComponent: React.FC<Props> = ({ title }) => {\n  return (\n    <div className="p-4 bg-slate-900 text-white rounded-xl">\n      <h2>{title}</h2>\n    </div>\n  );\n};`
            }));
        } else if (type === 'js') {
            setCurrentLib(prev => ({
                ...prev,
                codeJs: `import React from 'react';\n\nexport const MyComponent = ({ title }) => {\n  return (\n    <div className="p-4 bg-slate-900 text-white rounded-xl">\n      <h2>{title}</h2>\n    </div>\n  );\n};`
            }));
        }
    };

    // Filtering Libraries
    const filteredLibraries = libraries.filter(lib => {
        const matchesSearch = lib.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              lib.desc.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || lib.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-wrap items-center justify-between gap-4 text-left">
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-white flex items-center gap-2">
                        <BookOpen className="text-primary w-8 h-8" /> Quản Lý Thư Viện
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Quản lý kho thư viện kỹ thuật, hỗ trợ lưu trữ song song mã nguồn TypeScript & JavaScript.</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center gap-2 hover:shadow-[0_0_15px_rgba(20,184,166,0.25)] transition-all duration-300 cursor-pointer"
                >
                    <Plus className="w-5 h-5" /> Thêm Thư Viện Mới
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/5 text-left">
                <div className="flex-1 min-w-[280px] relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text"
                        placeholder="Tìm kiếm thư viện nhanh..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950/60 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-white"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-slate-950/60 border border-white/5 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    >
                        <option value="all">Tất Cả Phân Loại</option>
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">Database / DevOps</option>
                    </select>
                </div>
            </div>

            {/* List Table */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 text-left">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/40 border-b border-white/5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                <th className="px-6 py-4">Tên Thư Viện & File Cấu Hình</th>
                                <th className="px-6 py-4">Phân Loại</th>
                                <th className="px-6 py-4">Ngôn Ngữ</th>
                                <th className="px-6 py-4">Mã Nguồn Đang Có</th>
                                <th className="px-6 py-4 text-right">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground animate-pulse">Đang tải danh sách thư viện...</td>
                                </tr>
                            ) : filteredLibraries.length > 0 ? (
                                filteredLibraries.map((lib, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white">{lib.name}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5 font-mono">{lib.filename}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-900 border border-white/5 text-teal-400 capitalize">
                                                {lib.category === 'frontend' ? 'Frontend' : lib.category === 'backend' ? 'Backend' : 'Database / DevOps'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                            {lib.language}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {lib.codeTs && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">TS Code</span>
                                                )}
                                                {lib.codeJs && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">JS Code</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => openEditModal(lib)}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(lib.id)}
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
                                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">Không tìm thấy thư viện nào khớp với bộ lọc.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Overlay */}
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel max-w-4xl w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in-up text-left">
                        {/* Header */}
                        <div className="bg-slate-900/60 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="font-bold text-white font-outfit">
                                {currentLib.id ? 'Chỉnh Sửa Thư Viện' : 'Thêm Thư Viện Mới'}
                            </h3>
                            <button 
                                onClick={() => setModalOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                            {errorMsg && (
                                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl">
                                    {errorMsg}
                                </div>
                            )}

                            {/* AI Helper Banner */}
                            <div className="flex flex-wrap gap-3 justify-between items-center bg-indigo-950/20 border border-indigo-500/10 p-3 rounded-xl">
                                <div className="text-xs text-indigo-300 font-outfit">
                                    💡 <strong>Mẹo AI:</strong> Chỉ cần nhập <strong>Tên Thư Viện</strong>, chọn <strong>Phân Loại</strong> rồi bấm nút bên để tự động điền tài liệu Markdown và Code.
                                </div>
                                <button
                                    type="button"
                                    onClick={generateWithAI}
                                    disabled={isGeneratingAI || !currentLib.name}
                                    className="text-xs bg-indigo-600/35 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-200 font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                                >
                                    <Sparkles className="w-4 h-4 text-indigo-400" /> {isGeneratingAI ? 'Đang tạo bằng AI...' : 'Tạo bằng AI'}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">Tên Thư Viện</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={currentLib.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                                        placeholder="Ví dụ: Axios Client"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">Tên File Cấu Hình</label>
                                    <input 
                                        type="text" 
                                        name="filename"
                                        value={currentLib.filename}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-mono"
                                        placeholder="Ví dụ: api.ts — Axios"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">Phân Loại</label>
                                    <select 
                                        name="category"
                                        value={currentLib.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                                    >
                                        <option value="frontend">Frontend</option>
                                        <option value="backend">Backend</option>
                                        <option value="database">Database / DevOps</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">Ngôn Ngữ Chính</label>
                                    <input 
                                        type="text" 
                                        name="language"
                                        value={currentLib.language}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-mono"
                                        placeholder="TypeScript, JavaScript..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">Lệnh Cài Đặt</label>
                                    <input 
                                        type="text" 
                                        name="install"
                                        value={currentLib.install}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-mono"
                                        placeholder="npm install axios"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-300">Mô Tả & Hướng Dẫn (Tiếng Việt)</label>
                                <textarea 
                                    name="desc"
                                    value={currentLib.desc}
                                    onChange={handleInputChange}
                                    required
                                    rows={8}
                                    className="w-full bg-slate-950/90 border border-white/5 rounded-xl px-4 py-2 text-xs font-mono text-emerald-400 resize-y"
                                    placeholder="Viết mô tả ngắn gọn hoặc để AI sinh tự động..."
                                />
                             </div>

                            {/* Dual Code Area */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-sky-400 font-mono">1. Mã Nguồn TypeScript (TS)</label>
                                        <button 
                                            type="button"
                                            onClick={() => applyTemplate('ts')}
                                            className="text-[10px] text-slate-400 hover:text-white transition-colors underline cursor-pointer"
                                        >
                                            Chèn Template TS
                                        </button>
                                    </div>
                                    <textarea 
                                        name="codeTs"
                                        value={currentLib.codeTs}
                                        onChange={handleInputChange}
                                        required
                                        rows={12}
                                        className="w-full bg-slate-950/90 border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-sky-400 resize-y"
                                        placeholder="Nhập mã nguồn mẫu dạng TypeScript..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-amber-400 font-mono">2. Mã Nguồn JavaScript (JS)</label>
                                        <button 
                                            type="button"
                                            onClick={() => applyTemplate('js')}
                                            className="text-[10px] text-slate-400 hover:text-white transition-colors underline cursor-pointer"
                                        >
                                            Chèn Template JS
                                        </button>
                                    </div>
                                    <textarea 
                                        name="codeJs"
                                        value={currentLib.codeJs}
                                        onChange={handleInputChange}
                                        required
                                        rows={12}
                                        className="w-full bg-slate-950/90 border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-amber-400 resize-y"
                                        placeholder="Nhập mã nguồn mẫu dạng JavaScript..."
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

export default LibrariesManager;
