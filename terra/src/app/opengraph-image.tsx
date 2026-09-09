import { ImageResponse } from 'next/og'

export const alt = 'TERRA — a clay-coloured insulated mug with a bamboo lid, on a cream background'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Open Graph card, drawn rather than photographed so it always matches the
 * palette. Latin only on purpose: the default OG font has no Arabic glyphs.
 */
export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#F6F1E7',
          color: '#3E3229',
          fontFamily: 'sans-serif',
          padding: 72,
          alignItems: 'center',
          gap: 64,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ fontSize: 26, letterSpacing: 8, color: '#7C8B6B', fontWeight: 700 }}>
            TERRA
          </div>
          <div style={{ fontSize: 68, lineHeight: 1.05, marginTop: 20, fontWeight: 700 }}>
            The last cup you will ever need to buy.
          </div>
          <div style={{ fontSize: 28, marginTop: 24, color: '#5A4C3F' }}>
            Recycled steel · 12h hot · 24h cold · engraved with your words
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            {['#B4654A', '#7C8B6B', '#D9C7A7', '#4E5D43', '#3C4859'].map((hex) => (
              <div
                key={hex}
                style={{ width: 44, height: 44, borderRadius: 22, background: hex }}
              />
            ))}
          </div>
        </div>

        {/* A drawn mug: tapered body, bamboo lid, engraved band. */}
        <div style={{ display: 'flex', position: 'relative', width: 300, height: 460 }}>
          <div
            style={{
              position: 'absolute',
              left: 34,
              top: 44,
              width: 232,
              height: 380,
              background: '#B4654A',
              borderRadius: '28px 28px 60px 60px',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 22,
              top: 18,
              width: 256,
              height: 40,
              background: '#C69A6B',
              borderRadius: 20,
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 34,
              top: 200,
              width: 232,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F6F1E7',
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            terra
          </div>
        </div>
      </div>
    ),
    size,
  )
}
