function initializeHeader() {
    // Programs Modal (with null checks)
    const programsDiv = document.getElementById("programsDiv");
    const closeButton = document.getElementById("closeButton");
    const programsLink = document.getElementById("programsLink");

    if (programsLink && programsDiv && closeButton) {
        programsLink.addEventListener('click', (e) => {
            e.preventDefault();
            programsDiv.style.display = 'block';
        });

        closeButton.addEventListener('click', () => {
            programsDiv.style.display = 'none';
        });
    }


}

function initializeDownloadModal() {
    // Modal elements
    const loginModal = document.getElementById('download_modal');
    const closeButton = loginModal.querySelector('.Modal_close__C0ggP');
    const form = loginModal.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, select');

    // Get the download button
    const loginButton = document.getElementById('download_brochure_button');

    // Toggle modal visibility
    function toggleModal(show = false) {
        loginModal.style.display = show ? 'block' : 'none';
    }

    // Add click handler to download button
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();  // Prevent default anchor behavior
        toggleModal(true);
    });

    // Close modal when clicking close button
    closeButton.addEventListener('click', () => toggleModal(false));

    // Close on clicking outside
    loginModal.addEventListener('click', (e) => {
        if (e.target.closest('.Modal_dialog__e3Pgf')) {
            return; // Don't close if clicking inside modal content
        }
        toggleModal(false);
    });

    // Form validation
    function validateForm() {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        const name = form.querySelector('#name-input').value.trim();
        const phone = form.querySelector('#phone-number').value.trim();
        const email = form.querySelector('#email-id').value.trim();
        const consent = form.querySelector('input[name="consent"]:checked');

        if (!name || !phone || !email || !consent) {
            isValid = false;
        }

        if (!emailRegex.test(email)) {
            isValid = false;
        }

        if (!phoneRegex.test(phone)) {
            isValid = false;
        }

        submitButton.disabled = !isValid;
        submitButton.className = isValid
            ? 'button_root__RRK9v mt-auto !bg-blue-600 !text-white button_b__2Obj5'
            : 'button_root__RRK9v mt-auto !bg-[#E7E7E7] !border-stone-500 !text-stone-500 button_b__2Obj5';
    }

    // Add input listeners for validation
    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: form.querySelector('#name-input').value,
            countryCode: form.querySelector('#country-code-select').value,
            phone: form.querySelector('#phone-number').value,
            email: form.querySelector('#email-id').value
        };

        try {
            // Add your form submission logic here
            console.log('Form submitted:', formData);

            // Close modal after successful submission
            toggleModal(false);

            // Reset form
            form.reset();
            validateForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });

    // Initialize form validation state
    validateForm();
}

