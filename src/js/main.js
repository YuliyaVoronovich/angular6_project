window.addEventListener('resize', (event) =>{
     if (window.innerWidth > 768) {
        document.querySelector('.header').classList.remove('open');
        document.querySelector('body').classList.remove('body-overflow');
    }

  })