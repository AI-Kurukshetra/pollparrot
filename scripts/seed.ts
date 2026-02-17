/**
 * Database Seed Script
 *
 * Populates the database with test users, template surveys, and mock data.
 * Uses NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local
 *
 * Usage: npm run seed
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/database";

// Load environment variables from .env.local
config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing environment variables");
  console.error("   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper to generate a random share slug
function generateShareSlug(title: string): string {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 15)}-${Date.now().toString(36)}`;
}

// =====================================================
// TEST USERS
// =====================================================
const TEST_USERS = [
  {
    email: "admin@pollparrot.com",
    password: "password123",
    fullName: "Admin User",
    plan: "pro",
  },
  {
    email: "user1@pollparrot.com",
    password: "password123",
    fullName: "Test User One",
    plan: "free",
  },
  {
    email: "user2@pollparrot.com",
    password: "password123",
    fullName: "Test User Two",
    plan: "free",
  },
];

// =====================================================
// TEMPLATE SURVEYS
// =====================================================
const TEMPLATE_SURVEYS = [
  {
    title: "Customer Satisfaction Survey",
    description: "Gather feedback from your customers about their experience with your product or service.",
    category: "customer_feedback",
    questions: [
      {
        type: "rating",
        title: "How satisfied are you with our product/service?",
        is_required: true,
        settings: { maxValue: 5 },
      },
      {
        type: "multiple_choice",
        title: "How did you hear about us?",
        is_required: true,
        options: [
          { id: "1", label: "Search Engine" },
          { id: "2", label: "Social Media" },
          { id: "3", label: "Friend/Referral" },
          { id: "4", label: "Advertisement" },
        ],
        settings: {},
      },
      {
        type: "long_text",
        title: "What could we improve?",
        is_required: false,
        settings: { maxLength: 1000 },
      },
      {
        type: "scale",
        title: "How likely are you to recommend us to a friend?",
        description: "0 = Not at all likely, 10 = Extremely likely",
        is_required: true,
        settings: { minValue: 0, maxValue: 10, minLabel: "Not likely", maxLabel: "Very likely" },
      },
      {
        type: "multiple_choice",
        title: "Would you use our service again?",
        is_required: true,
        options: [
          { id: "1", label: "Yes, definitely" },
          { id: "2", label: "Probably" },
          { id: "3", label: "Not sure" },
          { id: "4", label: "Probably not" },
          { id: "5", label: "Definitely not" },
        ],
        settings: {},
      },
    ],
  },
  {
    title: "Employee Engagement Survey",
    description: "Measure employee satisfaction and engagement in your workplace.",
    category: "employee_engagement",
    questions: [
      {
        type: "scale",
        title: "I feel valued at work",
        is_required: true,
        settings: { minValue: 1, maxValue: 5, minLabel: "Strongly Disagree", maxLabel: "Strongly Agree" },
      },
      {
        type: "multiple_choice",
        title: "How would you rate your work-life balance?",
        is_required: true,
        options: [
          { id: "1", label: "Excellent" },
          { id: "2", label: "Good" },
          { id: "3", label: "Fair" },
          { id: "4", label: "Poor" },
        ],
        settings: {},
      },
      {
        type: "checkbox",
        title: "What benefits are most important to you?",
        is_required: false,
        options: [
          { id: "1", label: "Health Insurance" },
          { id: "2", label: "Remote Work Options" },
          { id: "3", label: "Professional Development" },
          { id: "4", label: "Flexible Hours" },
          { id: "5", label: "Paid Time Off" },
        ],
        settings: {},
      },
      {
        type: "long_text",
        title: "What would make this a better place to work?",
        is_required: false,
        settings: { maxLength: 1000 },
      },
      {
        type: "rating",
        title: "Rate your overall job satisfaction",
        is_required: true,
        settings: { maxValue: 5 },
      },
      {
        type: "dropdown",
        title: "How long have you been with the company?",
        is_required: true,
        options: [
          { id: "1", label: "Less than 1 year" },
          { id: "2", label: "1-2 years" },
          { id: "3", label: "3-5 years" },
          { id: "4", label: "More than 5 years" },
        ],
        settings: {},
      },
    ],
  },
  {
    title: "Event Feedback Survey",
    description: "Collect feedback from attendees after your event or conference.",
    category: "event_feedback",
    questions: [
      {
        type: "rating",
        title: "How would you rate the event overall?",
        is_required: true,
        settings: { maxValue: 5 },
      },
      {
        type: "multiple_choice",
        title: "What was your favorite part of the event?",
        is_required: true,
        options: [
          { id: "1", label: "Keynote Speakers" },
          { id: "2", label: "Networking Opportunities" },
          { id: "3", label: "Workshops/Sessions" },
          { id: "4", label: "Venue/Location" },
        ],
        settings: {},
      },
      {
        type: "multiple_choice",
        title: "Would you attend this event again?",
        is_required: true,
        options: [
          { id: "1", label: "Yes" },
          { id: "2", label: "No" },
          { id: "3", label: "Maybe" },
        ],
        settings: {},
      },
      {
        type: "long_text",
        title: "Any suggestions for improvement?",
        is_required: false,
        settings: { maxLength: 1000 },
      },
      {
        type: "scale",
        title: "How likely are you to recommend this event?",
        is_required: true,
        settings: { minValue: 1, maxValue: 10, minLabel: "Not likely", maxLabel: "Very likely" },
      },
    ],
  },
  {
    title: "Product Research Survey",
    description: "Understand customer needs and preferences for product development.",
    category: "product_research",
    questions: [
      {
        type: "multiple_choice",
        title: "How often do you use products like ours?",
        is_required: true,
        options: [
          { id: "1", label: "Daily" },
          { id: "2", label: "Weekly" },
          { id: "3", label: "Monthly" },
          { id: "4", label: "Rarely" },
        ],
        settings: {},
      },
      {
        type: "checkbox",
        title: "Which features are most important to you?",
        is_required: true,
        options: [
          { id: "1", label: "Ease of Use" },
          { id: "2", label: "Price" },
          { id: "3", label: "Quality" },
          { id: "4", label: "Customer Support" },
          { id: "5", label: "Innovation" },
        ],
        settings: {},
      },
      {
        type: "rating",
        title: "Rate the importance of mobile app support",
        is_required: false,
        settings: { maxValue: 5 },
      },
      {
        type: "scale",
        title: "How much would you pay for this product?",
        description: "Monthly subscription price",
        is_required: true,
        settings: { minValue: 0, maxValue: 100, minLabel: "$0", maxLabel: "$100" },
      },
      {
        type: "dropdown",
        title: "What is your industry?",
        is_required: true,
        options: [
          { id: "1", label: "Technology" },
          { id: "2", label: "Healthcare" },
          { id: "3", label: "Education" },
          { id: "4", label: "Finance" },
          { id: "5", label: "Other" },
        ],
        settings: {},
      },
      {
        type: "short_text",
        title: "Company name (optional)",
        is_required: false,
        settings: { maxLength: 100 },
      },
      {
        type: "long_text",
        title: "What problem are you trying to solve?",
        is_required: false,
        settings: { maxLength: 1000 },
      },
    ],
  },
  {
    title: "Course Evaluation Survey",
    description: "Collect feedback from students about a course or training program.",
    category: "education",
    questions: [
      {
        type: "rating",
        title: "Rate the course content quality",
        is_required: true,
        settings: { maxValue: 5 },
      },
      {
        type: "multiple_choice",
        title: "Was the course difficulty level appropriate?",
        is_required: true,
        options: [
          { id: "1", label: "Too Easy" },
          { id: "2", label: "Just Right" },
          { id: "3", label: "Too Difficult" },
        ],
        settings: {},
      },
      {
        type: "long_text",
        title: "What did you learn from this course?",
        is_required: false,
        settings: { maxLength: 1000 },
      },
      {
        type: "scale",
        title: "Rate the instructor's effectiveness",
        is_required: true,
        settings: { minValue: 1, maxValue: 5, minLabel: "Poor", maxLabel: "Excellent" },
      },
      {
        type: "multiple_choice",
        title: "Would you recommend this course?",
        is_required: true,
        options: [
          { id: "1", label: "Yes" },
          { id: "2", label: "No" },
        ],
        settings: {},
      },
    ],
  },
  {
    title: "Market Research Survey",
    description: "Gather market insights and understand your target audience.",
    category: "market_research",
    questions: [
      {
        type: "multiple_choice",
        title: "What is your age group?",
        is_required: true,
        options: [
          { id: "1", label: "18-24" },
          { id: "2", label: "25-34" },
          { id: "3", label: "35-44" },
          { id: "4", label: "45-54" },
          { id: "5", label: "55+" },
        ],
        settings: {},
      },
      {
        type: "checkbox",
        title: "Which social media platforms do you use?",
        is_required: false,
        options: [
          { id: "1", label: "Facebook" },
          { id: "2", label: "Instagram" },
          { id: "3", label: "Twitter/X" },
          { id: "4", label: "LinkedIn" },
          { id: "5", label: "TikTok" },
        ],
        settings: {},
      },
      {
        type: "dropdown",
        title: "What is your annual household income?",
        is_required: false,
        options: [
          { id: "1", label: "Under $30,000" },
          { id: "2", label: "$30,000 - $60,000" },
          { id: "3", label: "$60,000 - $100,000" },
          { id: "4", label: "Over $100,000" },
        ],
        settings: {},
      },
      {
        type: "scale",
        title: "How important is brand reputation when purchasing?",
        is_required: true,
        settings: { minValue: 1, maxValue: 5, minLabel: "Not important", maxLabel: "Very important" },
      },
      {
        type: "short_text",
        title: "What brands do you currently use?",
        is_required: false,
        settings: { maxLength: 200 },
      },
      {
        type: "long_text",
        title: "What influences your purchasing decisions?",
        is_required: false,
        settings: { maxLength: 1000 },
      },
    ],
  },
];

// =====================================================
// SEED FUNCTIONS
// =====================================================

async function createStorageBuckets() {
  console.log("\n📦 Creating storage buckets...");

  const buckets = [
    { name: "avatars", public: true },
    { name: "survey-images", public: true },
    { name: "response-files", public: false },
  ];

  for (const bucket of buckets) {
    const { data: existing } = await supabase.storage.getBucket(bucket.name);
    if (existing) {
      console.log(`   ⚠️  Bucket "${bucket.name}" already exists`);
      continue;
    }

    const { error } = await supabase.storage.createBucket(bucket.name, {
      public: bucket.public,
    });

    if (error) {
      console.log(`   ❌ Failed to create bucket "${bucket.name}": ${error.message}`);
    } else {
      console.log(`   ✅ Created bucket "${bucket.name}"`);
    }
  }
}

async function createTestUsers(): Promise<Map<string, string>> {
  console.log("\n👥 Creating test users...");
  const userIds = new Map<string, string>();

  for (const user of TEST_USERS) {
    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users.find((u) => u.email === user.email);

    if (existing) {
      console.log(`   ⚠️  User "${user.email}" already exists`);
      userIds.set(user.email, existing.id);

      // Update profile plan if needed
      await supabase
        .from("profiles")
        .update({ plan: user.plan, full_name: user.fullName })
        .eq("id", existing.id);
      continue;
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        full_name: user.fullName,
      },
    });

    if (error) {
      console.log(`   ❌ Failed to create user "${user.email}": ${error.message}`);
    } else if (data.user) {
      console.log(`   ✅ Created user "${user.email}"`);
      userIds.set(user.email, data.user.id);

      // Update profile with plan
      await supabase.from("profiles").update({ plan: user.plan }).eq("id", data.user.id);
    }
  }

  return userIds;
}

async function createTemplateSurveys() {
  console.log("\n📝 Creating template surveys...");

  // Get or create system user for templates
  const { data: existingTemplates } = await supabase
    .from("surveys")
    .select("title")
    .eq("is_template", true);

  const existingTitles = new Set(existingTemplates?.map((t) => t.title) || []);

  for (const template of TEMPLATE_SURVEYS) {
    if (existingTitles.has(template.title)) {
      console.log(`   ⚠️  Template "${template.title}" already exists`);
      continue;
    }

    // Get admin user for template ownership
    const { data: adminUsers } = await supabase.auth.admin.listUsers();
    const adminUser = adminUsers?.users.find((u) => u.email === "admin@pollparrot.com");

    if (!adminUser) {
      console.log(`   ❌ Admin user not found, skipping template`);
      continue;
    }

    // Create survey
    const { data: survey, error: surveyError } = await supabase
      .from("surveys")
      .insert({
        user_id: adminUser.id,
        title: template.title,
        description: template.description,
        status: "active",
        is_template: true,
        share_slug: generateShareSlug(template.title),
        settings: {
          showProgressBar: true,
          showQuestionNumbers: true,
          allowAnonymous: true,
          requireEmail: false,
          completionMessage: "Thank you for your feedback!",
        },
      })
      .select()
      .single();

    if (surveyError || !survey) {
      console.log(`   ❌ Failed to create template "${template.title}": ${surveyError?.message}`);
      continue;
    }

    // Create questions
    const questions = template.questions.map((q, index) => ({
      survey_id: survey.id,
      type: q.type,
      title: q.title,
      description: (q as { description?: string }).description || null,
      is_required: q.is_required,
      options: (q as { options?: { id: string; label: string }[] }).options || null,
      settings: q.settings,
      sort_order: index,
    }));

    const { error: questionsError } = await supabase.from("questions").insert(questions);

    if (questionsError) {
      console.log(`   ❌ Failed to create questions for "${template.title}": ${questionsError.message}`);
    } else {
      console.log(`   ✅ Created template "${template.title}" with ${questions.length} questions`);
    }
  }
}

async function createUserSurveys(userIds: Map<string, string>) {
  console.log("\n📊 Creating user surveys with mock data...");

  const adminId = userIds.get("admin@pollparrot.com");
  if (!adminId) {
    console.log("   ❌ Admin user not found, skipping user surveys");
    return;
  }

  // Check if surveys already exist
  const { data: existingSurveys } = await supabase
    .from("surveys")
    .select("title")
    .eq("user_id", adminId)
    .eq("is_template", false);

  if (existingSurveys && existingSurveys.length >= 3) {
    console.log("   ⚠️  User surveys already exist");
    return;
  }

  // Survey 1: Active with responses
  const { data: survey1, error: s1Error } = await supabase
    .from("surveys")
    .insert({
      user_id: adminId,
      title: "Product Feedback Q1 2024",
      description: "Quarterly feedback survey for our product.",
      status: "active",
      is_template: false,
      share_slug: generateShareSlug("product-feedback"),
      settings: {
        showProgressBar: true,
        showQuestionNumbers: true,
        allowAnonymous: true,
        requireEmail: false,
        completionMessage: "Thanks for your feedback!",
      },
    })
    .select()
    .single();

  if (s1Error || !survey1) {
    console.log(`   ❌ Failed to create survey 1: ${s1Error?.message}`);
  } else {
    // Add questions
    const s1Questions = [
      { type: "rating", title: "Rate our product", is_required: true, settings: { maxValue: 5 } },
      { type: "long_text", title: "What features would you like?", is_required: false, settings: {} },
      {
        type: "multiple_choice",
        title: "Would you recommend us?",
        is_required: true,
        options: [
          { id: "1", label: "Yes" },
          { id: "2", label: "No" },
          { id: "3", label: "Maybe" },
        ],
        settings: {},
      },
    ];

    const { data: createdQuestions } = await supabase
      .from("questions")
      .insert(
        s1Questions.map((q, i) => ({
          survey_id: survey1.id,
          type: q.type,
          title: q.title,
          is_required: q.is_required,
          options: (q as { options?: { id: string; label: string }[] }).options || null,
          settings: q.settings,
          sort_order: i,
        }))
      )
      .select();

    // Add mock responses
    if (createdQuestions) {
      for (let i = 0; i < 15; i++) {
        const { data: response } = await supabase
          .from("responses")
          .insert({
            survey_id: survey1.id,
            is_complete: true,
            respondent_email: i % 3 === 0 ? `respondent${i}@example.com` : null,
            completed_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .select()
          .single();

        if (response) {
          const answers = createdQuestions.map((q) => ({
            response_id: response.id,
            question_id: q.id,
            value:
              q.type === "rating"
                ? Math.floor(Math.random() * 5) + 1
                : q.type === "multiple_choice"
                  ? ["Yes", "No", "Maybe"][Math.floor(Math.random() * 3)]
                  : `Sample feedback ${i + 1}`,
          }));

          await supabase.from("answers").insert(answers);
        }
      }
    }

    console.log(`   ✅ Created "Product Feedback Q1 2024" with 15 responses`);
  }

  // Survey 2: Draft (no responses)
  const { error: s2Error } = await supabase.from("surveys").insert({
    user_id: adminId,
    title: "New Feature Survey (Draft)",
    description: "Draft survey for upcoming feature.",
    status: "draft",
    is_template: false,
    share_slug: generateShareSlug("feature-draft"),
    settings: {
      showProgressBar: true,
      showQuestionNumbers: true,
      allowAnonymous: true,
      requireEmail: true,
    },
  });

  if (s2Error) {
    console.log(`   ❌ Failed to create survey 2: ${s2Error.message}`);
  } else {
    console.log(`   ✅ Created "New Feature Survey (Draft)"`);
  }

  // Survey 3: Closed with responses
  const { data: survey3, error: s3Error } = await supabase
    .from("surveys")
    .insert({
      user_id: adminId,
      title: "Customer Satisfaction 2023",
      description: "Annual customer satisfaction survey - closed.",
      status: "closed",
      is_template: false,
      share_slug: generateShareSlug("csat-2023"),
      settings: {
        showProgressBar: true,
        showQuestionNumbers: true,
        allowAnonymous: true,
        requireEmail: false,
        completionMessage: "Survey closed. Thank you!",
      },
    })
    .select()
    .single();

  if (s3Error || !survey3) {
    console.log(`   ❌ Failed to create survey 3: ${s3Error?.message}`);
  } else {
    // Add questions and responses
    const { data: s3Questions } = await supabase
      .from("questions")
      .insert([
        {
          survey_id: survey3.id,
          type: "rating",
          title: "Overall satisfaction",
          is_required: true,
          settings: { maxValue: 5 },
          sort_order: 0,
        },
        {
          survey_id: survey3.id,
          type: "scale",
          title: "NPS Score",
          is_required: true,
          settings: { minValue: 0, maxValue: 10 },
          sort_order: 1,
        },
      ])
      .select();

    if (s3Questions) {
      for (let i = 0; i < 8; i++) {
        const { data: response } = await supabase
          .from("responses")
          .insert({
            survey_id: survey3.id,
            is_complete: true,
            respondent_email: `customer${i}@example.com`,
            completed_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .select()
          .single();

        if (response) {
          await supabase.from("answers").insert(
            s3Questions.map((q) => ({
              response_id: response.id,
              question_id: q.id,
              value:
                q.type === "rating"
                  ? Math.floor(Math.random() * 5) + 1
                  : Math.floor(Math.random() * 11),
            }))
          );
        }
      }
    }

    console.log(`   ✅ Created "Customer Satisfaction 2023" with 8 responses`);
  }
}

// =====================================================
// MAIN
// =====================================================

async function seed() {
  console.log("🌱 Starting database seed...");
  console.log(`   Supabase URL: ${SUPABASE_URL}`);

  await createStorageBuckets();
  const userIds = await createTestUsers();
  await createTemplateSurveys();
  await createUserSurveys(userIds);

  console.log("\n" + "=".repeat(50));
  console.log("🎉 Seed completed!");
  console.log("\nTest accounts:");
  console.log("   admin@pollparrot.com / password123 (Pro)");
  console.log("   user1@pollparrot.com / password123 (Free)");
  console.log("   user2@pollparrot.com / password123 (Free)");
}

seed().catch(console.error);
