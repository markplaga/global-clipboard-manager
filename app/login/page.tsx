import { AuthForm } from '@/components/AuthForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GalleryVerticalEnd } from 'lucide-react'

export default function LoginPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <GalleryVerticalEnd className="size-6 text-primary" />
                    Global Clipboard
                </a>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Welcome</CardTitle>
                        <CardDescription>
                            Sign in to access your clipboard snippets across all devices.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AuthForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
