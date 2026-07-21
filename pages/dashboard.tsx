import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AuctionSection {
  id: string;
  name: string;
  day: number;
  order: number;
  status: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sections, setSections] = useState<AuctionSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [budgetRemaining, setBudgetRemaining] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchSections();
    }
  }, [session]);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/sections');
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Fanta20 Asta Agosto</h1>
            </div>
            <div className="flex items-center space-x-4">
              {session?.user?.isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Team Info Card */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Team: {session?.user?.teamName}</h2>
            <p className="text-sm text-gray-600 mt-2">Email: {session?.user?.email}</p>
          </div>
        </div>

        {/* Budget Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">€0.00</p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <p className="text-sm font-medium text-gray-600">Reserved</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">€0.00</p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="mt-2 text-3xl font-bold text-green-600">€0.00</p>
            </div>
          </div>
        </div>

        {/* Auction Sections */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Auction Sections</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {sections.length === 0 ? (
              <div className="px-6 py-4 text-center text-gray-600">
                No auction sections available yet.
              </div>
            ) : (
              sections.map((section) => (
                <div
                  key={section.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <h3 className="text-base font-medium text-gray-900">{section.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Day {section.day} • Round {section.order}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        section.status === 'upcoming'
                          ? 'bg-yellow-100 text-yellow-800'
                          : section.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {section.status}
                    </span>
                    {section.status === 'active' && (
                      <Link
                        href={`/auction/${section.id}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Place Bids
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
