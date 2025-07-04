import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react"

type ButtonProps = {
    small?: boolean;
    gray? : boolean;
    className?: string;
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>
,HTMLButtonElement>;

export function Button({small,gray,className="",...props} : ButtonProps) {
    const sizeClasses = small ? "px-2 py-1" : "px-4 py-2 font-bold";
    const colorClasses = gray ? "by-gray-400 hover:bg-gray-300 focus-visible:big-gray-300"
    : "bg-blue-500 hover:bg-blue-400 focus-visible:big-blue-400";

    return <button className={`rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses} ${colorClasses} ${className}`} {...props}></button>
}