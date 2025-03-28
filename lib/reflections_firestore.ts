import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, Timestamp, query, orderBy } from "firebase/firestore";

const db = getFirestore();

export interface ReflectionQuestionAnswer {
  question: string;
  answer: string;
}

export interface ReflectionInsight {
  thinking: string;
  blindspot: string;
  growth: string;
  action: string;
}

export const createReflection = async (
  userId: string,
  title: string,
  summary: string,
  questionsAnswers: ReflectionQuestionAnswer[],
  insights: ReflectionInsight[] = []
) => {
  const reflectionRef = doc(collection(db, `users/${userId}/reflections`));
  const reflectionData = {
    title,
    summary,
    questionsAnswers,
    insights,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  await setDoc(reflectionRef, reflectionData);
  return reflectionRef.id;
};

export const readReflections = async (userId: string) => {
  const reflectionsRef = collection(db, `users/${userId}/reflections`);
  const q = query(reflectionsRef, orderBy("createdAt", "desc"));
  const reflectionsSnapshot = await getDocs(q);
  
  return reflectionsSnapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().title,
    summary: doc.data().summary,
    questionsAnswers: doc.data().questionsAnswers || [],
    insights: doc.data().insights || [],
    createdAt: doc.data().createdAt,
  }));
};

export const deleteReflection = async (userId: string, reflectionId: string) => {
  const reflectionRef = doc(db, `users/${userId}/reflections`, reflectionId);
  await deleteDoc(reflectionRef);
};