function initializeLoginModal() {
    // Modal elements
    const loginModal = document.getElementById('_modal');
    const closeButton = loginModal.querySelector('.Modal_close__C0ggP');
    const form = loginModal.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, select');

    // Get the download button
    const loginButton = document.getElementById('login-button');

    // Toggle modal visibility
    function toggleModal(show = false) {
        loginModal.style.display = show ? 'block' : 'none';
    }

    // Add click handler to download button
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();  // Prevent default anchor behavior
        toggleModal(true);
    });

    // Close modal when clicking close button
    closeButton.addEventListener('click', () => toggleModal(false));

    // Close on clicking outside
    loginModal.addEventListener('click', (e) => {
        if (e.target.closest('.Modal_dialog__e3Pgf')) {
            return; // Don't close if clicking inside modal content
        }
        toggleModal(false);
    });

    // login modal script start
    // const studentLoginlet = true;
    document.getElementById('loginwithotp').addEventListener('click', (e) => {
        if (studentLoginlet) {
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

    document.getElementById('loginwithemail').addEventListener('click', (e) => {
        if (studentLoginlet) {
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
        studentLoginlet = true;
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

        studentLoginlet = false;
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

    // Form validation
    function validateForm() {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        const name = form.querySelector('#name-input').value.trim();
        const phone = form.querySelector('#phone-number').value.trim();
        const email = form.querySelector('#email-id').value.trim();
        const consent = form.querySelector('input[name="consent"]:checked');

        if (!name || !phone || !email || !consent) {
            isValid = false;
        }

        if (!emailRegex.test(email)) {
            isValid = false;
        }

        if (!phoneRegex.test(phone)) {
            isValid = false;
        }

        submitButton.disabled = !isValid;
        submitButton.className = isValid
            ? 'button_root__RRK9v mt-auto !bg-blue-600 !text-white button_b__2Obj5'
            : 'button_root__RRK9v mt-auto !bg-[#E7E7E7] !border-stone-500 !text-stone-500 button_b__2Obj5';
    }

    // Add input listeners for validation
    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: form.querySelector('#name-input').value,
            countryCode: form.querySelector('#country-code-select').value,
            phone: form.querySelector('#phone-number').value,
            email: form.querySelector('#email-id').value
        };

        try {
            // Add your form submission logic here
            console.log('Form submitted:', formData);

            // Close modal after successful submission
            toggleModal(false);

            // Reset form
            form.reset();
            validateForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });

    // Initialize form validation state
    validateForm();
}

function applyNowPopupMobileView() {
    const applyModal = document.getElementById("Apply_modal");
    applyModal.style.display = "grid";
}

function loginPopupMobileView(){
    const loginModal = document.getElementById('_modal');
    loginModal.style.display = 'block';
}

function initializeApplyModal() {
    const applyModal = document.getElementById("Apply_modal");
    const applyButton = document.getElementById("apply-now-btn");
    const applyButtonClass = document.querySelector(".apply-now-btn-class");
    const applyCloseButton = document.querySelector("#Apply_modal .Modal_close__C0ggP");
    const stickyApplyButton = document.querySelector('.sticky-apply-btn');

    // Apply Modal Elements Mobileapply-now-btn
    const applyButtonMobile = document.getElementById("apply-now-btn-mobile");


    // Event Listeners
    applyCloseButton?.addEventListener('click', () => {
        applyModal.style.display = 'none';
        $("#apply-now-popup-submit-btn").attr("disabled", true);
        $("#apply-now-popup-submit-btn").attr("class", "font-semibold font-raleway uppercase w-full border Input_btn___g__n bg-[#E7E7E7] border-stone-500 text-stone-500");
        $(".aplly-now-second-step").attr("style", "display:none;");
        document.getElementById("applyNowForm").reset();
        localStorage.removeItem("ApplyNowFormStep");
    });

    stickyApplyButton?.addEventListener('click', function () {
        applyModal.style.display = 'block';  // Show the modal 
    });

    if (applyButton && applyModal) {
        applyButton.addEventListener("click", (e) => {
            e.preventDefault();
            applyModal.style.display = "grid";
        });
    }

    // window.addEventListener('click', (event) => {
    //     if (event.target === applyModal) applyModal.style.display = 'none';
    // });

    // National/International Button Handlers (now correctly ID'd)
    document.getElementById('nationalcodeselect')?.addEventListener('click', (e) => {
        e.preventDefault();
        // Update styles and code...
        document.getElementById('nationalcodeselect').style = `
			all: unset;
			border: 1px solid var(--P-Blue, #1a325d);
			background: var(--P-Blue, #1a325d);
			padding: .2rem 1.5rem;
			color: #fff;
			border-radius: .2rem;
			cursor: pointer;
			text-transform: uppercase;
			font-weight: 500;`;

        document.getElementById('internationcodeselect').style = `
			all: unset;
			border: 1px solid var(--P-Blue, #1a325d);
			color: var(--P-Blue, #1a325d);
			padding: .2rem 1.5rem;
			background: #fff;
			border-radius: .2rem;
			cursor: pointer;
			text-transform: uppercase;
			font-weight: 500;`;

        const option = document.getElementById('defalutoption');
        option.innerText = "+91";
    });

    document.getElementById('internationcodeselect')?.addEventListener('click', (e) => {
        e.preventDefault();
        // Update styles and code...
        document.getElementById('internationcodeselect').style = `
			all: unset;
			border: 1px solid var(--P-Blue, #1a325d);
			background: var(--P-Blue, #1a325d);
			padding: .2rem 1.5rem;
			color: #fff;
			border-radius: .2rem;
			cursor: pointer;
			text-transform: uppercase;
			font-weight: 500;`;

        document.getElementById('nationalcodeselect').style = `
			all: unset;
			border: 1px solid var(--P-Blue, #1a325d);
			color: var(--P-Blue, #1a325d);
			padding: .2rem 1.5rem;
			background: #fff;
			border-radius: .2rem;
			cursor: pointer;
			text-transform: uppercase;
			font-weight: 500;`;

        const option = document.getElementById('defalutoption');
        option.innerText = 'Code';
    });

    // Apply Button Handlers
    document.querySelectorAll("#apply-now-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("Apply_modal").style.display = "grid";
        });
    });


    applyButtonMobile?.addEventListener("click", (e) => {
        e.preventDefault();
        applyModal.style.display = "grid";
    });
}

