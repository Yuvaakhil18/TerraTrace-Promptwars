const fs = require('fs');
const files = [
  'src/index.css',
  'src/components/ui/Card.tsx',
  'src/components/ui/Button.tsx',
  'src/components/ui/Badge.tsx',
  'src/components/ui/ProgressBar.tsx',
  'src/components/Layout/Navbar.tsx',
  'src/App.tsx',
  'src/components/Dashboard/EmissionsSummary.tsx',
  'src/components/Dashboard/FootprintScore.tsx',
  'src/components/Dashboard/EmissionsChart.tsx',
  'src/pages/DashboardPage.tsx',
  'src/pages/LogPage.tsx',
  'src/components/Logger/CategoryPicker.tsx',
  'src/components/Logger/ActivityLogger.tsx',
  'src/pages/InsightsPage.tsx',
  'src/components/Insights/GeminiInsights.tsx',
  'src/components/Insights/InsightCard.tsx',
  'src/pages/ChallengePage.tsx',
  'src/components/Challenges/ChallengeBoard.tsx',
  'src/components/Challenges/ChallengeCard.tsx',
  'src/pages/AuthPage.tsx'
];

files.forEach(f => {
  try {
    let txt = fs.readFileSync(f, 'utf-8');
    if (txt.startsWith('"') && txt.endsWith('"')) {
      let fixed = JSON.parse(txt);
      fs.writeFileSync(f, fixed);
      console.log('Fixed ' + f);
    }
  } catch(e) {
    console.error('Error in ' + f + ':', e);
  }
});
