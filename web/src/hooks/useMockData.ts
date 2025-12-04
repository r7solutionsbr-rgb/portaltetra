/**
 * DEPRECATED: This file is kept for backward compatibility only
 * Please use useAppData from './useAppData' instead
 * 
 * This file now simply re-exports useAppData as useMockData
 * to avoid breaking existing imports while we migrate
 */

export { useAppData as useMockData } from './useAppData';
export { useAppData as default } from './useAppData';
