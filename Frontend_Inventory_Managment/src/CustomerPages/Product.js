import { useNavigate } from 'react-router-dom'
import { useUser } from '../Login _signup_pages/UserContext';
export const Product = (item) => {
  const {name, imageUrls, price, category } = item;
//  console.log(item);
  const navigate = useNavigate();
  const { userData } = useUser();
  function navigatehandler() {
    navigate(`/customer/${userData.id}/singleproduct/${item._id}`);
  }
  return (
    <div className="item" onClick={navigatehandler}  style={{ cursor: 'pointer' }} data-aos="zoom-in" data-aos-duration="5000">
      <figure className="small-container">
        <figcaption className='caption'>
          <div>{category}</div></figcaption>
        <img src={imageUrls[0]} alt="img" />
      </figure>
      <div className="detail">
        <div className="company">{name}</div>
        <div className="price">₹{price}</div>
      </div>
    </div>
  )
}
