"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from 'next/link';
import Image from "next/image";

interface Book {
    id: string;
    title: string;
    author: string;
    duration: string;
    imageLink: string;
    audioLink: string;
    subTitle: string;
    averageRating: number;
    subscriptionRequired: boolean; // Assuming this is the field for subscription status
}

const RecommendedBooks: React.FC<{ books: Book[] }> = () => {
    const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchRecommendedBooks = async () => {
        try {
            const response = await axios.get('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended');
            const data = response.data;
            setRecommendedBooks(data);
        } catch (error) {
            console.error("Error fetching selected books:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRecommendedBooks();
    }, []);

    return (
        <div>
            <div className="for-you__title">Recommended For You</div>
            <div className="for-you__sub--title">We think you’ll like this</div>

            {loading ? (
                <div className="row">
                    <div className="container">
                        <div className="for-you__wrapper">
                            {/* Selected for You Section */}
                            <div className="for-you__title">Selected just for you</div>
                            <div className="selected__book--skeleton"></div>

                            {/* Recommended For You Section */}
                            <div>
                                <div className="for-you__title">Recommended For You</div>
                                <div className="for-you__sub--title">We think you’ll like these</div>
                                <div className="recommended__books--skeleton-wrapper">
                                    {[...Array(5)].map((_, index) => (
                                        <div key={index} className="recommended__books--skeleton">
                                            <div className="skeleton" style={{ width: '100%', height: '240px', marginBottom: '8px' }}></div>
                                            <div className="skeleton" style={{ width: '100%', height: '20px', marginBottom: '8px' }}></div>
                                            <div className="skeleton" style={{ width: '90%', height: '16px', marginBottom: '8px' }}></div>
                                            <div className="skeleton" style={{ width: '80%', height: '32px', marginBottom: '8px' }}></div>
                                            <div className="skeleton" style={{ width: '90%', height: '16px' }}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (

                <div className="for-you__recommended--books">
                    {recommendedBooks.map((book) => {
                        return (
                            <Link href={`/book/${book.id}`} key={book.id}>
                                <div className="for-you__recommended--books-link">
                                    {book.subscriptionRequired && (
                                        <div className="subscription-pill">Premium</div>
                                    )}
                                    <figure className="book__image--wrapper" style={{ marginBottom: "8px" }}>
                                        <Image className="book__image" src={book.imageLink} alt="book" style={{ display: "block" }} width={100} height={100}/>
                                    </figure>
                                    <div className="recommended__book--title">{book.title}</div>
                                    <div className="recommended__book--author">{book.author}</div>
                                    <div className="recommended__book--sub-title">{book.subTitle}</div>
                                    <div className="recommended__book--details-wrapper">
                                        <div className="recommended__book--details">
                                            <div className="recommended__book--details-text">{book.duration}</div>
                                        </div>
                                        <div className="recommended__book--details">
                                            <div className="recommended__book--details-text">{book.averageRating}</div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    );
}

export default RecommendedBooks;