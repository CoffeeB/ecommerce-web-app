if (!sessionStorage.user) {
    location.replace('/login');
}

const placeOrderBtn = document.querySelector('.place-order-btn');
placeOrderBtn.addEventListener('click', () => {
    let address = getAddress();

    if (address) {
        fetch('/order', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                order: JSON.parse(localStorage.cart),
                email: JSON.parse(sessionStorage.user).email,
                add: address,
            })
        }).then(res => res.json())
          .then(data => {
            showAlert(data.alert, 'success');
            if (data.alert == 'your order has been placed') {
                delete localStorage.cart;
                showAlert(data.alert, 'success');
                location.reload();
            } else {
                showAlert(data.alert);   
            }
        });        
    }
})

const getAddress = () => {
    // validation
    let address = document.querySelector('#address').value;
    let street = document.querySelector('#street').value;
    let city = document.querySelector('#city').value;
    let zipcode = document.querySelector('#zipcode').value;
    let landmark = document.querySelector('#landmark').value;
    let state = document.querySelector('#state').value;
    
    if (!address.length || !street.length || !city.length || !state.length || !zipcode.length || !landmark.length) {
        showAlert('fill all the delivery inputs');
    } else {
        return {address, street, state, city, zipcode, landmark};
    }
}