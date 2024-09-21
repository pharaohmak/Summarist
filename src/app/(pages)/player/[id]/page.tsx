"use client";

import type { NextPage } from 'next';
import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/init';
import Image from 'next/image';

interface BookData {
    title: string;
    summary: string;
    audioLink: string;
    imageLink: string;
    author: string;
    duration: string;
    tags?: string[];
}

const Player: NextPage = () => {
    const [bookId, setBookId] = useState<string | null>(null);
    const [bookData, setBookData] = useState<BookData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [, setUser] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const urlParts = window.location.pathname.split('/');
        const id = urlParts[urlParts.length - 1]; // Assumes the ID is at the end of the URL
        setBookId(id);
    }, []);

    useEffect(() => {
        if (!bookId) return;

        const fetchBookData = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get<BookData>(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`);
                setBookData(data);
            } catch (err) {
                setError('Failed to load book data: ' + (err instanceof Error ? err.message : 'Unknown error'));
            } finally {
                setLoading(false);
            }
        };

        fetchBookData();
    }, [bookId]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user || null));
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleTimeUpdate = () => {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
            }
        };

        const audioElement = audioRef.current;
        audioElement?.addEventListener('timeupdate', handleTimeUpdate);
        return () => {
            audioElement?.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [isPlaying]);

    const handlePlayPause = useCallback(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(prev => !prev);
        }
    }, [isPlaying]);

    const handleRewind = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
        }
    };

    const handleForward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioRef.current.duration);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!bookData) return <div>No data available</div>;

    const duration = audioRef.current?.duration || 0;
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="summary">
            <div className="audio__book--summary" style={{ fontSize: '16px' }}>
                <div className="audio__book--summary-title"><b>{bookData.title}</b></div>
                <div className="audio__book--summary-text">{bookData.summary}</div>
            </div>
            <div className="audio__wrapper">
                <audio ref={audioRef} src={bookData.audioLink} onLoadedData={() => setCurrentTime(0)} />
                <div className="audio__track--wrapper">
                    <figure className="audio__track--image-mask">
                        <figure className="book__image--wrapper" style={{ height: 48, width: 48 }}>
                            <Image className="book__image" src={bookData.imageLink} alt="book" width={100} height={100} />
                        </figure>
                    </figure>
                    <div className="audio__track--details-wrapper">
                        <div className="audio__track--title">{bookData.title}</div>
                        <div className="audio__track--author">{bookData.author}</div>
                    </div>
                </div>
                <div className="audio__controls--wrapper">
                    <div className="audio__controls">
                        <button className="audio__controls--btn" onClick={handleRewind}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" stroke="#000" strokeWidth="2" d="M3.11111111,7.55555556 C4.66955145,4.26701301 8.0700311,2 12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 L12,22 C6.4771525,22 2,17.5228475 2,12 M2,4 L2,8 L6,8 M9,16 L9,9 L7,9.53333333 M17,12 C17,10 15.9999999,8.5 14.5,8.5 C13.0000001,8.5 12,10 12,12 C12,14 13,15.5000001 14.5,15.5 C16,15.4999999 17,14 17,12 Z M14.5,8.5 C16.9253741,8.5 17,11 17,12 C17,13 17,15.5 14.5,15.5 C12,15.5 12,13 12,12 C12,11 12.059,8.5 14.5,8.5 Z"></path>
                            </svg>

                        </button>
                        <button className="audio__controls--btn audio__controls--btn-play" onClick={handlePlayPause}>
                            {isPlaying ? (
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224 432h-80V80h80zm144 0h-80V80h80z"></path></svg>
                            ) : (
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="audio__controls--play-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M96 448l320-192L96 64v384z"></path>
                                </svg>
                            )}
                        </button>
                        <button className="audio__controls--btn" onClick={handleForward}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" stroke="#000" strokeWidth="2" d="M20.8888889,7.55555556 C19.3304485,4.26701301 15.9299689,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 L12,22 C17.5228475,22 22,17.5228475 22,12 M22,4 L22,8 L18,8 M9,16 L9,9 L7,9.53333333 M17,12 C17,10 15.9999999,8.5 14.5,8.5 C13.0000001,8.5 12,10 12,12 C12,14 13,15.5000001 14.5,15.5 C16,15.4999999 17,14 17,12 Z M14.5,8.5 C16.9253741,8.5 17,11 17,12 C17,13 17,15.5 14.5,15.5 C12,15.5 12,13 12,12 C12,11 12.059,8.5 14.5,8.5 Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="audio__progress--wrapper">
                    <div className="audio__time">{formatTime(currentTime)}</div>
                    <input
                        type="range"
                        className="audio__progress--bar"
                        value={progressPercent}
                        max="100"
                        onChange={(e) => {
                            if (audioRef.current) {
                                const newTime = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
                                audioRef.current.currentTime = newTime;
                                setCurrentTime(newTime);
                            }
                        }}
                        style={{
                            background: `linear-gradient(to right, rgb(43, 217, 124) ${progressPercent}%, rgb(109, 120, 125) ${progressPercent}%)`,
                        }}
                    />
                    <div className="audio__time">{formatTime(duration)}</div>
                </div>
            </div>
        </div>
    );
};

// Utility function to format time in MM:SS
const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default Player;