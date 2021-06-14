import {select, settings, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';


class Cart{
  constructor(element){
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();

  }
  getElements(element){
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subTotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelector(select.cart.totalPrice);
    thisCart.dom.cartTotalPrice = thisCart.dom.wrapper.querySelector(select.cart.cartTotalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber );
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);

  }

  remove(cartProduct){
    const thisCart = this;

    const productHTML = cartProduct.dom.wrapper;
    productHTML.remove();

    const productIndex = thisCart.products.indexOf(cartProduct);

    thisCart.products.splice(productIndex, 1);

    thisCart.update();

  }

  sendOrder(){
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;

    const payload = {};

    payload.adress = thisCart.dom.address.value;
    payload.phone = thisCart.dom.phone.value;
    payload.totalPrice = thisCart.totalPrice;
    payload.subtotalPrice =   thisCart.subTotalPrice;
    payload.totalNumber =   thisCart.totalNumber;
    payload.deliveryFee = settings.cart.defaultDeliveryFee;
    payload.products = [];

    console.log(payload);

    for(let prod of thisCart.products) {

      payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options);


  }

  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function() {

      thisCart.remove(event.detail.cartProduct);});

    thisCart.dom.form.addEventListener('submit', function(){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct){
    const thisCart = this;

    const generatedHTML = templates.cartProduct(menuProduct);

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    thisCart.dom.productList.appendChild(generatedDOM);


    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

    thisCart.update();
  }
  update(){
    const thisCart = this;

    const deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subTotalPrice = 0;

    for (let product of thisCart.products) {
      thisCart.totalNumber += product.amount;
      thisCart.subTotalPrice += product.price;

    }
    if (thisCart.subTotalPrice != 0) {
      thisCart.totalPrice = thisCart.subTotalPrice + deliveryFee;
    } else {
      thisCart.totalPrice  = 0;
    }

    thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    thisCart.dom.subTotalPrice.innerHTML = thisCart.subTotalPrice;
    thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.dom.cartTotalPrice .innerHTML = thisCart.totalPrice;

  }



}

export default Cart;
