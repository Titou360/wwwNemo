import { Head } from 'vite-react-ssg'

export default function NotFound() {
  return (
    <>
      <Head><meta name="robots" content="noindex" /></Head>
      <main className="min-h-screen bg-nemo-bg dark:bg-nemo-dark-bg pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="font-syne font-extrabold text-9xl text-nemo-orange mb-4" aria-hidden="true">404</p>
          <h1 className="font-syne font-bold text-3xl text-nemo-dark-bg dark:text-nemo-bg mb-4">Page introuvable</h1>
          <p className="font-jakarta text-nemo-dark-bg/60 dark:text-nemo-bg/60 mb-6">La page que vous cherchez n'existe pas ou a été déplacée.</p>
          <a href="/" className="btn-primary">Retour à l'accueil</a>
        </div>
      </main>
    </>
  )
}
