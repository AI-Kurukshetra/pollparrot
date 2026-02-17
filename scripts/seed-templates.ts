import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface TemplateQuestion {
  type: string
  title: string
  sort_order: number
  options: { id: string; text: string; order: number }[]
  settings: Record<string, unknown>
  is_required?: boolean
  description?: string
}

interface Template {
  title: string
  description: string
  template_category: string
  questions: TemplateQuestion[]
}

const templates: Template[] = [
  // Template 1: Customer Satisfaction Survey
  {
    title: 'Customer Satisfaction Survey',
    description: 'Measure how satisfied your customers are and identify areas for improvement.',
    template_category: 'customer_feedback',
    questions: [
      {
        type: 'rating',
        title: 'How satisfied are you with our product/service overall?',
        sort_order: 0,
        options: [],
        settings: { maxRating: 5 },
        is_required: true
      },
      {
        type: 'scale',
        title: 'How likely are you to recommend us to a friend or colleague?',
        sort_order: 1,
        options: [],
        settings: { min: 0, max: 10, minLabel: 'Not likely', maxLabel: 'Extremely likely' },
        is_required: true
      },
      {
        type: 'multiple_choice',
        title: 'What do you like most about our product?',
        sort_order: 2,
        options: [
          { id: 'mc1-1', text: 'Ease of use', order: 0 },
          { id: 'mc1-2', text: 'Customer support', order: 1 },
          { id: 'mc1-3', text: 'Price/value', order: 2 },
          { id: 'mc1-4', text: 'Features', order: 3 },
          { id: 'mc1-5', text: 'Reliability', order: 4 },
          { id: 'mc1-6', text: 'Other', order: 5 }
        ],
        settings: {},
        is_required: true
      },
      {
        type: 'checkbox',
        title: 'Which areas need improvement?',
        sort_order: 3,
        options: [
          { id: 'cb1-1', text: 'Speed/Performance', order: 0 },
          { id: 'cb1-2', text: 'User interface', order: 1 },
          { id: 'cb1-3', text: 'Documentation', order: 2 },
          { id: 'cb1-4', text: 'Pricing', order: 3 },
          { id: 'cb1-5', text: 'Customer support', order: 4 },
          { id: 'cb1-6', text: 'Feature set', order: 5 }
        ],
        settings: {},
        is_required: false
      },
      {
        type: 'long_text',
        title: 'Do you have any additional feedback or suggestions?',
        sort_order: 4,
        options: [],
        settings: {},
        is_required: false
      }
    ]
  },

  // Template 2: Employee Engagement Survey
  {
    title: 'Employee Engagement Survey',
    description: 'Understand how engaged and satisfied your team members are at work.',
    template_category: 'employee',
    questions: [
      {
        type: 'scale',
        title: 'I feel valued and appreciated at work.',
        sort_order: 0,
        options: [],
        settings: { min: 1, max: 5, minLabel: 'Strongly disagree', maxLabel: 'Strongly agree' },
        is_required: true
      },
      {
        type: 'scale',
        title: 'I have the tools and resources I need to do my job well.',
        sort_order: 1,
        options: [],
        settings: { min: 1, max: 5, minLabel: 'Strongly disagree', maxLabel: 'Strongly agree' },
        is_required: true
      },
      {
        type: 'multiple_choice',
        title: 'How would you describe the communication in your team?',
        sort_order: 2,
        options: [
          { id: 'mc2-1', text: 'Excellent', order: 0 },
          { id: 'mc2-2', text: 'Good', order: 1 },
          { id: 'mc2-3', text: 'Average', order: 2 },
          { id: 'mc2-4', text: 'Needs improvement', order: 3 },
          { id: 'mc2-5', text: 'Poor', order: 4 }
        ],
        settings: {},
        is_required: true
      },
      {
        type: 'checkbox',
        title: 'What benefits matter most to you?',
        sort_order: 3,
        options: [
          { id: 'cb2-1', text: 'Health insurance', order: 0 },
          { id: 'cb2-2', text: 'Remote work flexibility', order: 1 },
          { id: 'cb2-3', text: 'Professional development', order: 2 },
          { id: 'cb2-4', text: 'Paid time off', order: 3 },
          { id: 'cb2-5', text: 'Retirement benefits', order: 4 },
          { id: 'cb2-6', text: 'Team events', order: 5 }
        ],
        settings: {},
        is_required: false
      },
      {
        type: 'rating',
        title: 'How would you rate your work-life balance?',
        sort_order: 4,
        options: [],
        settings: { maxRating: 5 },
        is_required: true
      },
      {
        type: 'long_text',
        title: 'What is one thing we could do to make this a better place to work?',
        sort_order: 5,
        options: [],
        settings: {},
        is_required: false
      }
    ]
  },

  // Template 3: Event Feedback Survey
  {
    title: 'Event Feedback Survey',
    description: 'Collect attendee feedback to make your next event even better.',
    template_category: 'events',
    questions: [
      {
        type: 'rating',
        title: 'How would you rate the event overall?',
        sort_order: 0,
        options: [],
        settings: { maxRating: 5 },
        is_required: true
      },
      {
        type: 'multiple_choice',
        title: 'How did you hear about this event?',
        sort_order: 1,
        options: [
          { id: 'mc3-1', text: 'Email invitation', order: 0 },
          { id: 'mc3-2', text: 'Social media', order: 1 },
          { id: 'mc3-3', text: 'Word of mouth', order: 2 },
          { id: 'mc3-4', text: 'Company website', order: 3 },
          { id: 'mc3-5', text: 'Other', order: 4 }
        ],
        settings: {},
        is_required: true
      },
      {
        type: 'scale',
        title: 'How relevant was the content to your needs?',
        sort_order: 2,
        options: [],
        settings: { min: 1, max: 5, minLabel: 'Not relevant', maxLabel: 'Very relevant' },
        is_required: true
      },
      {
        type: 'multiple_choice',
        title: 'Would you attend this event again?',
        sort_order: 3,
        options: [
          { id: 'mc3-6', text: 'Yes', order: 0 },
          { id: 'mc3-7', text: 'No', order: 1 },
          { id: 'mc3-8', text: 'Maybe', order: 2 }
        ],
        settings: {},
        is_required: true
      },
      {
        type: 'long_text',
        title: 'What could we improve for next time?',
        sort_order: 4,
        options: [],
        settings: {},
        is_required: false
      }
    ]
  },

  // Template 4: Product Research Survey
  {
    title: 'Product Research Survey',
    description: 'Gather insights about your product from users to guide your roadmap.',
    template_category: 'product',
    questions: [
      {
        type: 'dropdown',
        title: 'How long have you been using our product?',
        sort_order: 0,
        options: [
          { id: 'dd4-1', text: 'Less than a month', order: 0 },
          { id: 'dd4-2', text: '1-3 months', order: 1 },
          { id: 'dd4-3', text: '3-6 months', order: 2 },
          { id: 'dd4-4', text: '6-12 months', order: 3 },
          { id: 'dd4-5', text: 'Over a year', order: 4 }
        ],
        settings: {},
        is_required: true
      },
      {
        type: 'checkbox',
        title: 'Which features do you use most often?',
        sort_order: 1,
        options: [
          { id: 'cb4-1', text: 'Dashboard', order: 0 },
          { id: 'cb4-2', text: 'Reports', order: 1 },
          { id: 'cb4-3', text: 'Integrations', order: 2 },
          { id: 'cb4-4', text: 'Collaboration tools', order: 3 },
          { id: 'cb4-5', text: 'Mobile app', order: 4 },
          { id: 'cb4-6', text: 'API', order: 5 }
        ],
        settings: {},
        is_required: true
      },
      {
        type: 'rating',
        title: 'How easy is the product to use?',
        sort_order: 2,
        options: [],
        settings: { maxRating: 5 },
        is_required: true
      },
      {
        type: 'scale',
        title: 'How likely are you to continue using our product?',
        sort_order: 3,
        options: [],
        settings: { min: 1, max: 10, minLabel: 'Very unlikely', maxLabel: 'Very likely' },
        is_required: true
      },
      {
        type: 'multiple_choice',
        title: 'Compared to alternatives, our product is:',
        sort_order: 4,
        options: [
          { id: 'mc4-1', text: 'Much better', order: 0 },
          { id: 'mc4-2', text: 'Somewhat better', order: 1 },
          { id: 'mc4-3', text: 'About the same', order: 2 },
          { id: 'mc4-4', text: 'Somewhat worse', order: 3 },
          { id: 'mc4-5', text: 'Much worse', order: 4 }
        ],
        settings: {},
        is_required: true
      },
      {
        type: 'short_text',
        title: 'What is the one feature you wish we had?',
        sort_order: 5,
        options: [],
        settings: {},
        is_required: false
      },
      {
        type: 'long_text',
        title: 'Any other feedback about the product?',
        sort_order: 6,
        options: [],
        settings: {},
        is_required: false
      }
    ]
  },

  // Template 5: Course Evaluation Survey
  {
    title: 'Course Evaluation Survey',
    description: 'Get student feedback on courses to improve teaching and curriculum.',
    template_category: 'education',
    questions: [
      {
        type: 'rating',
        title: 'How would you rate this course overall?',
        sort_order: 0,
        options: [],
        settings: { maxRating: 5 },
        is_required: true
      },
      {
        type: 'scale',
        title: 'The course content was well-organized and easy to follow.',
        sort_order: 1,
        options: [],
        settings: { min: 1, max: 5, minLabel: 'Strongly disagree', maxLabel: 'Strongly agree' },
        is_required: true
      },
      {
        type: 'multiple_choice',
        title: 'What was the most valuable part of this course?',
        sort_order: 2,
        options: [
          { id: 'mc5-1', text: 'Lectures', order: 0 },
          { id: 'mc5-2', text: 'Hands-on exercises', order: 1 },
          { id: 'mc5-3', text: 'Group discussions', order: 2 },
          { id: 'mc5-4', text: 'Reading materials', order: 3 },
          { id: 'mc5-5', text: 'Guest speakers', order: 4 },
          { id: 'mc5-6', text: 'Final project', order: 5 }
        ],
        settings: {},
        is_required: true
      },
      {
        type: 'multiple_choice',
        title: 'Would you recommend this course to others?',
        sort_order: 3,
        options: [
          { id: 'mc5-7', text: 'Yes, definitely', order: 0 },
          { id: 'mc5-8', text: 'Yes, with some reservations', order: 1 },
          { id: 'mc5-9', text: 'No', order: 2 }
        ],
        settings: {},
        is_required: true
      },
      {
        type: 'long_text',
        title: 'What suggestions do you have for improving this course?',
        sort_order: 4,
        options: [],
        settings: {},
        is_required: false
      }
    ]
  },

  // Template 6: Market Research Survey
  {
    title: 'Market Research Survey',
    description: 'Understand your target market, customer preferences, and buying behavior.',
    template_category: 'market_research',
    questions: [
      {
        type: 'dropdown',
        title: 'What is your age range?',
        sort_order: 0,
        options: [
          { id: 'dd6-1', text: '18-24', order: 0 },
          { id: 'dd6-2', text: '25-34', order: 1 },
          { id: 'dd6-3', text: '35-44', order: 2 },
          { id: 'dd6-4', text: '45-54', order: 3 },
          { id: 'dd6-5', text: '55-64', order: 4 },
          { id: 'dd6-6', text: '65+', order: 5 }
        ],
        settings: {},
        is_required: true
      },
      {
        type: 'multiple_choice',
        title: 'How often do you purchase products in this category?',
        sort_order: 1,
        options: [
          { id: 'mc6-1', text: 'Weekly', order: 0 },
          { id: 'mc6-2', text: 'Monthly', order: 1 },
          { id: 'mc6-3', text: 'A few times a year', order: 2 },
          { id: 'mc6-4', text: 'Once a year', order: 3 },
          { id: 'mc6-5', text: 'Rarely/Never', order: 4 }
        ],
        settings: {},
        is_required: true
      },
      {
        type: 'checkbox',
        title: 'What factors influence your purchasing decisions?',
        sort_order: 2,
        options: [
          { id: 'cb6-1', text: 'Price', order: 0 },
          { id: 'cb6-2', text: 'Quality', order: 1 },
          { id: 'cb6-3', text: 'Brand reputation', order: 2 },
          { id: 'cb6-4', text: 'Reviews/Recommendations', order: 3 },
          { id: 'cb6-5', text: 'Convenience', order: 4 },
          { id: 'cb6-6', text: 'Customer service', order: 5 }
        ],
        settings: {},
        is_required: true
      },
      {
        type: 'scale',
        title: 'How important is price when making a purchase decision?',
        sort_order: 3,
        options: [],
        settings: { min: 1, max: 5, minLabel: 'Not important', maxLabel: 'Very important' },
        is_required: true
      },
      {
        type: 'short_text',
        title: 'What brands do you currently use for this type of product?',
        sort_order: 4,
        options: [],
        settings: {},
        is_required: false
      },
      {
        type: 'long_text',
        title: 'Is there anything missing from the current market that you wish existed?',
        sort_order: 5,
        options: [],
        settings: {},
        is_required: false
      }
    ]
  }
]

