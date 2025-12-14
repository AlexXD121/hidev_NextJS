const getBaseUrl = (apiUrl) => {
    try {
        // Mock window.location.origin
        const origin = 'http://localhost:3000';
        const url = new URL(apiUrl || 'http://localhost:8000/api', origin);

        // Deduplicate slashes
        url.pathname = url.pathname.replace(/\/+/g, '/');

        if (url.pathname.endsWith('/')) {
            url.pathname = url.pathname.slice(0, -1);
        }

        if (!url.pathname.endsWith('/api')) {
            url.pathname += '/api';
        }

        return url.toString();
    } catch (e) {
        return "Error: " + e.message;
    }
}

console.log("Defaults:", getBaseUrl(undefined));
console.log("Empty String:", getBaseUrl(""));
console.log("http://localhost:8000:", getBaseUrl("http://localhost:8000"));
console.log("http://localhost:8000/:", getBaseUrl("http://localhost:8000/"));
console.log("http://localhost:8000/api:", getBaseUrl("http://localhost:8000/api"));
console.log("http://localhost:8000/api/:", getBaseUrl("http://localhost:8000/api/"));
console.log("http://localhost:8000//api:", getBaseUrl("http://localhost:8000//api"));
console.log("http://localhost:8000//api//:", getBaseUrl("http://localhost:8000//api//"));
console.log("/api (relative):", getBaseUrl("/api"));
console.log("//api (relative double):", getBaseUrl("//api"));
