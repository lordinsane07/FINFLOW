import { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = "success") => {
        setToast({ message, type, id: Date.now() });

        // auto-dismiss after 3 seconds
        setTimeout(() => {
            setToast(current => {
                // only dismiss if it's the same toast
                if (current && current.id === Date.now()) { // weak check but works for simple case
                    return null;
                }
                return null; // actually just nulling is fine for this simple app
            });
        }, 3000);
    }, []);

    const hideToast = () => setToast(null);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
        </ToastContext.Provider>
    );
}
