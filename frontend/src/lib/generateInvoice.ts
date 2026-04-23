import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (payment: any) => {
  const doc = new jsPDF() as any;

  // 1. Header (Minimalist B&W)
  doc.setFillColor(0, 0, 0); // Black
  doc.rect(0, 0, 210, 30, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("BOOK-HUB.", 15, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("INVOICE", 170, 16);
  doc.setFontSize(8);
  doc.text(`ID: #${payment._id.slice(-8).toUpperCase()}`, 170, 22);

  // 2. Billing Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("MERCHANT DETAILS", 15, 45);
  doc.setFont("helvetica", "normal");
  doc.text(payment.seller?.name || "Independent Seller", 15, 51);
  doc.text(payment.seller?.email || "N/A", 15, 56);
  doc.text(payment.seller?.phoneNumber || "N/A", 15, 61);

  doc.setFont("helvetica", "bold");
  doc.text("CLIENT DETAILS", 120, 45);
  doc.setFont("helvetica", "normal");
  doc.text(payment.order?.user?.name || "Verified Buyer", 120, 51);
  doc.text(payment.order?.user?.email || "N/A", 120, 56);
  doc.text(payment.order?.shippingAddress?.addressLine1 || "N/A", 120, 61);
  doc.text(`${payment.order?.shippingAddress?.city || ""}, ${payment.order?.shippingAddress?.state || ""}`, 120, 66);

  // 3. Divider
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
  doc.line(15, 75, 195, 75);

  // 4. Meta Data
  const metaData = [
    ["Issue Date:", new Date(payment.createdAt).toLocaleDateString()],
    ["Payment:", payment.paymentMethod || "Electronic"],
    ["Hash:", `#${payment.order?._id?.slice(-12).toUpperCase() || "N/A"}`],
  ];

  let startY = 85;
  metaData.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 15, startY);
    doc.setFont("helvetica", "normal");
    doc.text(value as string, 40, startY);
    startY += 5;
  });

  // 5. Table
  const tableColumn = ["DESCRIPTION", "SUB-INFO", "QTY", "PRICE", "TOTAL"];
  const tableRows = [
    [
      payment.product?.title || "Classified Item",
      payment.product?.author || "N/A",
      "01",
      `${payment.product?.finalPrice || payment.amount}`,
      `${payment.amount}`
    ]
  ];

  autoTable(doc, {
    startY: 105,
    head: [tableColumn],
    body: tableRows,
    theme: "plain",
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { textColor: [0, 0, 0], fontSize: 9 },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { left: 15, right: 15 },
    styles: { font: "helvetica", cellPadding: 4 }
  });

  // 6. Summary
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", 140, finalY);
  doc.text(`BDT ${payment.amount}`, 195, finalY, { align: "right" });
  
  doc.text("Shipping:", 140, finalY + 6);
  doc.text("BDT 0.00", 195, finalY + 6, { align: "right" });

  doc.setLineWidth(0.5);
  doc.line(140, finalY + 10, 195, finalY + 10);

  doc.setFont("helvetica", "bold");
  doc.text("TOTAL PAID:", 140, finalY + 18);
  doc.text(`BDT ${payment.amount}`, 195, finalY + 18, { align: "right" });

  // 7. Footer
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text("Certified computer-generated receipt from Book-Hub platform.", 105, 280, { align: "center" });

  doc.save(`Invoice_BH_${payment._id.slice(-6).toUpperCase()}.pdf`);
};
