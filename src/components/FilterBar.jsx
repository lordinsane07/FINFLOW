import { Search, X } from "lucide-react";

const CATEGORIES = [
    { label: "All Categories", value: "" },
    { label: "Food 🍔", value: "Food" },
    { label: "Transport 🚗", value: "Transport" },
    { label: "Shopping 🛍️", value: "Shopping" },
    { label: "Health 💊", value: "Health" },
    { label: "Entertainment 🎬", value: "Entertainment" },
    { label: "Salary 💼", value: "Salary" },
    { label: "Freelance 💻", value: "Freelance" },
    { label: "Utilities 🔌", value: "Utilities" },
    { label: "Other", value: "Other" },
];

export default function FilterBar({ filters, setFilters }) {
    const handleChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            category: "",
            type: "all",
            dateFrom: "",
            dateTo: ""
        });
    };

    const inputClass = "w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-btn text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20 transition-all";

    return (
        <div className="vault-card p-4 mb-2">
            <div className="flex flex-col gap-3">
                {/* Search Input */}
                <div className="relative w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={filters.search}
                        onChange={(e) => handleChange("search", e.target.value)}
                        className={`${inputClass} pl-10`}
                    />
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Category */}
                    <div className="relative">
                        <select
                            value={filters.category}
                            onChange={(e) => handleChange("category", e.target.value)}
                            className={`${inputClass} cursor-pointer appearance-none pr-8`}
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.label} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted text-xs">▼</div>
                    </div>

                    {/* Type */}
                    <div className="relative">
                        <select
                            value={filters.type}
                            onChange={(e) => handleChange("type", e.target.value)}
                            className={`${inputClass} cursor-pointer appearance-none pr-8`}
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted text-xs">▼</div>
                    </div>

                    {/* Date From */}
                    <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => handleChange("dateFrom", e.target.value)}
                        className={inputClass}
                    />

                    {/* Date To + Clear */}
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => handleChange("dateTo", e.target.value)}
                            className={`${inputClass} flex-1`}
                        />
                        <button
                            onClick={clearFilters}
                            className="p-2.5 rounded-btn border border-[var(--input-border)] hover:border-accent-expense text-text-muted hover:text-accent-expense hover:bg-[var(--color-expense-dim)] transition-all"
                            title="Clear Filters"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
