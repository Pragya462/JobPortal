import Navbar from '@/components/shared/Navbar'
import React from 'react'
import HeroSection from '@/components/HeroSection'
import CategoryCarousel from '@/components/CategoryCarousel'
import LatestJobs from '@/components/LatestJobs'
import Footer from '@/components/shared/Footer'

function HomePage() {
  return (
    <div>
        <Navbar />
        <HeroSection />
        <CategoryCarousel />
        <LatestJobs />
        <Footer />
    </div>
  )
}

export default HomePage
