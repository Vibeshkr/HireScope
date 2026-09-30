
import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import axios from "axios";

import {
  FaArrowLeft,
  FaCheck,
  FaExternalLinkAlt,
} from "react-icons/fa";

import {
  createApplication,
  getApplications,
} from "../services/applicationService";

function JobDetails() {
  const { id } =
    useParams();

  const userId =
    localStorage.getItem(
      "hireScopeUserId"
    );

  const [job, setJob] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [applied, setApplied] =
    useState(false);

  const [applying, setApplying] =
    useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await axios.get(
          "https://remotive.com/api/remote-jobs"
        );

      const jobs =
        response.data.jobs || [];

      const selectedJob =
        jobs.find(
          (item) =>
            String(item.id) ===
            String(id)
        );

      if (!selectedJob) {
        setError(
          "Job not found."
        );

        return;
      }

      setJob(
        selectedJob
      );

      if (userId) {
        const applications =
          await getApplications(
            userId
          );

        const alreadyApplied =
          applications.some(
            (application) =>
              String(
                application.jobId
              ) ===
              String(id)
          );

        setApplied(
          alreadyApplied
        );
      }
    } catch (error) {
      console.error(
        "JOB DETAILS ERROR:",
        error
      );

      setError(
        "Failed to load job details."
      );
    } finally {
      setLoading(false);
    }
  };

  const cleanDescription =
    (html) => {
      if (!html) {
        return "";
      }

      return html
        .replace(
          /<img[^>]*>/gi,
          ""
        )
        .replace(
          /<script[^>]*>[\s\S]*?<\/script>/gi,
          ""
        );
    };

  const trackApplication =
    async () => {
      if (!userId) {
        alert(
          "Please login first."
        );

        return;
      }

      if (!job || applied) {
        return;
      }

      try {
        setApplying(true);

        await createApplication({
          userId: String(
            userId
          ),

          jobId: String(
            job.id
          ),

          title:
            job.title ||
            "Untitled Job",

          company:
            job.company_name ||
            "Unknown Company",

          location:
            job.candidate_required_location ||
            "Worldwide",

          status:
            "Applied",

          appliedAt:
            new Date().toLocaleDateString(
              "en-IN"
            ),

          url:
            job.url || "",
        });

        setApplied(true);

        alert(
          "Application tracked successfully."
        );
      } catch (error) {
        console.error(
          "APPLICATION ERROR:",
          error
        );

        alert(
          "Failed to track application."
        );
      } finally {
        setApplying(false);
      }
    };

  if (loading) {
    return (
      <main className="job-details-page">
        <div className="job-details-loading">
          <h2>
            Loading job...
          </h2>
        </div>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="job-details-page">
        <div className="job-details-error">
          <h2>
            {error ||
              "Job not found."}
          </h2>

          <Link
            to="/jobs"
            className="back-to-jobs"
          >
            <FaArrowLeft />
            Back to Jobs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="job-details-page">
      <div className="job-details-container">

        <Link
          to="/jobs"
          className="back-to-jobs"
        >
          <FaArrowLeft />
          Back to Jobs
        </Link>

        <section className="job-details-card">

          <div className="job-details-header">

            <div className="job-company-logo">
              {job.company_logo ? (
                <img
                  src={
                    job.company_logo
                  }
                  alt={
                    job.company_name ||
                    "Company"
                  }
                />
              ) : (
                <span>
                  {job.company_name
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    "J"}
                </span>
              )}
            </div>

            <div className="job-details-title">

              <p className="job-details-company">
                {job.company_name ||
                  "Unknown Company"}
              </p>

              <h1>
                {job.title ||
                  "Untitled Job"}
              </h1>

              <div className="job-details-meta">

                <span>
                  {job.category ||
                    "General"}
                </span>

                <span>
                  {job.job_type ||
                    "Full Time"}
                </span>

                <span>
                  {job.candidate_required_location ||
                    "Worldwide"}
                </span>

              </div>
            </div>
          </div>

          <div className="job-details-actions">

            {!applied ? (
              <button
                type="button"
                className="apply-track-button"
                onClick={
                  trackApplication
                }
                disabled={applying}
              >
                {applying
                  ? "Tracking..."
                  : "Track Application"}
              </button>
            ) : (
              <div className="application-tracked">
                <FaCheck />
                Application Tracked
              </div>
            )}

            {job.url && (
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="apply-external-button"
              >
                Apply on Website
                <FaExternalLinkAlt />
              </a>
            )}

          </div>

          {applied && (
            <div className="application-success-message">

              <FaCheck />

              <div>
                <strong>
                  Application tracked
                </strong>

                <p>
                  Track this application
                  from your Applications
                  page.
                </p>
              </div>

              <Link
                to="/applications"
              >
                View Applications
              </Link>

            </div>
          )}

          <section className="job-description-section">

            <h2>
              Job Description
            </h2>

            <div
              className="job-description"
              dangerouslySetInnerHTML={{
                __html:
                  cleanDescription(
                    job.description
                  ),
              }}
            />

          </section>

          <section className="job-info-section">

            <h2>
              Job Information
            </h2>

            <div className="job-info-grid">

              <div className="job-info-item">
                <span>
                  Company
                </span>

                <strong>
                  {job.company_name ||
                    "Not specified"}
                </strong>
              </div>

              <div className="job-info-item">
                <span>
                  Job Type
                </span>

                <strong>
                  {job.job_type ||
                    "Not specified"}
                </strong>
              </div>

              <div className="job-info-item">
                <span>
                  Category
                </span>

                <strong>
                  {job.category ||
                    "Not specified"}
                </strong>
              </div>

              <div className="job-info-item">
                <span>
                  Location
                </span>

                <strong>
                  {job.candidate_required_location ||
                    "Worldwide"}
                </strong>
              </div>

            </div>

          </section>

          <div className="job-details-bottom">

            <Link
              to={`/jobs/${job.id}/match`}
              className="match-job-button"
            >
              Check Your Match
            </Link>

          </div>

        </section>

      </div>
    </main>
  );
}

export default JobDetails;