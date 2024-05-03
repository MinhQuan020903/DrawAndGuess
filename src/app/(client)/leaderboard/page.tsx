'use client';

import LeaderBoardComponent from '@/components/leaderboard/LeaderBoardComponent';

// Initial data is read from data.json
// Every 5 seconds, a random entry is selected and its values are incremented

function Page() {
  return <LeaderBoardComponent />;
}

export default Page;
