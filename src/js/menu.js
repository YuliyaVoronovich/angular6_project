import products from "./product.json" assert { type: "json" };

// import modalCard from "./modal-card.js";

const body = document.querySelector('body');
let currentCategory = 'coffee';
let currentProducts = [];
const itemCategoryButtons = document.querySelectorAll('.menu-choice-button');
let menuList = document.querySelector('.menu-list');
let loader = document.querySelector('.loader');
const closeModal = document.querySelector('.modal-button-close');

const modalSize = document.querySelectorAll('.modal-choice-size-value');
const modalAdditives = document.querySelectorAll('.modal-choice-additives-value');

const modalSizeButtons = document.querySelectorAll('.modal-choice-size');
const modalAdditivesButtons = document.querySelectorAll('.modal-choice-additives');
//const nodes = menuList.childNodes;
let arrayCards = [];

let currentSizeButton = modalSizeButtons[0];
let totalPrice = 0;
let price = 0;
let isLoader = false;
let isPopUp = false;;

const getCurrentProduts = () => {
    currentProducts = products.filter((item) => item.category === currentCategory);
};

itemCategoryButtons.forEach((button) => {
    
    button.addEventListener ('click', event => {
        itemCategoryButtons.forEach((currentButton) => currentButton.classList.remove('active'));
        button.classList.add('active');

        currentCategory = button.querySelector('.menu-choice-button-title').innerText.toLowerCase();
        getCurrentProduts();
        showMenuList(currentProducts);
        isLoader = false;
    
    });
});

const showMenuList = (currentProducts) => {     

    menuList.style.opacity = 0;  

    setTimeout(() => {
      menuList.innerHTML = '';
     // item = '';
     arrayCards = [];
      currentProducts.forEach((item, index) => {

       const itemCard = createCard(item, index);
       menuList.appendChild(itemCard);

       arrayCards.push(itemCard); 

      }); 
      menuList.style.opacity = 1;
      //menuList.innerHTML = list;
     
      resizeProduct();
      openCard();
    }, 400);
}

const createCard = (item, index) => {
  const itemCard = document.createElement('li');
  itemCard.classList.add('menu-item');

  const article = document.createElement('article');
  article.classList.add('menu-card');
  itemCard.append(article);

  const h2 = document.createElement('h2');
  h2.classList.add('hidden');
  h2.textContent = `menu-card`;
  article.append(h2);

  const div = document.createElement('div');
  div.classList.add('menu-item-overflow');
  article.append(div);

  const image = document.createElement('img');
  image.classList.add('menu-item-img');
  image.src = `./assets/img/${item.category}-${index+1}.jpg`;
  image.alt = `Image ${item.category}_${index+1}`;
  div.append(image);

  const divDesc = document.createElement('div');
  divDesc.classList.add('menu-item-desc');
  article.append(divDesc);

  const strong = document.createElement('strong');
  strong.classList.add('menu-item-title');
  strong.textContent = `${item.name}`;
  divDesc.append(strong);

  const p = document.createElement('p');
  p.classList.add('menu-item-text');
  p.textContent = `${item.description}`;
  divDesc.append(p);

  const span = document.createElement('span');
  span.classList.add('menu-item-price');
  span.textContent = `$${item.price}`;
  divDesc.append(span);

  return itemCard;
  //   return `<li class="menu-item">
  //   <article class="menu-card">
  //     <h2 class="hidden">menu-card</h2>
  //     <div class="menu-item-overflow">
  //       <img class="menu-item-img" src="./assets/img/${item.category}-${index+1}.jpg" alt="Image ${item.category}_${index+1}">
  //     </div>
  //     <div class="menu-item-desc">
  //       <strong class="menu-item-title">${item.name}</strong>
  //       <p class="menu-item-text">${item.description}</p>
  //       <span class="menu-item-price">$${item.price}</span>
  //     </div>
  //   </article>
  // </li>`;
}

