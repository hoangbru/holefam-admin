type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const handleApiError = (error: unknown) => {
  if (error && typeof error === "object" && "response" in error) {
    type ApiError = { response?: { data?: { meta?: { message?: string } } } };
    const message =
      (error as ApiError).response?.data?.meta?.message || "Lỗi không xác định";
    throw new Error(message);
  } else {
    throw new Error("Unexpected error");
  }
};

const request = async (
  path: string,
  method: Method = "GET",
  data?: Record<string, unknown>
) => {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin" as RequestCredentials,
    ...(method !== "GET" && { body: JSON.stringify(data) }),
  };

  try {
    let response = await fetch(path, config);

    if (response.status === 401) {
      try {
        const refreshResponse = await fetch("/api/auth/refresh", {
          ...config,
          method: "POST",
        });
        if (refreshResponse.ok) {
          response = await fetch(path, config);
        }
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
        throw refreshError;
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }

    const result = await response.json();

    return result;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetcher = (path: string) => request(path);

export const mutation = (
  path: string,
  method: Method = "POST",
  data?: Record<string, unknown>
) => request(path, method, data);
