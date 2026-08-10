import { Inject, Injectable, Optional } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, User, onAuthStateChanged, getIdToken } from '@angular/fire/auth';
import { BehaviorSubject, catchError, from, Observable, of, Subject, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  notify: Subject<string> = new Subject();
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(@Optional() private auth: Auth | null) {
    if (this.auth && typeof window !== 'undefined') {
      try {
        onAuthStateChanged(this.auth, (user) => {
          if (user) {
            this.userSubject.next(user);
            this.notify.next('✅ User Logged In');
          } else {
            this.userSubject.next(null);
            this.notify.next('❌ User Logged Out');
          }
        });
      } catch (err) {
        console.warn('Firebase Auth state listener error:', err);
      }
    }
  }

  setUser(user: User) {
    this.userSubject.next(user);
    this.notify.next('🔹 User Updated');
  }

  bindUserData(userData: any) {
    this.userSubject.next(userData);
    this.notify.next('🔹 User Data Bound');
  }

  loginWithGoogle(): Observable<string | null> {
    if (!this.auth) {
      console.warn('Firebase Auth is not available');
      return of(null);
    }
    const provider = new GoogleAuthProvider();

    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((credential) => {
        console.log(credential);
        return from(getIdToken(credential.user));
      }),
      catchError((error) => {
        console.error('Google Sign-In Error:', error);
        return of(null);
      })
    );
  }

  async logout(): Promise<void> {
    if (!this.auth) return;
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Logout Error:', error);
    }
  }
}