function resizeProduct () {
    let widthWind = document.querySelector('body').offsetWidth;

    loader.classList.remove('active'); 

    arrayCards.forEach((item) => {
      item.classList.remove('hide');     
    });

    if (widthWind < 769) {
      if (!isLoader) {
        console.log(isLoader);
        if (currentProducts.length > 4) {
          //показать только 4 карточки    
  
          arrayCards.slice(4).forEach((item) => {
               item.classList.add('hide');     
             });
           loader.classList.add('active');
         } 
      }       
    }    
}
function openCard() {
  arrayCards.forEach((item, index) => {

    item.addEventListener ('click', event => {
      const currentPopUp = document.querySelector('#modal-popup');
      openPopUp(currentPopUp); 
      resetActiveButtonModal();
      currentSizeButton = modalSizeButtons[0];
      currentSizeButton.classList.add('active');
      totalPrice = 0;
      drawModalCard(currentProducts[index], index);  
      

    });
  
  });
}

// function drawModalCard(item, index) {
//   document.querySelector('.modal-card').innerHTML =  modalCard(item, index);
 
// }

function drawModalCard(item, index) {
  document.querySelector('.modal-img').innerHTML = `<img class="menu-item-img" src="./assets/img/${item.category}-${index+1}.jpg" alt="Image ${item.category}_${index+1}">`;   
  document.querySelector('.modal-card-title').innerHTML = `${item.name}`;
  document.querySelector('.modal-card-text').innerHTML = `${item.description}`;

  modalSize.forEach((size, index) => {
    size.innerHTML = `${item.sizes[Object.keys(item.sizes)[index]].size}`;
    size.closest('.modal-choice-size').dataset.price = `${item.sizes[Object.keys(item.sizes)[index]]['add-price']}`;
  });

  modalAdditives.forEach((additive, index) => {
    additive.innerHTML = `${item.additives[Object.keys(item.additives)[index]].name}`;
    additive.closest('.modal-choice-additives').dataset.price = `${item.additives[Object.keys(item.additives)[index]]['add-price']}`;
  });

  document.querySelector('.modal-card-price').innerHTML =`$${item.price}`;
  totalPrice = +item.price;
}


function resetActiveButtonModal () {
  modalSizeButtons.forEach((currentButton) => currentButton.classList.remove('active'));
  modalAdditivesButtons.forEach((currentButton) => currentButton.classList.remove('active'));
}


modalSizeButtons.forEach((button) => {
    
  button.addEventListener ('click', event => {
     currentSizeButton.classList.remove('active');
     totalPrice -= +currentSizeButton.getAttribute('data-price');

    button.classList.add('active');
    totalPrice += +button.getAttribute('data-price');

    changePrice(totalPrice); 
    currentSizeButton = button;

  });
});

modalAdditivesButtons.forEach((button) => {
    
  button.addEventListener ('click', event => {

    if (button.classList.contains('active')) {
      button.classList.remove('active');
      totalPrice -= +button.getAttribute('data-price');
    } else {
      button.classList.add('active');
      totalPrice += +button.getAttribute('data-price');
    }    
    changePrice(totalPrice);  
  });
});

function changePrice(totalPrice) {

  document.querySelector('.modal-card-price').innerHTML = `$${totalPrice.toFixed(2)}`;
}

//popup

closeModal.addEventListener('click', event => {
  closePopUp(event.target.closest('.modal-wrap'));  
  event.preventDefault();  
});

function openPopUp(popUp) {

  if (popUp) {
  const popupActive = document.querySelector('.modal-wrap.open');   
      if (popupActive) {
          closePopUp(popupActive);
      } else {
          bodyLock();
      }
      popUp.classList.add('open');

      popUp.addEventListener('click', event => {
            if (!event.target.closest('.modal-content')) {
              closePopUp(event.target.closest('.modal-wrap'));
          }
      });  
      isPopUp = true;        
  }     
}

function closePopUp(popUp) {
      popUp.classList.remove('open');
      bodyUnlock();
      isPopUp = false;

}


function  bodyLock() {
  body.style.paddingRight = window.innerWidth - document.querySelector('body').offsetWidth + 'px';
  body.classList.add('body-overflow');

}

function  bodyUnlock() {
  body.style.paddingRight = '0px';
  body.classList.remove('body-overflow');
}

loader.addEventListener ('click', event => {

  arrayCards.forEach((item) => {
    item.classList.remove('hide');     
  });
  
  loader.classList.remove('active'); 
  isLoader = true;
});

window.addEventListener('load', () => {
  getCurrentProduts();
  showMenuList(currentProducts); 
});

window.addEventListener('resize', (event) =>{

  if (!isPopUp) {
      if (window.innerWidth > 768) {
        document.querySelector('.header').classList.remove('open');
        document.querySelector('body').classList.remove('body-overflow');
      }
  }  
})

