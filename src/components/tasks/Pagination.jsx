import { cn } from '../../utils/helpers'

export default function Pagination({ pagination, onPageChange }) {
    const { page, limit, total } = pagination
    const totalPages = Math.ceil(total / limit)
    if (totalPages <= 1) return null

    const pages = []
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
            pages.push(i)
        } else if (i === page - 2 || i === page + 2) {
            pages.push('...')
        }
    }
    // Deduplicate ellipses
    const deduped = pages.filter((p, idx) => p !== '...' || pages[idx - 1] !== '...')

    return (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-muted)]">
                {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} tasks
            </p>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className="btn-ghost px-2 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {deduped.map((p, i) =>
                    p === '...' ? (
                        <span key={`dot-${i}`} className="px-2 text-[var(--text-muted)]">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={cn(
                                'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                                p === page
                                    ? 'bg-brand-500 text-white shadow-glow-sm'
                                    : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                            )}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="btn-ghost px-2 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    )
}