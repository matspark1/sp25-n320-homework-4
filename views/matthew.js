import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.0.0/jspdf.es.js";

class GeneratePDF {
  pdfDoc;
  position = {
    x: 10,
    y: 20,
  };
  margin = {
    x: 10,
    y: 10,
  };
  pageCounter = 1;
  domRef = "";

  constructor(domRefId) {
    this.pdfDoc = new jsPDF();

    if (domRefId) {
      this.domRef = document.querySelector(`#${domRefId}`);
    }
  }

  downloadPDF(title) {
    this.pdfDoc.save(title);
  }

  getPDFURL() {
    return this.pdfDoc.output("bloburl");
  }

  addHeader(text) {
    this.pdfDoc.setFontSize(28);
    this.pdfDoc.text(text, 105, this.position.y, { align: "center" });
    this.position.y += 100;
  }

  addSubHeader(text) {
    this.pdfDoc.setFont("times", "italic");
    this.pdfDoc.setFontSize(16);
    this.pdfDoc.text(text, 105, this.position.y, { align: "center" });
    this.position.y += 10;
  }

  addText(text) {
    this.pdfDoc.setFontSize(14);
    this.pdfDoc.text(text, 105, this.position.y, { align: "center" });
    this.position.y += 8;
  }

  addName(text) {
    this.pdfDoc.setFontSize(24);
    this.pdfDoc.text(text, 105, this.position.y, { align: "center" });
    this.position.y += 20;
    this.pdfDoc.setFontSize(14);
    this.pdfDoc.setTextColor(0, 0, 0);
  }

  addBackground() {
    this.pdfDoc.setDrawColor(200, 200, 200);
    this.pdfDoc.rect(5, 5, 200, 287, "S");
  }

  showPDF() {
    if (this.domRef) {
      this.domRef.src = this.getPDFURL();
    }
  }

  resetPDF() {
    this.pdfDoc = new jsPDF();
    this.position = { x: 10, y: 20 };
    this.addBackground();
    this.addHeader("Matt's Eats 101");
    this.addSubHeader("Certificate of Completion");
    this.addText("to");
  }
}

const myPDF = new GeneratePDF("pdf-preview");

const form = document.querySelector("form");
const btns = document.querySelectorAll(".btns");
const saveBtn = document.querySelector("#download");
const viewBtn = document.querySelector("#view");
const saveNameInput = document.querySelector("#name");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  btns.forEach((btn) => {
    btn.style.display = "flex";
  });
});

viewBtn.addEventListener("click", () => {
  myPDF.resetPDF();
  myPDF.addName(saveNameInput.value || "Your Name Here");
  myPDF.showPDF();
});

saveBtn.addEventListener("click", () => {
  myPDF.resetPDF();
  myPDF.addName(saveNameInput.value || "Your Name Here");
  myPDF.downloadPDF(`Matts-Eats-Certificate-of-Completion.pdf`);
});
