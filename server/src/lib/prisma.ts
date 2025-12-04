// FIX: Added a triple-slash directive to include Node.js types, resolving errors with `global`.
/// <reference types="node" />

import { PrismaClient } from '@prisma/client';

// Adiciona o prisma ao objeto global do Node.js para evitar múltiplas instâncias em desenvolvimento
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
