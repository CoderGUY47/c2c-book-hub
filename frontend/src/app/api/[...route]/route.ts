import app from '../../../../backend/index';
// @ts-ignore
import serverless from 'serverless-http';

const handler = serverless(app);

const handleRequest = async (req: Request) => {
  return (handler(req, {}) as any);
};

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
export const OPTIONS = handleRequest;
