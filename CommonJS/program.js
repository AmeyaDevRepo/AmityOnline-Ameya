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

// document.addEventListener('DOMContentLoaded', () => {
//     const filterButtons = document.querySelectorAll('.styles_filterType__yfnkJ button');
//     const filterDiv = document.querySelector('.styles_filtersDesktop__Ejkci');
//     const programsContainer = document.querySelector('.styles_programsContainer__MSZLc');
//     const backButton = document.querySelector('.styles_backBtn__R1tTa');
//     const appliedFiltersContainer = document.getElementById('applied-filters');
//     const clearAllButton = document.querySelector('.styles_clear__D9lJm');

//     let currentFilters = {
//         programType: null,
//         domain: null,
//         duration: null,
//         trending: null
//     };

//     filterButtons.forEach(button => {
//         button.addEventListener('click', (e) => {
//             e.preventDefault();
//             applyFilter(button);
//         });
//     });

//     backButton.addEventListener('click', () => {
//         clearFilters();
//         filterDiv.classList.add('hidden-filter');
//         programsContainer.classList.remove('icons-hidden');
//     });

//     clearAllButton.addEventListener('click', () => {
//         clearFilters();
//     });

//     function applyFilter(button) {
//         const filterCategory = button.closest('.styles_filterType__yfnkJ').querySelector('p').textContent.trim();
//         const filterValue = button.textContent.trim();

//         switch(filterCategory) {
//             case 'Program Type':
//                 currentFilters.programType = filterValue;
//                 break;
//             case 'Domain':
//                 currentFilters.domain = filterValue;
//                 break;
//             case 'Duration':
//                 currentFilters.duration = filterValue;
//                 break;
//             case 'Trending Programs':
//                 currentFilters.trending = filterValue;
//                 break;
//         }

//         updateAppliedFilters();
//         filterPrograms();
//     }

//     function updateAppliedFilters() {
//         appliedFiltersContainer.innerHTML = '';
//         Object.entries(currentFilters).forEach(([key, value]) => {
//             if (value) {
//                 const filterButton = document.createElement('button');
//                 filterButton.className = 'styles_highlightedBtn__vxZyA';
//                 filterButton.innerHTML = `<span>${value}</span><img alt="Remove" loading="lazy" width="10" height="10" decoding="async" data-nimg="1" src="https://amityonline.com/_next/static/media/close.915fc8dd.svg" style="color: transparent;">`;
//                 filterButton.addEventListener('click', () => removeFilter(key));
//                 appliedFiltersContainer.appendChild(filterButton);
//             }
//         });
//     }

//     function removeFilter(filterKey) {
//         currentFilters[filterKey] = null;
//         updateAppliedFilters();
//         filterPrograms();
//     }

//     function clearFilters() {
//         currentFilters = {
//             programType: null,
//             domain: null,
//             duration: null,
//             trending: null
//         };
//         updateAppliedFilters();
//         filterPrograms();
//     }

//     function filterPrograms() {
//         const programs = document.querySelectorAll('.styles_programListing__SWYKc');
        
//         programs.forEach(program => {
//             let isVisible = true;

//             if (currentFilters.programType) {
//                 const typeElement = program.querySelector('.styles_programType__UPZjf');
//                 isVisible = typeElement?.textContent.includes(currentFilters.programType);
//             }

//             if (currentFilters.domain && isVisible) {
//                 const nameElement = program.querySelector('.styles_name__ffrQn');
//                 isVisible = nameElement?.textContent.toLowerCase().includes(currentFilters.domain.toLowerCase());
//             }

//             if (currentFilters.duration && isVisible) {
//                 const durationElement = program.querySelector('.styles_yearContainer__FFpQm span');
//                 isVisible = durationElement?.textContent.includes(currentFilters.duration);
//             }

//             if (currentFilters.trending && isVisible) {
//                 const stripElement = program.querySelector('.styles_strip__HEmoT');
//                 isVisible = stripElement?.textContent.includes(currentFilters.trending);
//             }

