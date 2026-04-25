import { NextApiRequest, NextApiResponse } from 'next';
import app from '../../../backend/index';

// Next.js Pages API Routes natively provide Node req and res streams, 
// which is exactly what Express needs to operate in a serverless environment.
// We must disable Next's default bodyParser to allow Express to handle it.
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true, // Tells Next.js that Express will handle the response
    responseLimit: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Await the app so unhandled async errors propagate correctly
  return new Promise<void>((resolve) => {
    app(req as any, res as any, (err: any) => {
      if (err) {
        console.error('[API HANDLER ERROR]', err?.message, err?.stack);
        res.status(500).json({
          success: false,
          message: `HANDLER ERROR: ${err?.message || 'Unknown Error'}`,
          data: null,
        });
      }
      resolve();
    });
  });
}
