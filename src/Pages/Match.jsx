import {useEffect,useState,} from "react";

import {Link,useParams,} from "react-router-dom";

import axios from "axios";

import {FaArrowLeft,FaCheck,FaTimes,FaBookOpen,} from "react-icons/fa";

import {getProfile,} from "../services/profileService";

const availableSkills = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Git",
  "GitHub",
  "TypeScript",
  "Bootstrap",
  "Tailwind CSS",
  "Python",
  "Java",
  "SQL",
  "Angular",
  "Next.js",
  "Redux",
  "REST API",
  "Docker",
  "Firebase",
  "Figma",
  "Vue.js",
  "PHP",
  "Laravel",
  "Flutter",
  "React Native",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "AWS",
  "Azure",
];

const skillAliases = {
  "react.js": "react",
  reactjs: "react",

  "node.js": "node.js",
  nodejs: "node.js",

  "express.js": "express.js",
  expressjs: "express.js",

  "mongo db": "mongodb",

  "next.js": "next.js",
  nextjs: "next.js",

  restapi: "rest api",

  tailwindcss:
    "tailwind css",

  "react-native":
    "react native",

  "vue.js": "vue.js",
};

const normalizeSkill =(skill) => {
    const value =skill.toLowerCase().trim();

    return (skillAliases[value] ||value);
  };

const containsSkill = (text,skill) => {
  if (!text || !skill) {
    return false;
  }

  const normalizedText =text.toLowerCase();

  const normalizedSkill =normalizeSkill(skill);

  const escaped =normalizedSkill.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");

  const regex =new RegExp(
      `(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`,
      "i"
    );

  return regex.test(
    normalizedText
  );
};

function Match() {const { id } = useParams();

  const userId =localStorage.getItem("hireScopeUserId");

  const [profile, setProfile] =useState(null);

  const [job, setJob] =useState(null);

  const [matchedSkills,setMatchedSkills,] = useState([]);

  const [missingSkills,setMissingSkills,] = useState([]);

  const [score, setScore] =useState(0);

  const [loading, setLoading] =useState(true);

  const [error, setError] =useState("");

  useEffect(() => {loadMatchData();}, [id]);

  const loadMatchData =
    async () => {
      try {
        setLoading(true);
        setError("");

        if (!userId) {
          setError(
            "Please login first."
          );

          return;
        }

        const profiles =await getProfile(userId);

        const currentProfile =profiles[0];

        if (
          !currentProfile ||
          !Array.isArray(
            currentProfile.skills
          ) ||
          currentProfile.skills
            .length === 0
        ) {
          setError(
            "Please create your profile and add your skills first."
          );

          return;
        }

        setProfile(
          currentProfile
        );

        const response =await axios.get("https://remotive.com/api/remote-jobs");

        const jobs =response.data.jobs || [];

        const currentJob =jobs.find((item) =>String(item.id) ===String(id));

        if (!currentJob) {
          setError(
            "Job not found."
          );

          return;
        }

        setJob(
          currentJob
        );

        const jobText = [currentJob.title,currentJob.category,currentJob.job_type,currentJob.description,]
          .filter(Boolean)
          .join(" ");

        const matched = [];
        const missing = [];

        availableSkills.forEach(
          (skill) => {
            if (
              containsSkill(
                jobText,
                skill
              )
            ) {
              const hasSkill =
                currentProfile.skills.some(
                  (userSkill) =>
                    normalizeSkill(
                      userSkill
                    ) ===
                    normalizeSkill(
                      skill
                    )
                );

              if (hasSkill) {
                matched.push(
                  skill
                );
              } else {
                missing.push(
                  skill
                );
              }
            }
          }
        );

        setMatchedSkills(
          matched
        );

        setMissingSkills(
          missing
        );

        const total =
          matched.length +
          missing.length;

        const calculatedScore =
          total === 0
            ? 0
            : Math.round(
                (matched.length /
                  total) *
                  100
              );

        setScore(
          calculatedScore
        );
      } catch (error) {
        console.error(
          "MATCH ERROR:",
          error
        );

        setError(
          "Failed to analyze this job."
        );
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <main className="match-page">

        <div className="match-loading">

          <h2>
            Analyzing your match...
          </h2>

        </div>

      </main>
    );
  }

  if (error) {
    return (
      <main className="match-page">

        <div className="match-error">

          <h2>
            {error}
          </h2>

          <Link
            to="/jobs"
            className="back-to-job"
          >
            <FaArrowLeft />
            Back to Jobs
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="match-page">

      <div className="match-header">

        <Link
          to={`/jobs/${id}`}
          className="back-to-job"
        >
          <FaArrowLeft />
          Back to Job
        </Link>

        <p className="page-label">
          JOB MATCH ANALYSIS
        </p>

        <h1>
          Your Match
        </h1>

        <p>
          Compare your profile with
          this job's requirements.
        </p>

      </div>

      <section className="match-score-card">

        <div className="score-circle">

          <strong>
            {score}%
          </strong>

        </div>

        <div className="score-content">

          <h2>
            Profile Match
          </h2>

          <p>
            Your profile matches{" "}
            <strong>
              {matchedSkills.length}
            </strong>{" "}
            identified skills for
            this job.
          </p>

        </div>

      </section>

      <div className="match-grid">

        <section className="skills-card matched-card">

          <div className="skills-card-header">

            <h2>
              <FaCheck />
              Matched Skills
            </h2>

            <span className="skills-count">
              {matchedSkills.length}
            </span>

          </div>

          {matchedSkills.length >
          0 ? (
            <div className="match-skill-list">

              {matchedSkills.map(
                (skill) => (
                  <div
                    className="match-skill"
                    key={skill}
                  >
                    <FaCheck />
                    {skill}
                  </div>
                )
              )}

            </div>
          ) : (
            <p className="no-skills">
              No matching skills found.
            </p>
          )}

        </section>

        <section className="skills-card missing-card">

          <div className="skills-card-header">

            <h2>
              <FaTimes />
              Skill Gaps
            </h2>

            <span className="skills-count">
              {missingSkills.length}
            </span>

          </div>

          {missingSkills.length >
          0 ? (
            <div className="match-skill-list">

              {missingSkills.map(
                (skill) => (
                  <div
                    className="match-skill"
                    key={skill}
                  >
                    <FaTimes />
                    {skill}
                  </div>
                )
              )}

            </div>
          ) : (
            <p className="no-skills">
              No identified skill gaps.
            </p>
          )}

        </section>

      </div>

      <section className="match-profile-summary">

        <h2>
          Your Profile
        </h2>

        <p>
          <strong>
            {profile.name}
          </strong>
          {" — "}
          {profile.role}
        </p>

        <div className="profile-skills">

          {profile.skills.map(
            (skill) => (
              <span key={skill}>
                {skill}
              </span>
            )
          )}

        </div>

     

      </section>

      {missingSkills.length >
        0 && (
        <div className="match-actions">

          <Link
            to={`/resources/${id}`}
            className="resources-button"
          >
            <FaBookOpen />
            Learn Missing Skills
          </Link>

          <Link
            to="/profile"
            className="match-secondary-button"
          >
            Update Profile
          </Link>

        </div>
      )}

    </main>
  );
}

export default Match;