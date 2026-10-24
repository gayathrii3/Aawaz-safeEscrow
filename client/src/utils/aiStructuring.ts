import { StructuredEvent } from '../types';

export interface AIStructuringResult {
  summary: string;
  events: StructuredEvent[];
  identifiedCategories: string[];
  safetyNotice: boolean;
  unclearItems?: string[];
}

/**
 * Trauma-Informed AI Incident Structuring Engine
 * Analyzes unstructured survivor text and transforms it into an objective, factual timeline.
 */
export async function structureIncidentWithAI(
  narrative: string,
  accusedRole?: string
): Promise<AIStructuringResult> {
  // Simulate AI parsing delay with natural empathy
  await new Promise(res => setTimeout(res, 900));

  const lower = narrative.toLowerCase();
  const events: StructuredEvent[] = [];
  const categories = new Set<string>();

  // Determine behavior categories
  if (lower.includes('touch') || lower.includes('shoulder') || lower.includes('arm') || lower.includes('hug') || lower.includes('corner')) {
    categories.add('unwanted_contact');
  }
  if (lower.includes('message') || lower.includes('text') || lower.includes('call') || lower.includes('whatsapp') || lower.includes('late')) {
    categories.add('repeated_unsolicited_contact');
  }
  if (lower.includes('appraisal') || lower.includes('rating') || lower.includes('promote') || lower.includes('internship') || lower.includes('praise') || lower.includes('favor')) {
    categories.add('quid_pro_quo_coercion');
  }
  if (lower.includes('comment') || lower.includes('dress') || lower.includes('look') || lower.includes('personal') || lower.includes('compliment')) {
    categories.add('verbal_harassment');
  }

  // Split narrative by paragraphs or sentence blocks for timeline approximation
  const sentences = narrative
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 15);

  if (sentences.length <= 1) {
    events.push({
      id: 'evt-1',
      dateOrPeriod: 'Reported Timeline',
      location: lower.includes('office') ? 'Office Premises' : (lower.includes('call') || lower.includes('zoom') ? 'Remote Communication' : 'Workplace Context'),
      description: narrative,
      behaviorCategory: categories.has('unwanted_contact') ? 'unwanted_contact' : 'verbal_harassment',
      witnesses: lower.includes('meeting') ? 'Team members present' : 'None specified',
      evidenceMentioned: lower.includes('message') || lower.includes('screenshot') ? 'Digital correspondence / messages' : 'Direct observation'
    });
  } else {
    sentences.forEach((sentence, index) => {
      let cat: StructuredEvent['behaviorCategory'] = 'other';
      const sLower = sentence.toLowerCase();
      if (sLower.includes('touch') || sLower.includes('shoulder') || sLower.includes('physical')) {
        cat = 'unwanted_contact';
      } else if (sLower.includes('internship') || sLower.includes('grade') || sLower.includes('career') || sLower.includes('project')) {
        cat = 'quid_pro_quo';
      } else if (sLower.includes('message') || sLower.includes('chat') || sLower.includes('call') || sLower.includes('text')) {
        cat = 'cyber_stalking';
      } else if (sLower.includes('comment') || sLower.includes('said') || sLower.includes('remark')) {
        cat = 'verbal_harassment';
      }

      events.push({
        id: `evt-${index + 1}`,
        dateOrPeriod: index === 0 ? 'Initial Occurrence' : (index === sentences.length - 1 ? 'Most Recent Incident' : `Incident ${index + 1}`),
        location: sLower.includes('meeting') ? 'Conference Room / Meeting' : (sLower.includes('desk') ? 'Workstation' : 'Workplace Environment'),
        description: sentence,
        behaviorCategory: cat,
        witnesses: sLower.includes('colleague') || sLower.includes('others') ? 'Colleagues nearby' : 'Not recorded',
        evidenceMentioned: sLower.includes('screenshot') || sLower.includes('text') || sLower.includes('email') ? 'Retained digital exchanges' : undefined
      });
    });
  }

  const categoryList = Array.from(categories);
  if (categoryList.length === 0) categoryList.push('inappropriate_conduct');

  return {
    summary: `Structured record of recurring conduct concerning ${accusedRole || 'the named individual'}. The timeline captures reported interactions, communication patterns, and workplace context.`,
    events,
    identifiedCategories: categoryList,
    safetyNotice: lower.includes('threat') || lower.includes('kill') || lower.includes('violence') || lower.includes('follow home'),
    unclearItems: [
      'Approximate calendar dates or time-of-day for each occurrence, if recalled without distress',
      'Presence of digital records (chat logs, calendar invites, emails) to attach'
    ]
  };
}
