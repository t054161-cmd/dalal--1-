'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { Camera, ChevronLeft, ChevronRight, Download, Minus, Plus, RotateCcw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { getBodyColor, getLidColor, getSize } from '@/data/product'
import { useOnceFlag, useReducedMotion, useWebGL } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import type { DesignConfig } from '@/types/design'
import { Mug2D, PRESET_ANGLES } from './mug-2d'
import { ViewerSkeleton } from './viewer-skeleton'
import type { ViewerApi } from './mug-canvas'

/**
 * The 3D bundle (three.js + fiber + drei) is code-split and only fetched when
 * a viewer actually mounts, so it never blocks first paint.
 */
const MugCanvas = dynamic(() => import('./mug-canvas'), {
  ssr: false,
  loading: () => <ViewerSkeleton />,
})

/** How long after the last touch before the mug starts turning again. */
const AUTO_ROTATE_RESUME_MS = 5000

export function MugViewer({
  design,
  className,
  /** Called with a PNG data URL when the customer takes a snapshot. */
  onSnapshot,
  showToolbar = true,
  /** Set on hero-style viewers that should not steal focus order. */
  decorative = false,
}: {
  design: DesignConfig
  className?: string
  onSnapshot?: (dataUrl: string) => void
  showToolbar?: boolean
  decorative?: boolean
}) {
  const { t, pick } = useI18n()
  const webgl = useWebGL()
  const reducedMotion = useReducedMotion()
  const [hintSeen, markHintSeen] = useOnceFlag('drag-hint')
  const [force3d, setForce3d] = React.useState(false)

  const apiRef = React.useRef<ViewerApi | null>(null)
  const [autoRotate, setAutoRotate] = React.useState(true)
  const [angleIndex, setAngleIndex] = React.useState(0)
  const [captured, setCaptured] = React.useState<string | null>(null)
  const resumeTimer = React.useRef<number | null>(null)

  /* Auto-rotate: stop the instant a user touches the mug, resume after 5s of
     stillness. Reduced motion means it never starts. */
  React.useEffect(() => {
    if (reducedMotion) setAutoRotate(false)
  }, [reducedMotion])

  const handleInteract = React.useCallback(() => {
    markHintSeen()
    setAutoRotate(false)
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current)
    if (reducedMotion) return
    resumeTimer.current = window.setTimeout(() => setAutoRotate(true), AUTO_ROTATE_RESUME_MS)
  }, [markHintSeen, reducedMotion])

  React.useEffect(
    () => () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current)
    },
    [],
  )

  /* ---- accessible description ------------------------------------------ */
  const size = getSize(design.sizeId)
  const describe = design.text.trim()
    ? t('viewer.a11yDescription', {
        size: pick(size.name),
        body: pick(getBodyColor(design.bodyColorId).name),
        lid: pick(getLidColor(design.lidColorId).name),
        text: design.text,
      })
    : t('viewer.a11yDescriptionNoText', {
        size: pick(size.name),
        body: pick(getBodyColor(design.bodyColorId).name),
        lid: pick(getLidColor(design.lidColorId).name),
      })

  /* ---- snapshot -------------------------------------------------------- */
  const takeSnapshot = React.useCallback(() => {
    const dataUrl = apiRef.current?.capture()
    if (!dataUrl) return
    setCaptured(dataUrl)
    onSnapshot?.(dataUrl)
  }, [onSnapshot])

  const downloadSnapshot = React.useCallback(() => {
    const dataUrl = captured ?? apiRef.current?.capture()
    if (!dataUrl) return
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `terra-${design.sizeId}ml-${design.bodyColorId}.png`
    link.click()
  }, [captured, design.bodyColorId, design.sizeId])

  /* ---- which renderer? ------------------------------------------------- */
  const use3d = webgl === true && (!reducedMotion || force3d)
  const undetermined = webgl === null

  return (
    <div className={cn('relative flex h-full w-full flex-col', className)}>
      <div
        className="relative isolate flex-1 overflow-hidden rounded-3xl bg-gradient-to-b from-sand/45 to-surface-sunken dark:from-surface-raised dark:to-surface-sunken"
        // The wrapper never sets touch-action, so a swipe that begins here but
        // outside the canvas still scrolls the page.
      >
        {/* Soft blob behind the mug, purely decorative. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(60%_60%_at_50%_45%,#000,transparent)]"
          style={{
            background:
              'radial-gradient(45% 40% at 50% 38%, rgb(var(--sand) / 0.9), transparent 70%)',
          }}
        />

        {undetermined ? (
          <ViewerSkeleton />
        ) : use3d ? (
          <MugCanvas
            design={design}
            autoRotate={autoRotate}
            onUserInteract={handleInteract}
            apiRef={apiRef}
            ariaLabel={describe}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center p-3">
            {/* The SVG has a viewBox, so filling the box keeps its aspect. */}
            <Mug2D design={design} angleIndex={angleIndex} className="h-full w-full" />
            <span className="sr-only">{describe}</span>
          </div>
        )}

        {/* First-visit hint, fades away after the first interaction. */}
        {use3d && !hintSeen && !decorative ? (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center animate-fade-in"
            aria-hidden
          >
            <span className="flex items-center gap-2 rounded-full bg-bark/85 px-4 py-2 text-xs font-semibold text-cream shadow-lift backdrop-blur">
              <Sparkles className="size-3.5" />
              {t('viewer.dragHint')}
            </span>
          </div>
        ) : null}
      </div>

      {/* ---- toolbar ------------------------------------------------------ */}
      {showToolbar ? (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {use3d ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  handleInteract()
                  apiRef.current?.rotateBy(-30)
                }}
                aria-label={t('viewer.prevAngle')}
              >
                <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => apiRef.current?.reset()}
              >
                <RotateCcw className="size-4" aria-hidden />
                {t('viewer.reset')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  handleInteract()
                  apiRef.current?.rotateBy(30)
                }}
                aria-label={t('viewer.nextAngle')}
              >
                <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => apiRef.current?.zoomBy(0.82)}
                aria-label={t('viewer.zoomIn')}
              >
                <Plus className="size-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => apiRef.current?.zoomBy(1.22)}
                aria-label={t('viewer.zoomOut')}
              >
                <Minus className="size-4" aria-hidden />
              </Button>
              <Button type="button" variant="quiet" size="sm" onClick={takeSnapshot}>
                <Camera className="size-4" aria-hidden />
                {t('common.snapshot')}
              </Button>
              {captured ? (
                <Button type="button" variant="ghost" size="sm" onClick={downloadSnapshot}>
                  <Download className="size-4" aria-hidden />
                  {t('common.download')}
                </Button>
              ) : null}
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAngleIndex((i) => (i - 1 + PRESET_ANGLES.length) % PRESET_ANGLES.length)}
                aria-label={t('viewer.prevAngle')}
              >
                <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
              </Button>
              <span className="text-xs font-medium text-ink-mute" aria-live="polite">
                {t('viewer.angleOf', { current: angleIndex + 1, total: PRESET_ANGLES.length })}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAngleIndex((i) => (i + 1) % PRESET_ANGLES.length)}
                aria-label={t('viewer.nextAngle')}
              >
                <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
              </Button>
              {webgl && reducedMotion && !force3d ? (
                <Button type="button" variant="ghost" size="sm" onClick={() => setForce3d(true)}>
                  {t('viewer.enable3d')}
                </Button>
              ) : null}
            </>
          )}
        </div>
      ) : null}

      {/* One quiet line of guidance under the toolbar. */}
      {showToolbar && use3d ? (
        <p className="mt-2 text-center text-xs text-ink-mute">{t('viewer.pinchHint')}</p>
      ) : null}
      {!use3d && !undetermined && showToolbar ? (
        <p className="mt-2 text-center text-xs text-ink-mute">{t('viewer.fallbackBody')}</p>
      ) : null}
    </div>
  )
}
