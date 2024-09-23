
    // document.getElementById("hamburger").onclick = function toggleMenu() {
    //     const navToggle = document.getElementsByClassName("toggle");
    //     for (let i = 0; i < navToggle.length; i++) {
    //       navToggle.item(i).classList.toggle("hidden");
    //     }
    //   };


    //   function validatePasswords() {
    //     var password1 = document.getElementById("password").value;
    //     var password2 = document.getElementById("Confirm_password").value;
    
    //     if (password1 != password2) {
    //         alert("Passwords do not match!");
    //         return false;
    //     }
    //     return true;
    // }
    

    function validatePasswords() {
      var password1 = document.getElementById("password").value;
      var password2 = document.getElementById("Confirm_password").value;
      var errorMessage = document.getElementById("error-message");
    
      if (password1 !== password2) {
        errorMessage.innerText = "Passwords do not match!";
        errorMessage.style.display = "block";
        return false;
      }
    
      errorMessage.style.display = "none";
      return true;
    }
    


    document.addEventListener("DOMContentLoaded", function () {
      const menuToggle = document.querySelector(".menu-toggle");
      const mobileMenu = document.querySelector(".mobile-menu");

      menuToggle.addEventListener("click", function () {
        mobileMenu.classList.toggle("hidden");
      });
    });

//for password show
function myFunction() {
  var x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

//expend and show
document.addEventListener('DOMContentLoaded', function () {
  const triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach(trigger => {
      trigger.addEventListener('click', function () {
          const content = this.nextElementSibling;
          content.classList.toggle('hidden');
      });
  });
});