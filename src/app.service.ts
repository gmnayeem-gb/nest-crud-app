import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as bwipjs from 'bwip-js';

@Injectable()
export class AppService {
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
          bcid: 'code128',       // Barcode type
          text: id,              // Text to encode (your ID)
          scale: 3,              // Scale factor
          height: 7,            // Bar height, in millimeters
          includetext: false,     // Show human-readable text
          textxalign: 'center',  // Align text to center
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

  async generatePdf(data: any): Promise<String> {
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

    // Convert the Uint8Array to a Buffer
    // const buffer = Buffer.from(pdfBuffer);
    await browser.close();

    // Save the PDF to a file
    const filePath = path.join(__dirname, '..', 'public', 'reports', 'report.pdf');
    fs.writeFileSync(filePath, pdfBuffer);

    // return buffer;
    return `/reports/report.pdf`;
  }
}
