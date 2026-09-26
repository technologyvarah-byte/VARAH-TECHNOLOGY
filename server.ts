import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // Purchase Invoice OCR Endpoint powered by Gemini 3 Flash
  app.post('/api/ocr-invoice', async (req, res) => {
    try {
      const { base64Image, mimeType } = req.body;
      if (!base64Image) {
        return res.status(400).json({ error: 'Missing base64Image payload' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(503).json({
          error: 'GEMINI_API_KEY is not configured in environment.',
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: cleanBase64,
              },
            },
            {
              text: `You are an expert CCTV & Security distribution GST Tax Invoice OCR parser for an Indian CCTV business (VARAH MANAGEMENT).
Extract the supplier details, invoice metadata, line items (Camera, NVR, DVR, HDD, Cable, SMPS, POE Switch, BNC, Adapter, Rack, Monitor, Router, Accessories), rates, discounts, GST percentages, serial numbers (if any), and totals.
If any field is unclear, infer sensible CCTV wholesale values from context.`,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              supplier: { type: Type.STRING, description: 'Supplier company name' },
              invoiceNumber: { type: Type.STRING, description: 'Tax invoice number' },
              date: { type: Type.STRING, description: 'Invoice date in YYYY-MM-DD format' },
              gstin: { type: Type.STRING, description: '15-character supplier GSTIN' },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    product: { type: Type.STRING, description: 'Product category e.g. Camera, NVR, DVR, HDD, Cable, SMPS, POE Switch' },
                    brand: { type: Type.STRING, description: 'Brand e.g. Hikvision, CP Plus, Dahua, WD Purple, Seagate, D-Link' },
                    model: { type: Type.STRING, description: 'Model code e.g. DS-2CD1023G0E-I' },
                    quantity: { type: Type.NUMBER, description: 'Quantity purchased' },
                    rate: { type: Type.NUMBER, description: 'Unit purchase rate in INR before GST' },
                    discount: { type: Type.NUMBER, description: 'Discount amount in INR' },
                    gstPercent: { type: Type.NUMBER, description: 'GST percentage (typically 18)' },
                    total: { type: Type.NUMBER, description: 'Line total including GST' },
                    serialNumbers: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Extracted or generated serial numbers for this batch',
                    },
                  },
                  required: ['product', 'brand', 'model', 'quantity', 'rate', 'discount', 'gstPercent', 'total'],
                },
              },
              grandTotal: { type: Type.NUMBER, description: 'Grand total invoice amount in INR' },
            },
            required: ['supplier', 'invoiceNumber', 'date', 'gstin', 'items', 'grandTotal'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error: unknown) {
      console.error('OCR Invoice Error:', error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to parse invoice image',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VARAH MANAGEMENT server running on http://localhost:${PORT}`);
  });
}

startServer();
