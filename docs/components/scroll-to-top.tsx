'use client'
import { useState, useEffect, useRef } from "react"
import { ArrowUp } from "lucide-react"

export function ScrollToTop() {
    const [isVisible, setVisibility] = useState(false)
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        function handleScroll() {
            setVisibility(false)
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }
            scrollTimeoutRef.current = setTimeout(() => {
                const shouldBeVisible = window.scrollY > 200
                setVisibility(shouldBeVisible)
            }, 300)
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }
        }
    }, [])
    
    return (
        isVisible && (
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Scroll to top"
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    zIndex: 50,
                }}
                className="p-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-600 shadow-lg hover:bg-gray-700 hover:text-white transition-all duration-300"
            >
                <ArrowUp className="size-6" />
            </button>
        )
    )
}
