import React, { useState } from 'react'
import '../CustomerPages_css/MyImage.scss'
export const MyImage = ({image = [{url:''}]}) => {
  const[mainImage , setMainImage] = useState(image[0]);
  console.log(mainImage);
return(
  <div className="main-grid">
        <div className='image-grid'>
          {
            image.map((curr ,index)=>{
              return(
                <figure key={index}  className='figure-product'>
                    <div style={{cursor:'pointer' , boxShadow: '2px 1px 13px gray',margin:'.5rem', borderRadius:'1rem',
                    padding:'1rem'
}}>
                  <img src={curr}  className='box-image-style' alt={curr.filename} key={index} onClick={()=> setMainImage(curr)} />
                    </div>
                </figure>
              )
            })
          }
        </div>

    <div className="main-screen">
      <img src={mainImage} alt="images" />
    </div>
  </div>
)
}
