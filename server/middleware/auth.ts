import { Request, Response, NextFunction } from "express";
import { verifySupabaseToken } from "../supabase";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7);
    const supabaseUser = await verifySupabaseToken(token);
    
    if (!supabaseUser) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      role: supabaseUser.user_metadata?.role || 'client',
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: "Authentication failed" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }
    
    next();
  };
}
