import api from "../config/axios";

export const getProfile = async (userId) => {
  const response = await api.get(
    `/profiles?userId=${encodeURIComponent(userId)}`
  );

  return response.data;
};

export const createProfile = async (profileData) => {
  const response = await api.post(
    "/profiles",
    profileData
  );

  return response.data;
};

export const updateProfile = async (
  profileId,
  profileData
) => {
  const response = await api.put(
    `/profiles/${profileId}`,
    profileData
  );

  return response.data;
};