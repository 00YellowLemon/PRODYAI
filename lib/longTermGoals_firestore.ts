import { getFirestore, collection, doc, setDoc, getDocs, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore();

// Function to create a long-term goal
export const createLongTermGoal = async (userId: string, title: string, startDate: Timestamp, endDate: Timestamp, progress: number, categories: string[]) => {
  const goalRef = doc(collection(db, `users/${userId}/longTermGoals`));
  const goalData = {
    title,
    startDate,
    endDate,
    progress,
    categories,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  await setDoc(goalRef, goalData);
  return goalRef.id;
};

// Function to read long-term goals
export const readLongTermGoals = async (userId: string) => {
  const goalsSnapshot = await getDocs(collection(db, `users/${userId}/longTermGoals`));
  const goalsList = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return goalsList;
};

// Function to update a long-term goal
export const updateLongTermGoal = async (userId: string, goalId: string, updatedData: Partial<{ title: string; startDate: Timestamp; endDate: Timestamp; progress: number; categories: string[] }>) => {
  const goalRef = doc(db, `users/${userId}/longTermGoals`, goalId);
  await updateDoc(goalRef, {
    ...updatedData,
    updatedAt: Timestamp.now(),
  });
};

// Function to delete a long-term goal
export const deleteLongTermGoal = async (userId: string, goalId: string) => {
  const goalRef = doc(db, `users/${userId}/longTermGoals`, goalId);
  await deleteDoc(goalRef);
};
