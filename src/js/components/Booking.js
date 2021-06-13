import {templates, select} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor (element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();


  }

  render (element) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = element;

    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    thisBooking.dom.dates = document.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hours = document.querySelector(select.widgets.hourPicker.wrapper);

  }
  initWidgets () {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dates = new DatePicker(thisBooking.dom.dates);
    thisBooking.hours = new HourPicker(thisBooking.dom.hours);

    thisBooking.dom.peopleAmount.addEventListener('updated', function() {});
    thisBooking.dom.hoursAmount.addEventListener('updated', function() {});
  }

}

export default Booking;
