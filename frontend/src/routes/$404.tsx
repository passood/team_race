import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/$404')({
  component: NotFoundPage,
})

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-400 mb-4">404</h1>
        <p className="text-xl text-slate-300 mb-8">Page Not Found</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-team-500 text-white rounded-lg hover:bg-blue-team-600 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
