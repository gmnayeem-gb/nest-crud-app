import { Response } from 'express';
import { Controller, Get, Res } from '@nestjs/common';

import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Get('/view')
  async getReport(@Res() res: Response) {
    const id = '24121477872208';
    const barcode = await this.reportService.generateBarcode(id);
    
    const data = {
      logo: 'http://localhost:3001/images/logo.png', // Replace with your logo URL or base64
      date: new Date().toLocaleDateString(),
      description: 'This is a detailed report generated dynamically.',
      companyName: 'Your Company Name',
      items: [
        { description: 'Product Title', price: 50, quantity: 1, sub_total: 50 },
        { description: 'Product Karkuma Organic Turmeric Immune Booster', price: 390, quantity: 1, sub_total: 390 },
      ],
      barcode
    };

    return res.render('report', data);
  }

  @Get('/pdf')
  async downloadPdf(@Res() res: Response): Promise<any> {
    const id = '24121477872208';

    // Generate the barcode for the id
    const barcode = await this.reportService.generateBarcode(id);

    // Example data to inject into the template
    const data = {
      id,
      logo: 'http://localhost:3001/images/logo.png', // Replace with your logo URL or base64
      date: new Date().toLocaleDateString(),
      description: 'This is a detailed report generated dynamically.',
      companyName: 'Your Company Name',
      items: [
        { description: 'Product Title', price: 50, quantity: 1, sub_total: 50 },
        { description: 'Product Karkuma Organic Turmeric Immune Booster', price: 390, quantity: 1, sub_total: 390 },
        { description: 'Product Title', price: 50, quantity: 1, sub_total: 50 },
        { description: 'Product Karkuma Organic Turmeric Immune Booster', price: 390, quantity: 1, sub_total: 390 },
        { description: 'Product Title', price: 50, quantity: 1, sub_total: 50 },
        { description: 'Product Karkuma Organic Turmeric Immune Booster', price: 390, quantity: 1, sub_total: 390 },
      ],
      barcode
    };

    // Generate the PDF and get the download link
    const downloadLink = await this.reportService.generatePdf(data);
    res.status(200).json({
      status: 'success',
      message: 'PDF generated successfully',
      data: {
        downloadLink,
      },
    });

    // Generate the PDF
    // const pdfBuffer = await this.reportService.generatePdf(data);

    // Send the PDF to the client
    // res.set({
    //   'Content-Type': 'application/pdf',
    //   'Content-Disposition': 'attachment; filename="report.pdf"',
    //   'Content-Length': pdfBuffer.length,
    // });
    // res.end(pdfBuffer);
  }
}
