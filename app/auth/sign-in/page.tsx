"use client"

import { useState } from 'react';
import { login } from '@/actions/login';
import { GoogleLogin } from '@/actions/google_login';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import toast from 'react-hot-toast';

import styles from './page.module.css';

type LoginForm = {
    email: string;
    password: string;
}

export default function SignIn() {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await login(loginForm);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={`${styles.headerText} ${styles.textGreen}`}>Party</h1>
          <p className={`${styles.headerText} ${styles.textGray}`}>-</p>
          <h1 className={`${styles.headerText} ${styles.textGray}`}>Do</h1>
        </div>
        <h1 className={styles.welcomeText}>Welcome Back!</h1>
      </header>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          <h2 className={styles.labelText}>Email</h2>
          <input
            type="email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <h2 className={styles.labelText}>Password</h2>
          <input
            type="password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            required
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.button}>
          Sign In
        </button>
      </form>
      <div className={styles.dividerContainer}>
        <div className={styles.divider} />
        <p className={styles.orText}>or</p>
        <div className={styles.divider} />
      </div>
      <button onClick={() => GoogleLogin()} className={styles.googleButton}>
        <FcGoogle className="h-6 w-6" />
      </button>
      <Link href={'/auth/sign-up'} className={styles.signUpLink}>
        Don&apos;t have an account?
      </Link>
    </div>
  );
}

