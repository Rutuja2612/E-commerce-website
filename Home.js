import React, { useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";

import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { clearErrors } from "../../actions/productAction";
import ProductCard from "./ProductCard";

const Home = () => {

  const alert=useAlert();
  const dispatch = useDispatch();

 const {loading,error, products }=useSelector(
   (state)=>state.products
 )
  useEffect(() => {
    if(error){
      alert.error(error)
      dispatch(clearErrors())
   }
    dispatch(getProduct());
  }, [dispatch, error,alert]);

  return (
    <>
      {loading ?(<Loader/>):
      (
        <>
      <MetaData title="Ecommerce" />
      <div className="banner">
        <p>Welcome to Ecommerce</p>
        <h1>Find Amazing Products Below</h1>
        <a href="#container">
          <button>
            Scroll <CgMouse />
          </button>
        </a>
      </div>
      <h2 className="homeHeading">Featured Products</h2>
      <div className="container" id="container">
       {
        products && products.map((product)=><ProductCard product={product} key={product._id} />)
       }
      </div>
    </>
      )
      }
    </>
  );
};

export default Home;
