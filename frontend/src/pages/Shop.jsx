import React from 'react' //Import react and other necessary components.
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import Newsletter from '../components/Newsletter'

const Shop = () => {
  return ( //Main container for the shop page, sequentially renders the hero, latestcollection, bestseller, ourpolicy and newsletter components.
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller/>
      <OurPolicy />
      <Newsletter />
    </div>
  )
}

export default Shop
