import React from 'react'
import HeroSection from '../component/HeroSection'
import CategorySection from '../component/CategorySection'
import ValueProps from '../component/ValueProps'
import ProductMarquee from '../component/ProductMarquee'
import { ProductsProvider, useProducts } from '../component/ProductsContext'
import useDocumentMeta from '../hooks/useDocumentMeta'
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION } from '../config/seo'

export const Home = () => (
  <ProductsProvider>
    <HomeContent />
  </ProductsProvider>
)

const HomeContent = () => {
  const { loading } = useProducts()

  useDocumentMeta({
    title: DEFAULT_TITLE,
    titleTemplate: false,
    description: DEFAULT_DESCRIPTION,
    path: '/',
  })

  return (
    <>
      {loading && (
        <div className="bg-surface min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-5">
            <span className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center text-surface text-lg font-black tracking-tight animate-pulse">
              E
            </span>
            <span className="w-24 h-px bg-surface-border overflow-hidden">
              <span className="block h-full bg-gold/60 animate-[ezbuy-load_1.4s_ease-in-out_infinite]" style={{ width: '40%' }} />
            </span>
          </div>
        </div>
      )}
      <HeroSection />
      <CategorySection />
      <ValueProps />
      <ProductMarquee />
    </>
  )
}