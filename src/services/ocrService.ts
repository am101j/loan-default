import { OCRResult, LoanApplication } from '@/src/types'
import { OCR_CONFIG } from '@/src/constants'

export class OCRService {
  static async processDocument(file: File): Promise<OCRResult> {
    try {
      this.validateFile(file)
      
      const buffer = await file.arrayBuffer()
      return await this.processWithTesseract(Buffer.from(buffer))
    } catch (error) {
      throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private static validateFile(file: File): void {
    if (file.size > OCR_CONFIG.MAX_FILE_SIZE) {
      throw new Error('File size exceeds 10MB limit')
    }
    
    if (!OCR_CONFIG.SUPPORTED_FORMATS.includes(file.type)) {
      throw new Error('Unsupported file format')
    }
  }

  private static async processWithTesseract(buffer: Buffer): Promise<OCRResult> {
    const { createWorker } = await import('tesseract.js')
    
    const worker = await createWorker()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    
    await worker.setParameters({
      tessedit_pageseg_mode: OCR_CONFIG.TESSERACT_PSM_MODE,
      tessedit_char_whitelist: OCR_CONFIG.CHAR_WHITELIST,
    })
    
    const { data: { text } } = await worker.recognize(buffer)
    await worker.terminate()
    
    const extractedData = this.extractLoanData(text)
    
    return {
      success: true,
      extractedData,
      rawText: text,
      message: 'Document processed with Tesseract OCR'
    }
  }



  private static extractLoanData(text: string): Partial<LoanApplication> {
    const data: Partial<LoanApplication> = {}
    
    const patterns = {
      age: /(?:age|Age)\s*:?\s*(\d{2,3})/i,
      monthlyIncome: /(?:income|salary|monthly)\s*:?\s*\$?([\d,]+)/i,
      debtRatio: /(?:debt|ratio)\s*:?\s*(\d+\.?\d*)/i,
      creditUtilization: /(?:credit|utilization)\s*:?\s*(\d+\.?\d*)/i,
      dependents: /(?:dependents|children)\s*:?\s*(\d+)/i,
      late30Days: /30\s*days?\s*late\s*:?\s*(\d+)/i,
      late60Days: /60\s*days?\s*late\s*:?\s*(\d+)/i,
      late90Days: /90\s*days?\s*late\s*:?\s*(\d+)/i,
      openCreditLines: /(?:credit\s*lines?|open\s*credit)\s*:?\s*(\d+)/i,
      realEstateLoans: /(?:real\s*estate|mortgage)\s*:?\s*(\d+)/i
    }

    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = text.match(pattern)
      if (match) {
        const value = match[1].replace(/,/g, '')
        data[key as keyof LoanApplication] = key.includes('Ratio') || key.includes('Utilization') 
          ? parseFloat(value) 
          : parseInt(value)
      }
    })
    
    return data
  }
}