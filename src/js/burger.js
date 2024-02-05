//бургер-меню

const linkMenu = document.querySelector('.link-page-menu');
const linkMenuHome = document.querySelector('.link-page-home');

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('burger').addEventListener('click', function() {    

        document.querySelector('.header').classList.toggle('open');
        document.querySelector('body').classList.toggle('body-overflow');  
    })
});

const links = Array.from(document.querySelector('.nav-list').children);

 links.forEach((link) => {
    link.addEventListener("click", closeOnClick);
});

function closeOnClick() {

     document.querySelector('.header').classList.remove('open');
     document.querySelector('body').classList.remove('body-overflow');
 }

if (linkMenu) {
    linkMenu.addEventListener('click', event => {
        event.preventDefault();  
        closeOnClick();
  });
}

if (linkMenuHome) {
    linkMenuHome.addEventListener('click', event => {
        event.preventDefault();  
        closeOnClick();
        setTimeout(function(){
            window.location.href = './menu.html';
          }, 500);
  });
}

