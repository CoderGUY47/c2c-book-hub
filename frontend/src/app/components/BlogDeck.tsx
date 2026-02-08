import React from 'react';
import styles from './BlogDeck.module.css';
import Image from 'next/image';

interface BlogPost {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    imageSrc?: string;
}

interface BlogDeckProps {
    posts: BlogPost[];
}

const BlogDeck: React.FC<BlogDeckProps> = ({ posts }) => {
    // Define rotations for the fan effect: Left, Center, Right
    const rotations = [-15, 5, 25];

    return (
        <div className={styles.container}>
            {posts.map((post, index) => {
                // Use predefined rotation or calculate based on index if more posts
                const rotation = rotations[index % rotations.length];

                return (
                    <div
                        key={index}
                        className={styles.glass}
                        style={{ '--r': rotation } as React.CSSProperties}
                    >
                        <div className={styles.glassContent}>
                            {post.imageSrc && (
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={post.imageSrc}
                                        alt={post.title}
                                        fill
                                        className={styles.glassImage}
                                        sizes="(max-width: 768px) 100vw, 300px"
                                    />
                                </div>
                            )}
                            <div className={`${styles.title} blog-card-title`}>
                                {post.title}
                            </div>
                            <div className={styles.overlay}>
                                <p className={`${styles.description} blog-card-description`}>{post.description}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BlogDeck;
