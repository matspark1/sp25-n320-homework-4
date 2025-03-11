import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.0.0/jspdf.es.js";

let cart = [];

//add item to cart
function addToCart(name, price) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
}

// show cart
function updateCart() {
    const cartTable = document.getElementById("cart-items");
    cartTable.innerHTML = `
        <tr><th>Item</th><th>Price</th><th>Quantity</th><th>Total</th></tr>
        ${cart.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
                <td>$${item.price * item.quantity}</td>
            </tr>
        `).join("")}
    `;
}

// receipt PDF
function generateReceipt() {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Gourmet Bistro Receipt", 10, 20);

    pdf.setFontSize(12);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 10, 30);

    let y = 40;
    cart.forEach(item => {
        pdf.text(`${item.name} - $${item.price} x ${item.quantity} = $${item.price * item.quantity}`, 10, y);
        y += 10;
    });

    const grandTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    pdf.text(`Grand Total: $${grandTotal}`, 10, y + 10);

    document.getElementById("pdf-preview").src = pdf.output("bloburl");
}

// download receipt
function downloadReceipt() {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Gourmet Bistro Receipt", 10, 20);

    pdf.setFontSize(12);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 10, 30);

    let y = 40;
    cart.forEach(item => {
        pdf.text(`${item.name} - $${item.price} x ${item.quantity} = $${item.price * item.quantity}`, 10, y);
        y += 10;
    });

    const grandTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    pdf.text(`Grand Total: $${grandTotal}`, 10, y + 10);

    pdf.save("Restaurant_Receipt.pdf");
}

document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", (e) => {
        const name = e.target.getAttribute("data-name");
        const price = parseFloat(e.target.getAttribute("data-price"));
        addToCart(name, price);
    });
});

document.getElementById("view-receipt").addEventListener("click", generateReceipt);
document.getElementById("download-receipt").addEventListener("click", downloadReceipt);
