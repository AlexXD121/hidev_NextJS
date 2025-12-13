import { ApiAdapter } from "./api";
import { MockApiService } from "./mock-api";
import { realApi } from "./real-api";

// Switch between Real and Mock API
// Switch between Real and Mock API
const useRealApi = process.env.NEXT_PUBLIC_USE_REAL_API !== 'false'; // Default to true

export const api: ApiAdapter = useRealApi
    ? realApi
    : new MockApiService();
