// Suspense boundary for the login page (it reads the URL at request time).
export default function LoadingLogin() {
  return <main className="flex-1" aria-busy="true" />;
}
