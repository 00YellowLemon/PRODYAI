const API_BASE_URL = "https://task-prioritization-6b7t.onrender.com";

interface ReflectionInsight {
  thinking: string;
  blindspot: string;
  growth: string;
  action: string;
}

interface InsightsResponse {
  insights: ReflectionInsight[];
}

interface ApiError {
  message: string;
  status?: number;
}

/**
 * Fetches reflection insights from the AI service
 * @param reflections The reflection text to analyze
 * @returns Promise with insights or default fallback
 */
export const getReflectionInsights = async (
  reflections: string
): Promise<InsightsResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}/reflection_insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reflections }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: `HTTP error! status: ${response.status}` };
      }
      throw {
        message: errorData.error || 'Failed to get insights',
        status: response.status,
      };
    }

    const data = await response.json();

    // Validate response structure
    if (!data.insights || !Array.isArray(data.insights)) {
      throw {
        message: 'Invalid response format from API',
      };
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Return meaningful fallback insights
    return {
      insights: [
        {
          thinking: "We couldn't analyze your reflections right now.",
          blindspot: "The insights service might be unavailable.",
          growth: "Try again later or reflect on these questions yourself.",
          action: "Check your connection and retry in a few minutes.",
        },
      ],
    };
  }
};

/**
 * Health check for the API service
 * @returns Promise with health status
 */
export const checkApiHealth = async (): Promise<{ status: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      timeout: 5000,
    });

    if (!response.ok) {
      throw new Error(`API health check failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'unhealthy' };
  }
};