// handling nvbar

const handlenavbar = (islogged) => {
    const profile = document.getElementById("profile");
    const logout = document.getElementById("logout");
    const login = document.getElementById("login");

    if(islogged) {
        profile.style.display = "inline-block";
        logout.style.display = "inline-block";
        login.style.display = "none";
    }else {
        profile.style.display = "none";
        logout.style.display = "none";
        login.style.display = "inline-block";
    }
}
document.addEventListener("DOMContentLoaded", function() {
    const isLogged = localStorage.getItem("token") !== null;
    handlenavbar(isLogged);
});


// handle register

const handleRegistration = (event) => {
    event.preventDefault();
 
    const username = getValue("username");
    const first_name = getValue("first_name");
    const last_name = getValue("last_name");
    const email = getValue("email");
    const password = getValue("password");
    const confirm_password = getValue("confirm_password");
 
    const registrationInfo = {
        username,
        first_name,
        last_name,
        email,
        password,
        confirm_password,
    };
 
    // Check if passwords match
    if (password !== confirm_password) {
        document.getElementById("error").innerText = "Passwords didn't match";
        alert("Passwords didn't match");
        return;
    }
 
    // Send POST request to backend
    fetch(`https://recipesharingbackend-dpiy.onrender.com/user/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationInfo),
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        return res.json();
    })
    .then((data) => {
        console.log(data); 
        document.getElementById("error").innerText = "Check Email for confirmation!";
        alert("check your email")
    })
    .catch((error) => {
        console.error("Error:", error.message);
        document.getElementById("error").innerText = "Registration failed";
        alert("Registration failed! Try again")
    });
 };
 
  
  
 
 const getValue = (id) => {
     const value = document.getElementById(id).value;
     return value;
 }
 
 
 const handleLogin = (event) => {
    event.preventDefault();
    const username = getValue("login-username")
    const password = getValue("login-password")
 
    if(username ,password){
       fetch(`https://recipesharingbackend-dpiy.onrender.com/user/login/`,{
          method:"POST",
          headers:{"content-type":"application/json"},
          body:JSON.stringify({username,password}),
       
       })
       .then((res) => res.json())
       .then((data) =>{
          console.log(data);
          
         if(data.token && data.user_id){
             localStorage.setItem("token",data.token);
             localStorage.setItem("user_id",data.user_id);
             handlenavbar(true);
             window.location.href="index.html"  
             alert("Logged in successfully");     
         }
       });
 
    }else{
       alert("Username or Password incorrect");
    }
 }

 const handlelogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    alert("Logged out Successfully!");
  
    // Redirect to index.html
    window.location.href = "index.html";
  
    
    const token = localStorage.getItem("token"); 
  
    fetch("https://recipesharingbackend-dpiy.onrender.com/user/logout/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };
  
