import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  FaExternalLinkAlt,
  FaTrash,
  FaArrowRight,
} from "react-icons/fa";

import {
  getApplications,
  deleteApplication,
} from "../services/applicationService";

function Applications() {
  const userId =
    localStorage.getItem(
      "hireScopeUserId"
    );

  const [
    applications,
    setApplications,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications =
    async () => {
      try {
        setLoading(true);

        if (!userId) {
          setApplications([]);
          return;
        }

        const data =
          await getApplications(
            userId
          );

        setApplications(data);
      } catch (error) {
        console.error(
          "APPLICATIONS ERROR:",
          error
        );

        setError(
          "Failed to load applications."
        );
      } finally {
        setLoading(false);
      }
    };

  const handleDelete =
    async (applicationId) => {
      const confirmed =
        window.confirm(
          "Remove this application from your tracking list?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(
          applicationId
        );

        await deleteApplication(
          applicationId
        );

        setApplications(
          (current) =>
            current.filter(
              (application) =>
                application.id !==
                applicationId
            )
        );
      } catch (error) {
        console.error(
          "DELETE ERROR:",
          error
        );

        alert(
          "Failed to remove application."
        );
      } finally {
        setDeletingId(null);
      }
    };

  if (loading) {
    return (
      <main className="applications-page">

        <div className="applications-loading">

          <h2>
            Loading applications...
          </h2>

        </div>

      </main>
    );
  }

  return (
    <main className="applications-page">

      <div className="applications-container">

        <div className="applications-header">

          <div>

            <p className="page-label">
              APPLICATION TRACKING
            </p>

            <h1>
              My Applications
            </h1>

            <p>
              Keep track of the jobs
              you have applied to.
            </p>

          </div>

          <Link
            to="/jobs"
            className="applications-jobs-button"
          >
            Explore Jobs
            <FaArrowRight />
          </Link>

        </div>

        {error && (
          <div className="applications-error">
            {error}
          </div>
        )}

        {applications.length ===
        0 ? (
          <div className="empty-applications">

            <h2>
              No applications yet
            </h2>

            <p>
              When you track a job
              application, it will
              appear here.
            </p>

            <Link
              to="/jobs"
              className="empty-applications-button"
            >
              Browse Jobs
              <FaArrowRight />
            </Link>

          </div>
        ) : (
          <div className="applications-list">

            {applications.map(
              (application) => (
                <article
                  className="application-card"
                  key={
                    application.id
                  }
                >

                  <div className="application-main">

                    <div className="application-company-icon">
                      {application.company
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "J"}
                    </div>

                    <div className="application-content">

                      <h2>
                        {
                          application.title
                        }
                      </h2>

                      <p className="application-company">
                        {
                          application.company
                        }
                      </p>

                      <p className="application-location">
                        {
                          application.location
                        }
                      </p>

                    </div>

                  </div>

                  <div className="application-right">

                    <span className="application-status">
                      {
                        application.status
                      }
                    </span>

                    <span className="application-date">
                      Applied:{" "}
                      {
                        application.appliedAt
                      }
                    </span>

                    <div className="application-actions">

                      {application.url && (
                        <a
                          href={
                            application.url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="application-view-button"
                        >
                          View Job
                          <FaExternalLinkAlt />
                        </a>
                      )}

                      <button
                        type="button"
                        className="application-delete-button"
                        onClick={() =>
                          handleDelete(
                            application.id
                          )
                        }
                        disabled={
                          deletingId ===
                          application.id
                        }
                      >
                        <FaTrash />

                        {deletingId ===
                        application.id
                          ? "Removing..."
                          : "Remove"}
                      </button>

                    </div>

                  </div>

                </article>
              )
            )}

          </div>
        )}

      </div>

    </main>
  );
}

export default Applications;