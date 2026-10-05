import {Link,} from "react-router-dom";

import {FaArrowRight,} from "react-icons/fa";

function Home({user,profile,}) {
  return (
    <main className="home">

      <section className="hero">

        <div className="hero-content">

          <p className="subtitle">
            SMARTER JOB SEARCH
          </p>

          <h1>
            Find the right job
            <br />
            <span>
              with confidence.
            </span>
          </h1>

          <p className="description">
            Discover jobs, compare your
            skills with their requirements,
            identify skill gaps, and track
            your applications.
          </p>

          {!user ? (
            <div className="hero-buttons">

              <Link to="/register">
                <button type="button">
                  Create Your Account
                  <FaArrowRight />
                </button>
              </Link>

            </div>
          ) : !profile ? (
            <div className="hero-buttons">

              <Link to="/profile">
                <button type="button">
                  Create Your Profile
                  <FaArrowRight />
                </button>
              </Link>

            </div>
          ) : (
            <div className="hero-buttons">

              <Link to="/jobs">
                <button type="button">
                  Explore Jobs
                  <FaArrowRight />
                </button>
              </Link>

            </div>
          )}

        </div>

        {!user ? (
          <div className="match-card">

            <p>
              GET STARTED
            </p>

            <h2>
              Create Your Account
            </h2>

            <p>
              Create an account and
              build your candidate
              profile to start exploring
              jobs.
            </p>

          </div>
        ) : !profile ? (
          <div className="match-card">

            <p>
              NEXT STEP
            </p>

            <h2>
              Build Your Profile
            </h2>

            <p>
              Add your target role,
              experience and skills to
              unlock job matching.
            </p>

          </div>
        ) : (
          <div className="match-card">

            <p>
              YOUR PROFILE
            </p>

            <h2>
              {profile.role}
            </h2>

            <div className="score">

              <strong>
                {profile.skills.length}
              </strong>

              <span>
                Skills Added
              </span>

            </div>

            <div className="skill-list-home">

              {profile.skills
                .slice(0, 4)
                .map(
                  (skill) => (
                    <div
                      className="skill-row"
                      key={skill}
                    >
                      <span>
                        {skill}
                      </span>
                    </div>
                  )
                )}

            </div>

            {profile.skills
              .length > 4 && (
              <p className="more-skills">
                +
                {profile.skills
                  .length - 4}{" "}
                more skills
              </p>
            )}

          </div>
        )}

      </section>

    </main>
  );
}

export default Home;