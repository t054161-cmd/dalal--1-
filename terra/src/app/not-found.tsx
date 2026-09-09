import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container-terra grid min-h-[50vh] place-items-center py-20 text-center">
      <div>
        <p className="font-mono text-sm tracking-widest text-sage">404</p>
        <h1 className="mt-4 text-display-sm">This cup does not exist — yet.</h1>
        <p className="mx-auto mt-3 max-w-prose text-ink-soft">
          الصفحة غير موجودة. Design your own instead, or start from one of ours.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/customize">Design your TERRA</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
