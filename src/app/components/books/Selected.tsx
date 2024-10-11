"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Book {
    id: string;
    title: string;
    author: string;
    duration: string;
    imageLink: string;
    audioLink: string;
    subTitle: string;
}

const Selected: React.FC = () => {
    const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchSelectedBooks = async () => {
        try {
            const response = await axios.get('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected');
            const data = response.data;
            setSelectedBooks(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching selected books:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSelectedBooks();
    }, []);

    if (loading) {
        return (
            <>
                <div className="for-you__title">Selected just for you</div>
                <div className="skeleton__wrapper">
                    <div className="skeleton__item">
                        <div className="skeleton__image" style={{ height: 200, width: 600, minWidth: 180, marginBottom: 20, backgroundColor: "#ddd" }} />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="for-you__title">Selected just for you</div>
            {selectedBooks.map((book) => (
                <div key={book.id}>
                    <audio src={book.audioLink}></audio>
                    <a className="selected__book" href={`/book/${book.id}`}>
                        <div className="selected__book--sub-title">{book.subTitle}</div>
                        <div className="selected__book--line"></div>
                        <div className="selected__book--content">
                            <figure className="book__image--wrapper" style={{ height: 140, width: 140, minWidth: 140 }}>
                                <Image className="book__image" src={book.imageLink} alt={book.title} style={{ display: "block" }} width={100} height={100} />
                            </figure>
                            <div className="selected__book--text">
                                <div className="selected__book--title">{book.title}</div>
                                <div className="selected__book--author">{book.author}</div>
                                <div className="selected__book--duration-wrapper">
                                    <div className="selected__book--icon">
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                                        </svg>
                                    </div>
                                    <div className="selected__book--duration">{book.duration}</div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            ))}
            <div />
        </>
    );
};

export default Selected;