import React from 'react'
import Header from '../components/Header'
import Main from '../components/Main'
import ChooseGocart from '../components/ChooseGocart'
import Reviews from '../components/Reviews'
import Howitwork from '../components/Howitwork'
import JoinGoCart from '../components/JoinGoCart'
import Faqs from '../components/Faqs'
import Footer from '../components/Footer'


function Landingpage() {
  return (
    <div>
        <Header></Header>
        <Main></Main>
        <ChooseGocart></ChooseGocart>
        <Reviews></Reviews>
        <Howitwork></Howitwork>
        <JoinGoCart></JoinGoCart>
        <Faqs></Faqs>
        <Footer></Footer>
        
    </div>
  )
}

export default Landingpage