//             program.style.display = isVisible ? 'block' : 'none';
//         });
//     }
// });

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.styles_filterType__yfnkJ button');
    const filterDiv = document.querySelector('.styles_filtersDesktop__Ejkci');
    const programsContainer = document.querySelector('.styles_programsContainer__MSZLc');
    const backButton = document.querySelector('.styles_backBtn__R1tTa');
    const appliedFiltersContainer = document.getElementById('applied-filters');
    const clearAllButton = document.querySelector('.styles_clear__D9lJm');
    const appliedFiltersSection = document.querySelector('.flex.items-center.justify-between'); // Select the "Applied filters" section

    let currentFilters = {
        programType: null,
        domain: null,
        duration: null,
        trending: null
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            applyFilter(button);
        });
    });

    backButton.addEventListener('click', () => {
        clearFilters();
        filterDiv.classList.add('hidden-filter');
        programsContainer.classList.remove('icons-hidden');
    });

    clearAllButton.addEventListener('click', () => {
        clearFilters();
    });

    function applyFilter(button) {
        const filterCategory = button.closest('.styles_filterType__yfnkJ').querySelector('p').textContent.trim();
        const filterValue = button.textContent.trim();

        switch(filterCategory) {
            case 'Program Type':
                currentFilters.programType = filterValue;
                break;
            case 'Domain':
                currentFilters.domain = filterValue;
                break;
            case 'Duration':
                currentFilters.duration = filterValue;
                break;
            case 'Trending Programs':
                currentFilters.trending = filterValue;
                break;
        }

        updateAppliedFilters();
        filterPrograms();
    }

    function updateAppliedFilters() {
        appliedFiltersContainer.innerHTML = '';
        let hasFilters = false;

        Object.entries(currentFilters).forEach(([key, value]) => {
            if (value) {
                hasFilters = true;
                const filterButton = document.createElement('button');
                filterButton.className = 'styles_highlightedBtn__vxZyA';
                filterButton.innerHTML = `<span>${value}</span><img alt="Remove" loading="lazy" width="10" height="10" decoding="async" data-nimg="1" src="https://amityonline.com/_next/static/media/close.915fc8dd.svg" style="color: transparent;">`;
                filterButton.addEventListener('click', () => removeFilter(key));
                appliedFiltersContainer.appendChild(filterButton);
            }
        });

        // Toggle visibility of the "Applied filters" section
        if (hasFilters) {
            appliedFiltersSection.style.display = 'flex'; // Show the section
        } else {
            appliedFiltersSection.style.display = 'none'; // Hide the section
        }
    }

    function removeFilter(filterKey) {
        currentFilters[filterKey] = null;
        updateAppliedFilters();
        filterPrograms();
    }

    function clearFilters() {
        currentFilters = {
            programType: null,
            domain: null,
            duration: null,
            trending: null
        };
        updateAppliedFilters();
        filterPrograms();
    }

    function filterPrograms() {
        const programs = document.querySelectorAll('.styles_programListing__SWYKc');
        
        programs.forEach(program => {
            let isVisible = true;

            if (currentFilters.programType) {
                const typeElement = program.querySelector('.styles_programType__UPZjf');
                isVisible = typeElement?.textContent.includes(currentFilters.programType);
            }

            if (currentFilters.domain && isVisible) {
                const nameElement = program.querySelector('.styles_name__ffrQn');
                isVisible = nameElement?.textContent.toLowerCase().includes(currentFilters.domain.toLowerCase());
            }

            if (currentFilters.duration && isVisible) {
                const durationElement = program.querySelector('.styles_yearContainer__FFpQm span');
                isVisible = durationElement?.textContent.includes(currentFilters.duration);
            }

            if (currentFilters.trending && isVisible) {
                const stripElement = program.querySelector('.styles_strip__HEmoT');
                isVisible = stripElement?.textContent.includes(currentFilters.trending);
            }

            program.style.display = isVisible ? 'block' : 'none';
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const filterIcon = document.querySelector('.styles_filtersLogo__XnFjk'); // The filter icon
    const backButton = document.querySelector('.styles_backBtn__R1tTa'); // The back button inside the filter section
    const filterDiv = document.querySelector('.styles_filtersDesktop__Ejkci'); // The filter container

    if (filterIcon && backButton && filterDiv) {
        // Open the filter container when the filter icon is clicked
        filterIcon.addEventListener('click', () => {
            filterDiv.classList.remove('hidden-filter'); // Remove 'hidden-filter' to show the filter section
        });

        // Close the filter container when the back button is clicked
        backButton.addEventListener('click', () => {
            filterDiv.classList.add('hidden-filter'); // Add 'hidden-filter' to hide the filter section
        });
    } else {
        console.warn('Filter icon, back button, or filter section is missing in the DOM.');
    }
});