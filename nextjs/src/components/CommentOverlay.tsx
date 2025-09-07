"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";

interface Comment {
    id: string;
    text: string;
    top: number;
    left: number;
    speed: number;
}

interface CommentOverlayProps {
    onAddCommentRef?: (addCommentFn: (comment: string) => void) => void;
}

const CommentOverlay: React.FC<CommentOverlayProps> = ({ onAddCommentRef }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const commentIdCounter = useRef(0);

    // コメントを追加する関数
    const addComment = useCallback((text: string) => {
        if (!containerRef.current) return;

        const containerHeight = containerRef.current.offsetHeight;
        const containerWidth = containerRef.current.offsetWidth;

        // ランダムな高さを生成（上下に少し余白を設ける）
        const randomTop = Math.random() * (containerHeight - 100) + 50;

        // ランダムな速度を生成（1-3秒で画面を横断）
        const randomSpeed = Math.random() * 2 + 4;

        const newComment: Comment = {
            id: `comment-${++commentIdCounter.current}`,
            text,
            top: randomTop,
            left: containerWidth,
            speed: randomSpeed,
        };

        setComments((prev) => [...prev, newComment]);

        // アニメーション終了後にコメントを削除
        setTimeout(() => {
            setComments((prev) => prev.filter((comment) => comment.id !== newComment.id));
        }, ((containerWidth + 300) / (randomSpeed * 100)) * 1000); // 速度に応じて削除タイミングを調整
    }, []);

    // 親コンポーネントにaddComment関数を渡す
    useEffect(() => {
        if (onAddCommentRef) {
            onAddCommentRef(addComment);
        }
    }, [addComment, onAddCommentRef]);

    return (
        <>
            <div
                ref={containerRef}
                className="fixed inset-0 pointer-events-none overflow-hidden"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10000,
                }}
            >
                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        className="absolute whitespace-nowrap text-white font-bold text-lg select-none comment-slide"
                        style={{
                            top: `${comment.top}px`,
                            left: `${comment.left}px`,
                            animationDuration: `${comment.speed}s`,
                            textShadow:
                                "2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)",
                            zIndex: 1000,
                        }}
                    >
                        {comment.text}
                    </div>
                ))}
            </div>

            <style jsx global>{`
                @keyframes slideLeft {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-200vw);
                    }
                }

                .comment-slide {
                    animation: slideLeft linear forwards;
                }
            `}</style>
        </>
    );
};

export default CommentOverlay;
