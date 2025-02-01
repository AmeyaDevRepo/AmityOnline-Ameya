function initializeApplyModal() {
        const applyModal = document.getElementById("Apply_modal");
        const applyButton = document.getElementById("apply-now-btn");
        const applyCloseButton = document.querySelector("#Apply_modal .Modal_close__C0ggP");
        const closeModalButton = document.querySelector('.Modal_close__C0ggP');

        // Apply Modal Elements Mobille
        const applyButtonMobile = document.getElementById("apply-now-btn-mobile");
        const applyModalMobile = document.getElementById("Apply_modal");

        // Close the modal when the close button is clicked
        closeModalButton.addEventListener('click', function () {
            applyModal.style.display = 'none';  // Hide the modal
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

        // Add event listener for the international button
        document.getElementById('internationcodeselect').addEventListener('click', (e) => {
            e.preventDefault();

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
        // Apply Modal Handlers
        if (applyButton && applyModal) {
            applyButton.addEventListener("click", (e) => {
                e.preventDefault();
                applyModal.style.display = "grid";
            });
        }
        // Apply Modal Handlers for Mobile
        if (applyButtonMobile && applyModalMobile) {
            applyButtonMobile.addEventListener("click", (e) => {
                e.preventDefault();
                applyModalMobile.style.display = "grid";
            });
        }

        if (applyCloseButton && applyModal) {
            applyCloseButton.addEventListener("click", (e) => {
                e.preventDefault();
                applyModal.style.display = "none";
            });
        }
        // Close Modal for Mobile
        if (applyCloseButtonMobile && applyModalMobile) {
            applyCloseButtonMobile.addEventListener("click", (e) => {
                e.preventDefault();
                applyModalMobile.style.display = "none";
            });
        }
    
}

async function includeApplyComponent(filepath, targetId) {
    try {
        const response = await fetch(filepath);
        const text = await response.text();

        document.getElementById(targetId).innerHTML = text;

        if (targetId === 'apply-modal-container') {
            initializeApplyModal();
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}