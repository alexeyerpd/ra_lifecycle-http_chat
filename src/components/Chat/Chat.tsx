import * as React from 'react';
import {cn} from 'utils/classname';

import {colors} from './colors';

import './Chat.scss';

const block = cn('chat');

interface Message {
    id: number;
    userId: string;
    content: string;
}

export function Chat() {
    const [message, setMessage] = React.useState('');
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [userIds, setUserIds] = React.useState<string[]>([]);

    const contentRef = React.useRef<HTMLDivElement>(null);

    const id = React.useId();
    const userId = getStorageData('userId') || setStorageData('userId', id);

    const onSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();

        if (!message) {
            return;
        }

        fetch('http://localhost:7070/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: 0,
                userId,
                content: message,
            }),
        }).then(() => {
            setMessage('');
        });
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.code === 'Enter') {
            e.preventDefault();
            onSubmit();
        }
    };

    React.useEffect(() => {
        getMessages();
        const iId = setInterval(getMessages, 1000);

        function getMessages() {
            fetch(`http://localhost:7070/messages?from=0`)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    clearInterval(iId);
                    throw new Error('Http wtf');
                })
                .then((respMsgs: Message[]) => {
                    setUserIds((prevUsrIds) => {
                        const ids = [...new Set(respMsgs.map((m) => m.userId))];
                        if (prevUsrIds.length !== ids.length) {
                            return ids;
                        }
                        return prevUsrIds;
                    });

                    setMessages((prevMsgs) => {
                        if (prevMsgs.length === respMsgs.length) {
                            return prevMsgs;
                        }
                        return respMsgs;
                    });
                });
        }
        return () => {
            clearInterval(iId);
        };
    }, []);

    React.useEffect(() => {
        scrollToBottom(contentRef.current);
    }, [messages]);

    return (
        <div className={block()}>
            <h1 className={block('title')}>Anonymous Chat</h1>
            <div ref={contentRef} className={block('messages')}>
                {messages.map(({content, id: msgId, userId: msgUserId}) => {
                    const isMe = msgUserId === userId;
                    return (
                        <div
                            key={msgId}
                            className={block('message', {self: isMe})}
                            style={{
                                color: isMe
                                    ? '#000'
                                    : getColors(userIds.findIndex((uId) => msgUserId === uId)),
                            }}
                        >
                            {content}
                        </div>
                    );
                })}
            </div>
            <form className={block('form')} onSubmit={onSubmit} onKeyDown={onKeyDown}>
                <input
                    className={block('form-input')}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className={block('form-btn-submit')} type="submit">
                    {'>'}
                </button>
            </form>
        </div>
    );
}

function getStorageData(key: string) {
    const value = localStorage.getItem(key);
    if (value === null) {
        return '';
    }
    return value;
}

function setStorageData(key: string, value: any) {
    localStorage.setItem(key, value);
    return value;
}

function scrollToBottom(elem?: HTMLDivElement | null) {
    if (!elem) {
        return;
    }
    if (elem.scrollHeight !== elem.offsetHeight + elem.scrollTop) {
        elem.lastElementChild?.scrollIntoView({behavior: 'smooth'});
    }
}

function getColors(n: number) {
    return colors[n % colors.length] || '#000';
}
