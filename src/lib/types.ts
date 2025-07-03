export type Internship = {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  domain: string;
  stipend: string;
  duration: string;
  postedDate: string;
  applicants: number;
  description: string;
  responsibilities: string[];
  skills: string[];
  perks: string[];
};

export type StudentProfile = {
  name: string;
  email: string;
  education: string;
  skills: string;
  about: string;
};
