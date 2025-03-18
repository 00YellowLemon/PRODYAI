import { getFirestore, collection, doc, setDoc, getDocs, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Initialize Firestore
const db = getFirestore();
const auth = getAuth();

// Function to create a task
export const createTask = async (userId: string, title: string, description: string, importance: boolean, urgency: boolean, dueDate?: Timestamp) => {
  const taskRef = doc(collection(db, `users/${userId}/tasks`));
  const taskData = {
    title,
    description,
    importance,
    urgency,
    completed: false,
    dueDate: dueDate || null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  await setDoc(taskRef, taskData);
  return taskRef.id;
};

// Function to read tasks
export const readTasks = async (userId: string) => {
  const tasksSnapshot = await getDocs(collection(db, `users/${userId}/tasks`));
  const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return tasksList;
};

// Function to update a task
export const updateTask = async (userId: string, taskId: string, updatedData: Partial<{ title: string; description: string; importance: boolean; urgency: boolean; completed: boolean; dueDate: Timestamp }>) => {
  const taskRef = doc(db, `users/${userId}/tasks`, taskId);
  await updateDoc(taskRef, {
    ...updatedData,
    updatedAt: Timestamp.now(),
  });
};

// Function to delete a task
export const deleteTask = async (userId: string, taskId: string) => {
  const taskRef = doc(db, `users/${userId}/tasks`, taskId);
  await deleteDoc(taskRef);
};
