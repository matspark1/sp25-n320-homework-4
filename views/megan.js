import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.0.0/jspdf.es.js";

let cart = [];

//add item to cart
function addToCart(name, price) {
  const item = cart.find((item) => item.name === name);
  if (item) {
    item.quantity++;
    item.Total = item.quantity * item.price;
  } else {
    cart.push({ name, price, quantity: 1, Total: price });
  }
  displayCart();
}

//yeet it out of cart
function removeFromCart(name) {
  const itemIndex = cart.findIndex((item) => item.name === name);
  if (itemIndex > -1) {
    cart.splice(itemIndex, 1);
  }
  displayCart();
}

//make caart show up
function displayCart() {
  const cartTable = document.getElementById("cart-items");
  cartTable.innerHTML = `
    <tr><th>Product Name</th><th>Price</th><th>Quantity</th><th>Total</th></tr>
    ${cart
      .map(
        (item) => `
      <tr>
        <td>${item.name}</td>
        <td>$${item.price}</td>
        <td>${item.quantity}</td>
        <td>$${item.Total}</td>
      </tr>
    `
      )
      .join("")} 
  `;
}
// make pdf
function generateInvoice() {
  const pdf = new jsPDF();
  pdf.setFontSize(16);
  pdf.text("Cloud Lamp Store", 10, 20);

  pdf.setFontSize(12);
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, 10, 30);

  let yPosition = 40;
  cart.forEach((item) => {
    pdf.text(
      `${item.name} - $${item.price} x ${item.quantity} = $${item.Total}`,
      10,
      yPosition
    );
    yPosition += 10;
  });

  const grandTotal = cart.reduce((total, item) => total + item.Total, 0);
  pdf.text(`Grand Total: $${grandTotal}`, 10, yPosition + 10);

  document.getElementById("pdf-preview").src = pdf.output("bloburl");
}

function downloadInvoice() {
  const pdf = new jsPDF();
  pdf.setFontSize(16);
  pdf.text("Cloud Lamp Store ☁️", 10, 20);

  pdf.setFontSize(12);
  pdf.text(`Date 📅: ${new Date().toLocaleDateString()}`, 10, 30);

  let yPosition = 40;
  cart.forEach((item) => {
    pdf.text(
      `${item.name} - $${item.price} x ${item.quantity} = $${item.lineTotal}`,
      10,
      yPosition
    );
    yPosition += 10;
  });

  const grandTotal = cart.reduce((total, item) => total + item.lineTotal, 0);
  pdf.text(`Grand Total: $${grandTotal}`, 10, yPosition + 10);

  pdf.save("Invoice.pdf");
}

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", (e) => {
    const name = e.target.getAttribute("data-name");
    const price = parseFloat(e.target.getAttribute("data-price"));
    addToCart(name, price);
  });
});

document
  .getElementById("view-invoice")
  .addEventListener("click", generateInvoice);
document
  .getElementById("download-invoice")
  .addEventListener("click", downloadInvoice);
