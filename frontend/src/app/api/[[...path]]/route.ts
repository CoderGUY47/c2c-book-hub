import { NextRequest } from 'next/server';
import app from '../../../../backend/index';
// @ts-ignore
import serverless from 'serverless-http';

const handler = serverless(app);

export const GET = async (req: Request) => {
  return (handler(req, {}) as any);
};

export const POST = async (req: Request) => {
  return (handler(req, {}) as any);
};

export const PUT = async (req: Request) => {
  return (handler(req, {}) as any);
};

export const DELETE = async (req: Request) => {
  return (handler(req, {}) as any);
};

export const PATCH = async (req: Request) => {
  return (handler(req, {}) as any);
};

export const OPTIONS = async (req: Request) => {
  return (handler(req, {}) as any);
};
