const daysAgo = (days) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().slice(0, 10)
}

export const sampleApplications = [
  {
    id: 'job-1', company: 'Flutterwave', title: 'Frontend Developer', location: 'Lagos, Nigeria',
    type: 'Full-time', salary: '₦8,000,000 - ₦12,000,000 / year', dateApplied: daysAgo(2),
    status: 'Applied', source: 'LinkedIn', url: 'https://flutterwave.com/careers',
    notes: 'React team focused on merchant checkout experiences.', updatedAt: daysAgo(2),
  },
  {
    id: 'job-2', company: 'Access Bank', title: 'Graduate Trainee', location: 'Lagos, Nigeria',
    type: 'Full-time', salary: '₦4,500,000 / year', dateApplied: daysAgo(5),
    status: 'Interview', source: 'Company Website', url: 'https://www.accessbankplc.com/careers',
    notes: 'First-round conversation scheduled with the talent team.', updatedAt: daysAgo(1),
  },
  {
    id: 'job-3', company: 'Jobberman', title: 'Product Intern', location: 'Remote',
    type: 'Internship', salary: '₦250,000 / month', dateApplied: daysAgo(8),
    status: 'Assessment', source: 'Jobberman', url: '',
    notes: 'Take-home exercise: review a job seeker onboarding flow.', updatedAt: daysAgo(4),
  },
  {
    id: 'job-4', company: 'Paystack', title: 'Associate Product Designer', location: 'Lagos, Nigeria',
    type: 'Full-time', salary: '₦7,000,000 - ₦10,000,000 / year', dateApplied: daysAgo(12),
    status: 'Offer', source: 'Referral', url: 'https://paystack.com/jobs',
    notes: 'Offer received. Reviewing the team scope and start date.', updatedAt: daysAgo(1),
  },
  {
    id: 'job-5', company: 'Andela', title: 'Software Engineer I', location: 'Remote',
    type: 'Remote', salary: '₦6,000,000 - ₦9,000,000 / year', dateApplied: daysAgo(16),
    status: 'Rejected', source: 'Indeed', url: '',
    notes: 'Keep an eye out for future early-career openings.', updatedAt: daysAgo(7),
  },
  {
    id: 'job-6', company: 'Kuda', title: 'Customer Success Associate', location: 'Lagos, Nigeria',
    type: 'Full-time', salary: '₦3,600,000 / year', dateApplied: daysAgo(19),
    status: 'Interview', source: 'LinkedIn', url: 'https://kuda.com/careers',
    notes: 'Panel interview with the customer operations team.', updatedAt: daysAgo(3),
  },
  {
    id: 'job-7', company: 'Interswitch', title: 'Backend Developer', location: 'Lagos, Nigeria',
    type: 'Contract', salary: '₦650,000 / month', dateApplied: daysAgo(24),
    status: 'Applied', source: 'Company Website', url: '',
    notes: '', updatedAt: daysAgo(24),
  },
  {
    id: 'job-8', company: 'Moniepoint', title: 'Business Analyst', location: 'Abuja, Nigeria',
    type: 'Full-time', salary: '₦5,000,000 - ₦7,000,000 / year', dateApplied: daysAgo(31),
    status: 'Withdrawn', source: 'Other', url: '',
    notes: 'Withdrew after accepting another interview process.', updatedAt: daysAgo(15),
  },
]