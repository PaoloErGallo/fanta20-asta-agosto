import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Player {
  id: string;
  name: string;
  position: string;
  club: string;
}

interface AuctionSection {
  id: string;
  name: string;
  day: number;
  order: number;
  status: string;
  players: Player[];
}

interface BidData {
  playerId: string;
  amount: number;
  preference: number;
}

export default function AuctionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [section, setSection] = useState<AuctionSection | null>(null);
  const [bids, setBids] = useState<Map<string, BidData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [budgetRemaining, setBudgetRemaining] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (id) {
      fetchSection();
    }
  }, [id]);

  const fetchSection = async () => {
    try {
      const response = await fetch(`/api/sections/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSection(data);
      }
    } catch (error) {
      console.error('Error fetching section:', error);
      setError('Failed to load section');
    } finally {
      setLoading(false);
    }
  };

  const handleBidChange = (
    playerId: string,
    field: 'amount' | 'preference',
    value: string | number
  ) => {
    const bidData = bids.get(playerId) || {
      playerId,
      amount: 0,
      preference: 0,
    };

    if (field === 'amount') {
      bidData.amount = parseFloat(String(value)) || 0;
    } else {
      bidData.preference = parseInt(String(value)) || 0;
    }

    setBids(new Map(bids.set(playerId, bidData)));
  };

  const handleSubmitBids = async () => {
    if (bids.size === 0) {
      setError('Please add at least one bid');
      return;
    }

    const bidsArray = Array.from(bids.values()).map((bid) => ({
      ...bid,
      sectionId: id,
    }));

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/bids/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bids: bidsArray }),
      });

      if (response.ok) {
        const data = await response.json();
        setBudgetRemaining(data.remainingBudget);
        alert('Bids submitted successfully!');
        setBids(new Map());
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit bids');
      }
    } catch (err) {
      setError('Failed to submit bids');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!section) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Section not found</p>
      </div>
    );
  }

  const maxBid = Math.max(...Array.from(bids.values()).map((b) => b.amount));

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">{section.name}</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Place Your Bids ({bids.size} players selected)
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Highest bid will be locked as reserved budget. You can bid on up to 6 players.
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {section.players.map((player) => {
              const playerBid = bids.get(player.id);
              return (
                <div key={player.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{player.name}</h3>
                      <p className="text-sm text-gray-500">
                        {player.position} • {player.club}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bid Amount (€)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={playerBid?.amount || ''}
                        onChange={(e) =>
                          handleBidChange(player.id, 'amount', e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Preference (1-6)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={playerBid?.preference || ''}
                        onChange={(e) =>
                          handleBidChange(player.id, 'preference', e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="1"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Reserved Budget (Max Bid):</p>
                <p className="text-2xl font-bold text-gray-900">€{maxBid.toFixed(2)}</p>
              </div>
              <button
                onClick={handleSubmitBids}
                disabled={submitting || bids.size === 0 || section.status !== 'active'}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Bids'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
