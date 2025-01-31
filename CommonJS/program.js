document.addEventListener('DOMContentLoaded', () => {
    const filterImages = document.querySelectorAll('.styles_filterTypes__rgtjl img');
    const backButton = document.querySelector('.styles_backBtn__R1tTa');
    const filterDiv = document.querySelector('.styles_filtersDesktop__Ejkci');
    const programsContainer = document.querySelector('.styles_programsContainer__MSZLc');

    if (filterImages.length && filterDiv && programsContainer) {
        // Add event listeners to all filter icons
        filterImages.forEach(image => {
            image.addEventListener('click', () => {
                // Show the filter container and hide icons
                filterDiv.classList.remove('hidden-filter');
                programsContainer.classList.add('icons-hidden');
            });
        });

        // Add event listener to the back button to close filters
        if (backButton) {
            backButton.addEventListener('click', () => {
                // Hide the filter container and show icons
                filterDiv.classList.add('hidden-filter');
                programsContainer.classList.remove('icons-hidden');
            });
        }
    } else {
        console.warn('Some elements are missing in the DOM.');
    }

    // Hide elements with the class `.icon-class`
    document.querySelectorAll('.icon-class').forEach(icon => {
        icon.style.display = 'none';
    });
});
document.querySelector('.styles_filterLogo__IUuM3').addEventListener('click', function() {
    const filterSection = document.querySelector('.styles_filtersDesktop__Ejkci');
    filterSection.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
    const filterImage = document.querySelector('.styles_filtersLogo__XnFjk'); // The filter icon
    const backButton = document.querySelector('.styles_backBtn__R1tTa'); // The back button inside the filter section
    const filterDiv = document.querySelector('.styles_filtersDesktop__Ejkci'); // The filter container
    const programsContainer = document.querySelector('.styles_programsContainer__MSZLc'); // The programs container

    if (filterImage && filterDiv && programsContainer) {
        // Open the filter container when the filter icon is clicked
        filterImage.addEventListener('click', () => {
            filterDiv.classList.toggle('active'); // Add or remove 'active' to show/hide filter
            programsContainer.classList.toggle('icons-hidden'); // Hide the programs container icons
        });

        // Close the filter container when the back button is clicked
        if (backButton) {
            backButton.addEventListener('click', () => {
                filterDiv.classList.remove('active'); // Hide the filter container
                programsContainer.classList.remove('icons-hidden'); // Show the programs container icons
            });
        }
    } else {
        console.warn('Some elements are missing in the DOM.');
    }
});

