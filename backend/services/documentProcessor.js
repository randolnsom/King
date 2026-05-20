const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');

class DocumentProcessor {
  async extractText(filePath, fileType) {
    switch (fileType) {
      case '.pdf':
        return this.extractFromPDF(filePath);
      case '.docx':
      case '.doc':
        return this.extractFromDOCX(filePath);
      case '.txt':
        return this.extractFromTXT(filePath);
      case '.png':
      case '.jpg':
      case '.jpeg':
        return this.extractFromImage(filePath);
      case '.pptx':
      case '.ppt':
        return this.extractFromPPTX(filePath);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  async extractFromPDF(filePath) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(fileBuffer);
      return data.text;
    } catch (error) {
      throw new Error(`Failed to extract from PDF: ${error.message}`);
    }
  }

  async extractFromDOCX(filePath) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ arrayBuffer: fileBuffer });
      return result.value;
    } catch (error) {
      throw new Error(`Failed to extract from DOCX: ${error.message}`);
    }
  }

  async extractFromTXT(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to extract from TXT: ${error.message}`);
    }
  }

  async extractFromImage(filePath) {
    try {
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
      return text;
    } catch (error) {
      throw new Error(`Failed to extract from image: ${error.message}`);
    }
  }

  async extractFromPPTX(filePath) {
    try {
      // For PPTX, we'll use a simple extraction method
      // Consider using 'pptxparse' or 'officegen' for production
      const PptxParser = require('pptxparse');
      const prs = new PptxParser();
      await prs.parseFile(filePath);
      
      let allText = [];
      prs.slides.forEach(slide => {
        slide.shapes.forEach(shape => {
          if (shape.text) {
            allText.push(shape.text);
          }
        });
      });
      
      return allText.join('\n\n');
    } catch (error) {
      throw new Error(`Failed to extract from PPTX: ${error.message}`);
    }
  }

  cleanText(text) {
    return text
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 50000); // Limit to 50k characters
  }
}

module.exports = new DocumentProcessor();
