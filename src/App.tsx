import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { MenuSection } from './components/MenuSection'
import { GallerySection } from './components/GallerySection'
import { TestimonialsSection } from './components/TestimonialsSection'
import { LocationSection } from './components/LocationSection'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { BottomNav } from './components/BottomNav'
import { CartModal } from './components/CartModal'
import { AdminModal } from './components/AdminModal'
import { VideoModal } from './components/VideoModal'
import { SubscriptionModal } from './components/SubscriptionModal'
import { AgeGate } from './components/AgeGate'


// ============ APP LIMPO ============
export default function App() {
  const [cart, setCart] = useState([])
  const [agencyConfig, setAgencyConfig] = useState(INITIAL_AGENCY_CONFIG)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  // O resto da tua lógica de 458 linhas continua aqui dentro,
  // mas agora separada por blocos
  
  return (
    <>
      <AgeGate />
      <Header cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} config={agencyConfig} />
      <main>
        <Hero />
        <MenuSection onAddToCart={(item) => setCart([...cart, item])} />
        <GallerySection />
        <TestimonialsSection />
        <LocationSection />
        <ContactSection />
      </main>
      <Footer config={agencyConfig} />
      <BottomNav cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} setCart={setCart} />
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} config={agencyConfig} setConfig={setAgencyConfig} />
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
      <SubscriptionModal />
    </>
  )
}
