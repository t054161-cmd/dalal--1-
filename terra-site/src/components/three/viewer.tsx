'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { Camera, ChevronLeft, ChevronRight, Download, Minus, Plus, RotateCcw } from 'lucide-react'
import { useI18n } from '@/i18n/provider'
import { useNearViewport, useOnceFlag, useReducedMotion, useWebGL } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import type { CupConfig } from '@/types'
import { ANGLES, Tumbler2D } from './tumbler-2d'
import type { ViewerApi } from './scene'

/** The 3D bundle is fetched only when a viewer mounts — never on first paint. */
const Scene = dynamic(() => import('./scene'), {
  ssr: false,
  loading: () => <ViewerSkeleton />,
})

export function ViewerSkeleton() {
  const { t } = useI18n()
  return (
    <div className="grid h-full w-full place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-5">
        <div className="animate-pulse-soft">
          <div className="mx-auto h-1.5 w-1.5 rounded-full bg-ink/20" />
          <div className="mx-auto mt-3 h-6 w-16 rounded-md bg-ink/10" />
          <div className="mx-auto mt-1 h-40 w-14 rounded-b-[1.4rem] rounded-t-sm bg-ink/[0.07]" />
        </div>
        <p className="meta text-ink-mute">{t('viewer.loading')}</p>
      </div>
    </div>
  )
}

/** How long after the last touch before the cup drifts again. */
const RESUME_MS = 4500

