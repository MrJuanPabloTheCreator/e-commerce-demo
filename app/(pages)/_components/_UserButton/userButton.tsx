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
}

export default function UserButton({ user }: UserButtonProps) {
    const [activateModal, setActivateModal] = useState<boolean>(false)

    const router = useRouter();

    useEffect(() => {

    },[user])

    return (
        <div className={styles.container}>
            {user !== undefined ? (
                <button 
                    className={styles.button} 
                    onClick={() => setActivateModal(!activateModal)}
                >
                    {user?.image != null ?
                        (
                            <Image src={user?.image} alt="profile photo" fill className={styles.profileImage}/>
                        ):(
                            <CircleUserRound size={32} className={styles.defaultProfileIcon}/>
                        )
                    }
                </button>
            ) : (
                <button
                    onClick={() => signIn()}
                    className={styles.signInButton}
                >
                    <CircleUserRound size={32} className={styles.defaultProfileIcon}/>
                </button>
            )}
            {activateModal && (
                <div 
                    className={styles.modal} 
                >
                    <button 
                        onClick={() => router.push(`/myteams/users/${user?.id}`)}
                        className={styles.modalButton}
                    >
                        <div className={styles.modalImageContainer}>
                            {user?.image != null ?
                                (
                                    <Image src={user?.image} alt="profile photo" fill className={styles.profileImage}/>
                                ):(
                                    <CircleUserRound size={32} className={styles.defaultProfileIcon}/>
                                )
                            }
                        </div>
                        <div className={styles.profileDetails}>
                            <h2 className={styles.profileName}>Profile</h2>
                            <h3 className={styles.profileEmail}>{user?.name}</h3>
                        </div>
                    </button>
                    <button 
                        onClick={() => signOut({ callbackUrl: '/home' })}
                        className={styles.signOutButton}
                    >   
                        <LogOut size={24} className={styles.signOutIcon}/>
                        <h2 className={styles.signOutText}>Sign Out</h2>
                    </button>
                </div>
            )}
        </div>
    )
}
