import { AlertTriangle, BadgeInfo } from 'lucide-react'

interface PriceCollectionNoticeProps {
  badge?: string
  title?: string
  message?: string
  arabicNote?: string
  className?: string
}

export function PriceCollectionNotice({
  badge = 'Information importante',
  title = 'Collecte des prix en toute transparence',
  message = 'Les prix sur notre plateforme sont collectés à partir des prix affichés sur les sites respectifs.',
  arabicNote = 'أما من داخل، ماندروش',
  className = '',
}: PriceCollectionNoticeProps) {
  return (
    <section className={`relative overflow-hidden rounded-[26px] border border-amber-200/70 bg-linear-to-r from-amber-50 via-white to-orange-50 p-4 shadow-[0_16px_32px_rgba(251,146,60,0.10)] sm:p-5 ${className}`}>
      <div className="absolute right-0 top-0 size-24 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-200/60">
            <AlertTriangle className="size-5" />
          </div>

          <div className="min-w-0 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-amber-200 bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-orange-600">
                {badge}
              </span>
              <span className="text-[13px] font-semibold text-orange-700 sm:text-sm">
                {title}
              </span>
            </div>

            <p className="max-w-2xl text-[13px] font-semibold leading-relaxed text-slate-800 sm:text-[15px]">
              {message}
            </p>

            <div className="inline-flex max-w-full rounded-2xl border border-orange-200/80 bg-linear-to-r from-orange-100 via-amber-50 to-white px-4 py-2 shadow-sm shadow-orange-100/80">
              <p dir="rtl" className="text-base font-black leading-relaxed text-orange-700 sm:text-lg">
                {arabicNote}
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-start rounded-xl border border-amber-200/80 bg-white/90 px-3 py-2 text-amber-700 shadow-sm lg:self-center">
          <BadgeInfo className="size-4.5" />
          <span className="text-xs font-bold">Sources publiques affichées</span>
        </div>
      </div>
    </section>
  )
}