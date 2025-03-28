export interface ReflectionInsight {
    thinking: string;
    blindspot: string;
    growth: string;
    action: string;
  }
  
  export interface ReflectionQuestionAnswer {
    question: string;
    answer: string;
  }
  
  export interface Reflection {
    id: string;
    title: string;
    summary: string;
    questionsAnswers: ReflectionQuestionAnswer[];
    insights: ReflectionInsight[];
    createdAt: any;
  }