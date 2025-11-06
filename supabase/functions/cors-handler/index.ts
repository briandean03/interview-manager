/*
  # CORS Handler Edge Function
  
  This edge function provides proper CORS handling for all API requests.
  It can be used as a template for other edge functions or as a standalone CORS proxy.
*/

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Client-Info, apikey",
  "Access-Control-Max-Age": "86400", // 24 hours
};

interface RequestBody {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: any;
}

Deno.serve(async (req: Request) => {
  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    // Health check endpoint
    if (path === "/health" || path === "/") {
      return new Response(
        JSON.stringify({ 
          status: "healthy", 
          timestamp: new Date().toISOString(),
          cors: "enabled"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // CORS proxy endpoint
    if (path === "/proxy" && req.method === "POST") {
      const requestBody: RequestBody = await req.json();
      
      if (!requestBody.url) {
        return new Response(
          JSON.stringify({ error: "URL is required" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      // Make the proxied request
      const proxyResponse = await fetch(requestBody.url, {
        method: requestBody.method || "GET",
        headers: requestBody.headers || {},
        body: requestBody.body ? JSON.stringify(requestBody.body) : undefined,
      });

      const responseData = await proxyResponse.text();
      
      return new Response(responseData, {
        status: proxyResponse.status,
        headers: {
          "Content-Type": proxyResponse.headers.get("Content-Type") || "application/json",
          ...corsHeaders,
        },
      });
    }

    // Default response for unknown endpoints
    return new Response(
      JSON.stringify({ 
        error: "Endpoint not found",
        available_endpoints: ["/health", "/proxy"]
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error("CORS Handler Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});