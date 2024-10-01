"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth  } from '@/firebase/init';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';

import type { NextPage } from "next";

interface BookData {
    title: string;
    author: string;
    subTitle?: string;
    averageRating?: number;
    totalRating?: number;
    keyIdeas?: string;
    description?: string;
    authorDescription?: string;
    imageLink?: string;
    subscriptionRequired?: boolean;
    tags?: string[];
}

const InsideBook: NextPage = () => {
    const [bookData, setBookData] = useState<BookData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [bookId, setBookId] = useState<string | null>(null);

    useEffect(() => {
        const pathSegments = window.location.pathname.split('/');
        const id = pathSegments[pathSegments.length - 1];
        setBookId(id);
    }, []);

    useEffect(() => {
        const fetchBookData = async () => {
            if (!bookId) return;

            try {
                const response = await axios.get(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`);
                setBookData(response.data);
            } catch (err) {
                setError('Failed to load book data: ' + err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookData();
    }, [bookId]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: any) => {
            setUser(user || null);
        });

        return () => unsubscribe();
    }, []);

    const handleReadOrListen = () => {
        if (!user) {
            alert('Please log in to continue');
            return;
        }

        if (bookData?.subscriptionRequired && !user?.subscriptionStatus) {
            window.location.href = '/choose-plan';
        } else {
            window.location.href = `/player/${bookId}`;
        }
    };

    // const handleAddToLibrary = async () => {
    //     if (!user) {
    //         alert('Please log in to add to your library');
    //         return;
    //     }

    //     try {
    //         const book = {
    //             title: bookData?.title || "Unknown Title",
    //             author: bookData?.author || "Unknown Author",
    //         };

    //         const libraryRef = collection(db, 'users', user.uid, 'library');
    //         await addDoc(libraryRef, book);
    //         alert('Book added to your library!');
    //     } catch (error) {
    //         console.error('Error adding book to library:', error);
    //         alert('Failed to add the book to your library. Please try again.');
    //     }
    // };

    if (loading) return <div>Loading book data...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="inner__wrapper">
            <div className="inner__book">
                <h1 className="inner-book__title">{bookData?.title || 'Unknown Title'}</h1>
                <h2 className="inner-book__author">{bookData?.author || 'Unknown Author'}</h2>
                <h3 className="inner-book__sub--title">{bookData?.subTitle || 'No Subtitle'}</h3>
                <div className="inner-book__wrapper">
                    <div className="inner-book__description--wrapper">
                        <div className="inner-book__description">
                            <span className="inner-book__overall--rating">{bookData?.averageRating || 'N/A'}</span>
                            <span className="inner-book__total--rating">({bookData?.totalRating || 0} ratings)</span>
                        </div>
                        <div className="inner-book__description">
                            <span className="inner-book__duration">03:24</span>
                        </div>
                        <div className="inner-book__description">
                            <span className="inner-book__type">Audio &amp; Text</span>
                        </div>
                        <div className="inner-book__description">
                            <span className="inner-book__key--ideas">{bookData?.keyIdeas || 'N/A'} Key ideas</span>
                        </div>
                    </div>
                </div>
                <div className="inner-book__read--btn-wrapper">
                    <button className="inner-book__read--btn" onClick={handleReadOrListen}>
                        Read
                    </button>
                    <button className="inner-book__read--btn" onClick={handleReadOrListen}>
                        Listen
                    </button>
                </div>
                <div className="inner-book__bookmark">
                    <span className="inner-book__bookmark--text">Add title to My Library</span>
                </div>
                <h4 className="inner-book__secondary--title">What&apos;s it about?</h4>
                <div className="inner-book__tags--wrapper">
                    {bookData?.tags && bookData.tags.length > 0 ? (
                        bookData.tags.map((tag) => (
                            <span className="inner-book__tag" key={tag}>
                                {tag}
                            </span>
                        ))
                    ) : (
                        <div>No tags available</div>
                    )}
                </div>
                <p className="inner-book__book--description">{bookData?.description || 'No description available'}</p>
                <h2 className="inner-book__secondary--title">About the author</h2>
                <p className="inner-book__author--description">{bookData?.authorDescription || 'No author description available'}</p>
            </div>
            <div className="inner-book--img-wrapper">
                <figure className="book__image--wrapper" style={{ height: 300, width: 300, minWidth: 300 }}>
                    <Image
                        className="book__image"
                        src={bookData?.imageLink || '/default-image.jpg'}
                        alt={bookData?.title || 'Book Image'}
                        width={300}
                        height={300}
                    />
                </figure>
            </div>
        </div>
    );
}

export default InsideBook;