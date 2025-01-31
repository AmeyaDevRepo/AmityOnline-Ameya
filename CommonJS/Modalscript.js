


document.addEventListener("DOMContentLoaded", () => {
    // Call Modal Elements
    const callModal = document.getElementById("call_modal");
    const callButton = document.getElementById("call-us-button");
    const callCloseButton = document.querySelector("#call_modal .Modal_close__C0ggP");

    // Login Modal Elements
    let studentLoginVar = true;
    const loginModal = document.getElementById("_modal");
    const loginButton = document.getElementById("login-button");
    const loginCloseButton = document.querySelector("#_modal .Modal_close__C0ggP");
    const loginButtonMobile = document.getElementById("login-button-mobile");
    const loginModalMobile = document.getElementById("_modal");

    // Apply Modal Elements
    const applyModal = document.getElementById("Apply_modal");
    const applyButton = document.getElementById("apply-now-btn");
    const applyCloseButton = document.querySelector("#Apply_modal .Modal_close__C0ggP");
    // Apply Modal Elements Mobille
    const applyButtonMobile = document.getElementById("apply-now-btn-mobile");
    const applyModalMobile = document.getElementById("Apply_modal");
    // Download Modal Elements
    // Download Modal Elements
    

    // Program Modal Elements
    // Program Modal Elements
    const programModal = document.getElementById("program_modal");
    const programButton = document.getElementById("program_button");
    const programCloseButton = document.querySelector("#program_modal .Modal_close__C0ggP");

    const stickyApplyButton = document.querySelector('.sticky-apply-btn');
    // const applyModal = document.getElementById('Apply_modal');
    const closeModalButton = document.querySelector('.Modal_close__C0ggP');

    stickyApplyButton.addEventListener('click', function () {
        applyModal.style.display = 'block';  // Show the modal 
    });

    // Close the modal when the close button is clicked
    closeModalButton.addEventListener('click', function () {
        applyModal.style.display = 'none';  // Hide the modal
    });

    window.addEventListener('click', function (event) {
        if (event.target === applyModal) {
            applyModal.style.display = 'none';
        }
    });

    const secApplyButton = document.querySelector('.sec-apply');
    const enrollNowBtn = document.querySelector('.enroll-now-btn');
    // const applyModal = document.getElementById('Apply_modal');
    // const closeModalButton = document.querySelector('.Modal_close__C0ggP');

    secApplyButton?.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default behavior (e.g., navigating to another page)
        applyModal.style.display = 'block';  // Show the modal
    });

    // Close the modal when the close button is clicked
    closeModalButton.addEventListener('click', function () {
        applyModal.style.display = 'none';  // Hide the modal
    });

    enrollNowBtn?.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default behavior (e.g., navigating to another page)
        applyModal.style.display = 'block';  // Show the modal
    });

    // Optionally, close the modal if clicked outside the modal content
    window.addEventListener('click', function (event) {
        if (event.target === applyModal) {
            applyModal.style.display = 'none';
        }
    });

    document.getElementById('nationalcodeselect').addEventListener('click', (e) => {
        e.preventDefault();

        document.getElementById('nationalcodeselect').style = `
            all: unset;
            border: 1px solid var(--P-Blue,#1a325d);
            background: var(--P-Blue,#1a325d);
            padding: .2rem 1.5rem;
            color: #fff;
            border-radius: .2rem;
            cursor: pointer;
            text-transform: uppercase;
            font-weight: 500;`;

        document.getElementById('internationcodeselect').style = `
            all: unset;
            border: 1px solid var(--P-Blue,#1a325d);
            color: var(--P-Blue,#1a325d);
            padding: .2rem 1.5rem;
            background: #fff;
            border-radius: .2rem;
            cursor: pointer;
            text-transform: uppercase;
            font-weight: 500;`;
        const option = document.getElementById('defalutoption');
        option.innerText = "+91"

    });

    // Add event listener for the international button
    document.getElementById('internationcodeselect').addEventListener('click', (e) => {
        e.preventDefault();


        document.getElementById('internationcodeselect').style = `
            all: unset;
            border: 1px solid var(--P-Blue,#1a325d);
            background: var(--P-Blue,#1a325d);
            padding: .2rem 1.5rem;
            color: #fff;
            border-radius: .2rem;
            cursor: pointer;
            text-transform: uppercase;
            font-weight: 500;`;

        // Reset styles for the national button
        document.getElementById('nationalcodeselect').style = `
            all: unset;
            border: 1px solid var(--P-Blue,#1a325d);
            color: var(--P-Blue,#1a325d);
            padding: .2rem 1.5rem;
            background: #fff;
            border-radius: .2rem;
            cursor: pointer;
            text-transform: uppercase;
            font-weight: 500;`;
        const option = document.getElementById('defalutoption');
        option.innerText = 'Code'

    });


    // login modal script start
    // const studentLoginVar = true;
    document.getElementById('loginwithotp').addEventListener('click', (e) => {
        if (studentLoginVar) {
            document.getElementById('phoneinputfield').style.display = 'block';
            document.getElementById('emailinputfield').style.display = 'none';
            document.getElementById('phoneinputfieldapplicant').style.display = 'none';
            document.getElementById('loginwithemail').checked = false; 
            document.getElementById('loginwithotp').checked = true; 
        } else {
            document.getElementById('phoneinputfieldapplicant').style.display = 'block';
            document.getElementById('emailinputfield').style.display = 'none';
            document.getElementById('phoneinputfield').style.display = 'none';
            document.getElementById('loginwithemail').checked = false; 
            document.getElementById('loginwithotp').checked = true; 
        }
    });
    
    document.getElementById('loginwithemail').addEventListener('click',(e)=>{
            if(studentLoginVar){
            document.getElementById('emailinputfield').style.display = 'block';
            document.getElementById('forgotPasswordBtn').style.display = 'block';
            document.getElementById('phoneinputfield').style.display = 'none';
            document.getElementById('phoneinputfieldapplicant').style.display = 'none';
            document.getElementById('loginwithotp').checked = false;
            document.getElementById('loginwithemail').checked = true;
        } else {
            document.getElementById('emailinputfield').style.display = 'block';
            document.getElementById('forgotPasswordBtn').style.display = 'none';
            document.getElementById('phoneinputfield').style.display = 'none';
            document.getElementById('phoneinputfieldapplicant').style.display = 'none';
            document.getElementById('loginwithotp').checked = false; 
            document.getElementById('loginwithemail').checked = true; 
        
    }
})



    document.getElementById('studentlogin').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('applicantlogin').style = `
       background: #fff;
color: #1a325d`;

        document.getElementById('studentlogin').style = `
         color: #fff;
border-color: #1a325d;
background: #1a325d;`;
        studentLoginVar = true;
        handleEmailForm()
        handlePhoneForm()


    });

    document.getElementById('applicantlogin').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('applicantlogin').style = `
         color: #fff !important;
border-color: #1a325d !important;
background: #1a325d !important;`;
        document.getElementById('studentlogin').style = `
background: #fff;
color: #1a325d`;

        studentLoginVar = false;
        handleEmailForm()
        handlePhoneForm()

    });

    document.getElementById('forgotPasswordBtn').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('forgotPasswordForm').style.display = 'block';

    });
    document.getElementById('backToLoginBtn').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('forgotPasswordForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';

    });
    // login modal script end

    // Call Modal Handlers
    if (callButton && callModal) {
        callButton?.addEventListener("click", (e) => {
            e.preventDefault();
            callModal.style.display = "grid";
        });
    }

    if (callCloseButton && callModal) {
        callCloseButton?.addEventListener("click", (e) => {
            e.preventDefault();
            callModal.style.display = "none";
        });
    }

    // Login Modal Handlers
    if (loginButton && loginModal) {
        loginButton?.addEventListener("click", (e) => {
            e.preventDefault();
            loginModal.style.display = "grid";
        });
    }

    if (loginCloseButton && loginModal) {
        loginCloseButton?.addEventListener("click", (e) => {
            e.preventDefault();
            loginModal.style.display = "none";
        });
    }

    // Apply Modal Handlers
    if (applyButton && applyModal) {
        applyButton?.addEventListener("click", (e) => {
            e.preventDefault();
            applyModal.style.display = "grid";
        });
    }
    // Apply Modal Handlers for Mobile
    if (applyButtonMobile && applyModalMobile) {
        applyButtonMobile?.addEventListener("click", (e) => {
            e.preventDefault();
            applyModalMobile.style.display = "grid";
        });
    }
    if (loginButtonMobile && loginModalMobile) {
        loginButtonMobile?.addEventListener("click", (e) => {
            e.preventDefault();
            loginModalMobile.style.display = "grid";
        });
    }

    if (applyCloseButton && applyModal) {
        applyCloseButton?.addEventListener("click", (e) => {
            e.preventDefault();
            applyModal.style.display = "none";
        });
    }
    // Close Modal for Mobile
    if (applyCloseButtonMobile && applyModalMobile) {
        applyCloseButtonMobile?.addEventListener("click", (e) => {
            e.preventDefault();
            applyModalMobile.style.display = "none";
        });
    }
    if (loginCloseButtonMobile && loginModalMobile) {
        loginCloseButtonMobile?.addEventListener("click", (e) => {
            e.preventDefault();
            loginModalMobile.style.display = "none";
        });
    }


    // Download Modal Handlers
    if (programButton && programModal) {
        programButton?.addEventListener("click", (e) => {
            e.preventDefault();
            programModal.style.display = "grid";
        });
    }

    if (programCloseButton && programModal) {
        programCloseButton?.addEventListener("click", (e) => {
            e.preventDefault();
            programModal.style.display = "none";
        });
    }

    // Global click handler for closing modals when clicking outside
    window.addEventListener("click", (e) => {
        if (e.target === callModal) {
            callModal.style.display = "none";
        }
        if (e.target === loginModal) {
            loginModal.style.display = "none";
        }
        if (e.target === applyModal) {
            applyModal.style.display = "none";
        }
        
        if (e.target === programModal) {
            programModal.style.display = "none";
        }
    });
    window.addEventListener("click", (e) => {
        if (e.target === applyModal) {
            applyModal.style.display = "none";
        }
        if (e.target === applyModalMobile) {
            applyModalMobile.style.display = "none";
        }
        if (e.target === loginModal) {
            loginModal.style.display = "none";
        }
        if (e.target === loginModalMobile) {
            loginModalMobile.style.display = "none";
        }
    });



});

