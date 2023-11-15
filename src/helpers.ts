export type Credentials = {
  username: string
  password: string
  namespace: string
  database: string
  scope: string
}

export function validateCredentials(credentials: Partial<Credentials>): credentials is Credentials {
  const requiredFields: (keyof Credentials)[] = ['username', 'password', 'namespace', 'database'];

  const missingFields = requiredFields.filter(field => !credentials[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required ${missingFields.length > 1 ? 'properties' : 'property'} for SurrealDB East adapter in .eastrc: ${missingFields.map((field) => `credentials.${field}`).join(', ')}`);
  }

  return true;
}