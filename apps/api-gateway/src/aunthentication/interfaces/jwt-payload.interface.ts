interface JwtPayload {
  sub: string; // Subject (typically the user ID)
  iss?: string; // Issuer
  aud?: string | string[]; // Audience
  exp?: number; // Expiration Time (Unix timestamp)
  nbf?: number; // Not Before (Unix timestamp)
  iat?: number; // Issued At (Unix timestamp)
  jti?: string; // JWT ID
}

export default JwtPayload;
