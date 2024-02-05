const modalCard = (item, index) => {
    console.log(Object.keys(item.sizes));
   return `<div class="modal-content-wrap">
    <div class="modal-card-left">
      <div class="menu-item-overflow modal-img">
      <img class="menu-item-img" src="./assets/img/${item.category}-${index+1}.jpg" alt="Image ${item.category}_${index+1}">
      </div>
    </div>
    <div class="modal-card-right">
      <div>
        <strong class="menu-item-title modal-card-title">${item.name}</strong>
        <p class="menu-item-text modal-card-text">${item.description}</p>
      </div>
      <div>
        <span class="modal-card-heading">Size</span>
        <div class="modal-choice-buttons modal-size">  
          <button class="modal-choice-button">
            <span class="modal-choice-button-icon">S</span>
            <span class="modal-choice-button-title modal-choice-size">200 ml</span>
          </button>
          <button class="modal-choice-button">
            <span class="modal-choice-button-icon">M</span>
            <span class="modal-choice-button-title modal-choice-size">300 ml</span>
          </button>
          <button class="modal-choice-button">
            <span class="modal-choice-button-icon">L</span>
            <span class="modal-choice-button-title modal-choice-size">400 ml</span>
          </button>
        </div>
      </div>
      <div>
        <span class="modal-card-heading">Additives</span>
        <div class="modal-choice-buttons modal-add">
          <button class="modal-choice-button">
            <span class="modal-choice-button-icon">1</span>
            <span class="modal-choice-button-title modal-choice-additives">Sugar</span>
          </button>
          <button class="modal-choice-button">
            <span class="modal-choice-button-icon">2</span>
            <span class="modal-choice-button-title modal-choice-additives">Cinnamon</span>
          </button>
          <button class="modal-choice-button">
            <span class="modal-choice-button-icon">3</span>
            <span class="modal-choice-button-title modal-choice-additives">Syrup</span>
          </button>
        </div>
      </div>
      <div class="modal-sum">
        <span>Total:</span>
        <span class="modal-card-price">${item.price}</span>
      </div>
      <p class="modal-text-important">
        <span class="modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g clip-path="url(#clip0_268_12877)">
            <path d="M8 7.66663V11" stroke="#403F3D" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 5.00667L8.00667 4.99926" stroke="#403F3D" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.99967 14.6667C11.6816 14.6667 14.6663 11.6819 14.6663 8.00004C14.6663 4.31814 11.6816 1.33337 7.99967 1.33337C4.31778 1.33337 1.33301 4.31814 1.33301 8.00004C1.33301 11.6819 4.31778 14.6667 7.99967 14.6667Z" stroke="#403F3D" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_268_12877">
            <rect width="16" height="16" fill="white"/>
            </clipPath>
            </defs>
            </svg>
        </span>
        <span class="modal-text">The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</span>
      </p>
      <button class="modal-button">Close</button>
    </div>
  </div>`;
}

export default modalCard;