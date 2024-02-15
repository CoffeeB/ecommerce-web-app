 // category inputs
 const clothes = document.querySelector('#clothes');
 const shoes = document.querySelector('#shoes');
 const kids = document.querySelector('#kids');
 const vehicles = document.querySelector('#vehicles');
 const food = document.querySelector('#food');
 const sports = document.querySelector('#sports');
 const electronics = document.querySelector('#electronics');

 // containers for sub-category and sizes
 const sub = document.querySelector('#sub-categories');
 const size = document.querySelector('#sizes');

 // event listeners for category inputs
 clothes.addEventListener('change', updateOptions);
 shoes.addEventListener('change', updateOptions);
 kids.addEventListener('change', updateOptions);
 vehicles.addEventListener('change', updateOptions);
 food.addEventListener('change', updateOptions);
 sports.addEventListener('change', updateOptions);
 electronics.addEventListener('change', updateOptions);

 // create the function that updates the sub-category and sizes
 function updateOptions() {
     // clear existing selections
     sub.innerHTML = "";
     size.innerHTML = "";

     // new sizes and sub-category options based on category
     if (clothes.checked) {
         const subCategories = ["Men's Shirt", "Women's Shirts", "Men's Trousers", "Women's Trousers", "Men's Underwear", "Women's Underwear"];

         subCategories.forEach(category => {
             const subContainer = document.createElement('div');
             subContainer.classList.add('category-container');

             const subInput = document.createElement('input');
             subInput.type = 'radio';
             subInput.classList.add('radio-checker');
             subInput.name = 'sub-category';
             subInput.id = category.toLowerCase();

             const subLabel = document.createElement('label');
             subLabel.htmlFor = category.toLowerCase();
             subLabel.classList.add('label');
             subLabel.textContent = category;

             subContainer.appendChild(subInput);
             subContainer.appendChild(subLabel);
             sub.appendChild(subContainer);
         });
         
         const sizes = ["xs", "s", "m", "l", "xl", "xxl", "xxxl"];
         const sizer = document.querySelector('.sizes'); // Select the parent element outside the loop

         sizes.forEach(category => {
             const sizeInput = document.createElement('input');
             sizeInput.type = 'checkbox';
             sizeInput.classList.add('size-checkbox');
             sizeInput.value = category.toLowerCase();

             sizer.appendChild(sizeInput);
         });
     } else if (shoes.checked) {
         const subCategories = ["Sneakers", "boots", "flats", "heels", "slippers", "sandals", "formal", "custom"];

         subCategories.forEach(category => {
             const subContainer = document.createElement('div');
             subContainer.classList.add('category-container');

             const subInput = document.createElement('input');
             subInput.type = 'radio';
             subInput.classList.add('radio-checker');
             subInput.name = 'sub-category';
             subInput.id = category.toLowerCase();

             const subLabel = document.createElement('label');
             subLabel.htmlFor = category.toLowerCase();
             subLabel.classList.add('label');
             subLabel.textContent = category;

             subContainer.appendChild(subInput);
             subContainer.appendChild(subLabel);
             sub.appendChild(subContainer);
         });
         
         const sizes = ["below 28", "28-32", "33-36", "37-42", "43-45", "above 45"];
         const sizer = document.querySelector('.sizes'); // Select the parent element outside the loop

         sizes.forEach(category => {
             const sizeInput = document.createElement('input');
             sizeInput.type = 'checkbox';
             sizeInput.classList.add('size-checkbox');
             sizeInput.value = category.toLowerCase();

             sizer.appendChild(sizeInput);
         });
     } else if (kids.checked) {
        const subCategories = ["kids clothes", "toys", "books", "baby care products", "party supplies", "Health and Safety", "outdoor gear"];
    
        subCategories.forEach(category => {
            const subContainer = document.createElement('div');
            subContainer.classList.add('category-container');
    
            const subInput = document.createElement('input');
            subInput.type = 'radio';
            subInput.classList.add('radio-checker');
            subInput.name = 'sub-category';
            subInput.id = category.toLowerCase();
    
            const subLabel = document.createElement('label');
            subLabel.htmlFor = category.toLowerCase();
            subLabel.classList.add('label');
            subLabel.textContent = category;
    
            subContainer.appendChild(subInput);
            subContainer.appendChild(subLabel);
            sub.appendChild(subContainer);
        });
    
        // Handle sizes based on the selected sub-category
        const subCategoryInputs = document.querySelectorAll('input[name="sub-category"]');
        const sizer = document.querySelector('.sizes');
    
        subCategoryInputs.forEach(subCategoryInput => {
            subCategoryInput.addEventListener('change', () => {
                sizer.innerHTML = ""; // Clear existing sizes
    
                if (subCategoryInput.id === "kids clothes") {
                    const sizes = ["xs", "s", "m", "l", "xl", "xxl", "xxxl"];
    
                    sizes.forEach(category => {
                        const sizeInput = document.createElement('input');
                        sizeInput.type = 'checkbox';
                        sizeInput.classList.add('size-checkbox');
                        sizeInput.value = category.toLowerCase();
    
                        sizer.appendChild(sizeInput);
                    });
                } else if (subCategoryInput.id === "toys") {
                    const sizeInput = document.createElement('p');
                    sizeInput.textContent = "This is not available for this product";
                    sizer.appendChild(sizeInput);
                } else if (subCategoryInput.id === "books") {
                    const sizes = ["Story Books", "Novels", "Text Books", "Note Books", "Diaries", "Colour Books"];
                        
                    sizes.forEach(category => {
                        const sizeInput = document.createElement('input');
                        sizeInput.type = 'checkbox';
                        sizeInput.classList.add('size-checkbox');
                        sizeInput.value = category.toLowerCase();
    
                        sizer.appendChild(sizeInput);
                    });
                }
            });
        });
     } else if (vehicles.checked) {
         const subCategories = ["Men's Shirt", "Women's Shirts", "Men's Trousers", "Women's Trousers", "Men's Underwear", "Women's Underwear"];

         subCategories.forEach(category => {
             const subContainer = document.createElement('div');
             subContainer.classList.add('category-container');

             const subInput = document.createElement('input');
             subInput.type = 'radio';
             subInput.classList.add('radio-checker');
             subInput.name = 'sub-category';
             subInput.id = category.toLowerCase();

             const subLabel = document.createElement('label');
             subLabel.htmlFor = category.toLowerCase();
             subLabel.classList.add('label');
             subLabel.textContent = category;

             subContainer.appendChild(subInput);
             subContainer.appendChild(subLabel);
             sub.appendChild(subContainer);
         });
         
         const sizes = ["xs", "s", "m", "l", "xl", "xxl", "xxxl"];
         const sizer = document.querySelector('.sizes'); // Select the parent element outside the loop

         sizes.forEach(category => {
             const sizeInput = document.createElement('input');
             sizeInput.type = 'checkbox';
             sizeInput.classList.add('size-checkbox');
             sizeInput.value = category.toLowerCase();

             sizer.appendChild(sizeInput);
         });
     } else if (sports.checked) {
        const subCategories = ["Men's Shirt", "Women's Shirts", "Men's Trousers", "Women's Trousers", "Men's Underwear", "Women's Underwear"];

        subCategories.forEach(category => {
            const subContainer = document.createElement('div');
            subContainer.classList.add('category-container');

            const subInput = document.createElement('input');
            subInput.type = 'radio';
            subInput.classList.add('radio-checker');
            subInput.name = 'sub-category';
            subInput.id = category.toLowerCase();

            const subLabel = document.createElement('label');
            subLabel.htmlFor = category.toLowerCase();
            subLabel.classList.add('label');
            subLabel.textContent = category;

            subContainer.appendChild(subInput);
            subContainer.appendChild(subLabel);
            sub.appendChild(subContainer);
        });
        
        const sizes = ["xs", "s", "m", "l", "xl", "xxl", "xxxl"];
        const sizer = document.querySelector('.sizes'); // Select the parent element outside the loop

        sizes.forEach(category => {
            const sizeInput = document.createElement('input');
            sizeInput.type = 'checkbox';
            sizeInput.classList.add('size-checkbox');
            sizeInput.value = category.toLowerCase();

            sizer.appendChild(sizeInput);
        });
     } else if (food.checked) {
         const subCategories = ["Men's Shirt", "Women's Shirts", "Men's Trousers", "Women's Trousers", "Men's Underwear", "Women's Underwear"];

         subCategories.forEach(category => {
             const subContainer = document.createElement('div');
             subContainer.classList.add('category-container');

             const subInput = document.createElement('input');
             subInput.type = 'radio';
             subInput.classList.add('radio-checker');
             subInput.name = 'sub-category';
             subInput.id = category.toLowerCase();

             const subLabel = document.createElement('label');
             subLabel.htmlFor = category.toLowerCase();
             subLabel.classList.add('label');
             subLabel.textContent = category;

             subContainer.appendChild(subInput);
             subContainer.appendChild(subLabel);
             sub.appendChild(subContainer);
         });
         
         const sizes = ["xs", "s", "m", "l", "xl", "xxl", "xxxl"];
         const sizer = document.querySelector('.sizes'); // Select the parent element outside the loop

         sizes.forEach(category => {
             const sizeInput = document.createElement('input');
             sizeInput.type = 'checkbox';
             sizeInput.classList.add('size-checkbox');
             sizeInput.value = category.toLowerCase();

             sizer.appendChild(sizeInput);
         });
     } else if (electronics.checked) {
         const subCategories = ["Men's Shirt", "Women's Shirts", "Men's Trousers", "Women's Trousers", "Men's Underwear", "Women's Underwear"];

         subCategories.forEach(category => {
             const subContainer = document.createElement('div');
             subContainer.classList.add('category-container');

             const subInput = document.createElement('input');
             subInput.type = 'radio';
             subInput.classList.add('radio-checker');
             subInput.name = 'sub-category';
             subInput.id = category.toLowerCase();

             const subLabel = document.createElement('label');
             subLabel.htmlFor = category.toLowerCase();
             subLabel.classList.add('label');
             subLabel.textContent = category;

             subContainer.appendChild(subInput);
             subContainer.appendChild(subLabel);
             sub.appendChild(subContainer);
         });
         
         const sizes = ["xs", "s", "m", "l", "xl", "xxl", "xxxl"];
         const sizer = document.querySelector('.sizes'); // Select the parent element outside the loop

         sizes.forEach(category => {
             const sizeInput = document.createElement('input');
             sizeInput.type = 'checkbox';
             sizeInput.classList.add('size-checkbox');
             sizeInput.value = category.toLowerCase();

             sizer.appendChild(sizeInput);
         });
     }
 }