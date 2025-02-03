function initializeMobileMenu() {
    // Get references to elements
    const searchIcon = document.querySelector('.header-search-icon');
    const menuToggleButton = document.getElementById('menuToggleButton');
    const hamburgerImage = document.getElementById('hamburgerImage');
    const closeIcon = document.getElementById('closeIcon');
    const mobileContainer = document.getElementById('mobileContainer');
    console.log(mobileContainer)
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

function initializeMobileProgramMenu() {
    // Get references to elements
    const mobileProgramsLink = document.querySelector('.header_menuItem__2qruK a[href="#"]'); // mobile nav bar or inside link
    const mobileProgramsMenu = document.querySelector('.ProgramsMenu_mobile__K4seG'); // this is a popover menu list
    const mobileMenuItems = document.querySelectorAll('.ProgramsMenu_mobile__K4seG .ProgramsMenu_item__mfuSn');// this is a popover menu list with inside links
    const contentBoxes = document.querySelectorAll('.ProgramsMenu_contentBox__UHi_e'); // detailed menu box of particular program
    const ameya_programm_list = document.querySelector('.ameya_programm_list');
    const ameya_main_navbar = document.querySelector('.ameya_main_navbar');
    const ameya_backbtn_programmelist = document.querySelectorAll('.ameya_backbtn_programmelist');
    // console.log("vikas",mobileProgramsLink,mobileProgramsMenu,mobileMenuItems,contentBoxes)
    ameya_main_navbar.addEventListener('click',()=>{
        mobileProgramsMenu.style.display = 'none';
    })
    if (mobileProgramsLink && mobileProgramsMenu) {
        // Open menu and show "All Programs" by default
        mobileProgramsLink.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            mobileProgramsMenu.style.display = 'block';
            // mobileProgramsMenu.style.backgroundColor = 'green';
            // Hide all content boxes initially
            contentBoxes.forEach(box => box.style.display = 'none');
        });

        document.querySelectorAll('a[href$="/Program/index.html"]').forEach(a => {
            // Move all child nodes before removing the <a>
            while (a.firstChild) {
                a.parentNode.insertBefore(a.firstChild, a);
            }
        
            // Remove the <a> element
            a.remove();
        });
        

        // Add click event listener to each menu item
        mobileMenuItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all menu items
                mobileMenuItems.forEach(el => el.classList.remove('ProgramsMenu_active__4g64w'));
                ameya_programm_list.style.display = "none"
                // mobileMenuItems.forEach(el => el.style.display = "none");
                // Add active class to the clicked item
                item.classList.add('ProgramsMenu_active__4g64w');
                // item.style.display = "block"
                // Get the data-category attribute of the clicked item
                const category = item.dataset.category;

                // Hide all content and show the selected category
                contentBoxes.forEach(box => box.style.display = 'none');
                const contentBox = document.querySelector(`.ProgramsMenu_contentBox__UHi_e[data-category="${category}"]`);
                ameya_backbtn_programmelist.forEach((el)=>el.addEventListener('click',(e)=>{
                    // e.defaultPrevented();
                    e.stopPropagation();
                    ameya_programm_list.style.display = "block";
                    contentBox.style.display = 'none';
                }))
                const programs = document.querySelectorAll('.ProgramsMenu_tab__0j8Nn');
                if (contentBox) {
                    contentBox.style.display = 'block';
                    // contentBox.style.backgroundColor = "red"
                    // mobileProgramsMenu.style.display = 'none';
                }
                programs.forEach(program => {
                    if (category === 'All' || program.classList.contains(category)) {
                        console.log("bikas")
                        program.forEach((el)=>el.style.display = 'block!important')
                        // program.style.display = 'block!important';
                    } else {
                        program.style.display = 'none';
                        mobileProgramsMenu.style.display = 'block';
                    }
                });
                console.log("vikas", contentBox)
                
            });
        });

        // Close menu when close button is clicked
        const closeButton = mobileProgramsMenu.querySelector('.ProgramsMenu_closeButton__3QVlI');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                mobileProgramsMenu.style.display = 'none';
            });
        }
    }
}

async function includeComponent(filepath, targetId) {
    try {
        const response = await fetch(filepath);
        const text = await response.text();

        document.getElementById(targetId).innerHTML = text;

        if (targetId === 'mobile-menu-container') {
            // initializeProgramsModal();
            initializeMobileMenu();
            initializeMobileProgramMenu();
        }

    } catch (error) {
        console.error('Error loading component:', error);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    initializeMobileProgramMenu();
});