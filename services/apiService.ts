import axios from 'axios';

const API_BASE_URL = "https://task-prioritization-6b7t.onrender.com";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 100000, // 100 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ReflectionInsight {
  thinking: string;
  blindspot: string;
  growth: string;
  action: string;
}

interface InsightsResponse {
  insights: ReflectionInsight[];
}

interface SummaryResponse {
  summary: string;
}

interface ApiError {
  message: string;
  status?: number;
}

/**
 * Formats reflection data into a string suitable for API requests
 * @param questionsAnswers Array of question/answer pairs from reflection
 * @returns A formatted string containing all reflection content
 */
export const formatReflectionAsString = (
  questionsAnswers: { question: string; answer: string }[]
): string => {
  const formatted = questionsAnswers
    .map(qa => `Question: ${qa.question}\nAnswer: ${qa.answer}`)
    .join('\n\n');
  
  console.log('[formatReflectionAsString] Formatted reflection:', formatted);
  return formatted;
};

/**
 * Fetches reflection insights from the AI service
 * @param reflections The reflection text to analyze
 * @returns Promise with insights or default fallback
 */
export const getReflectionInsights = async (
  reflections: string
): Promise<InsightsResponse> => {
  console.log('[getReflectionInsights] Sending POST request with reflections:', reflections);
  
  try {
    const response = await apiClient.post('/reflection_insights', { reflections });
    
    console.log('[getReflectionInsights] Received response:', response.data);

    // Validate response structure
    if (!response.data.insights || !Array.isArray(response.data.insights)) {
      console.error('[getReflectionInsights] Invalid response format:', response.data);
      throw {
        message: 'Invalid response format from API',
      };
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[getReflectionInsights] API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack
      });
      
      if (error.response) {
        // Server responded with a status code outside 2xx
        throw {
          message: error.response.data?.error || 'Failed to get insights',
          status: error.response.status,
        };
      } else if (error.request) {
        // Request was made but no response received
        throw {
          message: 'No response received from server',
        };
      }
    } else {
      console.error('[getReflectionInsights] Non-Axios error:', error);
    }

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
 * Fetches a reflection summary from the AI service
 * @param reflection The reflection text to summarize
 * @returns Promise with summary or default fallback
 */
export const getReflectionSummary = async (
  reflection: string
): Promise<SummaryResponse> => {
  console.log('[getReflectionSummary] Sending POST request with reflection:', reflection);
  
  try {
    const response = await apiClient.post('/reflection_summary', { reflection });
    
    console.log('[getReflectionSummary] Received response:', response.data);

    // Validate response structure
    if (!response.data.summary || typeof response.data.summary !== 'string') {
      console.error('[getReflectionSummary] Invalid response format:', response.data);
      throw {
        message: 'Invalid response format from API',
      };
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[getReflectionSummary] API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack
      });
      
      if (error.response) {
        throw {
          message: error.response.data?.error || 'Failed to get summary',
          status: error.response.status,
        };
      } else if (error.request) {
        throw {
          message: 'No response received from server',
        };
      }
    } else {
      console.error('[getReflectionSummary] Non-Axios error:', error);
    }
    
    // Return meaningful fallback summary
    return {
      summary: "Unable to generate summary at this time.",
    };
  }
};

/**
 * Health check for the API service
 * @returns Promise with health status
 */
export const checkApiHealth = async (): Promise<{ status: string }> => {
  console.log('[checkApiHealth] Performing health check with POST request');
  
  try {
    const response = await apiClient.post('/health'); // Changed from GET to POST
    console.log('[checkApiHealth] Health check successful:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[checkApiHealth] Health check failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    } else {
      console.error('[checkApiHealth] Non-Axios health check error:', error);
    }
    return { status: 'unhealthy' };
  }
};