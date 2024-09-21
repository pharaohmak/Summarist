"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, db } from '@/firebase/init';
import { onAuthStateChanged } from 'firebase/auth';
import SideBar from '@/app/components/SideBar';
import SearchBar from '@/app/components/SearchBar';
import { collection, addDoc } from 'firebase/firestore';
import Image from 'next/image';

import type { NextPage } from "next";
import React from "react";

const InsideBook: NextPage = () => {
    const [bookData, setBookData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [bookId, setBookId] = useState<string | null>(null);

    // Extract the book ID from the URL without using useRouter
    useEffect(() => {
        const pathSegments = window.location.pathname.split('/');
        const id = pathSegments[pathSegments.length - 1]; // Assuming the ID is the last part of the URL
        setBookId(id);
    }, []);

    useEffect(() => {
        if (!bookId) return;

        const fetchBookData = async () => {
            try {
                const response = await axios.get(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`);
                setBookData(response.data);
            } catch (err) {
                setError('Failed to load book data.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookData();
    }, [bookId]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleReadOrListen = (type: string) => {
        if (!user) {
            // Show auth modal
            alert('Please log in to continue');
        } else {
            if (bookData?.subscriptionRequired && !user?.subscriptionStatus) {
                // Redirect to the subscription plan page
                window.location.href = '/choose-plan';
            } else {
                // Redirect to the player page
                window.location.href = `/player/${bookId}`;
            }
        }
    };

    const handleAddToLibrary = async () => {
        if (!user) {
            // Show auth modal
            alert('Please log in to add to your library');
        } else {
            try {
                // Assume `book` is an object containing the book details
                const book = {
                    title: bookData.title || "Unknown Title",
                    author: bookData.author || "Unknown Author",
                    // Add other book details here
                };

                // Reference to the user's library collection
                const libraryRef = collection(db, 'users', user.uid, 'library');

                // Add the book to the Firestore collection
                await addDoc(libraryRef, book);

                alert('Book added to your library!');
            } catch (error) {
                console.error('Error adding book to library:', error);
                alert('Failed to add the book to your library. Please try again.');
            }
        }
    };

    if (loading) return <div>Loading book data...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="inner__wrapper">
            <div className="inner__book">
                <div className="inner-book__title">{bookData?.title || 'Unknown Title'}</div>
                <div className="inner-book__author">{bookData?.author || 'Unknown Author'}</div>
                <div className="inner-book__sub--title">{bookData?.subTitle || 'No Subtitle'}</div>
                <div className="inner-book__wrapper">
                    <div className="inner-book__description--wrapper">
                        <div className="inner-book__description">
                            <div className="inner-book__overall--rating">{bookData?.averageRating || 'N/A'}&nbsp;</div>
                            <div className="inner-book__total--rating">({bookData?.totalRating || 0}&nbsp;ratings)</div>
                        </div>
                        <div className="inner-book__description">
                            <div className="inner-book__duration">03:24</div>
                        </div>
                        <div className="inner-book__description">
                            <div className="inner-book__type">Audio &amp; Text</div>
                        </div>
                        <div className="inner-book__description">
                            <div className="inner-book__key--ideas">{bookData?.keyIdeas || 'N/A'} Key ideas</div>
                        </div>
                    </div>
                </div>
                <div className="inner-book__read--btn-wrapper">
                    <button
                        className="inner-book__read--btn"
                        onClick={() => handleReadOrListen('read')}
                    >
                        Read
                    </button>
                    <button
                        className="inner-book__read--btn"
                        onClick={() => handleReadOrListen('listen')}
                    >
                        Listen
                    </button>
                </div>
                <div className="inner-book__bookmark" onClick={handleAddToLibrary}>
                    <div className="inner-book__bookmark--text">
                        Add title to My Library
                    </div>
                </div>
                <div className="inner-book__secondary--title">What's it about?</div>
                <div className="inner-book__tags--wrapper">
                    {bookData?.tags?.length > 0 ? bookData.tags.map((tag: string) => (
                        <div className="inner-book__tag" key={tag}>
                            {tag}
                        </div>
                    )) : <div>No tags available</div>}
                </div>
                <div className="inner-book__book--description">
                    {bookData?.description || 'No description available'}
                </div>
                <h2 className="inner-book__secondary--title">About the author</h2>
                <div className="inner-book__author--description">
                    {bookData?.authorDescription || 'No author description available'}
                </div>
            </div>
            <div className="inner-book--img-wrapper">
                <figure className="book__image--wrapper" style={{ height: 300, width: 300, minWidth: 300 }}>
                    <Image
                        className="book__image"
                        src={bookData?.imageLink || '/default-image.jpg'}
                        alt={bookData?.title || 'Book Image'}
                        style={{ display: 'block' }}
                        width={300}
                        height={300}
                    />
                </figure>
            </div>
        </div>
    )
}

export default InsideBook;