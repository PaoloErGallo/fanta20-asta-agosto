import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Fanta20 Asta Agosto</h1>
            </div>
            {!session && (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Football Auction Platform
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Welcome to Fanta20 Asta Agosto - Your interactive fantasy football auction platform
          </p>
          <p className="mt-4 text-sm text-gray-600">
            Place sealed bids on players across multiple auction sections. Manage your budget and
            build your fantasy team strategically.
          </p>
          <div className="mt-8 space-y-4">
            <Link
              href="/auth/register"
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
