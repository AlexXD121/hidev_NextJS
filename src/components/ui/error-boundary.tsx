"use client"

import { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface Props {
    children?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo)
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null })
        window.location.reload()
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
                    <div className="mb-4 rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                        <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold tracking-tight">
                        Something went wrong
                    </h2>
                    <p className="mb-6 max-w-md text-muted-foreground">
                        We apologize for the inconvenience. An unexpected error occurred.
                    </p>
                    <div className="flex gap-4">
                        <Button onClick={() => window.location.href = '/'} variant="outline">
                            Go Home
                        </Button>
                        <Button onClick={this.handleReset}>
                            Try Again
                        </Button>
                    </div>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <div className="mt-8 max-h-[200px] w-full max-w-lg overflow-auto rounded bg-slate-100 p-4 text-left text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                            <pre>{this.state.error.message}</pre>
                            <pre>{this.state.error.stack}</pre>
                        </div>
                    )}
                </div>
            )
        }

        return this.props.children
    }
}
