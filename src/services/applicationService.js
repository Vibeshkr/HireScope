import api from "../config/axios";

export const getApplications = async (
  userId
) => {
  const response = await api.get(
    `/applications?userId=${encodeURIComponent(
      userId
    )}`
  );

  return response.data;
};

export const createApplication = async (
  applicationData
) => {
  const response = await api.post(
    "/applications",
    applicationData
  );

  return response.data;
};

export const deleteApplication = async (
  applicationId
) => {
  const response = await api.delete(
    `/applications/${applicationId}`
  );

  return response.data;
};