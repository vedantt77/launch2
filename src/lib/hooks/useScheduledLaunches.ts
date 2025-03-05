import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Launch } from '@/lib/types/launch';

export function useScheduledLaunches() {
  const [scheduledLaunches, setScheduledLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScheduledLaunches() {
      try {
        // Get the start and end of the current week
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        // Query Firestore for approved startups scheduled for this week
        const startupsRef = collection(db, 'startups');
        const q = query(
          startupsRef,
          where('status', '==', 'approved'),
          where('scheduledLaunchDate', '>=', Timestamp.fromDate(startOfWeek)),
          where('scheduledLaunchDate', '<=', Timestamp.fromDate(endOfWeek))
        );

        const querySnapshot = await getDocs(q);
        const launches: Launch[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          launches.push({
            id: doc.id,
            name: data.name,
            logo: data.logoUrl,
            description: data.description,
            launchDate: data.scheduledLaunchDate.toDate().toISOString(),
            website: data.url,
            category: 'New Launch',
            listingType: 'regular',
            doFollowBacklink: true
          });
        });

        setScheduledLaunches(launches);
      } catch (err) {
        console.error('Error fetching scheduled launches:', err);
        setError('Failed to fetch scheduled launches');
      } finally {
        setLoading(false);
      }
    }

    fetchScheduledLaunches();
  }, []);

  return { scheduledLaunches, loading, error };
}