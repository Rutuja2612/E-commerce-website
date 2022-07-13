import React, { Fragment, useEffect } from 'react'
import { Navigate, Route, Router,Routes, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';


const ProtectedRoute = (props) => {
    const navigate=useNavigate();
     const {Component}=props
    const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  
          {/* {loading === false && ( */}
           
             useEffect(()=>{
              let isAuthenticated=localStorage.getItem('isAuthenticated')
              if (isAuthenticated === false) {
                navigate("/login")
              }
  
              // if (isAdmin === true && user.role !== "admin") {
              //   navigate("/login")
              // }
             })
             
        

                return (
                  <>
    
               <Component  />;
             
           
         
          {/* //)} */}
        </>
      );
    };

// export default ProtectedRoute





// import React, { Fragment } from "react";
// import { useSelector } from "react-redux";
// import { Redirect, Route } from "react-router-dom";

// const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
//   const { loading, isAuthenticated, user } = useSelector((state) => state.user);

//   return (
//     <Fragment>
//       {loading === false && (
//         <Route
//           {...rest}
//           render={(props) => {
//             if (isAuthenticated === false) {
//               return <Redirect to="/login" />;
//             }

//             if (isAdmin === true && user.role !== "admin") {
//               return <Redirect to="/login" />;
//             }

//             return <Component {...props} />;
//           }}
//         />
//       )}
//     </Fragment>
//   );
// };





// const ProtectedRoute = () => {
//   const useAuth=()=>{
//     const 
//   }
//   return (
//     <div>ProtectedRoute</div>
//   )
// }

// export default ProtectedRoute


// const ProtectedRoute = ({isAdmin}) => {
//  // let auth = useAuth();
//   let location = useLocation();

//   // if (!auth.user) {
//   //   // Redirect them to the /login page, but save the current location they were
//   //   // trying to go to when they were redirected. This allows us to send them
//   //   // along to that page after they login, which is a nicer user experience
//   //   // than dropping them off on the home page.
//   //   return <Navigate to="/login" state={{ from: location }} />;
//   // }
//   const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  
        
//   if (isAuthenticated === false) {
//                       return Navigate("/login")
//                     }
        
//                     if (isAdmin === true && user.role !== "admin") {
//                       return Navigate("/login")
//                     }
  
 
//                    // <Navigate to="/login" state={{ from: location }} />;

//   return <Outlet />;
// }

  export default ProtectedRoute;




