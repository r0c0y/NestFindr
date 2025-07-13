import React from 'react';
import Modal from './Modal';
import { FiDownload, FiPrinter } from 'react-icons/fi';

const VirtualBuyReceipt = ({ isOpen, onClose, receiptData }) => {
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([receiptData.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'purchase_receipt.txt';
    document.body.appendChild(element); // Required for Firefox
    element.click();
    document.body.removeChild(element); // Clean up
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Purchase Receipt</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: 'Courier New', Courier, monospace; margin: 20px; background-color: #f0f0f0; }
      .receipt-container { background-color: white; padding: 30px; border: 1px solid #ccc; box-shadow: 2px 2px 8px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; }
      h1 { text-align: center; margin-bottom: 20px; color: #333; font-size: 24px; }
      pre { white-space: pre-wrap; word-wrap: break-word; font-size: 16px; line-height: 1.5; color: #222; }
      .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #555; }
    `);
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div class="receipt-container"><h1>Purchase Receipt</h1><pre>' + receiptData.content + '</pre><div class="footer">Thank you for your purchase!</div></div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Purchase Receipt">
      <div className="p-6">
        <pre className="receipt-content" style={{ fontFamily: 'Courier New, Courier, monospace', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {receiptData.content}
        </pre>
        <div className="flex justify-center gap-4 mt-6">
          <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
            <FiDownload /> Download Receipt
          </button>
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-2">
            <FiPrinter /> Print Receipt
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VirtualBuyReceipt;
