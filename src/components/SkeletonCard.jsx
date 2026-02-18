export default function SkeletonCard() {
    return (
        <div className="bg-bg-card border border-border-subtle rounded-card py-4 px-4 flex items-center gap-4 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-bg-surface" />
            <div className="w-9 h-9 bg-bg-surface rounded-xl" />
            <div className="flex-1 space-y-2">
                <div className="h-3.5 w-3/5 bg-bg-surface rounded-md" />
                <div className="h-2.5 w-2/5 bg-bg-surface rounded-md" />
            </div>
            <div className="h-4 w-20 bg-bg-surface rounded-md" />
        </div>
    );
}
