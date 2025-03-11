import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.0.0/jspdf.es.js";

let cart = [];

function generateInvoiceNumber() {
    return Math.floor(10000000 + Math.random() * 90000000);
}

function addToCart(name, price) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    const cartTable = document.getElementById("cart-items");
    cartTable.innerHTML = `
        <tr><th>Item</th><th>Price</th><th>Quantity</th><th>Total</th></tr>
        ${cart.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `).join("")}
    `;
}

function generateReceipt() {
    const customerName = document.getElementById("customer-name").value.trim();
    const customerEmail = document.getElementById("customer-email").value.trim();

    if (!customerName || !customerEmail) {
        alert("No email or name was provided");
        return;
    }

    const pdf = new jsPDF({ format: [216, 350] });
    const invoiceNumber = generateInvoiceNumber();
    const date = new Date().toLocaleString();

    pdf.setFontSize(10);
    pdf.text("POSTERED", 10, 20);
    pdf.text("Email: POSTERED@gmail.com | Phone: 123-456-7890", 10, 40);

    pdf.setFontSize(12);
    pdf.text(`Customer: ${customerName}`, 10, 60);
    pdf.text(`Email: ${customerEmail}`, 10, 70);

    pdf.setFontSize(10);
    pdf.text(`Invoice #: ${invoiceNumber}`, 150, 20);
    pdf.text(`Date: ${date}`, 150, 30);

    pdf.setFontSize(30);
    pdf.text("Invoice", 80, 90);

    let y = 110;
    pdf.setFontSize(10);
    pdf.text("Itemized List of Purchases", 10, y);
    y += 10;

    pdf.setFontSize(8);
    cart.forEach(item => {
        pdf.text(`${item.name} - $${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`, 10, y);
        y += 10;
    });

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.07;
    const grandTotal = subtotal + tax;

    pdf.setFontSize(10);
    pdf.text(`Subtotal: $${subtotal.toFixed(2)}`, 10, y + 10);
    pdf.text(`Tax (7%): $${tax.toFixed(2)}`, 10, y + 20);

    pdf.setFontSize(14);
    pdf.text(`Grand Total: $${grandTotal.toFixed(2)}`, 10, y + 40);

    document.getElementById("pdf-preview").src = pdf.output("bloburl");
}

function downloadReceipt() {
    generateReceipt();
    const pdf = new jsPDF({ format: [216, 350] });
    pdf.save("Invoice.pdf");
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
