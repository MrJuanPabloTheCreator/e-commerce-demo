"use client"

import { CircleUserRound, LogOut } from "lucide-react";
import { User } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from './userButton.module.css';

interface UserButtonProps {
    user: User | undefined;
    activeAction: string | null;
    setActiveAction: (action: string | null) => void;
}

export default function UserButton({ user, activeAction, setActiveAction }: UserButtonProps) {

    const router = useRouter();

    useEffect(() => {

    },[user])

    const handleToggle = () => {
        setActiveAction(activeAction === 'user' ? null : 'user');
    };
    
    return (
        <div className={styles.container}>
            {user !== undefined ? (
                <button 
                    className={styles.button} 
                    onClick={handleToggle}
                >
                    {user?.image != null ?
                        (
                            <Image src={user?.image} alt="profile photo" height={24} width={24} className={styles.profileImage}/>
                        ):(
                            <CircleUserRound size={24}/>
                        )
                    }
                    <p className={styles.rightNavP}>Your Account</p>
                </button>
            ) : (
                <button
                    onClick={() => signIn()}
                    className={styles.signInButton}
                >
                    <CircleUserRound size={24}/>
                    <p className={styles.rightNavP}>Sign In</p>
                </button>
            )}
            {activeAction === 'user' && (
                <div 
                    className={styles.modal} 
                >
                    <button 
                        className={styles.modalButton}
                    >
                        {user?.image != null ?
                            (
                                <Image src={user?.image} alt="profile photo" height={36} width={36} className={styles.profileImage}/>
                            ):(
                                <CircleUserRound size={36}/>
                            )
                        }
                        <div className={styles.profileDetails}>
                            <h3>Profile</h3>
                            <h4>{user?.name}</h4>
                        </div>
                    </button>
                    <button 
                        onClick={() => signOut({ callbackUrl: '/home' })}
                        className={styles.modalButton}
                        style={{cursor: 'pointer'}}
                    >   
                        <LogOut size={24}/>
                        <h3>Sign Out</h3>
                    </button>
                </div>
            )}
        </div>
    )
}
