import { AilmentDetail } from '@/lib/db/ailments'
import AilmentHeroBanner from './AilmentHeroBanner'
import SafetyCheckRow from './SafetyCheckRow'
import WhatToDoNow from './WhatToDoNow'
import DeepDiveAccordion from './DeepDiveAccordion'
import RelatedAilments from './RelatedAilments'

export default function AilmentScaffold({ ailment }: { ailment: AilmentDetail }) {
  const primaryTag = ailment.condition_tags?.[0] || 'general'

  return (
    <div className="min-h-screen bg-surface">
      <AilmentHeroBanner
        name={ailment.common_name}
        summary={ailment.two_line_summary}
        primaryTag={primaryTag}
      />

      <div className="max-w-2xl mx-auto px-6 pt-6 pb-36 space-y-4">
        <SafetyCheckRow triage={ailment.triage || []} />

        <WhatToDoNow steps={ailment.what_to_do_now || []} />

        {(ailment.overview || ailment.causes || ailment.symptoms_detail) && (
          <DeepDiveAccordion
            overview={ailment.overview}
            causes={ailment.causes}
            symptomsDetail={ailment.symptoms_detail}
            whenToSeekHelp={ailment.when_to_seek_help}
            sourceUrl={ailment.healthify_url}
            lastReviewed={ailment.last_reviewed_date}
          />
        )}

        {ailment.related_ailments?.length > 0 && (
          <RelatedAilments names={ailment.related_ailments} />
        )}
      </div>
    </div>
  )
}
