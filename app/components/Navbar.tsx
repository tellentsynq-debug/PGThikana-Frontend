

export default function Navbar(){// React Component
  
  return (
    <div 
   
    style ={{//main container
    display: "flex",//makes children go in a row
    justifyContent: "space-between",//spreads item equally
    alignItems:"center",//aligns items vertically in center
    padding: "15px 30px",//add space inside -> 15px top/bottom, 30px left right
    backgroundColor: "#0F766E",
    color:"white",//text color
    boxShadow:"0 2px 10px rgba(0,0,0,0,1)",
    transition:"0.3s",
    overflow:"hidden"

    }}>

       
    
       <div style={{
  display: "flex",
  alignItems: "center",
  gap: "30px",
  width:"100%"
}}>

  {/* Links */}
  

  {/* Button */}
  <button style={{
    padding: "8px 16px",
    backgroundColor:"#0D5F58",
    border:"none",
    borderRadius:"6px",
    color:"white",
    fontWeight:"600",
    cursor:"pointer",
    transition:"0.3s",
    marginLeft:"auto"
  }}>
    Login
  </button>

</div>
         
        </div>
  );
}