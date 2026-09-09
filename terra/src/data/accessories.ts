/**
 * ============================================================================
 * TERRA — ACCESSORIES
 * ============================================================================
 * Add-ons a customer can attach to any mug. Each one renders on the 3D model
 * (see src/components/mug3d/mug-mesh.tsx) so the preview always matches what
 * ships.
 *
 * To add an accessory: give it a new id, a bilingual name and blurb, a price,
 * and a `render` key the 3D component knows how to draw ('sleeve' | 'chain' |
 * 'none'). A 'none' accessory is priced and listed but not drawn.
 * ============================================================================
 */

import type { Bilingual } from '@/types/design'

export type Accessory = {
  id: string
  name: Bilingual
  blurb: Bilingual
  price: number
  /** Which 3D part to draw for this accessory. */
  render: 'sleeve' | 'chain' | 'none'
  /** Default colour of the accessory part, overridable per body colour. */
  hex: string
  /** Icon name from lucide-react. */
  icon: 'cup-soda' | 'link' | 'brush' | 'package'
}

export const accessories: Accessory[] = [
  {
    id: 'holder',
    name: { en: 'Cork cup holder', ar: 'حاضن فلّيني' },
    blurb: {
      en: 'A grippy cork sleeve that slips over the body — cool to hold when the drink is hot, and it stops the mug sliding on a desk.',
      ar: 'حاضن من الفلّين يُركَّب حول الجسم — بارد على اليد حين يكون الشراب ساخناً، ويمنع الكوب من الانزلاق على المكتب.',
    },
    price: 2.25,
    render: 'sleeve',
    hex: '#C79A62',
    icon: 'cup-soda',
  },
  {
    id: 'chain',
    name: { en: 'Carry chain', ar: 'سلسلة حمل' },
    blurb: {
      en: 'A short recycled-steel chain that clips to the lid so the mug hangs off a bag, a belt loop or a hook by the door.',
      ar: 'سلسلة قصيرة من فولاذ معاد تدويره تُثبَّت في الغطاء، فيتعلّق الكوب بحقيبة أو حزام أو معلاق عند الباب.',
    },
    price: 3.5,
    render: 'chain',
    hex: '#A9AEB2',
    icon: 'link',
  },
  {
    id: 'brush',
    name: { en: 'Sisal cleaning brush', ar: 'فرشاة سيزال' },
    blurb: {
      en: 'Long wooden handle, plant-fibre bristles, reaches the bottom of the 700 ml. Compostable when it wears out.',
      ar: 'مقبض خشبي طويل وشعيرات من ألياف نباتية، تصل إلى قاع كوب ٧٠٠ مل. قابلة للتحلّل عند انتهائها.',
    },
    price: 1.75,
    render: 'none',
    hex: '#B98A55',
    icon: 'brush',
  },
  {
    id: 'spare-lid',
    name: { en: 'Spare bamboo lid', ar: 'غطاء خيزران إضافي' },
    blurb: {
      en: 'One in the dishwasher, one on the mug. The seal ring comes with it.',
      ar: 'واحد في الغسّالة وواحد على الكوب. حلقة الإحكام مرفقة.',
    },
    price: 2.9,
    render: 'none',
    hex: '#C69A6B',
    icon: 'package',
  },
]

export const getAccessory = (id: string) => accessories.find((a) => a.id === id)

export const accessoriesTotal = (ids: string[]) =>
  Math.round(ids.reduce((sum, id) => sum + (getAccessory(id)?.price ?? 0), 0) * 1000) / 1000
