import { AilmentDetail } from '@/lib/db/ailments'
import SafetyCheckRow from './SafetyCheckRow'
import WhatToDoNow from './WhatToDoNow'
import DeepDiveAccordion from './DeepDiveAccordion'
import RelatedAilments from './RelatedAilments'

export default function AilmentScaffold({ ailment }: { ailment: AilmentDetail }) {
  return (
    <div className="min-h-screen bg-[#F9FAFF] rounded-3xl md:mt-2">
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-40 space-y-6">
        
        <div className="mb-2">
          <h1 className="text-[28px] font-extrabold text-[#101828] mb-3 leading-tight tracking-tight">
            {ailment.common_name}
          </h1>
          <p className="text-[16px] text-[#475467] leading-relaxed">
            {ailment.two_line_summary || ailment.overview}
          </p>
        </div>

        {ailment.what_to_do_now && ailment.what_to_do_now.length > 0 && (
          <WhatToDoNow steps={ailment.what_to_do_now} />
        )}

        {((ailment.triage && ailment.triage.length > 0) || ailment.when_to_seek_help) && (
          <SafetyCheckRow triage={ailment.triage || []} whenToSeekHelp={ailment.when_to_seek_help} />
        )}

        {(ailment.overview || ailment.causes || ailment.symptoms_detail) && (
          <DeepDiveAccordion
            overview={ailment.overview}
            causes={ailment.causes}
            symptomsDetail={ailment.symptoms_detail}
            whenToSeekHelp={null} // Moved to Safety Check
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
