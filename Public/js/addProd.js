let user = JSON.parse(sessionStorage.user || null);
let loader = document.querySelector('.loader');

// checking if user is logged in or not
window.onload = () => {
    if (user) {
        if (!compareToken(user.authToken, user.email)) {
            location.replace('/login');
        }
        if (!user.seller) {
            location.replace('/seller');
        }
    } else {
        location.replace('/login');
    }
}

// price inputs

const actualPrice = document.querySelector('#actual-price');
const discountPercentage = document.querySelector('#discount');
const sellingPrice = document.querySelector('#sell-price');

discountPercentage.addEventListener('input', () => {
    if (discountPercentage.value > 100) {
        discountPercentage.value = 90;
    } else {
        let discount = actualPrice.value * discountPercentage.value / 100;
        sellingPrice.value = actualPrice.value - discount;
    }
})

sellingPrice.addEventListener('input', () => {
    let discount = (sellingPrice.value / actualPrice.value)* 100;
    discountPercentage.value = discount;
})

// upload image handle
let uploadImages = document.querySelectorAll('.fileupload');
let imagePaths = []; // for uploaded image paths to be stored

uploadImages.forEach((fileupload, index) => {
    fileupload.addEventListener('change', () => {
        const file = fileupload.files[0];
        let imageUrl;
        
        if (file.type.includes('image')) {
            // means user uploaded an image
            fetch('/s3url').then(res => res.json())
            .then(url => {
                fetch(url, {
                    method: 'PUT',
                    headers: new Headers({'Content-Type': 'multipart/form-data'}),
                    body: file
                }).then(res => {
                    imageUrl = url.split("?")[0];
                    imagePaths[index] = imageUrl;
                    let label = document.querySelector(`label[for=${fileupload.id}]`);
                    label.style.backgroundImage = `url(${imageUrl})`;
                    let productImage = document.querySelector('.product-image');
                    let indicate = document.querySelector('.indicator');
                    productImage.style.backgroundImage = `url(${imageUrl})`;
                    if (productImage != null) {
                        indicate.classList.add('hide');
                    }
                })
            })
        } else {
            showAlert('Upload Image only');
        }
    })
})

// form submission

const productName = document.querySelector('#product-name');
const shortLine = document.querySelector('#short-des');
const des = document.querySelector('#des');
const pictures = document.querySelector('.upload-image-sec');
const sizeSelector = document.querySelector('.select-sizes');

let sizes = []; // will store all the sizes

const stock = document.querySelector('#stock');
const tags = document.querySelector('#tags');
const tnc = document.querySelector('#tnc');

//  buttons

const addProductBtn = document.querySelector('#add-btn');
const saveDraft = document.querySelector('#draft-btn');

// store size function
const storeSizes = () => {
    sizes = [];
    let sizeCheckBox = document.querySelectorAll('.size-checkbox');
    sizeCheckBox.forEach(item => {
        if (item.checked) {
            sizes.push(item.value);
        } 
    });
}

const validateForm = () => {
    if (!productName.value.length) {
        productName.focus();
        productName.scrollIntoView({behavior: 'smooth'});
        return showAlert('enter product name');
    } else if (shortLine.value.length > 100 || shortLine.value.length < 10) {
        shortLine.focus();
        shortLine.scrollIntoView({behavior: 'smooth'});
        return showAlert('snippet must be between 10 and 100 letters long');
    } else if (!des.value.length) {
        des.focus();
        des.scrollIntoView({behavior: 'smooth'});
        return showAlert('enter detailed description about the product');
    } else if (!imagePaths.length) { // image link array
        pictures.classList.add('warn');
        pictures.scrollIntoView({behavior: 'smooth'});
        return showAlert('upload at least one product image');
    } else if (!sizes.length) { // size array
            sizeSelector.classList.add('warn');
            sizeSelector.scrollIntoView({behavior: 'smooth'});
            return showAlert('select at least one size');
    } else if (!actualPrice.value.length || !discount.value.length || !sellingPrice.value.length) {
        actualPrice.focus();
        sellingPrice.focus();
        actualPrice.scrollIntoView({behavior: 'smooth'});
        return showAlert('you must add pricings');
    } else if (stock.value < 20) {
        stock.focus();
        stock.scrollIntoView({behavior: 'smooth'});
        return showAlert('you must have at least 20 items in stock');
    } else if (!tags.value.length) {
        tags.focus();
        tags.scrollIntoView({behavior: 'smooth'});
        return showAlert('enter few tags to help ranking your product in search');
    } else if (!tnc.checked) {
        return showAlert('you must agree to our terms and conditions');
    }
    return true;
}

const productData = () => {
    let tagArr = tags.value.split(',');
    tagArr.forEach((item, i) => tagArr[i] = tagArr[i].trim());
    return data = {
        name: productName.value,
        shortDes: shortLine.value,
        des: des.value,
        images: imagePaths,
        sizes: sizes,
        actPrice: actualPrice.value,
        disc: discountPercentage.value,
        sellPrice: sellingPrice.value,
        stock: stock.value,
        tags: tagArr,
        tnc: tnc.checked,
        email: user.email
    }
}

addProductBtn.addEventListener('click', () => {
    storeSizes();
    // validate form
    if (validateForm()) { // if validate form returns true or false while doing validation
        loader.style.display = 'block';
        let data = productData();
        if (productId) {
            data.id = productId;
        }
        sendData('/add-product', data);
    }
})

saveDraft.addEventListener('click', () => {
    // store sizes
    storeSizes();
    // check product name
    if (!productName.value.length) {
        productName.classList.add('warn');
        productName.scrollIntoView({behavior: 'smooth'});
        return showAlert('enter product name');
    } else {
        let data = productData();
        data.draft = true;
        if (productId) {
            data.id = productId;
        }
        sendData('/add-product', data);
    }
})

// existing product handle
const setFormData = (data) => {
    productName.value = data.name;
    shortLine.value = data.shortDes;
    des.value = data.des;
    actualPrice.value = data.actPrice;
    discountPercentage.value = data.disc;
    sellingPrice.value = data.sellPrice;
    stock.value = data.stock;
    tags.value = data.tags;

    // saving image drafts

    imagePaths = data.images;
    imagePaths.forEach((url, i) => {
        let label = document.querySelector(`label[for=${uploadImages[i].id}]`);
        label.style.backgroundImage = `url(${url})`;
        let productImage = document.querySelector('.product-image');
        let indicate = document.querySelector('.indicator');
        productImage.style.backgroundImage = `url(${url})`;
        if (productImage != null) {
            indicate.classList.add('hide');
        }
    })

    // saving sizes drafts
    sizes = data.sizes;
    
    let sizeCheckBox = document.querySelectorAll('.size-checkbox');
    sizeCheckBox.forEach(item => {
        if (sizes.includes(item.value)) {
            item.setAttribute('checked', '');
        }
    })
}

const fetchProductData = () => {
    fetch('/get-products', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({email: user.email, id: productId})
    }).then(res => res.json())
    .then(data => {
        console.log(data);
        setFormData(data);
    })
}

let productId = null;
if (location.pathname != '/add-product') {
    productId = decodeURI(location.pathname.split('/').pop());

    fetchProductData();
}
