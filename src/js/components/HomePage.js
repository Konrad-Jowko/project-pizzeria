import {templates, classNames, settings, select} from '../settings.js';
//import utils from '../utils.js';

class HomePage {
  constructor(wrapper) {
    const thisPage = this;

    thisPage.data = {};

    thisPage.getData();
    thisPage.render(wrapper);
  }

  render(wrapper) {
    const thisPage = this;


    const generatedHTML = templates.homePage(thisPage.data);

    thisPage.dom = {};

    thisPage.dom.wrapper = wrapper;

    thisPage.dom.wrapper.innerHTML = generatedHTML;

    const elem = document.querySelector('.main-carousel');
    // eslint-disable-next-line
    const flkty = new Flickity( elem, {
      // options
      cellAlign: 'left',
      autoPlay: true,
      adaptiveHeight: true,
      contain: true,
      imagesLoaded: true,
      setGallerySize: false,
      prevNextButtons: false
    });

    const btn = document.querySelectorAll(thisPage.data.btn);

    for (let button of btn) {
      button.addEventListener('click', thisPage.initRedirecting);
    }
  }

  getData () {
    const thisPage = this;

    thisPage.data.firstImg = classNames.home.firstImg;
    thisPage.data.secondImg = classNames.home.secondImg;
    thisPage.data.images = settings.images;
    thisPage.data.btn = classNames.home.btn;
  }

  initRedirecting () {

    const target = event.target;
    const att = target.getAttribute('class');

    if (att == classNames.home.firstImg || att == classNames.home.secondImg) {

      const linkAtt = att.replace(classNames.home.btnClass, '');
      const href = '#' + linkAtt;

      const pages = document.querySelector(select.containerOf.pages).children;
      const navLinks = document.querySelectorAll(select.nav.links);

      for (let page of pages) {

        if (page.id == 'order' || page.id == 'booking' ||page.id == 'home') {
          page.classList.toggle(classNames.pages.active, page.id == linkAtt);
        }
      }

      window.location.hash = '#/' + linkAtt;

      for (let link of navLinks) {

        const linkHref = link.getAttribute('href');

        link.classList.toggle(classNames.pages.active, linkHref == href);
      }





    }
  }
}




export default HomePage;
