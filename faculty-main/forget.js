// ===============================
// VARIABLES
// ===============================

let generatedOTP = "";

// ===============================
// ELEMENTS
// ===============================

const email = document.getElementById("email");
const otp = document.getElementById("otp");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

const emailError = document.getElementById("emailError");
const otpError = document.getElementById("otpError");
const passwordError = document.getElementById("passwordError");
const confirmError = document.getElementById("confirmError");

// ===============================
// FUNCTIONS
// ===============================

function clearErrors(){

    document.querySelectorAll(".error").forEach(error=>{
        error.innerHTML="";
    });

    document.querySelectorAll("input").forEach(input=>{
        input.classList.remove("error-input");
    });

}

function showError(input,errorElement,message){

    input.classList.add("error-input");

    errorElement.innerHTML=message;

}

// ===============================
// GENERATE OTP
// ===============================

document.getElementById("generateOTP").onclick=function(){

    clearErrors();

    const emailValue=email.value.trim();

    if(emailValue===""){

        showError(email,emailError,"Email Address is required.");

        return;

    }

    const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(emailValue)){

        showError(email,emailError,"Enter a valid email address.");

        return;

    }

    generatedOTP=Math.floor(100000+Math.random()*900000).toString();

    document.getElementById("generatedOTP").innerHTML=generatedOTP;

    document.getElementById("otpDisplay").style.display="block";

    document.getElementById("otpSection").style.display="block";

    email.disabled=true;

    document.getElementById("generateOTP").disabled=true;

};

// ===============================
// VERIFY OTP
// ===============================

document.getElementById("verifyOTP").onclick=function(){

    otp.classList.remove("error-input");

    otpError.innerHTML="";

    if(otp.value.trim()===""){

        showError(otp,otpError,"OTP is required.");

        return;

    }

    if(otp.value!==generatedOTP){

        showError(otp,otpError,"Invalid OTP.");

        return;

    }

    otp.disabled=true;

    document.getElementById("verifyOTP").disabled=true;

    document.getElementById("passwordSection").style.display="block";

};

// ===============================
// SAVE PASSWORD
// ===============================

document.getElementById("savePassword").onclick=function(){

    newPassword.classList.remove("error-input");
    confirmPassword.classList.remove("error-input");

    passwordError.innerHTML="";
    confirmError.innerHTML="";

    let valid=true;

    if(newPassword.value.trim()===""){

        showError(newPassword,passwordError,"New Password is required.");

        valid=false;

    }

    if(confirmPassword.value.trim()===""){

        showError(confirmPassword,confirmError,"Confirm Password is required.");

        valid=false;

    }

    if(newPassword.value!="" && newPassword.value.length<6){

        showError(newPassword,passwordError,"Password must be at least 6 characters.");

        valid=false;

    }

    if(newPassword.value!="" &&
       confirmPassword.value!="" &&
       newPassword.value!==confirmPassword.value){

        showError(confirmPassword,confirmError,"Passwords do not match.");

        valid=false;

    }

    if(!valid) return;

    document.querySelector(".section").style.display="none";

    document.getElementById("otpSection").style.display="none";

    document.getElementById("passwordSection").style.display="none";

    document.getElementById("successSection").style.display="block";

};

// ===============================
// SHOW / HIDE PASSWORD
// ===============================

function togglePassword(id,icon){

    const input=document.getElementById(id);

    if(input.type==="password"){

        input.type="text";

        icon.classList.remove("fa-eye");

        icon.classList.add("fa-eye-slash");

    }else{

        input.type="password";

        icon.classList.remove("fa-eye-slash");

        icon.classList.add("fa-eye");

    }

}