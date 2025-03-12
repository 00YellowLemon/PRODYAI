import { NextResponse } from 'next/server';
import { getAuth } from 'firebase/auth';

export function middleware(request) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return NextResponse.redirect('/login');
  }

  return NextResponse.next();
}
