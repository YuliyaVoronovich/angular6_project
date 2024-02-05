//let autoplayInterval;
let progressInterval;
let movePosition;

let step = 0;
let endStep = 2;
let progressStep = 0;
let progressStepInterval = 4;

const container = document.querySelector('.favorites-slides');
const track = document.querySelector('.favorites-list');
const nextArrow = document.querySelector('.favorites-button-right');
const prevArrow = document.querySelector('.favorites-button-left');

const progressBarButtons = document.querySelectorAll('.carousel-button');

let x1 = null;
let y1 = null;

function startSlider() {
   // stopSlider();
   // autoplayInterval = setInterval(nextSlide, 4000);  
    progressInterval = setInterval(progressBar, 200);
}

function stopSlider() {
   // clearInterval(autoplayInterval);
    clearInterval(progressInterval);
}

const progressBar = () => {

    if (progressStep >= 100) {
        progressStep = 0;
        progressBarButtons[step].style.width = `0%`;
        nextSlide();
    } else {
        progressStep +=progressStepInterval;
        progressBarButtons[step].style.width = `${progressStep}%`;
    }
   
}

const nextSlide = () => {

    if (step >= endStep) {        
        step = 0;
        track.style.transform = `translateX(-${0}%)`;
    } else {
        step += 1; 
        movePosition = container.clientWidth * step;

        track.style.transform = `translateX(-${movePosition}px)`;
    }    
}

const prevSlide = () => {

    if (step === 0) {  
        step = endStep;       
        movePosition = container.clientWidth * endStep;
        track.style.transform = `translateX(-${movePosition}px)`;
    } else {
        step -= 1; 
        movePosition = container.clientWidth * step;
        track.style.transform = `translateX(-${movePosition}px)`;
    }    
}

nextArrow.addEventListener ('click',  event => { 

    progressBarButtons[step].style.width = `0%`;
    progressStep = 0;
    stopSlider();
    startSlider();  
    nextSlide();  
});

prevArrow.addEventListener ('click',  event => {     
     
    progressBarButtons[step].style.width = `0%`;
    progressStep = 0;
    stopSlider();
    startSlider();    
    prevSlide();
   
});

container.addEventListener ('mouseover',  event => { 
    stopSlider();   
});

container.addEventListener ('mouseout',  event => {    
    startSlider();   
});

container.addEventListener ('touchstart', handleTouchStart, false); 
container.addEventListener ('touchend', handleTouchEnd, false); 


function handleTouchStart (event) {
    stopSlider();
    x1 = event.touches[0].clientX;
}

function handleTouchEnd (event) { 

    let x2 = event.changedTouches[0].clientX;
    let xDiff = x2-x1;

   // if (xDiff === 0)  startSlider();
    if (x1-x2 > 100) {   
        console.log('next');
        progressBarButtons[step].style.width = `0%`;
        progressStep = 0; 
        nextSlide(); 
    } else if (x2-x1 > 100) { 
        console.log('prev'); 
        progressBarButtons[step].style.width = `0%`;
        progressStep = 0;  
        prevSlide();
    } else {
        event.preventDefault(); 
    }
    stopSlider();
    startSlider();
}

window.addEventListener('load', () => {
    startSlider(); 
  });