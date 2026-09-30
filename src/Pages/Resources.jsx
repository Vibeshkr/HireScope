import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaBookOpen,
  FaCode,
  FaArrowLeft,
  FaUserEdit,
  FaRedo,
} from "react-icons/fa";

import { getProfile } from "../services/profileService";

const availableSkills = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Bootstrap",
  "Tailwind CSS",
  "Git",
  "GitHub",
  "TypeScript",
  "Next.js",
  "Redux",
  "Python",
  "Java",
];

const skillAliases = {
  html: ["html", "html5"],
  css: ["css", "css3"],
  javascript: ["javascript", "js", "ecmascript"],
  react: ["react", "react.js", "reactjs"],
  "node.js": ["node.js", "nodejs", "node"],
  "express.js": ["express.js", "expressjs", "express"],
  mongodb: ["mongodb", "mongo db", "mongo"],
  bootstrap: ["bootstrap"],
  "tailwind css": ["tailwind css", "tailwind"],
  git: ["git"],
  github: ["github", "git hub"],
  typescript: ["typescript", "ts"],
  "next.js": ["next.js", "nextjs", "next"],
  redux: ["redux"],
  python: ["python"],
  java: ["java"],
};

function normalizeText(text = "") {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function skillExists(text, skill) {
  const normalizedText = normalizeText(text);
  const aliases = skillAliases[skill.toLowerCase()] || [skill];

  return aliases.some((alias) => {
    const normalizedAlias = normalizeText(alias);

    if (!normalizedAlias) {
      return false;
    }

    return normalizedText.includes(normalizedAlias);
  });
}

function Resources() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);

  const [missingSkills, setMissingSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        setError("");

        const userId = localStorage.getItem("hireScopeUserId");

        if (!userId) {
          setError("Please login first.");
          return;
        }

        if (!id) {
          setError("Job not found.");
          return;
        }

        const [profileResponse, jobsResponse] = await Promise.all([
          getProfile(userId),
          axios.get("https://remotive.com/api/remote-jobs"),
        ]);

        const profiles = profileResponse || [];
        const currentProfile = profiles[0] || null;

        if (!currentProfile) {
          setError("Please create your profile first.");
          return;
        }

        const jobs = jobsResponse.data?.jobs || [];

        const currentJob = jobs.find(
          (item) => String(item.id) === String(id)
        );

        if (!currentJob) {
          setError("Job not found.");
          return;
        }

        setProfile(currentProfile);
        setJob(currentJob);

        const profileSkills = Array.isArray(currentProfile.skills)
          ? currentProfile.skills
          : [];

        const jobText = `
          ${currentJob.title || ""}
          ${currentJob.category || ""}
          ${currentJob.job_type || ""}
          ${currentJob.description || ""}
        `;

        const missing = availableSkills.filter((skill) => {
          const requiredByJob = skillExists(jobText, skill);

          const userHasSkill = profileSkills.some((userSkill) => {
            return (
              normalizeText(userSkill) === normalizeText(skill) ||
              skillExists(userSkill, skill)
            );
          });

          return requiredByJob && !userHasSkill;
        });

        setMissingSkills(missing);
      } catch (err) {
        console.error("RESOURCES ERROR:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load resources."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [id]);

  if (loading) {
    return (
      <main className="resources-page">
        <div className="resources-container">
          <div className="resources-loading">
            <h2>Loading resources...</h2>
            <p>Finding learning resources for this job.</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="resources-page">
        <div className="resources-container">
          <div className="resources-error">
            <h2>Resources unavailable</h2>
            <p>{error}</p>

            <Link to="/jobs" className="resources-back-button">
              <FaArrowLeft />
              Back to Jobs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="resources-page">
      <div className="resources-container">

        <div className="resources-header">
          <p className="page-label">SKILL DEVELOPMENT</p>

          <h1>Resources</h1>

          <p>
            Improve the skills you are missing for this job and check your
            match again.
          </p>
        </div>

        {job && (
          <section className="resources-job-card">
            <div>
              <p className="resources-job-label">TARGET JOB</p>

              <h2>{job.title}</h2>

              <p>
                {job.company_name || "Company not specified"}
              </p>
            </div>

            <Link
              to={`/jobs/${id}/match`}
              className="resources-match-button"
            >
              <FaRedo />
              View Match
            </Link>
          </section>
        )}

        <section className="resources-skills-section">
          <div className="resources-section-heading">
            <div>
              <p className="page-label">SKILL GAP</p>

              <h2>
                Skills to Improve
              </h2>
            </div>

            <span className="resources-skill-count">
              {missingSkills.length}
            </span>
          </div>

          {missingSkills.length === 0 ? (
            <div className="resources-empty">
              <h3>No major skill gaps found</h3>

              <p>
                Your profile currently covers the skills detected from this
                job.
              </p>

              <Link
                to={`/jobs/${id}/match`}
                className="resources-check-button"
              >
                <FaRedo />
                Check Match Again
              </Link>
            </div>
          ) : (
            <div className="resources-grid">
              {missingSkills.map((skill) => {
                const searchQuery = encodeURIComponent(
                  `${skill} tutorial for beginners`
                );

                return (
                  <article
                    className="resource-card"
                    key={skill}
                  >
                    <div className="resource-icon">
                      <FaBookOpen />
                    </div>

                    <div className="resource-content">
                      <span className="resource-type">
                        LEARN
                      </span>

                      <h3>{skill}</h3>

                      <p>
                        Learn the fundamentals of {skill} and build practical
                        knowledge before checking your job match again.
                      </p>

                      <a
                        href={`https://www.youtube.com/results?search_query=${searchQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        Learn {skill}
                        <FaArrowLeft className="resource-arrow" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {missingSkills.length > 0 && (
          <section className="resources-practice-section">
            <div className="resources-practice-icon">
              <FaCode />
            </div>

            <div>
              <h2>Practice before checking again</h2>

              <p>
                Learn the missing skills, add the skills you actually know to
                your profile, and then run the match analysis again.
              </p>
            </div>
          </section>
        )}

        <section className="resources-actions">
          <div className="resources-actions-content">
            <h2>Ready to check again?</h2>

            <p>
              Update your profile after learning new skills and re-check your
              job match.
            </p>
          </div>

          <div className="resources-actions-buttons">
            <Link
              to="/profile"
              className="resources-update-button"
            >
              <FaUserEdit />
              Update Profile
            </Link>

            <Link
              to={`/jobs/${id}/match`}
              className="resources-check-button"
            >
              <FaRedo />
              Check Match Again
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}

export default Resources;