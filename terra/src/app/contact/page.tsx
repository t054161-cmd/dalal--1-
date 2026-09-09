import type { Metadata } from 'next'
import { ContactContent } from '@/components/pages/contact-content'

export const metadata: Metadata = {
  title: 'Contact TERRA',
  description: 'Talk to the workshop — WhatsApp, email or the form. We answer in Arabic and English.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return <ContactContent />
}
