import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="wrap grid min-h-[60vh] place-items-center py-40 text-center">
      <div>
        <p className="text-[0.66rem] uppercase tracking-[0.3em] text-ink-mute">404</p>
        <h1 className="mt-8 text-title font-light">This page has not been made.</h1>
        <p className="passage mx-auto mt-5 max-w-measure">الصفحة غير موجودة.</p>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-solid tap">
            <span>Home</span>
          </Link>
          <Link href="/shop" className="btn tap">
            <span>Shop</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
