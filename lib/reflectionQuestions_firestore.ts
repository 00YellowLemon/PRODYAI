import { getFirestore, collection, doc, setDoc, getDocs, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore();

// Function to create a reflection question
export const createReflectionQuestion = async (userId: string, questions: string[]) => {
  const reflectionQuestionRef = doc(collection(db, `users/${userId}/reflectionQuestions`));
  const reflectionQuestionData = {
    questions,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  await setDoc(reflectionQuestionRef, reflectionQuestionData);
  return reflectionQuestionRef.id;
};

// Function to read reflection questions
export const readReflectionQuestions = async (userId: string) => {
  const reflectionQuestionsSnapshot = await getDocs(collection(db, `users/${userId}/reflectionQuestions`));
  const reflectionQuestionsList = reflectionQuestionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return reflectionQuestionsList;
};

// Function to update a reflection question
export const updateReflectionQuestion = async (userId: string, reflectionQuestionId: string, questions: string[]) => {
  const reflectionQuestionRef = doc(db, `users/${userId}/reflectionQuestions`, reflectionQuestionId);
  await updateDoc(reflectionQuestionRef, {
    questions,
    updatedAt: Timestamp.now(),
  });
};

// Function to delete a reflection question
export const deleteReflectionQuestion = async (userId: string, reflectionQuestionId: string) => {
  const reflectionQuestionRef = doc(db, `users/${userId}/reflectionQuestions`, reflectionQuestionId);
  await deleteDoc(reflectionQuestionRef);
};

// Function to create a reflection question
export const createReflectionQuestion = async (userId: string, question: string) => {
  const reflectionQuestionRef = doc(collection(db, `users/${userId}/reflectionQuestions`));
  const reflectionQuestionData = {
    question,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  await setDoc(reflectionQuestionRef, reflectionQuestionData);
  return reflectionQuestionRef.id;
};

// Function to read reflection questions
export const readReflectionQuestions = async (userId: string) => {
  const reflectionQuestionsSnapshot = await getDocs(collection(db, `users/${userId}/reflectionQuestions`));
  const reflectionQuestionsList = reflectionQuestionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return reflectionQuestionsList;
};

// Function to update a reflection question
export const updateReflectionQuestion = async (userId: string, reflectionQuestionId: string, question: string) => {
  const reflectionQuestionRef = doc(db, `users/${userId}/reflectionQuestions`, reflectionQuestionId);
  await updateDoc(reflectionQuestionRef, {
    question,
    updatedAt: Timestamp.now(),
  });
};

// Function to delete a reflection question
export const deleteReflectionQuestion = async (userId: string, reflectionQuestionId: string) => {
  const reflectionQuestionRef = doc(db, `users/${userId}/reflectionQuestions`, reflectionQuestionId);
  await deleteDoc(reflectionQuestionRef);
};
