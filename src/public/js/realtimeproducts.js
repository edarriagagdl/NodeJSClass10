console.log('hola estoy ejecutando el script desde real time');
const socket = io();

socket.on('hello', (arg) => {
  console.log(arg);
});

socket.on('server:productadded', (product) => {
  console.log(JSON.stringify(product));
  let table = document.getElementById('tableproducts');
  let row = table.insertRow(-1);
  let c1 = row.insertCell(0);
  let c2 = row.insertCell(1);
  let c3 = row.insertCell(2);
  let c4 = row.insertCell(3);
  let c5 = row.insertCell(4);
  let c6 = row.insertCell(5);
  c1.innerText = product.id;
  c2.innerText = product.title;
  c3.innerText = product.description;
  c4.innerText = product.code;
  c5.innerText = product.price;
  c6.innerText = product.category;
});

socket.on('server:productdeleted', (productId) => {
  console.log(productId);
  var row = document.getElementById(productId);
  row.parentNode.removeChild(row);
});

const newproduct = document.getElementById('newproduct');
const responseMessage = document.getElementById('response-message');

const apiUrl = '/api/products';

newproduct.addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData(newproduct);
  let object = {};
  formData.forEach(function (value, key) {
    object[key] = value;
  });
  const json = JSON.stringify(object);

  const requestOptions = {
    method: 'POST',
    body: json,
    headers: { 'Content-Type': 'application/json' },
  };

  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error to add the product');
      }
      return response.text();
    })
    .then((data) => {
      responseMessage.textContent = data;
    })
    .catch((error) => {
      console.error('Error:', error);
      responseMessage.textContent = error;
    });
});
