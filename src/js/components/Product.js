import {select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';


class Product{
  constructor(id, data){
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();


  }
  renderInMenu(){
    const thisProduct = this;

    const generatedHTML = templates.menuProduct(thisProduct.data);

    thisProduct.element = utils.createDOMFromHTML(generatedHTML);

    const menuContainer = document.querySelector(select.containerOf.menu);

    menuContainer.appendChild(thisProduct.element);
  }

  getElements(){
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }


  initAccordion(){
    const thisProduct = this;

    thisProduct.accordionTrigger.addEventListener('click', function(){


      event.preventDefault();

      let activeProduct = document.querySelector('[class="product active"]');


      if (activeProduct && activeProduct != thisProduct.element){

        activeProduct.classList.remove('active');

        thisProduct.element.classList.toggle('active');
      } else {
        thisProduct.element.classList.toggle('active');
      }});
  }

  initOrderForm(){
    const thisProduct = this;


    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
      thisProduct.prepareCartProduct();
    });

  }

  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

    thisProduct.amountWidgetElem.addEventListener('updated', function() { thisProduct.processOrder();});

  }

  processOrder(){
    const thisProduct = this;

    const formData = utils.serializeFormToObject(thisProduct.form);


    let price = thisProduct.data.price;



    for(let paramId in thisProduct.data.params) {

      const param = thisProduct.data.params[paramId];


      for(let optionId in param.options) {
        const option = param.options[optionId];


        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        const image = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);


        if (image) {
          if(optionSelected) {
            image.classList.add(classNames.menuProduct.imageVisible);
          } else {
            image.classList.remove(classNames.menuProduct.imageVisible);
          }
        }


        if (optionSelected) {


          if (!option['default']) {

            price += option['price'];
          }
        } else {

          if (option['default']) {

            price -= option['price'];

          }

        }
      }
    }
    thisProduct.priceSingle = price;
    price *= thisProduct.amountWidget.value;
    thisProduct.priceElem.innerHTML = price;
  }

  addToCart () {
    const thisProduct = this;
    thisProduct.preparedProduct = thisProduct.prepareCartProduct();


    // app.cart.add(thisProduct.prepareCartProduct());

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct.preparedProduct,
      }
    });

    thisProduct.element.dispatchEvent(event);
  }

  prepareCartProductParams() {
    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.form);
    const params = {};
    // for very category (param)
    for(let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];

      // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
      params[paramId] = {
        label: param.label,
        options: {}
      };
      // for every option in this category

      for(let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        if(optionSelected) {
          params[paramId].options[optionId] = option.label;
        }
      }
    }
    return params;
  }

  prepareCartProduct () {
    const thisProduct = this;

    const productSummary = {};
    productSummary.id = thisProduct.id;
    productSummary.name = thisProduct.data.name;
    productSummary.amount = thisProduct.amountWidget.value;
    productSummary.priceSingle = thisProduct.priceSingle;
    productSummary.price = thisProduct.priceSingle *   productSummary.amount;
    productSummary.params = thisProduct.prepareCartProductParams();

    return productSummary;
  }


}

export default Product;
