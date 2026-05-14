// import Registration from "./pages/Registration";
// import { BrowserRouter } from 'react-router-dom';
// import Sample from "./pages/sample";
// function App(){
//   const handleRegistration = (email) => {
//     console.log("Registered email:", email);
//   };

//   const handleParent = (details) => {
//     console.log("Signed in details:", details);
//   };
//   return (
//     // <>
//      <BrowserRouter>
//     <Registration  toRegisteration={handleRegistration}
//       toParent={handleParent}/>
//       </BrowserRouter>
//     // <Sample/>
//     // </>
//     // <div><h1> hello</h1></div>
//   )
// }

// export default App;


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Registration from './pages/Registration';
// import Services from './pages/Services';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import UserDetails from './pages/details';
// import Recommend from './pages/Recommend';
// import AbhiyanChatbot from './pages/Chatbot';
import { useState } from 'react';
function App() {
  const [userdata,setUserdata]=useState("");
  const [email,setEmail]=useState("");
  function fromChild(data){
    setUserdata(data);
  }
  function fromDetails(data){
    setEmail(data);
  }
  return (
    <Router>
      <Routes>
       {/* <Route path="/" element={<Registration toRegisteration={fromDetails} toParent={fromChild}/>} /> */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/pages/Services.js" element={<Services />} />
        <Route path="/pages/About.js" element={<About />} />
        <Route path="/pages/Home.js" element={<Home />} />
        <Route path="/pages/Contact.js" element={<Contact />} /> */}
        <Route path="/pages/Registration.jsx" element={<Registration toRegisteration={fromDetails} toParent={fromChild}/>} />
        {/* <Route path="/pages/details.js" element={<UserDetails toParent={fromChild} email={email}/>} />
        <Route path="/pages/Recommend.js" element={<Recommend userData={userdata}/>} />
        <Route path="/pages/Chatbot.js" element={<AbhiyanChatbot />} /> */}
      </Routes>
    </Router>
  );
}
export default App;
