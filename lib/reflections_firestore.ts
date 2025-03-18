import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, Timestamp } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore();

// Function to create a reflection
export const createReflection = async (userId: string, title: string, summary: string, insight: string, questions: Array<{ question: string, answer: string }>) => {
  const reflectionRef = doc(collection(db, `users/${userId}/reflections`));
  const reflectionData = {
    title,
    summary,
    insight,
    questions,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  await setDoc(reflectionRef, reflectionData);
  return reflectionRef.id;
};

// Function to read reflections
export const readReflections = async (userId: string) => {
  const reflectionsSnapshot = await getDocs(collection(db, `users/${userId}/reflections`));
  const reflectionsList = reflectionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return reflectionsList;
};

// Function to delete a reflection
export const deleteReflection = async (userId: string, reflectionId: string) => {
  const reflectionRef = doc(db, `users/${userId}/reflections`, reflectionId);
  await deleteDoc(reflectionRef);
};