export function CupViewer({
  config,
  className,
  /** Turn the cup as the section scrolls, instead of on a timer. */
  spin,
  exploded = false,
  showLabels = false,
  autoTurn = true,
  interactive = true,
  toolbar = 'full',
  /** Off where something behind the viewer already lights the object — the
      product page paints its own pool of light into the botanical set. */
  glow = true,
  onSnapshot,
}: {
  config: CupConfig
  className?: string
  spin?: number
  exploded?: boolean
  showLabels?: boolean
  autoTurn?: boolean
  interactive?: boolean
  toolbar?: 'full' | 'minimal' | 'none'
  glow?: boolean
  onSnapshot?: (dataUrl: string) => void
}) {
  const { t, pick } = useI18n()
  const webgl = useWebGL()
  const reduced = useReducedMotion()
  const [hintSeen, markHint] = useOnceFlag('drag-hint')
  const [force3d, setForce3d] = React.useState(false)

  // The canvas mounts only around its own section, so a long page never holds
  // more than a couple of live WebGL contexts.
  const [frameRef, near] = useNearViewport<HTMLDivElement>('320px')
  const apiRef = React.useRef<ViewerApi | null>(null)
  const [drifting, setDrifting] = React.useState(autoTurn)
  const [angle, setAngle] = React.useState(0)
  const [captured, setCaptured] = React.useState<string | null>(null)
  const timer = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (reduced) setDrifting(false)
  }, [reduced])

  const onInteract = React.useCallback(() => {
    markHint()
    setDrifting(false)
    if (timer.current) window.clearTimeout(timer.current)
    if (reduced || !autoTurn) return
    timer.current = window.setTimeout(() => setDrifting(true), RESUME_MS)
  }, [autoTurn, markHint, reduced])

  React.useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  const describe = config.mark.trim()
    ? t('viewer.describe', {
        body: config.bodyColor,
        lid: config.lidColor,
        straw: config.strawColor,
        mark: config.mark,
      })
    : t('viewer.describePlain', {
        body: config.bodyColor,
        lid: config.lidColor,
        straw: config.strawColor,
      })

  const snapshot = () => {
    const url = apiRef.current?.capture()
    if (!url) return
    setCaptured(url)
    onSnapshot?.(url)
  }

  const download = () => {
    const url = captured ?? apiRef.current?.capture()
    if (!url) return
    const link = document.createElement('a')
    link.href = url
    link.download = 'terra-tumbler.png'
    link.click()
  }

  const use3d = webgl === true && (!reduced || force3d) && near

  return (
    <div ref={frameRef} className={cn('flex h-full w-full flex-col', className)}>
      <div className="relative isolate flex-1 overflow-hidden">
        {/* A soft pool of light behind the object; the tone comes from the
            theme, so dark mode gets a lit floor rather than a grey card. */}
        {glow ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: 'radial-gradient(46% 40% at 50% 42%, var(--viewer-glow), transparent 72%)',
            }}
          />
        ) : null}

        {webgl === null || (near === false && webgl === true && !reduced) ? (
          <div className="absolute inset-0 grid place-items-center p-4">
            <Tumbler2D config={config} angleIndex={0} className="h-full w-full opacity-90" />
          </div>
        ) : use3d ? (
          <Scene
            config={config}
            exploded={exploded}
            spin={spin}
            showLabels={showLabels}
            autoTurn={drifting && spin === undefined}
            interactive={interactive}
            apiRef={apiRef}
            onUserInteract={onInteract}
            ariaLabel={describe}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center p-4">
            {/* The SVG carries a viewBox, so filling the box keeps its aspect. */}
            <Tumbler2D config={config} angleIndex={angle} className="h-full w-full" />
            <span className="sr-only">{describe}</span>
          </div>
        )}

        {/* First-visit hint; it never returns once the cup has been touched. */}
        {use3d && !hintSeen && interactive && toolbar !== 'none' ? (
          <p
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-5 text-center meta text-ink-mute animate-fade-in"
          >
            {t('viewer.drag')}
          </p>
        ) : null}
      </div>

      {toolbar === 'none' ? null : (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          {use3d ? (
            <>
              <ViewerButton label={t('viewer.turnLeft')} onClick={() => { onInteract(); apiRef.current?.turn(-32) }}>
                <ChevronLeft className="size-4 flip-rtl" aria-hidden />
              </ViewerButton>
              <ViewerButton label={t('viewer.reset')} onClick={() => apiRef.current?.reset()}>
                <RotateCcw className="size-3.5" aria-hidden />
              </ViewerButton>
              <ViewerButton label={t('viewer.turnRight')} onClick={() => { onInteract(); apiRef.current?.turn(32) }}>
                <ChevronRight className="size-4 flip-rtl" aria-hidden />
              </ViewerButton>
              {toolbar === 'full' ? (
                <>
                  <ViewerButton label={t('viewer.zoomIn')} onClick={() => apiRef.current?.zoom(0.84)}>
                    <Plus className="size-3.5" aria-hidden />
                  </ViewerButton>
                  <ViewerButton label={t('viewer.zoomOut')} onClick={() => apiRef.current?.zoom(1.2)}>
                    <Minus className="size-3.5" aria-hidden />
                  </ViewerButton>
                  <ViewerButton label={t('designer.snapshot')} onClick={snapshot}>
                    <Camera className="size-3.5" aria-hidden />
                  </ViewerButton>
                  {captured ? (
                    <ViewerButton label={t('designer.download')} onClick={download}>
                      <Download className="size-3.5" aria-hidden />
                    </ViewerButton>
                  ) : null}
                </>
              ) : null}
            </>
          ) : (
            <>
              <ViewerButton
                label={t('viewer.prev')}
                onClick={() => setAngle((a) => (a - 1 + ANGLES.length) % ANGLES.length)}
              >
                <ChevronLeft className="size-4 flip-rtl" aria-hidden />
              </ViewerButton>
              <span className="px-2 meta text-ink-mute" aria-live="polite">
                {t('viewer.angle', { current: angle + 1, total: ANGLES.length })}
              </span>
              <ViewerButton label={t('viewer.next')} onClick={() => setAngle((a) => (a + 1) % ANGLES.length)}>
                <ChevronRight className="size-4 flip-rtl" aria-hidden />
              </ViewerButton>
              {webgl && reduced && !force3d ? (
                <button type="button" className="btn btn-quiet tap ms-2" onClick={() => setForce3d(true)}>
                  <span>{t('viewer.enable3d')}</span>
                </button>
              ) : null}
            </>
          )}
        </div>
      )}

      {!use3d && webgl !== null && toolbar !== 'none' ? (
        <p className="mx-auto mt-2 max-w-measure text-center text-[0.68rem] leading-relaxed text-ink-mute">
          {t('viewer.fallback')}
        </p>
      ) : null}
      {use3d && toolbar !== 'none' ? (
        <p className="mt-2 text-center meta text-ink-mute">
          {t('viewer.pinch')}
        </p>
      ) : null}
    </div>
  )
}

function ViewerButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="tap grid place-items-center rounded-full border border-ink/15 px-3 text-ink-soft transition-colors duration-500 ease-cinema hover:border-ink/40 hover:text-ink"
    >
      {children}
    </button>
  )
}
