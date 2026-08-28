import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, Save, X, ExternalLink, Box } from 'lucide-react';
import api from '../lib/api';

const ExtensionsManager = () => {
    const [extensions, setExtensions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'form'

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        extensionId: '',
        desc: '',
        category: 'AI',
        installUrl: '',
        iconUrl: ''
    });

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchExtensions = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/portfolio/extensions');
            setExtensions(res.data);
        } catch (err) {
            console.error("Lỗi tải extensions:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExtensions();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (ext) => {
        setFormData({
            id: ext.id,
            name: ext.name,
            extensionId: ext.extensionId,
            desc: ext.desc,
            category: ext.category,
            installUrl: ext.installUrl || '',
            iconUrl: ext.iconUrl || ''
        });
        setErrorMsg('');
        setSuccessMsg('');
        setActiveTab('form');
    };

    const handleAddNew = () => {
        setFormData({
            id: '',
            name: '',
            extensionId: '',
            desc: '',
            category: 'AI',
            installUrl: '',
            iconUrl: ''
        });
        setErrorMsg('');
        setSuccessMsg('');
        setActiveTab('form');
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa extension này?")) return;
        try {
            await api.delete(`/portfolio/extensions/${id}`);
            setSuccessMsg("Xóa extension thành công!");
            fetchExtensions();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setErrorMsg("Không thể xóa extension.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMsg('');
        setSuccessMsg('');
        try {
            await api.post('/portfolio/extensions', formData);
            setSuccessMsg(formData.id ? "Cập nhật extension thành công!" : "Thêm extension mới thành công!");
            fetchExtensions();
            setTimeout(() => {
                setSuccessMsg('');
                setActiveTab('list');
            }, 1500);
        } catch (err) {
            setErrorMsg("Lưu dữ liệu thất bại. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setIsSaving(false);
        }
    };

    const categories = ['AI', 'NestJS', 'Formatter', 'Linter', 'Git', 'API Client', 'Database', 'CSS', 'Comments', 'Other'];

    const filteredExtensions = extensions.filter(ext => {
        const matchesSearch = ext.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              ext.extensionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              ext.desc.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || ext.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-wrap items-center justify-between gap-4 text-left">
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-white">Quản Lý VS Code Extensions</h1>
                    <p className="text-sm text-muted-foreground mt-1">Quản lý và hiển thị danh sách các extensions VS Code khuyên dùng trên trang Portfolio.</p>
                </div>
                {activeTab === 'list' && (
                    <button 
                        onClick={handleAddNew}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center gap-2 hover:shadow-[0_0_15px_rgba(20,184,166,0.25)] transition-all duration-300 cursor-pointer active:scale-95 text-sm"
                    >
                        <Plus className="w-4 h-4" /> Thêm Tiện Ích Mới
                    </button>
                )}
            </div>

            {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-left">
                    {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-left">
                    {errorMsg}
                </div>
            )}

            {activeTab === 'list' ? (
                <div className="space-y-6">
                    {/* Filter & Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-3 h-4 w-4 text-slate-500" />
                            <input 
                                type="text"
                                placeholder="Tìm kiếm extension..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary text-left"
                            />
                        </div>
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary text-left"
                        >
                            <option value="all">Tất cả danh mục</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Extension Cards Grid */}
                    {isLoading ? (
                        <div className="text-muted-foreground animate-pulse text-left py-10">Đang tải danh sách extensions...</div>
                    ) : filteredExtensions.length === 0 ? (
                        <div className="glass-panel p-10 rounded-2xl border border-white/5 text-center text-muted-foreground">
                            Không tìm thấy extension nào phù hợp.
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredExtensions.map((ext) => (
                                <div key={ext.id} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between text-left relative group">
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                                                {ext.iconUrl ? (
                                                    <img src={ext.iconUrl} alt={ext.name} className="w-8 h-8 object-contain rounded" />
                                                ) : (
                                                    <Box className="w-6 h-6 text-primary" />
                                                )}
                                            </div>
                                            <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded font-mono uppercase">
                                                {ext.category}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-md font-bold text-white font-outfit truncate">{ext.name}</h4>
                                            <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">{ext.extensionId}</p>
                                            <p className="text-xs text-muted-foreground mt-2 line-clamp-3 min-h-[48px]">{ext.desc}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                                        {ext.installUrl ? (
                                            <a 
                                                href={ext.installUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                                            >
                                                Marketplace <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <span />
                                        )}

                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleEdit(ext)}
                                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
                                                title="Sửa"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(ext.id)}
                                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-rose-400 hover:bg-rose-500/5 transition-all cursor-pointer"
                                                title="Xóa"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* Form Add/Edit */
                <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 max-w-2xl mx-auto text-left space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="text-lg font-bold text-white font-outfit">
                            {formData.id ? "Sửa Extension" : "Thêm Extension Mới"}
                        </h3>
                        <button 
                            type="button"
                            onClick={() => setActiveTab('list')}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 block">Tên Extension</label>
                            <input 
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Ví dụ: Prettier - Code formatter"
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 block">Danh mục</label>
                            <select 
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">Extension ID (VS Code Unique ID)</label>
                        <input 
                            type="text"
                            name="extensionId"
                            value={formData.extensionId}
                            onChange={handleInputChange}
                            required
                            placeholder="Ví dụ: esbenp.prettier-vscode"
                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">Mô tả ngắn</label>
                        <textarea 
                            name="desc"
                            value={formData.desc}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            placeholder="Mô tả công dụng và lý do khuyên dùng tiện ích này..."
                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 block">Đường Dẫn Cài Đặt (Marketplace URL)</label>
                            <input 
                                type="url"
                                name="installUrl"
                                value={formData.installUrl}
                                onChange={handleInputChange}
                                placeholder="https://marketplace.visualstudio.com/..."
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 block">Đường Dẫn Icon (Icon URL)</label>
                            <input 
                                type="url"
                                name="iconUrl"
                                value={formData.iconUrl}
                                onChange={handleInputChange}
                                placeholder="Link ảnh icon hoặc logo"
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                        <button 
                            type="button"
                            onClick={() => setActiveTab('list')}
                            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 cursor-pointer"
                        >
                            Hủy Bỏ
                        </button>
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:shadow-[0_0_15px_rgba(20,184,166,0.25)] transition-all duration-300 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4 mr-2 inline" /> {isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ExtensionsManager;
