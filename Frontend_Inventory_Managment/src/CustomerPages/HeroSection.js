import React from 'react'
import '../CustomerPages_css/HeroSection.scss'
import {useNavigate } from 'react-router-dom'
import { useUser } from '../Login _signup_pages/UserContext';
const HeroSection = () => {
    const { userData } = useUser(); 
    const navigate = useNavigate();
    const clickHandler=()=>{
        navigate(`/customer/${userData.id}/product`);
    }
  return (
    <div className="container-home-new">
    <div className="left-container-new">
      <p className='intro-data-new'>Welcome to</p>
      <h1 className='heading-new' >INVENTORY MANAGEMENT</h1>
      <p className='main-content-new'>Experience refined elegance with our minimalist brand. We embody sophistication in every aspect of your shopping, be it groceries or any other necessity. Elevate your style and shopping experience with timeless minimalism.</p>
       <div >
       <button className='button' onClick={clickHandler}>Shop Now</button>
        </div>
    </div>
    <div className="right-container-new" data-aos="zoom-in-up" data-aos-duration="1000">
      <img src="/newlogo.svg" alt="shopping" />
    </div>
  </div>
  )
}

export default HeroSection