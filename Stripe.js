import React,{useEffect, useState} from 'react'
import axios from 'axios';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from './Payment';

const Stripe = () => {
    
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }
  useEffect(()=>{
    getStripeApiKey();
  },[])
  return (
    <div>
 
           {
          stripeApiKey && (
            
          <Elements stripe={loadStripe(stripeApiKey)}>
      
          <Payment/>
          
         
          </Elements>
         
        )}
    </div>
  )
}

export default Stripe
