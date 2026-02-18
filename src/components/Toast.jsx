import { CheckCircle, XCircle, X } from "lucide-react";

export default function Toast({ message, type, onClose }) {
    return (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border animate-slide-up ${type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            }`}>
            {type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span className="text-sm font-medium text-text-primary">{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-60 transition-opacity">
                <X size={16} />
            </button>
        </div>
    );
}
