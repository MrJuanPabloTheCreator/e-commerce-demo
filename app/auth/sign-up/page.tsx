"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { login } from '@/actions/login';
import styles from './page.module.css';

interface NewUser {
    name: string;
    email: string;
    password: string;
    provider: string;
}

export default function SignUp() {
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [newUserForm, setNewUserForm] = useState<NewUser>({
        name: '',
        email: '',
        password: '',
        provider: 'credentials'
    })

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUserForm),
            });

            const data = await response.json();
            if(data.success){
                toast.success('User Created Successfully')
                await login({email: newUserForm.email, password: newUserForm.password});
            } else {
                throw new Error('Error creating user')
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            // setLoading(false);
        }
    };

    const validatePasswords = (event: React.FormEvent) => {
        event.preventDefault();

        if(confirmPassword === newUserForm.password){
            handleSubmit();
        } else {
            toast.error('Incorrect passwords')
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1 className={`${styles.headerText} ${styles.textGreen}`}>Party</h1>
                    <p className={`${styles.headerText} ${styles.textGray}`}>-</p>
                    <h1 className={`${styles.headerText} ${styles.textGray}`}>Do</h1>
                </div>
                <h1 className={styles.welcomeText}>Welcome!</h1>
            </header>
            <form onSubmit={validatePasswords} className={styles.form}>
                <label className={styles.label}>
                    <h2 className={styles.labelText}>Name</h2>
                    <input
                        required
                        type="text"
                        value={newUserForm.name}
                        onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                        className={styles.input}
                    />
                </label>
                <label className={styles.label}>
                    <h2 className={styles.labelText}>Email</h2>
                    <input
                        required
                        type="email"
                        value={newUserForm.email}
                        onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                        className={styles.input}
                    />
                </label>
                <label className={styles.label}>
                    <h2 className={styles.labelText}>Password</h2>
                    <input
                        required
                        type="password"
                        value={newUserForm.password}
                        onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                        className={styles.input}
                    />
                </label>
                <label className={styles.label}>
                    <h2 className={styles.labelText}>Confirm Password</h2>
                    <input
                        required
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={styles.input}
                    />
                </label>
                <button 
                    type="submit"
                    className={styles.button}
                >
                    Sign Up
                </button>
            </form>
            <Link 
                href={'/auth/sign-in'} 
                className={styles.signInLink}
            >
                Already have an account?
            </Link>
        </div>
    );
}

