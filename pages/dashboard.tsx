import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchSections();
  }, []);

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

  if (!session?.user) {
    return null;
  }

  const day1Sections = sections.filter((s) => s.day === 1).sort((a, b) => a.order - b.order);
  const day2Sections = sections.filter((s) => s.day === 2).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Fanta20 Asta Agosto</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-sm text-gray-700">
                  <strong>{session.user.teamName}</strong>
                </p>
                <p className="text-xs text-gray-600">{session.user.email}</p>
              </div>
              {session.user.isAdmin && (
                <a
                  href="/admin"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Admin
                </a>
              )}
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Day 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Day 1 - Sections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {day1Sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">{section.name}</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Status:{' '}
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          section.status === 'upcoming'
                            ? 'bg-yellow-100 text-yellow-800'
                            : section.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {section.status}
                      </span>
                    </p>
                    <button
                      onClick={() => router.push(`/auction/${section.id}`)}
                      className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Section
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Day 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Day 2 - Sections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {day2Sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">{section.name}</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Status:{' '}
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          section.status === 'upcoming'
                            ? 'bg-yellow-100 text-yellow-800'
                            : section.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {section.status}
                      </span>
                    </p>
                    <button
                      onClick={() => router.push(`/auction/${section.id}`)}
                      className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Section
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
