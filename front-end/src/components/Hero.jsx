import React from 'react'
import {Link} from 'react-router-dom';

const Hero = () => {
  return (
    <div>
    
    <Link to={'/sender'} ><p> Enter class room</p> </Link>  
    <Link to={'/receiver'} ><p> Join class room</p></Link>   
    
    </div>
)
}

export default Hero
