import { createHmac, timingSafeEqual } from "crypto";

export const COOKIE_NAME = "reuse_session";
const SECRET = process.env.AUTH_SECRET ?? "dev-secret-change-me";

export function assinar(usuarioId: string) {
  const hmac = createHmac("sha256", SECRET).update(usuarioId).digest("hex");
  return `${usuarioId}.${hmac}`;
}

export function verificar(valor: string): string | null {
  const [usuarioId, hmac] = valor.split(".");
  if (!usuarioId || !hmac) return null;

  const esperado = createHmac("sha256", SECRET).update(usuarioId).digest("hex");
  const a = Buffer.from(hmac);
  const b = Buffer.from(esperado);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  return usuarioId;
}
