import { ApiAdapter } from "./api";
import { MockApiService } from "./mock-api";

// In the future, we can switch this based on environment variables
// const useRealApi = process.env.NEXT_PUBLIC_USE_REAL_API === 'true';
const useRealApi = false;

export const api: ApiAdapter = useRealApi
    ? new MockApiService() // Placeholder for RealApiService
    : new MockApiService();
