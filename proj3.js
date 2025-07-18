let currentPrice = 100;
let orders = [];

function updatePrice() {
  const priceChange = (Math.random() * 4 - 2).toFixed(2); // -2 to +2
  currentPrice = Math.max(1, (parseFloat(currentPrice) + parseFloat(priceChange)).toFixed(2));
  document.getElementById('price').innerText = `$${currentPrice}`;
  checkOrders();
}

function placeOrder() {
  const side = document.getElementById('buySellType').value;
  const type = document.getElementById('orderType').value;
  const priceInput = document.getElementById('orderPrice');
  const enteredPrice = parseFloat(priceInput.value);

  if (type === 'limit' && isNaN(enteredPrice)) {
    alert('Enter a valid price for limit order.');
    return;
  }

  let order = {
    id: Date.now(),
    side,
    type,
    price: type === 'market' ? currentPrice : enteredPrice,
    status: type === 'market' ? 'Filled' : 'Pending'
  };

  orders.push(order);
  if (order.status === 'Filled') {
    showToast(`${side.toUpperCase()} MARKET order filled at $${currentPrice}`);
    document.getElementById("ding").play();
  }

  updateOrderList();
  priceInput.value = '';
}

function cancelOrder(id) {
  orders = orders.filter(order => order.id !== id);
  updateOrderList();
}

function checkOrders() {
  orders.forEach(order => {
    if (order.type === 'limit' && order.status === 'Pending') {
      const isBuy = order.side === 'buy';
      const conditionMet = isBuy ? currentPrice <= order.price : currentPrice >= order.price;

      if (conditionMet) {
        order.status = 'Filled';
        showToast(`${order.side.toUpperCase()} LIMIT order filled at $${currentPrice}`);
        document.getElementById("ding").play();
      }
    }
  });

  updateOrderList();
}

function updateOrderList() {
  const list = document.getElementById('orderList');
  list.innerHTML = '';

  orders.forEach(order => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${order.side.toUpperCase()} ${order.type.toUpperCase()} @ $${order.price} - <strong>${order.status}</strong>
      ${order.status === 'Pending' ? `<button class="cancel-btn" onclick="cancelOrder(${order.id})">Cancel</button>` : ''}
    `;
    list.appendChild(li);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.style.opacity = 1;

  setTimeout(() => {
    toast.style.opacity = 0;
  }, 3000);
}

setInterval(updatePrice, 2000);