function initializeProgramsModal() {
    const programsDiv = document.getElementById("programsDiv");
    const closeButton = document.getElementById("closeButton");
    const programsLink = document.getElementById('programsLink');

    // Show the programsDiv when 'PROGRAMS' link is clicked
    programsLink.addEventListener('click', function (e) {
        e.preventDefault();
        programsDiv.style.display = 'block';  // Show the div
        document.body.style.overflow = 'hidden';  // Hide the scrollbar
    });

    // Select all menu items
    const menuItems = document.querySelectorAll(".ProgramsMenu_item__mfuSn");

    // Add click event listener to each menu item
    menuItems.forEach((item) => {
        item.addEventListener("click", function () {
            // Remove the active class from all items
            menuItems.forEach((el) => el.classList.remove("ProgramsMenu_active__4g64w"));

            // Add the active class to the clicked item
            item.classList.add("ProgramsMenu_active__4g64w");

            // Get the category of the clicked item
            const category = item.getAttribute('data-category');

            // Filter and display programs
            const programs = document.querySelectorAll('.ProgramsMenu_tab__0j8Nn');
            programs.forEach(program => {
                if (category === 'All' || program.classList.contains(category)) {
                    program.style.display = 'block';
                } else {
                    program.style.display = 'none';
                }
            });
        });
    });

    // Close the programsDiv when close icon is clicked
    closeButton.addEventListener('click', function () {
        programsDiv.style.display = 'none';  // Hide the div
        document.body.style.overflow = 'auto';  // Restore the scrollbar
    });

    // Click outside close
    window.addEventListener('click', (event) => {
        if (event.target === programsDiv) {
            programsDiv.style.display = 'none';
        }
    });

    // Programs button click handler
    programsLink.addEventListener('click', (e) => {
        e.preventDefault();
        programsDiv.style.display = 'block';
    });
}

function initializeMobileMenu() {
    // Get references to elements
    const searchIcon = document.querySelector('.header-search-icon');
    const menuToggleButton = document.getElementById('menuToggleButton');
    const hamburgerImage = document.getElementById('hamburgerImage');
    const closeIcon = document.getElementById('closeIcon');
    const mobileContainer = document.getElementById('mobileContainer');

    // Toggle menu visibility and icons
    menuToggleButton.addEventListener('click', () => {
        const isHamburgerVisible = hamburgerImage.style.display !== 'none';

        if (isHamburgerVisible) {
            // Hide the hamburger image, show the cross icon, and display the mobile container
            hamburgerImage.style.display = 'none';
            closeIcon.style.display = 'block';
            mobileContainer.style.display = 'block';
        } else {
            // Show the hamburger image, hide the cross icon, and hide the mobile container
            hamburgerImage.style.display = 'block';
            closeIcon.style.display = 'none';
            mobileContainer.style.display = 'none';
        }
    });
    // Function to check if the device is mobile
    function isMobile() {
        return window.innerWidth <= 1024;  // Adjust this value based on your mobile breakpoint
    }

    // Toggle the mobile menu visibility when the search icon is clicked (only on mobile)
    searchIcon.addEventListener('click', function () {
        if (isMobile()) {
            // Toggle visibility of mobile menu
            if (mobileContainer.style.display === 'block') {
                mobileContainer.style.display = 'none';  // Hide the menu
                hamburgerImage.style.display = 'block';  // Show hamburger
                closeIcon.style.display = 'none';  // Hide close icon
            } else {
                mobileContainer.style.display = 'block';  // Show the menu
                hamburgerImage.style.display = 'none';  // Hide hamburger
                closeIcon.style.display = 'block';  // Show close icon
            }
        }
    });
}


// Modified component loader
async function includeComponent(filepath, targetId) {
    try {
        const response = await fetch(filepath);
        const text = await response.text();

        // Insert the content
        document.getElementById(targetId).innerHTML = text;

        // Initialize modal if this is the download modal component
        if (targetId === 'header-container') {
            initializeHeader();
        }
        if (targetId === 'modal-container') {
            initializeDownloadModal();
        }
        if (targetId === 'login-modal') {
            initializeLoginModal();
        }
        if (targetId === 'apply-modal-container') {
            initializeApplyModal();
        }
        if (targetId === 'programs-modal-container') {
            initializeProgramsModal();
            // initializeMobileMenu();
        }
        if (targetId === 'mobile-menu-container') {
            // initializeProgramsModal();
            initializeMobileMenu();
        }

    } catch (error) {
        console.error('Error loading component:', error);
    }
}

$(document).on('click', '.header-search-icon', function () {
    $('#search-input').toggleClass('active');
});