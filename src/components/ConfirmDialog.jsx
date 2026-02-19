import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-sm bg-[var(--modal-bg)] border border-[var(--modal-border)] rounded-2xl shadow-2xl animate-pop-in p-6 text-center space-y-5">
                <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto">
                    <AlertTriangle size={24} className="text-rose-400" />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-text-primary mb-2">{title || "Are you sure?"}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{message || "This action cannot be undone."}</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-btn border border-[var(--input-border)] text-text-secondary font-semibold text-sm hover:bg-bg-surface transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className="flex-1 py-2.5 rounded-btn bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:bg-rose-600 transition-all"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
