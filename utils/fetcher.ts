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
  data?: Record<string, unknown> | FormData
) => {
  const isFormData = data instanceof FormData;

  const config: RequestInit = {
    method,
    credentials: "same-origin" as RequestCredentials,
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    ...(method !== "GET" && {
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    }),
  };

  try {
    let response = await fetch(path, config);

    if (response.status === 401) {
      try {
        const refreshConfig = {
          ...config,
          method: "POST",
          headers: { "Content-Type": "application/json" },
        };
        const refreshResponse = await fetch("/api/auth/refresh", refreshConfig);
        if (refreshResponse.ok) {
          response = await fetch(path, config);
        } else {
          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
          throw new Error("Refresh token failed");
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
  data?: Record<string, unknown> | FormData
) => request(path, method, data);
