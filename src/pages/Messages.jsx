import React, { useState, useEffect } from 'react';
import { Mail, Calendar, User, Search, RefreshCw, X, ShieldAlert } from 'lucide-react';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const fetchMessages = async () => {
        setIsLoading(true);
        setErrorMsg('');
        try {
            const res = await fetch('http://localhost:3000/api/contact');
            if (res.ok) {
                const data = await res.json();
                setMessages(data.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)));
            } else {
                setErrorMsg('Không thể tải danh sách thư liên hệ từ máy chủ.');
            }
        } catch (err) {
            setErrorMsg('Không thể kết nối đến máy chủ. Đang sử dụng dữ liệu mẫu dự phòng.');
            setMessages([
                { name: "Nguyễn Văn A", email: "john@example.com", subject: "Yêu cầu: Hợp tác dự án", message: "Chào Nghĩa, bên mình đang cần tuyển lập trình viên tối ưu cơ sở dữ liệu PostgreSQL. Vui lòng phản hồi sớm nhé!", timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
                { name: "Sarah Jenkins", email: "sarah@fintech.com", subject: "Đánh giá: Tích hợp API", message: "Hệ thống thanh toán hoạt động rất tốt, cấu trúc code sạch sẽ, cảm ơn bạn rất nhiều!", timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
                { name: "David Miller", email: "david@nexus.org", subject: "Dự án Freelance", message: "Chúng tôi muốn mời bạn làm việc trong dự án di chuyển dữ liệu 3 tháng. Có thể gọi trao đổi ngày mai không?", timestamp: new Date(Date.now() - 3600000 * 48).toISOString() }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const filteredMessages = messages.filter(msg => 
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (isoString) => {
        if (!isoString) return 'Vừa xong';
        const date = new Date(isoString);
        return date.toLocaleDateString('vi-VN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-left">
                    <h1 className="text-3xl font-bold font-outfit text-white">Hộp Thư Liên Hệ</h1>
                    <p className="text-sm text-muted-foreground mt-1">Xem và quản lý các yêu cầu liên hệ gửi từ website Portfolio.</p>
                </div>
                
                {/* Search & Refresh Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm người gửi, tiêu đề..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/60 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all duration-300"
                        />
                    </div>
                    <button 
                        onClick={fetchMessages}
                        disabled={isLoading}
                        className="p-2 rounded-xl glass-panel border-white/5 hover:border-primary/50 text-muted-foreground hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50"
                        title="Tải lại tin nhắn"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-primary' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Error alerts */}
            {errorMsg && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-center gap-3 text-left">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Main Table view */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/40 border-b border-white/5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                <th className="px-6 py-4">Người Gửi</th>
                                <th className="px-6 py-4">Tiêu Đề</th>
                                <th className="px-6 py-4">Thời Gian Nhận</th>
                                <th className="px-6 py-4 text-right">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                            {filteredMessages.length > 0 ? (
                                filteredMessages.map((msg, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white">{msg.name}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{msg.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-200 line-clamp-1 max-w-[250px]">{msg.subject}</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                                            {formatDate(msg.timestamp)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setSelectedMsg(msg)}
                                                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer"
                                            >
                                                Chi Tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-muted-foreground">
                                        Không tìm thấy thư liên hệ nào phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Inspect Modal Dialog */}
            {selectedMsg && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel max-w-lg w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in-up">
                        {/* Header */}
                        <div className="bg-slate-900/60 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="font-bold text-white font-outfit flex items-center gap-2">
                                <Mail className="w-5 h-5 text-primary" /> Chi Tiết Thư Liên Hệ
                            </h3>
                            <button 
                                onClick={() => setSelectedMsg(null)}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Content */}
                        <div className="p-6 space-y-6 text-left">
                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase">Người Gửi:</span>
                                    <p className="font-semibold text-white flex items-center gap-1.5">
                                        <User className="w-4 h-4 text-primary" /> {selectedMsg.name}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase">Email:</span>
                                    <a href={`mailto:${selectedMsg.email}`} className="font-semibold text-primary hover:underline block">
                                        {selectedMsg.email}
                                    </a>
                                </div>
                            </div>
                            <div className="space-y-1 text-sm border-t border-white/5 pt-4">
                                <span className="text-xs font-semibold text-muted-foreground uppercase">Tiêu Đề:</span>
                                <p className="font-semibold text-white">{selectedMsg.subject}</p>
                            </div>
                            <div className="space-y-2 text-sm border-t border-white/5 pt-4">
                                <span className="text-xs font-semibold text-muted-foreground uppercase">Nội Dung:</span>
                                <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 text-slate-300 leading-relaxed max-h-[200px] overflow-y-auto whitespace-pre-line">
                                    {selectedMsg.message}
                                </div>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="bg-slate-900/30 px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4.5 h-4.5 text-secondary" /> {formatDate(selectedMsg.timestamp)}
                            </span>
                            <button 
                                onClick={() => setSelectedMsg(null)}
                                className="px-4 py-2 rounded-lg font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
