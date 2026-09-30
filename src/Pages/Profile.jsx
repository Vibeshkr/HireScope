
import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  FaArrowRight,
  FaEdit,
  FaTimes,
} from "react-icons/fa";

import {
  createProfile,
  updateProfile,
} from "../services/profileService";

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

function Profile({
  user,
  profile,
  refreshProfile,
}) {
  const [name, setName] =
    useState("");

  const [role, setRole] =
    useState("");

  const [experience, setExperience] =
    useState("Fresher");

  const [skillInput, setSkillInput] =
    useState("");

  const [skills, setSkills] =
    useState([]);

  const [saving, setSaving] =
    useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (profile) {
      setName(
        profile.name ||
          user?.name ||
          ""
      );

      setRole(
        profile.role || ""
      );

      setExperience(
        profile.experience ||
          "Fresher"
      );

      setSkills(
        Array.isArray(
          profile.skills
        )
          ? profile.skills
          : []
      );

      setSkillInput("");
      setIsEditing(false);
    } else {
      setName(
        user?.name || ""
      );

      setRole("");
      setExperience(
        "Fresher"
      );
      setSkills([]);
      setSkillInput("");
      setIsEditing(true);
    }
  }, [
    user,
    profile,
  ]);

  const addSkill = () => {
    const value =
      skillInput.trim();

    if (!value) {
      return;
    }

    const selectedSkill =
      availableSkills.find(
        (skill) =>
          skill.toLowerCase() ===
          value.toLowerCase()
      );

    if (!selectedSkill) {
      alert(
        "Please select a valid skill from the list."
      );

      return;
    }

    const exists =
      skills.some(
        (skill) =>
          skill.toLowerCase() ===
          selectedSkill.toLowerCase()
      );

    if (exists) {
      setSkillInput("");
      return;
    }

    setSkills(
      (currentSkills) => [
        ...currentSkills,
        selectedSkill,
      ]
    );

    setSkillInput("");
  };

  const removeSkill = (
    skill
  ) => {
    setSkills(
      (currentSkills) =>
        currentSkills.filter(
          (item) =>
            item !== skill
        )
    );
  };

  const validRole = () => {
    const value =
      role.trim().toLowerCase();

    const roleKeywords = [
      "developer",
      "engineer",
      "designer",
      "analyst",
      "tester",
      "intern",
      "manager",
      "frontend",
      "backend",
      "full stack",
      "fullstack",
      "mern",
      "mean",
      "react",
      "node",
      "software",
      "data",
      "devops",
      "ui",
      "ux",
      "marketing",
      "accountant",
      "sales",
      "support",
      "cloud",
      "mobile",
      "security",
    ];

    return (
      value.length >= 3 &&
      roleKeywords.some(
        (keyword) =>
          value.includes(keyword)
      )
    );
  };

  const saveProfile =
    async () => {
      if (!user?.id) {
        alert(
          "User session not found. Please login again."
        );

        return;
      }

      const cleanName =
        name.trim();

      const cleanRole =
        role.trim();

      if (
        cleanName.length < 2 ||
        !/^[A-Za-z ]+$/.test(
          cleanName
        )
      ) {
        alert(
          "Please enter a valid name."
        );

        return;
      }

      if (!validRole()) {
        alert(
          "Please enter a valid target role such as MERN Stack Developer, Frontend Developer, or Software Engineer."
        );

        return;
      }

      if (
        skills.length === 0
      ) {
        alert(
          "Please add at least one skill."
        );

        return;
      }

      try {
        setSaving(true);

        const profileData = {
          userId: String(
            user.id
          ),
          name: cleanName,
          role: cleanRole,
          experience,
          skills,
        };

        if (profile) {
          await updateProfile(
            profile.id,
            profileData
          );
        } else {
          await createProfile(
            profileData
          );
        }

        await refreshProfile();

        alert(
          profile
            ? "Profile updated successfully."
            : "Profile created successfully."
        );
      } catch (error) {
        console.error(
          "PROFILE SAVE ERROR:",
          error
        );

        alert(
          error.response?.data ||
            error.message ||
            "Failed to save profile."
        );
      } finally {
        setSaving(false);
      }
    };

  const cancelEditing = () => {
    if (!profile) {
      return;
    }

    setName(
      profile.name || ""
    );

    setRole(
      profile.role || ""
    );

    setExperience(
      profile.experience ||
        "Fresher"
    );

    setSkills(
      Array.isArray(
        profile.skills
      )
        ? [...profile.skills]
        : []
    );

    setSkillInput("");
    setIsEditing(false);
  };

  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-header">
          <p className="page-label">
            CANDIDATE PROFILE
          </p>

          <h1>
            Login Required
          </h1>

          <p>
            Please login to view
            your profile.
          </p>

          <Link
            to="/login"
            className="profile-next-button"
          >
            Login
            <FaArrowRight />
          </Link>
        </div>
      </main>
    );
  }

  if (
    profile &&
    !isEditing
  ) {
    return (
      <main className="profile-page">
        <div className="profile-header">
          <p className="page-label">
            CANDIDATE PROFILE
          </p>

          <h1>
            Your Profile
          </h1>

          <p>
            Keep your profile updated
            to improve your job matches.
          </p>
        </div>

        <div className="profile-preview">
          <div className="profile-preview-header">
            <div>
              <p className="page-label">
                PROFILE
              </p>

              <h2>
                {profile.name}
              </h2>

              <p>
                {profile.role}
              </p>
            </div>

            <button
              type="button"
              className="edit-profile-button"
              onClick={() =>
                setIsEditing(true)
              }
            >
              <FaEdit />
              Update Profile
            </button>
          </div>

          <div className="profile-details-grid">
            <div className="profile-detail">
              <span>
                Email
              </span>

              <strong>
                {user?.email ||
                  "Not available"}
              </strong>
            </div>

            <div className="profile-detail">
              <span>
                Experience
              </span>

              <strong>
                {profile.experience ||
                  "Fresher"}
              </strong>
            </div>
          </div>

          <div className="profile-skills-preview">
            <p className="page-label">
              SKILLS
            </p>

            <div className="profile-skills">
              {Array.isArray(
                profile.skills
              ) &&
                profile.skills.map(
                  (skill) => (
                    <span
                      key={skill}
                    >
                      {skill}
                    </span>
                  )
                )}
            </div>
          </div>

          <Link
            to="/jobs"
            className="profile-next-button"
          >
            Explore Jobs
            <FaArrowRight />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-header">
        <p className="page-label">
          CANDIDATE PROFILE
        </p>

        <h1>
          {profile
            ? "Update Your Profile"
            : "Build Your Profile"}
        </h1>

        <p>
          Add your target role,
          experience and skills.
        </p>
      </div>

      <div className="profile-form">
        <div className="form-group">
          <label>
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label>
            Email
          </label>

          <input
            type="email"
            value={
              user?.email || ""
            }
            disabled
          />

          <small>
            Account email cannot be
            changed here.
          </small>
        </div>

        <div className="form-group">
          <label>
            Target Role
          </label>

          <input
            type="text"
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value
              )
            }
            placeholder="Example: MERN Stack Developer"
          />
        </div>

        <div className="form-group">
          <label>
            Experience
          </label>

          <select
            value={experience}
            onChange={(e) =>
              setExperience(
                e.target.value
              )
            }
          >
            <option value="Fresher">
              Fresher
            </option>

            <option value="0-1 Years">
              0-1 Years
            </option>

            <option value="1-2 Years">
              1-2 Years
            </option>

            <option value="2-5 Years">
              2-5 Years
            </option>

            <option value="5+ Years">
              5+ Years
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>
            Skills
          </label>

          <div className="skill-input-row">
            <input
              list="available-skills"
              type="text"
              value={skillInput}
              onChange={(e) =>
                setSkillInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Select a skill"
            />

            <button
              type="button"
              onClick={addSkill}
            >
              Add
            </button>
          </div>

          <datalist id="available-skills">
            {availableSkills.map(
              (skill) => (
                <option
                  key={skill}
                  value={skill}
                />
              )
            )}
          </datalist>

          <div className="selected-skills">
            {skills.map(
              (skill) => (
                <span
                  className="selected-skill"
                  key={skill}
                >
                  {skill}

                  <button
                    type="button"
                    onClick={() =>
                      removeSkill(
                        skill
                      )
                    }
                  >
                    <FaTimes />
                  </button>
                </span>
              )
            )}
          </div>
        </div>

        <div className="profile-form-actions">
          <button
            type="button"
            className="save-profile-button"
            onClick={
              saveProfile
            }
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : profile
              ? "Update Profile"
              : "Create Profile"}

            {!saving && (
              <FaArrowRight />
            )}
          </button>

          {profile && (
            <button
              type="button"
              className="cancel-profile-button"
              onClick={
                cancelEditing
              }
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default Profile;
