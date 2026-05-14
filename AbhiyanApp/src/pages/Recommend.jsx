import React from "react";
import "../css/responsive.css";
import "../css/Rec_style.css"; 
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import CardList from "../components/CardList"
import { useEffect } from "react";
import { useState } from "react";

function Recommend({userData}){
  const [apiData,setApidata]=useState(null);
  const [isLoading,setIsloading]=useState(true);
  //const [data,setData]=useState(null);
  useEffect(()=>{
    fetch("https://jwie2c4inb.execute-api.ap-south-1.amazonaws.com/dev2/getSchemes",{
      "method":"POST",
      "headers":{
        "Content-Type":"application/json"
      },
      "body":JSON.stringify({
        id:1,
        state:userData["state"],
        describe:userData["beneficiaries"]
      })
    }).then(response=>{
      if(response) return response.json()
    }).then(data=>{
      if(data) {
        setApidata(data);
        setIsloading(false);
      }
    }).catch(err=>{
      console.log(err);
      setIsloading(false);
    })
  },[])
/*   useEffect(() => {
    console.log("apiData updated:", apiData); // Observe changes to apiData
}, [apiData]); */
  return (
    <div className="hero_area">
      <Navbar />
      <Slider />
      <br/>
      {isLoading ? "..Loading":(
        <CardList schemes={apiData}/>
      )}
      
      
    </div>
  );
};

export default Recommend;
