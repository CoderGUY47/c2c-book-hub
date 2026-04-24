import { NextApiRequest, NextApiResponse } from 'next';
import app from '../../../backend/index';

// Next.js Pages API Routes natively provide Node req and res streams, 
// which is exactly what Express needs to operate in a serverless environment.
// We must disable Next's default bodyParser to allow Express to handle it.
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true, // Tells Next.js that Express will handle the response
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Direct hand-off to Express without needing `serverless-http` wrapper
  return app(req as any, res as any);
}
