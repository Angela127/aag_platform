import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Users, ArrowRight, CheckCircle2 } from 'lucide-react';

function getAvatarColor(name) {
  const colors = [
    'bg-aag-primary', 'bg-rose-600', 'bg-amber-600',
    'bg-emerald-600', 'bg-indigo-600', 'bg-violet-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function ProfileSimilarity({ currentClient, allClients }) {
  const navigate = useNavigate();

  const similarClients = useMemo(() => {
    if (!currentClient || !allClients || allClients.length === 0) return [];

    const scored = allClients.map(other => {
      let score = 0;
      let maxScore = 0;
      const traits = [];

      // 1. Occupation Match (Weight: 30)
      maxScore += 30;
      if (currentClient.occupation && other.occupation) {
        const occ1 = currentClient.occupation.toLowerCase().trim();
        const occ2 = other.occupation.toLowerCase().trim();
        if (occ1 === occ2) {
          score += 30;
          traits.push(`Same occupation (${currentClient.occupation})`);
        } else if (occ1.includes(occ2) || occ2.includes(occ1)) {
          score += 20;
          traits.push(`Similar field (${other.occupation})`);
        }
      }

      // 2. Age Similarity (Weight: 20)
      maxScore += 20;
      if (currentClient.age && other.age) {
        const ageDiff = Math.abs(currentClient.age - other.age);
        if (ageDiff <= 3) {
          score += 20;
          traits.push('Very close age group');
        } else if (ageDiff <= 6) {
          score += 15;
          traits.push('Similar age range');
        } else if (ageDiff <= 10) {
          score += 10;
          traits.push('Within 10 years');
        }
      }

      // 3. Risk Level Match (Weight: 25)
      maxScore += 25;
      if (currentClient.riskLevel && other.riskLevel) {
        if (currentClient.riskLevel.toLowerCase() === other.riskLevel.toLowerCase()) {
          score += 25;
          traits.push(`Same risk profile (${currentClient.riskLevel})`);
        } else if (
          (currentClient.riskLevel.toLowerCase() === 'medium' && (other.riskLevel.toLowerCase() === 'low' || other.riskLevel.toLowerCase() === 'high')) ||
          (other.riskLevel.toLowerCase() === 'medium' && (currentClient.riskLevel.toLowerCase() === 'low' || currentClient.riskLevel.toLowerCase() === 'high'))
        ) {
          score += 10;
        }
      }

      // 4. Plan/Goals Match (Weight: 25)
      maxScore += 25;
      const c1Plans = (currentClient.plans || []).map(p => (p.name || '').toLowerCase());
      const c2Plans = (other.plans || []).map(p => (p.name || '').toLowerCase());
      
      if (c1Plans.length > 0 && c2Plans.length > 0) {
        let matchingPlanCount = 0;
        c1Plans.forEach(p1 => {
          if (c2Plans.some(p2 => p2.includes(p1) || p1.includes(p2))) {
            matchingPlanCount++;
          }
        });
        if (matchingPlanCount > 0) {
          score += Math.min(25, matchingPlanCount * 12.5);
          traits.push('Overlapping policy profiles');
        }
      } else if (c1Plans.length === 0 && c2Plans.length === 0) {
        score += 15;
        traits.push('Both new/unstructured portfolios');
      }

      const matchPercentage = Math.round((score / maxScore) * 100);

      // Generate a dynamic advisory recommendation
      let recommendation = '';
      const otherPlanNames = (other.plans || []).map(p => p.name);
      const currentPlanNames = (currentClient.plans || []).map(p => p.name);
      
      const missingPlans = otherPlanNames.filter(p => !currentPlanNames.includes(p));

      if (missingPlans.length > 0) {
        recommendation = `Propose ${missingPlans[0]} next. ${other.name} has this plan and matches profiles.`;
      } else if (other.riskLevel === currentClient.riskLevel && other.activePlans > currentClient.activePlans) {
        recommendation = `Review asset growth strategies. ${other.name} has a larger structured portfolio with ${other.riskLevel} risk.`;
      } else {
        recommendation = `Use ${other.name}'s wealth protection structure as a blueprint for ${currentClient.name}.`;
      }

      return {
        client: other,
        matchPercentage,
        traits,
        recommendation
      };
    });

    // Sort by match percentage desc and filter for at least 50% match
    return scored
      .filter(item => item.matchPercentage >= 50)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 3); // Top 3
  }, [currentClient, allClients]);

  if (similarClients.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-aag-primary" />
          <h3 className="text-sm font-semibold text-gray-900">Profile Similarity Insights</h3>
        </div>
        <span className="text-[10px] bg-aag-primary/10 text-aag-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Advisor Helper
        </span>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-xs text-gray-500 leading-relaxed">
          The following clients share similar demographics, risk limits, and financial structures. 
          Use their active setups to cross-reference strategies or templates.
        </p>

        <div className="space-y-3">
          {similarClients.map(({ client, matchPercentage, traits, recommendation }) => {
            const initials = client.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);
            const avatarColor = getAvatarColor(client.name);
            const isHighMatch = matchPercentage >= 75;

            return (
              <div 
                key={client.id} 
                className="border border-gray-100 rounded-xl p-3.5 hover:border-aag-primary/20 hover:bg-gray-50/50 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <button
                    onClick={() => navigate(`/clients/${client.id}`)}
                    className="flex items-center gap-2.5 text-left group/btn hover:opacity-90 cursor-pointer"
                  >
                    <div className={`${avatarColor} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm`}>
                      {initials}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-800 group-hover:text-aag-primary transition-colors flex items-center gap-1">
                        {client.name}
                        <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-aag-primary" />
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        {client.occupation} · {client.age} y/o
                      </span>
                    </div>
                  </button>

                  <div className="text-right">
                    <span className={`text-xs font-extrabold ${isHighMatch ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'} px-2 py-0.5 rounded-md`}>
                      {matchPercentage}% Match
                    </span>
                  </div>
                </div>

                {/* Match Details */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {traits.map((trait, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                    >
                      {trait}
                    </span>
                  ))}
                </div>

                {/* Advisor Recommendation */}
                <div className="bg-amber-50/50 border border-amber-100/60 rounded-lg p-2.5 flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 leading-normal font-medium">
                    {recommendation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

ProfileSimilarity.propTypes = {
  currentClient: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    age: PropTypes.number,
    occupation: PropTypes.string,
    riskLevel: PropTypes.string,
    activePlans: PropTypes.number,
    plans: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string
      })
    )
  }).isRequired,
  allClients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      age: PropTypes.number,
      occupation: PropTypes.string,
      riskLevel: PropTypes.string,
      activePlans: PropTypes.number,
      plans: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string
        })
      )
    })
  ).isRequired
};
