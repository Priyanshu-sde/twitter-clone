'use client'

import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import {  useCallback, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { api } from "~/trpc/react";

function updateTextAreaSize(textArea? : HTMLTextAreaElement) {
    if(textArea == null) return
    textArea.style.height = "0"
    textArea.style.height = `${textArea.scrollHeight}px`
}

function Form(){
    const session = useSession()
    const [inputValue, setInputValue] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const inputRef = useCallback((textArea : HTMLTextAreaElement) => {
        updateTextAreaSize(textArea);
        textAreaRef.current = textArea;

    }, [])

useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current)
},[inputValue])     

const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
        console.log(newTweet);
        setInputValue("");
    } })

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        createTweet.mutate({content : inputValue});
    }




    return <form className="flex flex-col gap-2 border-b px-4 py-2">
        <div className="flex gap-4">
            <ProfileImage src={session.data.user.image}/>
            <textarea 
            ref={inputRef}
            style={{height : 0}}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none" placeholder="What's Happening"/>
        </div>
        <Button className="self-end" onClick={handleSubmit}>Tweet</Button>

    </form>
}

export function NewTweetForm() {
    const session = useSession();
    if(session.status !== "authenticated") return;

    return<Form/>
}