document.addEventListener("DOMContentLoaded", () => {
    // Download Modal Elements
    const downloadModal = document.getElementById("download_modal");
    const downloadButton = document.getElementById("download_brochure_button");
    const downloadCloseButton = document.querySelector("#download_modal .Modal_close__C0ggP");

    const downloadModalMobile = document.getElementById("download_modal");
    const downloadButtonMobile = document.getElementById("download_brochure_button_mobile");


    
    // Open the download modal
    if (downloadButton && downloadModal) {
        downloadButton.addEventListener("click", (e) => {
            e.preventDefault();
            downloadModal.style.display = "grid"; // Show the modal
        });
    }
    if (downloadButtonMobile && downloadModalMobile) {
        downloadButtonMobile.addEventListener("click", (e) => {
            e.preventDefault();
            downloadModalMobile.style.display = "grid";
        });
    }
    // Close the download modal
    if (downloadCloseButton && downloadModal) {
        downloadCloseButton.addEventListener("click", (e) => {
            e.preventDefault();
            downloadModal.style.display = "none"; // Hide the modal
        });
    }
    const DownloadCloseButtonMobile = document.querySelector("#Apply_modal .Modal_close__C0ggP");
if (downloadCloseButtonMobile && downloadModalMobile) {
    downloadCloseButtonMobile.addEventListener("click", (e) => {
        e.preventDefault();
        downloadModalMobile.style.display = "none"; // Close the modal
    });
}
    // Close the modal if clicked outside the modal content
    window.addEventListener("click", (e) => {
        if (e.target === downloadModal) {
            downloadModal.style.display = "none";
        }
    });
});

  document.addEventListener("DOMContentLoaded", function () {
    // Select all menu items
    const menuItems = document.querySelectorAll(".ProgramsMenu_item__mfuSn");

    // Add click event listener to each menu item
    menuItems.forEach((item) => {
      item.addEventListener("click", function () {
        // Remove the active class from all items
        menuItems.forEach((el) =>
          el.classList.remove("ProgramsMenu_active__4g64w")
        );

        // Add the active class to the clicked item
        item.classList.add("ProgramsMenu_active__4g64w");
      });
    });
  });
function enableScroll(elementId) {
    const container = document.getElementById(elementId);
    if(!container) return;
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isDown = false;
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX);
        container.scrollLeft = scrollLeft - walk;
    });
}

enableScroll('landingPageFacultyList');