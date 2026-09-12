import React, { useState, useCallback, useRef } from 'react'
import HeroSection from '../component/HeroSection'
import CategorySection from '../component/CategorySection'
import ValueProps from '../component/ValueProps'
import Newsletter from '../component/Newsletter'

export const Home = () => {
  const [loaded, setLoaded] = useState(false)
  const loadedRef = useRef({ hero: false, categories: false })

  const handleLoad = useCallback((section) => {
    loadedRef.current[section] = true
    if (loadedRef.current.hero && loadedRef.current.categories) {
      setLoaded(true)
    }
  }, [])

  return (
    <>
      {!loaded && (
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
      <HeroSection onLoad={() => handleLoad('hero')} />
      <CategorySection onLoad={() => handleLoad('categories')} />
      <ValueProps />
      <Newsletter />
    </>
  )
}