async function seedTemplates() {
  console.log('🌱 Seeding templates...\n')

  // First, get ANY existing user to set as the template owner
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)

  if (usersError) {
    console.error('❌ Error fetching users:', usersError.message)
    process.exit(1)
  }

  if (!users || users.length === 0) {
    console.error('❌ No users found. Please sign up at least one user first.')
    process.exit(1)
  }

  const userId = users[0].id
  console.log(`📧 Using user ID: ${userId}\n`)

  // Delete existing templates first (clean slate)
  console.log('🗑️  Deleting existing templates...')

  // First delete questions for template surveys
  const { data: existingTemplates } = await supabase
    .from('surveys')
    .select('id')
    .eq('is_template', true)

  if (existingTemplates && existingTemplates.length > 0) {
    const templateIds = existingTemplates.map(t => t.id)

    const { error: deleteQuestionsError } = await supabase
      .from('questions')
      .delete()
      .in('survey_id', templateIds)

    if (deleteQuestionsError) {
      console.error('⚠️  Error deleting template questions:', deleteQuestionsError.message)
    }
  }

  // Then delete template surveys
  const { error: deleteError } = await supabase
    .from('surveys')
    .delete()
    .eq('is_template', true)

  if (deleteError) {
    console.error('⚠️  Error deleting old templates:', deleteError.message)
  } else {
    console.log('✅ Old templates deleted\n')
  }

  // Insert each template
  let successCount = 0

  for (const template of templates) {
    const { questions, ...surveyData } = template

    // Create survey (store template_category in settings since column doesn't exist)
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .insert({
        user_id: userId,
        title: surveyData.title,
        description: surveyData.description,
        status: 'active',
        is_template: true,
        settings: {
          allowAnonymous: true,
          showProgressBar: true,
          shuffleQuestions: false,
          oneQuestionPerPage: false,
          limitResponses: null,
          closingDate: null,
          completionMessage: 'Thank you for completing this survey!',
          collectEmail: false,
          templateCategory: surveyData.template_category
        }
      })
      .select()
      .single()

    if (surveyError) {
      console.error(`❌ Error creating template "${surveyData.title}":`, surveyError.message)
      continue
    }

    console.log(`✅ Created template: ${surveyData.title}`)
    console.log(`   ID: ${survey.id}`)

    // Create questions for this template
    const questionsToInsert = questions.map(q => ({
      survey_id: survey.id,
      type: q.type,
      title: q.title,
      description: q.description || '',
      is_required: q.is_required ?? true,
      sort_order: q.sort_order,
      options: q.options,
      settings: q.settings
    }))

    const { error: questionsError } = await supabase
      .from('questions')
      .insert(questionsToInsert)

    if (questionsError) {
      console.error(`   ❌ Error creating questions:`, questionsError.message)
    } else {
      console.log(`   ✅ Added ${questions.length} questions`)
      successCount++
    }

    console.log('')
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`\n🎉 Template seeding complete!`)
  console.log(`   ${successCount}/${templates.length} templates created successfully\n`)

  // Verify templates exist
  const { data: verifyTemplates, error: verifyError } = await supabase
    .from('surveys')
    .select('id, title, settings, questions(count)')
    .eq('is_template', true)

  if (verifyError) {
    console.error('❌ Verification error:', verifyError.message)
  } else {
    console.log('📋 Verification - Templates in database:')
    verifyTemplates?.forEach(t => {
      const questionCount = (t.questions as unknown as { count: number }[])?.[0]?.count || 0
      const category = (t.settings as Record<string, unknown>)?.templateCategory || 'unknown'
      console.log(`   • ${t.title} (${category}) - ${questionCount} questions`)
    })
  }
}

seedTemplates().catch(console.error)
