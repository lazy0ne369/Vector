import { useState, useEffect, useCallback } from "react";
import {
  coursesAPI,
  deadlinesAPI,
  wellbeingAPI,
  healthAPI,
} from "../services/api";
import { authAPI } from "../services/api";

// Configuration: Set to true when backend is running
const USE_BACKEND = true;

// Local Storage Keys
const STORAGE_KEYS = {
  COURSES: "vector_atlas_courses",
  DEADLINES: "vector_atlas_deadlines",
  WELLBEING: "vector_atlas_wellbeing",
};

// Helper function to load from localStorage
const loadFromStorage = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Helper function to save to localStorage
const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * Hook for Atlas data management
 * Uses backend API when available, falls back to localStorage
 */
export function useAtlasData() {
  const [courses, setCourses] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendAvailable, setBackendAvailable] = useState(false);

  // Check if backend is available
  useEffect(() => {
    const checkBackend = async () => {
      if (USE_BACKEND && authAPI.isAuthenticated()) {
        // Verify backend is actually reachable
        const isReady = await healthAPI.isReady();
        setBackendAvailable(isReady);
      } else {
        setBackendAvailable(false);
      }
    };
    checkBackend();
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (backendAvailable) {
          // Fetch from backend
          const [coursesData, deadlinesData] = await Promise.all([
            coursesAPI.getAll(),
            deadlinesAPI.getAll(),
          ]);
          setCourses(coursesData || []);
          setDeadlines(deadlinesData || []);
        } else {
          // Load from localStorage
          setCourses(loadFromStorage(STORAGE_KEYS.COURSES, []));
          setDeadlines(loadFromStorage(STORAGE_KEYS.DEADLINES, []));
        }
      } catch (err) {
        setError(err.message);
        // Fallback to localStorage on error
        setCourses(loadFromStorage(STORAGE_KEYS.COURSES, []));
        setDeadlines(loadFromStorage(STORAGE_KEYS.DEADLINES, []));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [backendAvailable]);

  // Save to localStorage when data changes (only in local mode)
  useEffect(() => {
    if (!backendAvailable && !loading) {
      saveToStorage(STORAGE_KEYS.COURSES, courses);
    }
  }, [courses, backendAvailable, loading]);

  useEffect(() => {
    if (!backendAvailable && !loading) {
      saveToStorage(STORAGE_KEYS.DEADLINES, deadlines);
    }
  }, [deadlines, backendAvailable, loading]);

  // Course operations
  const createCourse = useCallback(
    async (course) => {
      try {
        if (backendAvailable) {
          const newCourse = await coursesAPI.create(course);
          setCourses((prev) => [newCourse, ...prev]);
          return newCourse;
        } else {
          const newCourse = {
            ...course,
            id: Date.now(),
            createdAt: new Date().toISOString(),
          };
          setCourses((prev) => [newCourse, ...prev]);
          return newCourse;
        }
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [backendAvailable],
  );

  const updateCourse = useCallback(
    async (id, course) => {
      try {
        if (backendAvailable) {
          const updated = await coursesAPI.update(id, course);
          setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
          return updated;
        } else {
          setCourses((prev) =>
            prev.map((c) =>
              c.id === id
                ? { ...c, ...course, updatedAt: new Date().toISOString() }
                : c,
            ),
          );
          return { ...course, id };
        }
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [backendAvailable],
  );

  const deleteCourse = useCallback(
    async (id) => {
      try {
        if (backendAvailable) {
          await coursesAPI.delete(id);
        }
        setCourses((prev) => prev.filter((c) => c.id !== id));
        // Also delete related deadlines
        setDeadlines((prev) => prev.filter((d) => d.courseId !== id));
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [backendAvailable],
  );

  // Deadline operations
  const createDeadline = useCallback(
    async (deadline) => {
      try {
        if (backendAvailable) {
          const newDeadline = await deadlinesAPI.create(deadline);
          setDeadlines((prev) =>
            [...prev, newDeadline].sort(
              (a, b) =>
                new Date(a.dueDate || a.date) - new Date(b.dueDate || b.date),
            ),
          );
          return newDeadline;
        } else {
          const newDeadline = {
            ...deadline,
            id: Date.now(),
            createdAt: new Date().toISOString(),
          };
          setDeadlines((prev) =>
            [...prev, newDeadline].sort(
              (a, b) => new Date(a.date) - new Date(b.date),
            ),
          );
          return newDeadline;
        }
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [backendAvailable],
  );

  const updateDeadline = useCallback(
    async (id, deadline) => {
      try {
        if (backendAvailable) {
          const updated = await deadlinesAPI.update(id, deadline);
          setDeadlines((prev) => prev.map((d) => (d.id === id ? updated : d)));
          return updated;
        } else {
          setDeadlines((prev) =>
            prev.map((d) => (d.id === id ? { ...d, ...deadline } : d)),
          );
          return { ...deadline, id };
        }
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [backendAvailable],
  );

  const toggleDeadlineCompletion = useCallback(
    async (id) => {
      try {
        if (backendAvailable) {
          const updated = await deadlinesAPI.toggleCompletion(id);
          setDeadlines((prev) => prev.map((d) => (d.id === id ? updated : d)));
          return updated;
        } else {
          setDeadlines((prev) =>
            prev.map((d) =>
              d.id === id ? { ...d, completed: !d.completed } : d,
            ),
          );
        }
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [backendAvailable],
  );

  const deleteDeadline = useCallback(
    async (id) => {
      try {
        if (backendAvailable) {
          await deadlinesAPI.delete(id);
        }
        setDeadlines((prev) => prev.filter((d) => d.id !== id));
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [backendAvailable],
  );

  // Statistics
  const getStats = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingDeadlines = deadlines.filter((d) => {
      const dueDate = new Date(d.dueDate || d.date);
      return !d.completed && dueDate >= today;
    });

    const overdueDeadlines = deadlines.filter((d) => {
      const dueDate = new Date(d.dueDate || d.date);
      return !d.completed && dueDate < today;
    });

    const completedDeadlines = deadlines.filter((d) => d.completed);

    return {
      totalCourses: courses.length,
      totalDeadlines: deadlines.length,
      upcomingCount: upcomingDeadlines.length,
      overdueCount: overdueDeadlines.length,
      completedCount: completedDeadlines.length,
      completionRate:
        deadlines.length > 0
          ? Math.round((completedDeadlines.length / deadlines.length) * 100)
          : 0,
    };
  }, [courses, deadlines]);

  return {
    courses,
    deadlines,
    loading,
    error,
    backendAvailable,
    createCourse,
    updateCourse,
    deleteCourse,
    createDeadline,
    updateDeadline,
    toggleDeadlineCompletion,
    deleteDeadline,
    getStats,
    setCourses,
    setDeadlines,
  };
}
