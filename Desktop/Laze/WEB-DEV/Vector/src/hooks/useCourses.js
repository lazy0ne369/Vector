import { useState, useEffect, useCallback } from "react";
import { coursesAPI } from "../services/api";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await coursesAPI.getAll();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const createCourse = useCallback(async (course) => {
    setError(null);

    try {
      const newCourse = await coursesAPI.create(course);
      setCourses((prev) => [newCourse, ...prev]);
      return newCourse;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateCourse = useCallback(async (id, course) => {
    setError(null);

    try {
      const updatedCourse = await coursesAPI.update(id, course);
      setCourses((prev) => prev.map((c) => (c.id === id ? updatedCourse : c)));
      return updatedCourse;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteCourse = useCallback(async (id) => {
    setError(null);

    try {
      await coursesAPI.delete(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const searchCourses = useCallback(async (query) => {
    setError(null);

    try {
      return await coursesAPI.search(query);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    searchCourses,
  };
}

export function useCourseStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await coursesAPI.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
