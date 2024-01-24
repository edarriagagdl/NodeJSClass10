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
  c1.innerText = product.id;
  c2.innerText = product.title;
  c3.innerText = product.description;
  c4.innerText = product.price;
});

socket.on('server:productdeleted', (productId) => {
  console.log(productId);
  var row = document.getElementById(productId);
  row.parentNode.removeChild(row);
});
