import { useEffect,useMemo,useState,} from "react";

import axios from "axios";
import { Link } from "react-router-dom";
import {FaSearch,FaMapMarkerAlt,FaBriefcase,FaArrowRight,} from "react-icons/fa";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("all");

  const [location, setLocation] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "https://remotive.com/api/remote-jobs"
        );

        setJobs(response.data.jobs || []);
      } catch (error) {
        console.error(
          "GET JOBS ERROR:",
          error
        );

        setError(
          "Failed to load jobs. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const categories = useMemo(() => {
    const values = jobs
      .map((job) => job.category)
      .filter(Boolean);

    return [
      "all",
      ...new Set(values),
    ];
  }, [jobs]);

  const locations = useMemo(() => {
    const values = jobs
      .map((job) => job.candidate_required_location)
      .filter(Boolean);

    return [
      "all",
      ...new Set(values),
    ];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        job.title
          ?.toLowerCase()
          .includes(searchValue) ||
        job.company_name
          ?.toLowerCase()
          .includes(searchValue) ||
        job.category
          ?.toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        category === "all" ||
        job.category === category;

      const matchesLocation =
        location === "all" ||
        job.candidate_required_location ===
          location;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation
      );
    });
  }, [
    jobs,
    search,
    category,
    location,
  ]);

  if (loading) {
    return (
      <div className="jobs-page">
        <div className="jobs-loading">
          <h2>Finding jobs...</h2>
          <p>
            Loading available opportunities.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs-page">
        <div className="jobs-error">
          <h2>Something went wrong</h2>
          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <div>
          <p className="page-label">
            JOB DISCOVERY
          </p>

          <h1>Find Your Next Opportunity</h1>

          <p>
            Search real job opportunities and
            compare them with your profile.
          </p>
        </div>

        <div className="jobs-count">
          <strong>
            {filteredJobs.length}
          </strong>

          <span>Jobs Found</span>
        </div>
      </div>

      <div className="jobs-filters">
        <div className="search-box">
          <FaSearch />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search jobs, companies or skills"
          />
        </div>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          {categories.map((item) => (
            <option
              value={item}
              key={item}
            >
              {item === "all"
                ? "All Categories"
                : item}
            </option>
          ))}
        </select>

        <select
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
        >
          {locations.map((item) => (
            <option
              value={item}
              key={item}
            >
              {item === "all"
                ? "All Locations"
                : item}
            </option>
          ))}
        </select>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="empty-jobs">
          <h2>No jobs found</h2>

          <p>
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <article
              className="job-card"
              key={job.id}
            >
              <div className="job-card-top">
                <div className="company-logo">
                  {job.company_name
                    ?.charAt(0)
                    .toUpperCase() || "J"}
                </div>

                <div>
                  <p className="job-company">
                    {job.company_name}
                  </p>

                  <h2>{job.title}</h2>
                </div>
              </div>

              <div className="job-meta">
                <span>
                  <FaMapMarkerAlt />
                  {job.candidate_required_location ||
                    "Worldwide"}
                </span>

                <span>
                  <FaBriefcase />
                  {job.job_type || "Remote"}
                </span>
              </div>

              {job.category && (
                <span className="job-category">
                  {job.category}
                </span>
              )}

              <div className="job-card-bottom">
                <span>
                  Remote Opportunity
                </span>

                <Link
                  to={`/jobs/${job.id}`}
                  className="view-job-button"
                >
                  View Job
                  <FaArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Jobs;