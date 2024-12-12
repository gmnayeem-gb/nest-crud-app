import * as fs from 'fs';
import * as path from 'path';
import * as bwipjs from 'bwip-js';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  getData() {
    return {
      success: true,
      message: 'Welcome to NestJS!',
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Bob Johnson' },
      ],
    };
  }

  async generateBarcode(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bwipjs.toBuffer(
        {
          bcid: 'code128', // Barcode type
          text: id, // Text to encode (your ID)
          scale: 3, // Scale factor
          height: 7, // Bar height, in millimeters
          includetext: false, // Show human-readable text
          textxalign: 'center', // Align text to center
        },
        (err, png) => {
          if (err) {
            reject(err);
          } else {
            const base64 = `data:image/png;base64,${png.toString('base64')}`;
            resolve(base64);
          }
        },
      );
    });
  }

  async generatePdf(data: any): Promise<any> {
    // Load and compile the HTML template
    const templatePath = './templates/report.html';
    const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(htmlTemplate);
    const compiledHtml = template(data);

    // Launch Puppeteer and create the PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(compiledHtml, { waitUntil: 'networkidle0' });

    // Generate the PDF and convert to Buffer
    const pdfBuffer: Uint8Array = await page.pdf({
      format: 'A4',
      // width: '576px',  // 6 inches = 576 pixels
      // height: '384px', // 4 inches = 384 pixels
      printBackground: true,
    });

    await browser.close();

    // Generate a unique file name (e.g., based on an ID or timestamp)
    const fileName = `report_${data.id || Date.now()}.pdf`;
    const filePath = path.join(__dirname, '..', '..', 'public', 'reports', fileName);

    // Check if there are any existing reports with a similar pattern and delete them
    const directoryPath = path.join(__dirname, '..', '..', 'public', 'reports');
    const files = fs.readdirSync(directoryPath);

    // Delete old files matching your naming convention (optional logic)
    files.forEach((file) => {
      if (file.startsWith('report_')) {
        fs.unlinkSync(path.join(directoryPath, file));
      }
    });

    // Save the new report
    fs.writeFileSync(filePath, pdfBuffer);

    // Return the dynamic download URL
    return `/reports/${fileName}`;

    // other way to send the pdf
    // const buffer = Buffer.from(pdfBuffer);  // Convert the Uint8Array to a Buffer
    // await browser.close();
    // return buffer;
  }
}
