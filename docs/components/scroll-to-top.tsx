'use client'
import { useState, useEffect, useRef } from "react"
import { ArrowUp } from "lucide-react"

export function ScrollToTop() {
    const [isVisible, setVisibility] = useState(false)
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    function handleScroll() {
        // Hide button immediately when scrolling starts
        setVisibility(false)

        // Clear previous timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
        }

        // Show button after scrolling stops (300ms delay)
        scrollTimeoutRef.current = setTimeout(() => {
            const shouldBeVisible = window.scrollY > 200
            setVisibility(shouldBeVisible)
        }, 300)
    }
    
    useEffect(() => {
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