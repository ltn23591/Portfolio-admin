import React, { useState, useEffect } from 'react';
import { Mail, Calendar, User, Search, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { SpotlightCard, BlurText, ShinyText } from '../components/reactbits';

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
                setMessages(
                    data.sort(
                        (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
                    )
                );
            } else {
                setErrorMsg('Không thể tải danh sách thư liên hệ từ máy chủ.');
            }
        } catch {
            setErrorMsg('Không thể kết nối đến máy chủ. Đang hiển thị dữ liệu mẫu.');
            setMessages([
                {
                    name: 'Nguyễn Văn A',
                    email: 'john@example.com',
                    subject: 'Yêu cầu: Hợp tác dự án',
                    message:
                        'Chào Nghĩa, bên mình đang cần tuyển lập trình viên tối ưu cơ sở dữ liệu PostgreSQL. Vui lòng phản hồi sớm nhé!',
                    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
                },
                {
                    name: 'Sarah Jenkins',
                    email: 'sarah@fintech.com',
                    subject: 'Tuyển dụng Senior Backend Engineer',
                    message:
                        'Chúng tôi rất ấn tượng với kiến trúc Microservices trong Best Project của bạn. Hẹn bạn một buổi phỏng vấn kỹ thuật nhé!',
                    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/contact');
                if (res.ok && isMounted) {
                    const data = await res.json();
                    setMessages(
                        data.sort(
                            (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
                        )
                    );
                }
            } catch {
                if (isMounted) {
                    setErrorMsg('Không thể kết nối đến máy chủ. Đang hiển thị dữ liệu mẫu.');
                    setMessages([
                        {
                            name: 'Nguyễn Văn A',
                            email: 'john@example.com',
                            subject: 'Yêu cầu: Hợp tác dự án',
                            message:
                                'Chào Nghĩa, bên mình đang cần tuyển lập trình viên tối ưu cơ sở dữ liệu PostgreSQL. Vui lòng phản hồi sớm nhé!',
                            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
                        },
                        {
                            name: 'Sarah Jenkins',
                            email: 'sarah@fintech.com',
                            subject: 'Tuyển dụng Senior Backend Engineer',
                            message:
                                'Chúng tôi rất ấn tượng với kiến trúc Microservices trong Best Project của bạn. Hẹn bạn một buổi phỏng vấn kỹ thuật nhé!',
                            timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
                        },
                    ]);
                }
            }
        };
        init();
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredMessages = messages.filter(
        (msg) =>
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
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-left">
                    <ShinyText
                        text="08 // WORK CONTACT INBOX"
                        speed={3}
                        className="text-xs font-orbitron font-bold uppercase tracking-widest mb-1"
                    />
                    <h1 className="text-3xl font-bold font-orbitron text-white">
                        <BlurText text="8. Hộp Thư Liên Hệ Công Việc" />
                    </h1>
                    <p className="text-sm text-muted-foreground font-space mt-1">
                        Xem và quản lý các tin nhắn tuyển dụng, hợp tác gửi từ mục Contact.
                    </p>
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
                            className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                        />
                    </div>
                    <button
                        onClick={fetchMessages}
                        disabled={isLoading}
                        className="p-2.5 rounded-xl glass-panel border-white/10 hover:border-primary/50 text-muted-foreground hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50"
                        title="Tải lại tin nhắn"
                    >
                        <RefreshCw
                            className={`w-5 h-5 ${isLoading ? 'animate-spin text-primary' : ''}`}
                        />
                    </button>
                </div>
            </div>

            {errorMsg && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-center gap-3 text-left">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Main Table view */}
            <SpotlightCard className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/60 border-b border-white/5 text-xs font-orbitron font-bold uppercase tracking-wider text-muted-foreground">
                                <th className="px-6 py-4">Người Gửi</th>
                                <th className="px-6 py-4">Tiêu Đề Công Việc</th>
                                <th className="px-6 py-4">Thời Gian Nhận</th>
                                <th className="px-6 py-4 text-right">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm text-slate-300 font-space">
                            {filteredMessages.length > 0 ? (
                                filteredMessages.map((msg, idx) => (
                                    <tr
                                        key={idx}
                                        className="hover:bg-white/5 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-bold font-orbitron text-white text-xs">
                                                {msg.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                {msg.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-200 line-clamp-1 max-w-[260px]">
                                                {msg.subject}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                                            {formatDate(msg.timestamp)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedMsg(msg)}
                                                className="px-3.5 py-1.5 rounded-lg text-xs font-orbitron font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer"
                                            >
                                                Chi Tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-12 text-center text-muted-foreground"
                                    >
                                        Không tìm thấy thư liên hệ nào phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </SpotlightCard>

            {/* Inspect Modal Dialog */}
            {selectedMsg && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel max-w-lg w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in-up text-left">
                        <div className="bg-slate-900/60 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="font-bold text-white font-orbitron flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-primary" /> Chi Tiết Thư Liên Hệ
                            </h3>
                            <button
                                onClick={() => setSelectedMsg(null)}
                                className="p-1 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 font-space">
                            <div className="grid grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-xl border border-white/5">
                                <div>
                                    <span className="text-[10px] font-orbitron uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                        <User className="w-3 h-3 text-primary" /> Người Gửi
                                    </span>
                                    <p className="text-sm font-semibold text-white mt-1">
                                        {selectedMsg.name}
                                    </p>
                                    <p className="text-xs text-teal-400">{selectedMsg.email}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-orbitron uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-secondary" /> Thời Gian
                                    </span>
                                    <p className="text-xs font-mono text-slate-300 mt-1">
                                        {formatDate(selectedMsg.timestamp)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <span className="text-xs font-orbitron font-bold uppercase tracking-wider text-muted-foreground">
                                    Tiêu Đề
                                </span>
                                <h4 className="text-base font-semibold text-white mt-1">
                                    {selectedMsg.subject}
                                </h4>
                            </div>

                            <div>
                                <span className="text-xs font-orbitron font-bold uppercase tracking-wider text-muted-foreground">
                                    Nội Dung Tin Nhắn
                                </span>
                                <div className="mt-2 p-4 rounded-xl bg-slate-900/60 border border-white/5 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                                    {selectedMsg.message}
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/40 px-6 py-4 border-t border-white/5 flex justify-end gap-3">
                            <a
                                href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`}
                                className="px-4 py-2 rounded-xl text-xs font-orbitron font-bold bg-primary text-slate-950 hover:bg-primary/90 transition-all"
                            >
                                Phản Hồi Qua Email
                            </a>
                            <button
                                onClick={() => setSelectedMsg(null)}
                                className="px-4 py-2 rounded-xl text-xs font-orbitron font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
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
