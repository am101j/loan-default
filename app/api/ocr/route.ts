import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Use dynamic import to avoid SSR issues
    const { createWorker } = await import('tesseract.js')
    
    const worker = await createWorker()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    
    // Set parameters for better OCR accuracy
    await worker.setParameters({
      tessedit_pageseg_mode: '6', // Uniform block of text
      tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .:$,%',
    })
    
    const { data: { text } } = await worker.recognize(buffer)
    await worker.terminate()
    
    const extractedData = extractLoanData(text)
    
    console.log('OCR Text:', text)
    console.log('Extracted Data:', extractedData)

    return NextResponse.json({
      success: true,
      extractedData,
      rawText: text,
      message: 'Document processed successfully'
    })
    
  } catch (error) {
    console.error('OCR processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    )
  }
}

function extractLoanData(text: string) {
  console.log('Processing text for extraction:', text)
  const data: any = {}
  
  // Extract any numbers that might be loan data
  const numbers = text.match(/\d+/g) || []
  

  
  const incomeMatch = text.match(/(?:income|salary|monthly)\s*:?\s*\$?([\d,]+)/i)
  if (incomeMatch) data.monthlyIncome = incomeMatch[1].replace(/,/g, '')
  
  const debtMatch = text.match(/(?:debt|ratio)\s*:?\s*(\d+\.?\d*)/i)
  if (debtMatch) data.debtRatio = debtMatch[1]
  
  const creditMatch = text.match(/(?:credit|utilization)\s*:?\s*(\d+\.?\d*)/i)
  if (creditMatch) data.creditUtilization = creditMatch[1]
  
  const dependentsMatch = text.match(/(?:dependents|children)\s*:?\s*(\d+)/i)
  if (dependentsMatch) data.dependents = dependentsMatch[1]
  
  const late30Match = text.match(/30\s*days?\s*late\s*:?\s*(\d+)/i)
  if (late30Match) data.late30Days = late30Match[1]
  
  const late60Match = text.match(/60\s*days?\s*late\s*:?\s*(\d+)/i)
  if (late60Match) data.late60Days = late60Match[1]
  
  const late90Match = text.match(/90\s*days?\s*late\s*:?\s*(\d+)/i)
  if (late90Match) data.late90Days = late90Match[1]
  

  
  return data
}

