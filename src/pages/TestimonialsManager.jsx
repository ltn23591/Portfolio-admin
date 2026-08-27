import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Star } from 'lucide-react';
import { usePortfolioStore } from '../stores/portfolioStore';

const TestimonialsManager = () => {
    const { 
        testimonials, isLoading, fetchTestimonials, 
        saveTestimonial, deleteTestimonial 
    } = usePortfolioStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [currentTest, setCurrentTest] = useState({
        id: null,
        name: '',
        role: '',
        content: '',
        rating: 5,
        avatarUrl: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const openAddModal = () => {
        setCurrentTest({
            id: null,
            name: '',
            role: '',
            content: '',
            rating: 5,
            avatarUrl: ''
        });
        setErrorMsg('');
        setModalOpen(true);
    };

    const openEditModal = (test) => {
        setCurrentTest(test);
        setErrorMsg('');
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
        try {
            await deleteTestimonial(id);
        } catch (err) {
            alert('Xóa đánh giá thất bại.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMsg('');
        try {
            await saveTestimonial(currentTest);
            setModalOpen(false);
        } catch (err) {
            setErrorMsg('Không thể lưu thông tin đánh giá.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentTest(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-left">
                    <h1 className="text-3xl font-bold font-outfit text-white">Quản Lý Đánh Giá</h1>
                    <p className="text-sm text-muted-foreground mt-1">Thêm, chỉnh sửa hoặc xóa nhận xét từ khách hàng và đối tác.</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center gap-2 hover:shadow-[0_0_15px_rgba(20,184,166,0.25)] transition-all duration-300 cursor-pointer"
                >
                    <Plus className="w-5 h-5" /> Thêm Đánh Giá
                </button>
            </div>

            {/* Testimonials list table */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 text-left">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/40 border-b border-white/5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                <th className="px-6 py-4">Khách Hàng</th>
                                <th className="px-6 py-4">Đánh Giá</th>
                                <th className="px-6 py-4">Nội Dung</th>
                                <th className="px-6 py-4 text-right">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground animate-pulse">Đang tải dữ liệu...</td>
                                </tr>
                            ) : testimonials.length > 0 ? (
                                testimonials.map((test, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={test.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'} 
                                                    alt={test.name}
                                                    className="w-10 h-10 rounded-full border border-white/10 object-cover"
                                                />
                                                <div>
                                                    <div className="font-semibold text-white">{test.name}</div>
                                                    <div className="text-xs text-teal-400 mt-0.5">{test.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-0.5 text-amber-400">
                                                {[...Array(test.rating)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-current" />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-slate-400 line-clamp-2 max-w-[300px]">{test.content}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => openEditModal(test)}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(test.id)}
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
                                    <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">Chưa có đánh giá nào.</td>
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
                                {currentTest.id ? 'Chỉnh Sửa Nhận Xét' : 'Thêm Nhận Xét Mới'}
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
                                    <label className="text-xs font-bold text-slate-300">Tên Khách Hàng</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={currentTest.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                                        placeholder="Ví dụ: Nguyễn Văn A"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">Chức Danh / Vị Trí</label>
                                    <input 
                                        type="text" 
                                        name="role"
                                        value={currentTest.role}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                                        placeholder="Ví dụ: CEO, Nexus Hub"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">Ảnh Đại Diện (URL)</label>
                                    <input 
                                        type="text" 
                                        name="avatarUrl"
                                        value={currentTest.avatarUrl}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300">Đánh Giá Sao (1-5)</label>
                                    <input 
                                        type="number" 
                                        name="rating"
                                        min="1"
                                        max="5"
                                        value={currentTest.rating}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-300">Nội Dung Nhận Xét</label>
                                <textarea 
                                    name="content"
                                    value={currentTest.content}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white resize-none"
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

export default TestimonialsManager;
